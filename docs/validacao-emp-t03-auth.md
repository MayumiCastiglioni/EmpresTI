# EMP-T03 — sessão, vínculo e isolamento local (deployment pendente)

Data: 07/11/2026. Critérios relacionados: fundamento de EMP-01/EMP-08; esta
validação não aprova os critérios completos.

## Alteração

`src/server/api/trpc.ts` exporta `protectedProcedure` e `tenantProcedure`.
O primeiro consulta `supabase.auth.getUser()` no servidor e propaga somente o
usuário verificado. O segundo consulta via Prisma o vínculo do usuário ao tenant
fixo `empresti`; somente então disponibiliza `tenantId` e papel ao procedimento.
Sessão ausente/inválida retorna `UNAUTHORIZED`, falta de vínculo retorna
`FORBIDDEN`, e falha Auth/Prisma retorna `SERVICE_UNAVAILABLE` genérico.

## Evidência executada

- `npx vitest run tests/authorization-procedures.test.ts`: 8 testes passaram.
- `npm run test:tenant-local`: 1/1 passou em Postgres local, com tenant e usuários
  sintéticos aleatórios; limpeza do tenant confirmou exclusão em cascata.
- `npm run test:health-local`: 5/5 passou, integração HTTP/Postgres local sem escrita.
- `npm test`: 78 testes em 12 arquivos passaram.
- `npm run lint`: código de saída 0.
- `npm run build`: código de saída 0, incluindo checagem TypeScript.

Os oito testes tRPC usam Supabase sintético e Prisma mockado. A integração
adicional prova lookup e negação de membership em Postgres local com fixture
sintética. Na rodada de 07/11, nenhum teste conectava Auth HTTP nem verificava
RLS, catálogo, listagem própria ou procedure de produto; a atualização abaixo
cobre parte dessas lacunas no caminho local.

## Atualização executada em 10/11/2026

Foi criado `withAuthenticatedRls`, que abre transação Prisma, executa
`SET LOCAL ROLE authenticated` e define `request.jwt.claim.sub` usando somente o
ID que `protectedProcedure` já verificou por `supabase.auth.getUser()`. Catálogo
e empréstimos próprios agora fazem suas leituras dentro desse contexto; o papel
volta ao original ao encerrar a transação.

`npm run test:loans-local` usa dois tenants e membros sintéticos. Além dos
`createCaller`, uma consulta sem filtro de borrower executada pelo helper provou
que o papel authenticated vê equipamentos do tenant vinculado, não vê outro
tenant e só vê empréstimos próprios, mesmo havendo empréstimo de colega. O teste
também confirma que a troca de papel é compatível com a conexão local e se
encerra ao fim da transação.

O INSERT de empréstimo continua exclusivamente no serviço tRPC/Prisma, conforme
o DDL aprovado: DEC-26/27 removeram a policy que permitia INSERT direto ao papel
authenticated. A mutation valida sessão/vínculo, usa IDs do contexto verificado
e aplica as regras transacionais/trigger; a policy não foi reintroduzida.

Checks atuais relacionados: `npm run test:loans-local` 8/8, `npm test` 81/81,
`npm run test:loans-http-local` 1/1, lint, TypeScript e build isolado passaram.
O endpoint HTTP passou com cookie de sessão emitido pelo Supabase Auth local;
deployment não foi conectado e nenhum serviço remoto foi acessado. EMP-T03 está
validada no caminho local; não declarar deployment validado.

## Limites e próximo passo

`getDatabase()` ainda aceita somente Postgres local, conforme a barreira atual;
nenhum serviço remoto foi conectado. EMP-T03 está concluída para o caminho local;
produção/deployment não foi validado. Não houve alteração de schema, migration,
segredo, Auth real, serviço remoto ou Git. Os testes criaram/removeram apenas
tenants, membership, equipamentos e empréstimos sintéticos locais.
