# EMP-T02 — cálculo de prazo isolado

Spec: [solicitação](specs/solicitar-emprestimo.md), EMP-07 e fronteira EMP-04.
Código src/server/loans/calendar.ts; testes tests/loan-calendar.test.ts.
Fonte/decisões: [calendário](produto/calendario-emprestimos.md).

Implementa 14 dias úteis, nove feriados fixos, 2026–2030, data São Paulo,
23:59:59 convertido para UTC. Sem SQL, banco, variáveis, SDK de datas ou rede.
Calendário é injetado no cálculo, isolando política e clock da persistência.
Função ainda não é consumida pela mutation de empréstimos (não implementada).
Não aprova EMP-07/04 completos antes da integração/testes do fluxo.

Checks atuais: npm test passou com 70 testes em 11 arquivos; lint e build
aprovados com saída zero, incluindo TypeScript. Novos testes de calendário: 11. As sessões anteriores foram encerradas sem resultado
recuperável; não foram tratadas como aprovadas. Exemplos de julho foram conferidos
independentemente em Python e expectativas UTC de 2027/2028 ajustadas antes da
validação final. Fonte móvel pesquisada foi descartada após decisão explícita
por feriados fixos; não há data móvel na política atual.
