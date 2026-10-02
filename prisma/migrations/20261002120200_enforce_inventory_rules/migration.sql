-- This is an empty migration.
-- Prevent more than one pending or checked-out loan for the same equipment.
CREATE UNIQUE INDEX "loans_active_equipment_id_key"
ON "loans" ("equipment_id")
WHERE "status" IN ('SOLICITADO', 'RETIRADO');

-- Keep tenant checks centralized so RLS policies cannot read memberships directly.
CREATE FUNCTION public.requesting_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

CREATE FUNCTION public.is_tenant_member(target_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "memberships"
    WHERE "tenant_id" = target_tenant_id
      AND "user_id" = public.requesting_user_id()
  );
$$;

CREATE FUNCTION public.has_tenant_role(
  target_tenant_id uuid,
  allowed_roles public."MembershipRole"[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "memberships"
    WHERE "tenant_id" = target_tenant_id
      AND "user_id" = public.requesting_user_id()
      AND "role" = ANY(allowed_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.requesting_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_tenant_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_tenant_role(uuid, public."MembershipRole"[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.requesting_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_tenant_role(uuid, public."MembershipRole"[]) TO authenticated;

ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "equipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_members_can_read_tenant"
ON "tenants" FOR SELECT
TO authenticated
USING (public.is_tenant_member("id"));

CREATE POLICY "tenant_admins_manage_tenant"
ON "tenants" FOR ALL
TO authenticated
USING (public.has_tenant_role("id", ARRAY['ADMIN']::public."MembershipRole"[]))
WITH CHECK (public.has_tenant_role("id", ARRAY['ADMIN']::public."MembershipRole"[]));

CREATE POLICY "tenant_members_can_read_memberships"
ON "memberships" FOR SELECT
TO authenticated
USING (public.is_tenant_member("tenant_id"));

CREATE POLICY "tenant_admins_manage_memberships"
ON "memberships" FOR ALL
TO authenticated
USING (public.has_tenant_role("tenant_id", ARRAY['ADMIN']::public."MembershipRole"[]))
WITH CHECK (public.has_tenant_role("tenant_id", ARRAY['ADMIN']::public."MembershipRole"[]));

CREATE POLICY "tenant_members_can_read_equipment"
ON "equipment" FOR SELECT
TO authenticated
USING (public.is_tenant_member("tenant_id"));

CREATE POLICY "operations_manage_equipment"
ON "equipment" FOR ALL
TO authenticated
USING (public.has_tenant_role("tenant_id", ARRAY['OPERACOES', 'ADMIN']::public."MembershipRole"[]))
WITH CHECK (public.has_tenant_role("tenant_id", ARRAY['OPERACOES', 'ADMIN']::public."MembershipRole"[]));

CREATE POLICY "tenant_members_can_read_loans"
ON "loans" FOR SELECT
TO authenticated
USING (public.is_tenant_member("tenant_id"));

CREATE POLICY "members_request_own_loans"
ON "loans" FOR INSERT
TO authenticated
WITH CHECK (
  "borrower_id" = public.requesting_user_id()
  AND public.is_tenant_member("tenant_id")
);

CREATE POLICY "operations_manage_loans"
ON "loans" FOR UPDATE
TO authenticated
USING (public.has_tenant_role("tenant_id", ARRAY['OPERACOES', 'ADMIN']::public."MembershipRole"[]))
WITH CHECK (public.has_tenant_role("tenant_id", ARRAY['OPERACOES', 'ADMIN']::public."MembershipRole"[]));

CREATE POLICY "operations_read_audit_logs"
ON "audit_logs" FOR SELECT
TO authenticated
USING (public.has_tenant_role("tenant_id", ARRAY['OPERACOES', 'ADMIN']::public."MembershipRole"[]));

-- Enforce the approved loan lifecycle and reflect it in the equipment inventory.
CREATE FUNCTION public.enforce_loan_rules()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  active_loan_count integer;
  current_equipment_status public."EquipmentStatus";
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."status" <> 'SOLICITADO' THEN
      RAISE EXCEPTION 'New loans must start as SOLICITADO';
    END IF;

    SELECT "status"
    INTO current_equipment_status
    FROM "equipment"
    WHERE "id" = NEW."equipment_id"
      AND "tenant_id" = NEW."tenant_id"
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Equipment does not belong to this tenant';
    END IF;

    IF current_equipment_status <> 'DISPONIVEL' THEN
      RAISE EXCEPTION 'Equipment is not available for a new loan';
    END IF;

    SELECT count(*)
    INTO active_loan_count
    FROM "loans"
    WHERE "tenant_id" = NEW."tenant_id"
      AND "borrower_id" = NEW."borrower_id"
      AND "status" IN ('SOLICITADO', 'RETIRADO');

    IF active_loan_count >= 3 THEN
      RAISE EXCEPTION 'A borrower can have at most three active loans';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM "loans"
      WHERE "tenant_id" = NEW."tenant_id"
        AND "borrower_id" = NEW."borrower_id"
        AND "status" = 'RETIRADO'
        AND "due_at" < now()
    ) THEN
      RAISE EXCEPTION 'A borrower with an overdue loan cannot request another item';
    END IF;

    UPDATE "equipment"
    SET "status" = 'RESERVADO', "updated_at" = now()
    WHERE "id" = NEW."equipment_id";

    RETURN NEW;
  END IF;

  IF NEW."tenant_id" <> OLD."tenant_id"
     OR NEW."equipment_id" <> OLD."equipment_id"
     OR NEW."borrower_id" <> OLD."borrower_id" THEN
    RAISE EXCEPTION 'A loan cannot be reassigned';
  END IF;

  IF NEW."status" = OLD."status" THEN
    RETURN NEW;
  ELSIF OLD."status" = 'SOLICITADO' AND NEW."status" = 'RETIRADO' THEN
    NEW."checked_out_at" := COALESCE(NEW."checked_out_at", now());
    UPDATE "equipment"
    SET "status" = 'EMPRESTADO', "updated_at" = now()
    WHERE "id" = NEW."equipment_id";
  ELSIF OLD."status" = 'SOLICITADO' AND NEW."status" = 'CANCELADO' THEN
    UPDATE "equipment"
    SET "status" = 'DISPONIVEL', "updated_at" = now()
    WHERE "id" = NEW."equipment_id";
  ELSIF OLD."status" = 'RETIRADO' AND NEW."status" = 'DEVOLVIDO' THEN
    NEW."returned_at" := COALESCE(NEW."returned_at", now());
    NEW."returned_condition" := COALESCE(NEW."returned_condition", 'OK');
    UPDATE "equipment"
    SET "status" = CASE
      WHEN NEW."returned_condition" IN ('DANIFICADO', 'INCOMPLETO') THEN 'MANUTENCAO'::public."EquipmentStatus"
      ELSE 'DISPONIVEL'::public."EquipmentStatus"
    END,
    "updated_at" = now()
    WHERE "id" = NEW."equipment_id";
  ELSE
    RAISE EXCEPTION 'Invalid loan status transition from % to %', OLD."status", NEW."status";
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_loan_rules
BEFORE INSERT OR UPDATE ON "loans"
FOR EACH ROW
EXECUTE FUNCTION public.enforce_loan_rules();
