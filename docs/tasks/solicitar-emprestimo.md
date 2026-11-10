# Tarefas — solicitar empréstimo

[Spec](../specs/solicitar-emprestimo.md) · [Plano](../plans/solicitar-emprestimo.md).

- [x] EMP-T00: rascunhar spec/plano/tasks e auditar divergências existentes.
- [x] EMP-T01: aprovar propostas de calendário, precisão, legado e reenvio.
- [x] EMP-T02: cálculo isolado, calendário 2026–2030 e testes de fronteira; consumo do serviço validado em EMP-T05.
- [x] EMP-T03: sessão, vínculo, isolamento local por RLS nas leituras e negações EMP-01/08; deployment não conectado/verificado.
- [x] EMP-T04: DDL/impacto/policies aprovados; migration aplicada localmente.
- [x] EMP-T05: serviço transacional/testes reais EMP-02/03/04/05/06/10; migration já aplicada.
- [ ] EMP-T06 (parcial): procedures tRPC e contratos EMP-01/02/08/10; createCaller, leitura RLS e endpoint HTTP com sessão/cookies passaram localmente. Papel do deployment e aceite completo seguem sem prova.
- [ ] EMP-T07 (parcial): fluxo autenticado Playwright local passou; usuária aprovou telas, foco e tamanhos de viewport em 10/11. Fotos reais e seus créditos ainda pendem.
- [ ] EMP-T08: checks completos e verificador independente; correções pelo principal.

EMP-T03 concluída no caminho local em 10/11/2026. `protectedProcedure` e
`tenantProcedure` validam sessão/vínculo; leituras do catálogo e empréstimos
mudam para `authenticated` dentro da transação, com claim da identidade verificada.
Testes locais negam colega, outro tenant e anônimo. O runtime de deployment não
foi conectado nem verificado. Ver [evidências](../validacao-emp-t03-auth.md).

EMP-T01 concluída documentalmente em 08/11/2026: calendário/precisão já definidos;
legado e reenvio aprovados explicitamente pela usuária (DEC-23/24).
Isso não comprova implementação, aceite da spec completa ou aprovação de DDL.

Intervalo escolhido: 2026–2030 inclusive. EMP-T02 conferiu/testou todos os anos
e transições; o serviço recusa prazos fora da cobertura. Não usar a lista de 2026
como lista móvel fixa.

EMP-T02: 2026–2030, somente nove feriados nacionais fixos por DEC-19.
70 testes e lint aprovados; build aprovado. EMP-T05 consumiu o cálculo no serviço
e testou o vencimento retornado. Os critérios completos ainda precisam da revisão
independente. [Evidências](../validacao-emp-t02-calendario.md).

Registro histórico de EMP-T03 em 07/11: middleware e vínculo ao tenant estavam
implementados; RLS ainda pendente à época. A validação local de RLS foi concluída
em 10/11 e está descrita abaixo e em
[evidências](../validacao-emp-t03-auth.md).

EMP-T04 concluída em 10/11/2026: DEC-26/27, DDL aprovado e migration
`20261110122729_loan_immediate_limit_five_policies` aplicada no banco local.
O SQL passou em Postgres descartável com fixtures sintéticas; `npm test` 78/78,
lint e build passaram. [Evidência](../validacao-emp-t04-loans.md).
EMP-T05 concluída localmente em 10/11/2026: serviço transacional e oito testes
de integração com Postgres local cobrem criação imediata, prazo, autoria,
indisponibilidade, manutenção, atraso, limite cinco/sexto, duas concorrências e
rollback. EMP-T06/07 avançaram parcialmente: procedures e telas estão conectadas;
endpoint HTTP/Auth/cookies e fluxo Playwright autenticado passaram localmente.
A usuária aprovou telas autenticadas, foco e viewports em 10/11. Faltam deployment,
fotos reais e revisão independente.
[Evidências EMP-T05 a EMP-T07](../validacao-emp-t05-t07.md).
