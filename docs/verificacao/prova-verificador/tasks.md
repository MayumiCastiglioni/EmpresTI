# Tarefas da prova

Spec: [spec.md](spec.md). Plano: [plan.md](plan.md).

- [x] PV-01: baseline e retorno incorreto plantado pelo principal (PROVA-01).
- [x] PV-02: rodada FALHA independente encontra regressão e não corrige (PROVA-01).
- [x] PV-03: restauração pelo principal e rodada RESTAURADA independente (PROVA-01).
- [x] PV-04: saídas, hashes, checks e limitações registrados.
- [ ] PV-05: comprovar bloqueio técnico de escrita/rede no harness efetivo.
- [x] PV-06: registrar dois commits locais de erro/restauração após autorização explícita em 06/11/2026.

PV-05 permanece aberto: as rodadas confirmaram obediência, não bloqueio técnico
de escrita/rede. Commits: 12aa161 (erro plantado) e d8bdcbb (restauração).
