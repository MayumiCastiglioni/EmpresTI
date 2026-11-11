ALTER TABLE public."loans"
  ALTER COLUMN "status" SET DEFAULT 'RETIRADO';

ALTER POLICY "tenant_members_can_read_loans"
ON public."loans"
TO authenticated
USING (
  "borrower_id" = public.requesting_user_id()
  AND public.is_tenant_member("tenant_id")
);

DROP POLICY "members_request_own_loans" ON public."loans";
DROP POLICY "operations_manage_loans" ON public."loans";

CREATE OR REPLACE FUNCTION public.enforce_loan_rules()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  active_loan_count integer;
  current_equipment_status public."EquipmentStatus";
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."status" <> 'RETIRADO' THEN
      RAISE EXCEPTION 'New loans must start as RETIRADO';
    END IF;

    IF NEW."due_at" <= NEW."requested_at" THEN
      RAISE EXCEPTION 'Loan due_at must be after requested_at';
    END IF;

    -- Serialize a borrower's simultaneous requests for different equipment.
    PERFORM pg_advisory_xact_lock(
      hashtextextended(NEW."tenant_id"::text || ':' || NEW."borrower_id"::text, 0)
    );

    -- Serialize competing requests for the same equipment.
    SELECT "status"
    INTO current_equipment_status
    FROM public."equipment"
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
    FROM public."loans"
    WHERE "tenant_id" = NEW."tenant_id"
      AND "borrower_id" = NEW."borrower_id"
      AND "status" IN ('SOLICITADO', 'RETIRADO');

    IF active_loan_count >= 5 THEN
      RAISE EXCEPTION 'A borrower can have at most five active loans';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public."loans"
      WHERE "tenant_id" = NEW."tenant_id"
        AND "borrower_id" = NEW."borrower_id"
        AND "status" IN ('SOLICITADO', 'RETIRADO')
        AND clock_timestamp() > "due_at"
    ) THEN
      RAISE EXCEPTION 'A borrower with an overdue loan cannot request another item';
    END IF;

    -- The trusted server supplies requested_at and calendar.ts supplies due_at.
    NEW."checked_out_at" := NEW."requested_at";

    UPDATE public."equipment"
    SET "status" = 'EMPRESTADO', "updated_at" = now()
    WHERE "id" = NEW."equipment_id"
      AND "tenant_id" = NEW."tenant_id";

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
    UPDATE public."equipment"
    SET "status" = 'EMPRESTADO', "updated_at" = now()
    WHERE "id" = NEW."equipment_id";
  ELSIF OLD."status" = 'SOLICITADO' AND NEW."status" = 'CANCELADO' THEN
    UPDATE public."equipment"
    SET "status" = 'DISPONIVEL', "updated_at" = now()
    WHERE "id" = NEW."equipment_id";
  ELSIF OLD."status" = 'RETIRADO' AND NEW."status" = 'DEVOLVIDO' THEN
    NEW."returned_at" := COALESCE(NEW."returned_at", now());
    NEW."returned_condition" := COALESCE(NEW."returned_condition", 'OK');
    UPDATE public."equipment"
    SET "status" = CASE
      WHEN NEW."returned_condition" IN ('DANIFICADO', 'INCOMPLETO')
        THEN 'MANUTENCAO'::public."EquipmentStatus"
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
