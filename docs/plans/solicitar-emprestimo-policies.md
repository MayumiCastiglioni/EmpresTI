# EMP-T04 — proposta consolidada de policies e trigger

Estado: SQL aprovado por DEC-27 e aplicado localmente na migration
`20261110122729_loan_immediate_limit_five_policies`. DEC-26 registra a decisão
de escopo para retirar a policy UPDATE de OPERACOES/ADMIN nesta fatia. Preparada
em 10/11/2026 após revisão local de EMP-01/02/03/04/05/06/08/10, PRD, ADR-001,
spec e migrations existentes. Runtime/RLS de produção e fluxo end-to-end ainda
não foram comprovados.

[Spec](../specs/solicitar-emprestimo.md) · [Plano](solicitar-emprestimo.md) ·
[Tarefas](../tasks/solicitar-emprestimo.md) · [Regra de migration](../rules/migration.md) ·
[Decisões](../produto/decisoes-pratica.md).

## DDL proposto para uma nova migration Prisma

Este é o SQL integral aprovado por DEC-27 e usado na migration indicada acima.
Ele não altera a migration histórica `20261002120200_enforce_inventory_rules`.

```sql
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
```

O campo `Loan.status` em `prisma/schema.prisma` mudou de
`@default(SOLICITADO)` para `@default(RETIRADO)` na mesma tarefa. `calendar.ts`
continua sendo a única fonte de cálculo de `due_at`;
este trigger apenas rejeita uma data que não seja posterior a `requested_at`.

## Impacto previsto

- Nenhuma linha existente será atualizada, convertida ou apagada. Registros
  legados `SOLICITADO` e `RETIRADO` continuarão contando no limite e na regra de
  atraso. O novo valor default só vale para inserções futuras.
- A leitura RLS de empréstimos fica restrita ao próprio `borrower_id` e ao tenant
  válido; colega do mesmo tenant deixa de ler o registro de outra pessoa.
- Remover `members_request_own_loans` impede INSERT direto pelo papel
  `authenticated`; a mutation deve passar por tRPC/Prisma para definir identidade,
  tenant, `requested_at` e `due_at` no servidor.
- Remover `operations_manage_loans` elimina a policy RLS atual que permite
  UPDATE a `OPERACOES`/`ADMIN`, conforme DEC-26. Com RLS ativo e sem outra policy
  de UPDATE, esses papéis não atualizam empréstimos diretamente como
  `authenticated`. O requisito futuro da tela de Operações no PRD permanece; sua
  autorização e fluxo serão decididos em outra etapa.
- O limite passa de três para cinco ativos; pedidos novos começam em `RETIRADO`,
  gravam `checked_out_at = requested_at` e atualizam o equipamento para
  `EMPRESTADO` dentro da mesma transação.
- O advisory lock por tenant/colaborador serializa pedidos simultâneos da mesma
  pessoa em itens diferentes. `FOR UPDATE` no equipamento serializa disputas
  pelo mesmo item. A contagem sob esse padrão pressupõe o isolamento
  `READ COMMITTED` padrão do PostgreSQL; validar a mesma configuração do runtime.
  Falha posterior reverte ambas as alterações.
- Solicitação recusa item não disponível, inclusive manutenção, quinto item já
  atingido e colaborador com qualquer empréstimo ativo atrasado. A fronteira de
  atraso continua estrita: só depois de `due_at`.
- Não há `GRANT`/`REVOKE` nesta proposta. O papel real de Prisma/runtime ainda
  não foi provado; owner/superuser/BYPASSRLS pode contornar RLS. tRPC continua
  responsável por autenticar/autorizar a mutation, e esta migration não prova
  isolamento de runtime ou acesso remoto.

## Validação executada em 10/11/2026

- Migration aplicada no Supabase local via Prisma Migrate; `migrate status`
  confirmou quatro migrations e schema sincronizado. Host validado como loopback
  antes de cada comando. Nenhum banco remoto foi acessado.
- SQL verificado num Postgres descartável 17.11, com as três migrations
  históricas e fixtures sintéticas. Foram conferidos: preservação do empréstimo
  legado, default/novo empréstimo `RETIRADO`, `checked_out_at`, equipamento
  `EMPRESTADO`, máximo cinco e recusa do sexto, manutenção, prazo inválido,
  bloqueio por legado atrasado, leitura própria, negação a colega, INSERT
  autenticado negado e UPDATE negado a OPERACOES/ADMIN.
- Concorrência: com quatro empréstimos prévios, duas sessões simultâneas da mesma
  pessoa tentaram equipamentos distintos; uma chegou ao quinto, a outra foi
  recusada e o total ficou em cinco, sem alteração do segundo equipamento.
- `npm test`: 12 arquivos e 78 testes passaram. `npm run lint` e `npm run build`
  passaram.
- O teste SQL foi temporário e usou somente dados sintéticos; nenhum teste
  permanente específico de empréstimos foi adicionado. Serviços tRPC, UI, papel
  real de runtime/RLS e produção continuam sem validação. EMP-T05/T03 e a spec
  seguem abertas.

Não houve alteração de migrations históricas, serviço remoto, secrets, Git,
deploy ou publicação. A migration local não altera/apaga linhas existentes.
