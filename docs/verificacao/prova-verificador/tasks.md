# Tarefas da prova

Spec: [spec.md](spec.md). Plano: [plan.md](plan.md).

- [x] PV-01: baseline e retorno incorreto plantado pelo principal (PROVA-01).
- [x] PV-02: rodada FALHA independente encontra regressão e não corrige (PROVA-01).
- [x] PV-03: restauração pelo principal e rodada RESTAURADA independente (PROVA-01).
- [x] PV-04: saídas, hashes, checks e limitações registrados.
- [x] PV-05: comprovar bloqueio técnico de escrita/rede no harness efetivo.
- [x] PV-06: registrar dois commits locais de erro/restauração após autorização explícita em 06/11/2026.
- [x] PV-07: comprovar descoberta nativa do agente do projeto e executar a rodada isolada R4.

PV-01–PV-07 concluídos para a fixture técnica na R4. Foram negadas gravação
no projeto, leitura do perfil/arquivos .env* e rede; o agente foi carregado
pela configuração nativa do projeto. A PRA-02 não aprova specs de produto nem
segurança de produção. Commits da prova: 12aa161 (erro) e d8bdcbb (restauração),
locais e sem push.
