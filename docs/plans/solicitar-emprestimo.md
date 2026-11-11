# Plano — solicitar empréstimo

[Spec](../specs/solicitar-emprestimo.md) · [Tarefas](../tasks/solicitar-emprestimo.md).
PRA-06 documental; PRA-07 em andamento (EMP-T02/03/05 concluídas no caminho
local; EMP-T06/07 implementadas parcialmente; teste HTTP local passou).

1. Contratos de calendário/precisão, legado e reenvio aprovados (EMP-T01;
   DEC-23/24 em 08/11/2026). Implementação e aceite integral continuam pendentes.
2. Implementar cálculo determinístico com testes de feriado/fuso/fronteiras,
   sem dependência externa por solicitação ou biblioteca não aprovada.
3. EMP-T03 concluída localmente: contexto protegido e tenantProcedure verificam
   sessão/membership; catálogo e empréstimos próprios usam transação com
   `SET LOCAL ROLE authenticated` e claim só da identidade verificada. Postgres
   local confirmou isolamento por tenant e borrower. Deployment não conectado;
   memberships continuam consultados via Prisma, não Supabase.
4. DDL/policies/trigger aprovados e aplicados localmente em 10/11/2026
   (DEC-26/27); registros legados preservados. O caminho local de leitura RLS foi
   testado; deployment e escrita de produção não foram conectados.
5. EMP-T05 concluída localmente: serviço usa os IDs verificados no contexto,
   calendário aprovado, locks de membro/equipamento e uma transação. Oito testes
   Postgres locais cobrem prazo consumido pelo fluxo, restrições, duas corridas e
   rollback. As quatro migrations também foram aplicadas em Postgres descartável
   limpo e `migrate status` confirmou schema sincronizado.
6. EMP-T06 parcial: catálogo, próprios empréstimos e pedido via tRPC/createCaller
   usam sessão/vínculo e não aceitam campos de autoridade do cliente. O teste
   `npm run test:loans-http-local` passou com Auth/cookies e Postgres locais:
   consulta catálogo/próprios empréstimos, cria empréstimo e rejeita borrower
   forjado. Deployment e seu papel de runtime/RLS continuam sem prova.
7. EMP-T07 parcial: tela de colaborador conectada, confirma antes de iniciar,
   atualiza depois do sucesso e mostra disponibilidade/erro/ausência. Testes de
   componente e fluxo Playwright com sessão sintética passaram; navegador validou
   recusa pelo limite, manutenção, catálogo vazio, teclado/foco e viewport 390 px.
   Revisão humana das telas/foco/viewport aprovada pela usuária em 10/11; faltam
   aquisição/revisão das fotos reais autorizadas.
8. EMP-T08: verificador independente compara todos EMPs; principal corrige e repete.
   Sem fotos/Storage reais, manter limite de evidência explícito em EMP-09.

Uma tarefa por vez, checks e relato ao fim. Não avançar execução remota ou Git
por este plano. Dados iniciais permanecem abertos; usar fixtures próprias locais
para desenvolver sem declarar entrega dos dados pronta.

EMP-T03 concluída localmente em 10/11/2026: sessão, tenantProcedure, isolamento
RLS das leituras e negações por Postgres real local passaram. Deployment continua
sem validação; [evidências](../validacao-emp-t03-auth.md).

EMP-T04/05 — 10/11/2026: DDL aprovado e migration
`20261110122729_loan_immediate_limit_five_policies` aplicado no banco local.
As quatro migrations também foram aplicadas desde zero em Postgres descartável.
SQL e checks registrados em [evidências](../validacao-emp-t04-loans.md). Serviço
transacional e testes locais foram concluídos para EMP-T05. EMP-T06/07 seguem
parciais; o teste HTTP/Auth e Playwright local passaram. Revisão visual autenticada,
foco e viewports foram aprovados pela usuária em 10/11; fotos reais e revisão
independente continuam pendentes. [Evidência](../validacao-emp-t05-t07.md).
Nenhum acesso remoto.
