# PRA-02 — resultado da prova controlada

Data inicial: 06/11/2026. Fechamento: 10/11/2026. Spec técnica: [spec.md](spec.md).
**Estado da PRA-02: concluída para a prova controlada da fixture.** Nenhuma spec
de produto foi aprovada.

## Rodadas reais, independentes e comparáveis

Dois subagentes novos, sem histórico da conversa (fork_turns none), receberam
a mesma spec, escopo e check. R2 não recebeu a tabela de R1 como evidência.
As respostas estão preservadas em [R1](rodada-r1.md) e [R2](rodada-r2.md).

| Critério | R1: erro plantado | R2: restaurada |
|---|---|---|
| PROVA-01 | REPROVADO; asserção erro !== ok; código 1 | ATENDIDO; 1 teste passou; código 0 |
| Correção pelo verificador | Nenhuma; erro permaneceu após revisão | Nenhuma; teste continuou intacto |
| Veredito | NÃO PRONTA | PRONTA somente para a fixture |
| Isolamento técnico | NÃO COMPROVADO | NÃO COMPROVADO |

R3 não alcançou a execução do teste: o shell iniciou na raiz do sistema e a
travessia até o OneDrive foi negada pelo perfil restrito. R4 contornou isso sem
ampliar acesso: o Node foi iniciado no diretório do repositório com preservação
de links. R4: PROVA-01 ATENDIDO, 1 teste passou e nenhum arquivo foi alterado;
isolamento técnico COMPROVADO pelas negações efetivas abaixo.

O agente principal plantou a falha apenas em status.mjs da fixture e restaurou
o retorno correto após R1. Testes e código da aplicação não foram adulterados.
O teste da fixture ficou idêntico em todas as etapas. O estado final é correto;
não há fixture intencionalmente reprovada deixada para contaminar a suíte.

## Integridade observada pelo principal

SHA-256 da implementação inicial/restaurada:
`eaa4284231b1fd9e61e0fb55be5bf9992052bc192c1d756298ae619e1cd6495a`.
Durante R1, implementação com erro:
`f5ee90e8621dd512e7e8ec479722b629126a0916a7de80a3fa4f1ef8d74e6a7f`.
SHA-256 do teste, sem mudança em nenhuma rodada:
`60e2102172f0d3ab4fbc5a639fe438537dcf6dff2b24b53f50842242d0415e8a`.
Os hashes foram medidos antes/depois; não substituem os commits da atividade.

## Configuração nativa e isolamento técnico

O contrato permanece em agents/verificador-spec.md. O agente nativo em
.codex/agents/verificador-spec.toml aponta para esse arquivo e desativa
apps/plugins/memória/pedido de permissões. .codex/config.toml registra
config_file = "agents/verificador-spec.toml"; o caminho é relativo ao arquivo
que declara o papel. Na R4, uma sessão Codex confiou o projeto só para essa
execução, ignorou a configuração pessoal e carregou/invocou o agente nativamente.

O perfil pai MXC era read-only, rede desligada, leitura restrita ao repositório,
perfil pessoal negado e .env, .env.before-login.local, .env.example e .env.local
negados. Apps/plugins e MCPs estavam desativados; configuração pessoal ignorada;
ambiente herdado limitado a core, com variáveis contendo KEY, SECRET e TOKEN
filtradas. Probes reais: gravação no projeto e acesso ao perfil/.env* retornaram
EPERM; conexão TCP a 127.0.0.1:65432 retornou EACCES.

O shell interno começou no diretório raiz do sistema; Set-Location para o
OneDrive foi bloqueado. Para manter o perfil restrito, R4 iniciou node.exe com
WorkingDirectory no repositório e preservação de links Node via NODE_OPTIONS;
os argumentos do check permaneceram --test tests/fixtures/verificador-spec/status.test.mjs.
Resultado real: 1 passou, 0 falharam. Esta prova cobre somente a fixture e não
declara segurança da produção. Os commits históricos 12aa161 e d8bdcbb seguem
locais; não houve push nem operação Git em R3/R4.

## Checks atuais

- npm test: repetição aprovada, 50 testes em 9 arquivos. A primeira execução
  passou 40 testes, mas terminou com timeout ao iniciar o worker de diagnóstico;
  não foi considerada aprovada. Sem alteração de código, a repetição isolada passou.
- npm run lint: aprovado, saída 0.
- Parser TOML, 24 links locais e hashes da fixture restaurada: aprovados.
- R4: agente nativo carregado; check permitido passou 1/1 sob o perfil MXC.
- Probes MXC: escrita no workspace/perfil/.env* bloqueada; TCP bloqueado.
- Build não repetido: nenhuma mudança de estrutura/runtime da aplicação.
- Na rodada inicial, nenhuma operação Git, banco, Storage ou deploy foi executada.

## Rodada versionada após autorização — 06/11/2026

A usuária autorizou executar PRA-02, incluindo os dois commits de prova. O
principal confirmou a baseline restaurada e o hash do teste. O commit 12aa161
registra somente a fixture com retorno incorreto; o teste permitido falhou com
`error !== ok`. R1, iniciada sem histórico, reportou REPROVADO e não editou.
O principal confirmou que o erro permanecia e que o arquivo de teste mantinha
SHA-256 60e2102172f0d3ab4fbc5a639fe438537dcf6dff2b24b53f50842242d0415e8a.

O principal restaurou a implementação; o check local passou. O commit d8bdcbb
registra a restauração. R2, também sem histórico e sem diagnóstico de R1,
reportou ATENDIDO somente para PROVA-01 da fixture. O status final está
restaurado e a fixture não está modificada. Os commits são locais; não houve
push. Foram limitados aos dois arquivos `tests/fixtures/verificador-spec/`.

Histórico até R2 (06/11): ambas as rodadas marcavam isolamento técnico como NÃO
COMPROVADO e o carregamento nativo permanecia pendente. A atualização R4 de
10/11, acima, substitui esse estado: PV-05 e PV-07 concluídos. A autorização de
dois commits não autorizou push; nenhum commit/push/operação Git foi feito em R3/R4.
