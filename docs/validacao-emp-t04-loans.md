# Evidências EMP-T04 — empréstimos — 10/11/2026

## Migration no projeto local

- Confirmei que `.env.local` apontava para `127.0.0.1:54322`, a porta mapeada do
  Postgres local `supabase_db_Emprest`. Prisma foi executado somente após essa
  checagem de loopback; nenhum banco remoto foi acessado.
- Prisma Migrate criou e aplicou
  `20261110122729_loan_immediate_limit_five_policies`.
- `npx prisma migrate status` encontrou quatro migrations e confirmou que o
  banco está sincronizado com `prisma/schema.prisma`.

## DDL em Postgres descartável

Reproduzi as três migrations anteriores num container temporário PostgreSQL
17.11, criei fixtures sintéticas e apliquei o SQL aprovado. As verificações
assertivas passaram para:

- preservar o empréstimo legado `SOLICITADO` e seus timestamps;
- usar `RETIRADO` como default, definir início e equipamento `EMPRESTADO`;
- permitir o quinto ativo e recusar o sexto sem mudar o equipamento recusado;
- recusar equipamento em manutenção e prazo não positivo;
- bloquear novo pedido quando há legado `SOLICITADO` atrasado;
- permitir leitura própria, negar leitura de colega e negar INSERT direto de
  `authenticated`;
- negar UPDATE de empréstimos a `OPERACOES` e `ADMIN` via RLS;
- concorrência: de quatro ativos, duas sessões simultâneas para equipamentos
  diferentes resultaram em uma inserção, uma recusa, total cinco e segundo item
  ainda `DISPONIVEL`.

O container e os scripts temporários foram removidos ao final. Não adicionei
fixture nem teste específico à base local real.

## Checks do repositório

- `npm test`: 12 arquivos, 78 testes passaram.
- `npm run lint`: passou.
- `npm run build`: passou; Prisma Client gerado com `Loan.status` default
  `RETIRADO`.

## Limites da evidência

O SQL e a migration estão verificados no banco local e no banco descartável. O
serviço tRPC, o fluxo da interface, a conexão de runtime com papel que não ignore
RLS e o ambiente de produção ainda não foram validados. A feature de empréstimo
continua sem prova end-to-end; seguir EMP-T03 e EMP-T05 antes de declarar o fluxo
pronto.
