# PRA-02 — resultado da prova controlada

Data: 06/11/2026. Spec técnica: [spec.md](spec.md).
**Estado da PRA-02: parcialmente concluída.** Nenhuma spec de produto aprovada.

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

## Configuração e limite que não será ocultado

O contrato permanece em agents/verificador-spec.md. O arquivo nativo
.codex/agents/verificador-spec.toml aponta para ele, sem copiar seu corpo,
e solicita redução de apps/plugins/memória/pedido de permissões. TOML foi
validado por parser, mas descoberta/aplicação na sessão nativa não foi provada.
As rodadas usaram delegação explícita do contrato, não o carregamento do TOML.

A documentação oficial informa que agentes personalizados herdam permissões
da sessão pai; sandbox_mode no arquivo de agente não substitui a configuração
do pai. Fonte consultada em 06/11:
[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
Por isso não foi adicionado um sandbox_mode decorativo ao TOML nem declarada
segurança de produção apenas porque o verificador obedeceu às instruções.

Para encerrar PRA-02, ainda falta iniciar e testar uma sessão pai com escrita
e acesso a produção bloqueados de fato, sem MCPs/credenciais de produção.
Não alterar a política global de acesso do usuário nesta tarefa. Os dois commits
de erro/restauração foram criados em rodada posterior após autorização específica:
12aa161 e d8bdcbb. Não houve push; isso não prova isolamento técnico.

## Checks atuais

- npm test: repetição aprovada, 50 testes em 9 arquivos. A primeira execução
  passou 40 testes, mas terminou com timeout ao iniciar o worker de diagnóstico;
  não foi considerada aprovada. Sem alteração de código, a repetição isolada passou.
- npm run lint: aprovado, saída 0.
- Parser TOML, 24 links locais e hashes da fixture restaurada: aprovados.
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

As duas rodadas continuaram marcando isolamento técnico como NÃO COMPROVADO.
O papel foi acionado pela ferramenta de colaboração explicitamente; isso não
prova descoberta do `.codex/agents/verificador-spec.toml` pelo Codex nativo.
PV-06 concluído; PV-05, descoberta nativa e fechamento integral da PRA-02 seguem
pendentes. A autorização de dois commits não autorizou push ou outras operações Git.
