# Entrega da prática

**Status: rascunho em andamento — não é declaração de entrega concluída.**
Atualizado em 10/11/2026. Plano: [prática](docs/plans/pratica-sdd-subagentes.md).
Respostas: [registro de decisões](docs/produto/decisoes-pratica.md).

## Links

- Repositório: https://github.com/MayumiCastiglioni/EmpresTI
- Produção: pendente confirmar funcionamento e corrigir a falha do Preview Vercel no [PR #1](https://github.com/MayumiCastiglioni/EmpresTI/pull/1); o log de build não foi acessível nesta sessão e a causa continua sem confirmação.
- Tag entrega-pratica: ainda não criada.

## 1. Conflitos: o que foi pedido contra o que já existia

| Pedido | Contrariava o quê | O que foi feito | Por quê | Onde registrado | Commit |
|---|---|---|---|---|---|
| Limite de 5 no briefing | Limite de 3 no PRD anterior | Usuária escolheu 5; migration, trigger e serviço locais aplicam o limite; integração Postgres passou | Escolha explícita: conforme briefing | PRD; spec MVP; PRAT-C01; DEC-02 | Não commitado |
| 14 dias úteis | Prazo de 14 dias sem contagem definida | Usuária escolheu úteis; calendário 2026–2030/23:59:59 integrado ao serviço e validado localmente | Escolha explícita da usuária | PRD; spec MVP; PRAT-C02; EMP-T02/05 | Não commitado |
| TI-0010 disponível no briefing | Lista de equipamentos o coloca em manutenção | Usuária escolheu disponível; nenhuma carga executada | Escolha explícita: conforme briefing | PRD; spec MVP; PRAT-C03 | Não commitado |
| Senha literal no arquivo de carga | Regras de segredos | Não foi criada carga nem versionada senha; forma privada ainda a especificar | Proibição vigente preservada | PRAT-C04; docs/rules/secrets.md | Pendente |
| Verificador corrigir teste | Independência e proibições do verificador | Rodadas versionadas R1/R2 não corrigiram a fixture; isolamento técnico segue não comprovado | Contrato vigente preservado | PRAT-C05; docs/verificacao/prova-verificador/resultado.md | 12aa161, d8bdcbb (somente fixture; locais) |
| Catálogo sem crédito | Contrato de crédito Fotos: Pexels | Crédito Pexels é exibido quando metadados válidos existem; nenhuma foto real disponível para validar | Escolha explícita da usuária | PRAT-C06; EMP-T07 | Pendente |
| Instalar sharp | Dependências limitadas pelos ADRs/regras | Autorizado pela usuária; sharp 0.35.5 instalado para processamento local | Autorização explícita recebida; atualização de ADR pelo time | PRAT-C07 | Pendente |

As specs de dados iniciais e de solicitação existem. O pipeline local usa
fixtures sintéticas; a spec de dados não recebeu veredito PRONTA, e a spec de
empréstimos está em implementação parcial. O prazo já é consumido pelo serviço;
falta aceite integral e revisão independente.

## 1b. Lacunas: o que foi pedido de forma incompleta

| Spec | O que falta | Alternativas | Decisão | Motivo | Commit |
|---|---|---|---|---|---|
| Solicitar empréstimo | Contrato de legado/reenvio e integração de prazo | Propostas na spec | Regra/cálculo isolado aprovados; integração e legado pendentes | Decisões registradas | Não commitado |
| Dados iniciais | Fotos reais, Storage público e acesso real do professor | Contrato aprovado; testes sintéticos locais | Decisões no registro central; execução real pendente | Não confundir teste com produção | Não commitado |

## 2. Onde o agente tentou decidir por você

Pendente registrar episódio real com evidência. Não inventar ocorrência para
preencher a entrega; propostas do agente não equivalem a decisões do usuário.

## 3. Uma decisão que merece (ou não) um ADR

Pendente escolha e justificativa pelo time. Alterações de limite/prazo são de
produto e foram registradas no PRD; nenhum ADR foi escrito pelo agente.

## 4. A skill imagens-equipamentos

[Procedimento criado](skills/imagens-equipamentos/SKILL.md), com preparação e
validação local testadas. O Help Center oficial da Pexels, verificado em 07/11/2026,
que a emissão de novas chaves está pausada; [fonte](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key).
Não existem fotos reais aprovadas. Pixabay não foi aprovado como troca. Revisão
visual, créditos dos arquivos e upload humano continuam pendentes.

## 5. O subagente verificador

O [contrato](agents/verificador-spec.md), o gatilho no
[specflow](docs/rules/specflow.md) e a configuração nativa em
.codex/agents/verificador-spec.toml foram preparados. O TOML foi validado,
mas seu carregamento nativo ainda não foi comprovado. As rodadas usaram
subagentes novos com delegação explícita e contexto limpo.

O isolamento técnico permanece **não comprovado**: as sessões permitem escrita
e ferramentas externas. O acionamento explícito do papel verificador não prova
que o TOML do projeto foi descoberto/carregado nativamente.

## 6. O verificador em ação

Prova controlada real: [resultado e integridade](docs/verificacao/prova-verificador/resultado.md).

| Rodada | Estado da fixture | Resultado | Autocorreção |
|---|---|---|---|
| R1 | Erro plantado pelo principal | REPROVADO; asserção falhou | Nenhuma |
| R2 | Restaurada pelo principal | ATENDIDO; teste passou | Nenhuma |

As respostas completas estão preservadas no resultado. A prova versionada
criou `12aa161` (erro) e `d8bdcbb` (restauração), somente para a fixture; ambos
estão locais, sem push. O teste terminou restaurado. PV-05 permanece pendente,
e a prova não aprova as specs de produto.

## 7. Uma regra sua que esta prática pôs à prova

A proibição de autocorreção foi exercitada: R1 reportou a falha e deixou o
erro intacto, conferido pelo principal antes da restauração. Isso demonstra
comportamento nesta prova, sem comprovar bloqueio técnico de escrita.
A proibição de senha em código continua preservada; não foi criada carga.

## 8. O que ficou de fora e o que faria diferente

Dados iniciais, fotos, conta do professor no deploy e aceite final do fluxo
continuam pendentes. Solicitação persistente foi exercitada com fixtures
sintéticas locais; isso não comprova dados reais nem produção funcionando.
Devolução, Operações e redesign amplo ficam fora desta fatia da atividade.
Próximo trabalho depende das decisões registradas e do ciclo SDD aprovado.

## Atualização — revisão da preparação local

[IMG-R1](docs/verificacao/imagens-local/r1.md) reprovou a cobertura parcial de
IMG-01. O principal acrescentou teste de formato PNG, recorte com imagem não
uniforme e hash calculado independentemente; os dois testes Node passaram.
[IMG-R2](docs/verificacao/imagens-local/r2.md) aprovou os quatro critérios locais;
2 testes específicos, 50 testes gerais e lint passaram. Nenhuma foto real foi aprovada.
Decisões novas: organização única; carga preserva dados existentes e interrompe
para reportar divergências. [Spec de dados](docs/specs/dados-iniciais.md) preparada como rascunho;
a de empréstimo ainda pendente. Nenhum CA da carga aprovado.

Identificação confirmada: EmpresTI / empresti. Professor como COLABORADOR,
reaproveitamento sem trocar senha e confirmação normal de e-mail. Divergências
interrompem. Isso foi exercitado apenas com identidade/fixtures sintéticas;
a conta real e a carga em produção não foram usadas.

O DDL de image JSONB foi aprovado; a migration é local e está documentada em
docs/validacao-dat03-imagem.md. Nenhuma alteração remota foi executada.

DAT-03 executada após aprovação: coluna image opcional e constraint geradas
via Prisma Migrate, aplicadas somente local. Atualização preservou linha anterior;
reconstrução limpa, teste de constraint/RLS, 50 testes gerais, lint e build passaram.
[Evidências](docs/validacao-dat03-imagem.md). Isso não aprova carga/fotos/produção.

A pré-validação DAT-05A está integrada ao fluxo local DAT-05C, com comparação
e transação testadas em fixtures sintéticas. Fotos e conta reais seguem pendentes.

Persistência interna de equipamentos implementada (DAT-05B): teste com Prisma e
Postgres local validou duas execuções simultâneas sem duplicar, repetição sem
alterar registros e divergência preservada. Pré-condições ainda sintéticas;
sem fotos/conta reais ou comando operacional. Carga completa não aprovada.

DAT-06A: conferência da identidade e provisionamento do vínculo local implementados.
Teste com Auth/Postgres sintéticos comprovou bloqueio antes de confirmação,
reexecução, senha preservada e divergências/empréstimos intactos. Não comprova
cadastro/entrega de e-mail do professor em produção ou carga completa.

DAT-05C integrou arquivos, revisão registrada, conta e lote em operação local.
Integrações sintéticas 3/3 passaram; não comprova fotos Pexels, Storage público
ou acesso do professor no deploy. Evidências em docs/validacao-dat05c-fluxo-local.md.

DAT-07A: interrupção após oito INSERTs no Postgres local comprovou rollback de
organização/vínculo/itens; Auth fixture preservado. DADOS-R1 terminou NÃO PRONTA
por falta de fotos/Storage/acesso professor/evidência humana; sem CA completo.
Fonte: docs/validacao-dat07a-rollback.md e docs/verificacao/dados-iniciais/r1.md.

[DADOS-R1](docs/verificacao/dados-iniciais/r1.md): veredito NÃO PRONTA para a spec
completa. Revisor reproduziu 59 testes/lint, mas não integrações com escrita;
fotos reais, Storage, acesso professor e roteiro humano continuam pendentes.
Não há CA completo aprovado por esta rodada.

DAT-08A: verificador público de imagens e roteiro humano parcial preparados,
validados contra servidor HTTP de teste. Nenhuma consulta/publicação real no
Storage; DADOS-04 e DAT-08 não concluídos. Veja docs/validacao-dat08a-storage.md.

Regra do calendário definida e implementada: segunda a sexta, nove feriados
fixos, 2026–2030, dia inicial excluído e fim às 23:59:59 de São Paulo. O serviço
consome o cálculo e a integração local testou o vencimento retornado.

A spec de solicitação está em implementação parcial: serviço transacional local;
procedures e tela mínima de colaborador conectadas; leituras RLS testadas no
Postgres local. Teste HTTP com Auth/cookies e Playwright local passaram; as quatro
migrations foram reconstruídas numa base descartável. A usuária aprovou as telas,
foco e viewports em 10/11/2026. Faltam deployment e aceites integrais.

Cobertura e precisão aprovadas estão codificadas em
src/server/loans/calendar.ts e são consumidas pelo serviço de solicitação.

## Regra de rastreabilidade e revisão do enunciado

Por pedido da usuária, decisões serão registradas continuamente em
[registro central](docs/produto/decisoes-pratica.md), conforme
[regra obrigatória](docs/rules/decisions.md), com origem/responsável/data,
alternativas/motivo informado e estado de implementação/validação.
[Checklist do enunciado](docs/checklist-enunciado.md) reúne 20 pontos de atenção;
auditoria final, evidências por item e conferência da versão da entrega pendentes.

DEC-19: usuária escolheu somente feriados nacionais fixos; não incluir Sexta-feira
da Paixão/Carnaval/Corpus Christi. EMP-T02 implementou cálculo isolado 2026–2030,
14 dias úteis, fuso São Paulo e 23:59:59; 70 testes e lint passaram. Integração
com solicitação e verificação de banco permanecem pendentes; build aprovado.
Fonte/evidências: docs/produto/calendario-emprestimos.md e docs/validacao-emp-t02-calendario.md.
DEC-20 registra a escolha operacional de cálculo puro/Intl sem pacote novo.

## EMP-T03 — sessão, vínculo e RLS de leitura local — 10/11/2026

`protectedProcedure` valida sessão por `supabase.auth.getUser()`; `tenantProcedure`
consulta o vínculo pelo Prisma para `empresti` e só propaga o tenant/papel após
localizá-lo. Ausência de vínculo retorna FORBIDDEN; falhas Auth/Prisma retornam
mensagem genérica. Oito testes unitários, 1 integração de membership em Postgres
local, 78 testes gerais, lint e build passaram. Atualização em 10/11: leitura de
catálogo/empréstimos troca para `authenticated` com claim derivado da sessão
verificada; teste local provou que RLS restringe tenant/borrower. Rota HTTP,
cookies e deployment seguem sem prova. `getDatabase()` segue local-only, sem
consulta remota. [DEC-21](docs/produto/decisoes-pratica.md) e
[evidências EMP-T03](docs/validacao-emp-t03-auth.md).
## PRA-02 a PRA-05 — estado desta execução

PRA-02: commits locais `12aa161` (erro) e `d8bdcbb` (restauração); R1 falhou
e R2 passou na fixture. Ambos os revisores marcaram isolamento técnico como
NÃO COMPROVADO; configuração nativa ainda não provada.

PRA-03: testes locais de preparação 2/2 e verificação HTTP simulada 1/1. A
aquisição API Pexels está bloqueada por pausa oficial de novas chaves; nenhuma
foto real ou upload foi produzido. A origem alternativa continua sem aprovação.

PRA-04: DDL de imagem aprovado e migration local concluída. DADOS-R1 retornou
NÃO PRONTA; a spec de dados permanece aberta por falta de fotos/Storage/conta real.

PRA-05: `npm run test:images-local` 1/1 e `npm run test:initial-data-local` 3/3
passaram com Postgres/Auth locais e fixtures sintéticas. Sem CLI/rota operacional,
fotos reais, Storage, conta do professor ou escrita de produção.

Evidência consolidada: [PRA-02 a PRA-05](docs/validacao-pra02-pra05.md).

## Pipeline de acompanhamento

Por pedido explícito da usuária, a automação local do Codex chegou a ser ativada
para executar a pipeline a cada 15 minutos. A usuária pediu posteriormente que
fosse desativada; ela não está ativa. O prompt padrão permanece em
[docs/prompt-pipeline-automatica.md](docs/prompt-pipeline-automatica.md) como
referência para retomada manual. DEC-22 registra a ativação inicial e a
desativação posterior.

## Aprovação de legado e reenvio — 08/11/2026

Usuária respondeu "aprovo 1 e 2" às propostas apresentadas: DEC-23 preserva e
conta SOLICITADO/RETIRADO existentes no limite/atraso, sem conversão/exclusão;
novos pedidos iniciam em RETIRADO. DEC-24 recusa reenvio para equipamento com
empréstimo ativo, atualiza a consulta e impede duplicação/exposição de terceiros.
Alternativa de retornar estado atual foi substituída pela recusa aprovada.
Motivo não informado. [Registro central](docs/produto/decisoes-pratica.md).
PRD, spec, plano/tasks e checklist atualizados; EMP-T01 concluída documentalmente.
Implementação e aceites de produto pendentes. O DDL foi aprovado e aplicado no
banco local em 10/11/2026; ver EMP-T04 abaixo. Nesta etapa de 08/11, as alterações
foram somente documentais e não commitadas.
Checks locais de consistência/links e handoff executados; testes/lint/build
não aplicáveis porque não houve mudança de código, configuração ou runtime.

## EMP-T04 — DDL aplicado localmente — 10/11/2026

[Proposta consolidada](docs/plans/solicitar-emprestimo-policies.md) inclui DDL,
impacto e plano de validação. DEC-26/27 registram a remoção da policy UPDATE de
OPERACOES/ADMIN nesta fatia e a aprovação do SQL após teste isolado. A migration
`20261110122729_loan_immediate_limit_five_policies` foi aplicada no Postgres local;
`migrate status` confirmou schema sincronizado. Postgres descartável 17.11 passou
nos cenários de trigger/RLS/concorrência; `npm test` 78/78, lint e build passaram.
O serviço tRPC, UI, papel de runtime/RLS e produção continuam pendentes; não é
uma entrega end-to-end. [Evidência](docs/validacao-emp-t04-loans.md). Sem Git,
serviço remoto ou deploy; não commitado. ENUN-15/16 continuam parciais.

## DEC-26 — acesso de Operações nesta fatia — 10/11/2026

Origem e responsável: resposta explícita da usuária nesta conversa. Alternativas:
manter a policy `operations_manage_loans` ou removê-la nesta fatia. Escolha:
remover a policy UPDATE de empréstimos para OPERACOES/ADMIN e deixar esse acesso
para uma decisão futura. Motivo informado: alinhar esta fatia ao escopo da
atividade e decidir o acesso futuro depois. Estado: aprovada e implementada no
banco local pela migration listada acima; produção e fluxo futuro continuam
pendentes. [Registro central](docs/produto/decisoes-pratica.md).

## DEC-27 — aprovação do DDL EMP-T04 — 10/11/2026

Origem/responsável: resposta explícita da usuária, condicionando o ok à verificação
de funcionamento. Alternativas: adiar até teste ou aprovar o conjunto exato após
teste. Escolha: aprovar o DDL consolidado e atualizar o default Prisma para
`RETIRADO`, aplicando somente localmente. Motivo informado: confirmar que
funcionava antes de autorizar. Estado: SQL aplicado em
`20261110122729_loan_immediate_limit_five_policies`; teste isolado passou,
`npm test` 78/78, lint e build passaram. Não comprova o fluxo end-to-end, runtime
RLS ou produção. [Registro central](docs/produto/decisoes-pratica.md) ·
[evidências](docs/validacao-emp-t04-loans.md).

## EMP-T05 a EMP-T07 — implementação local parcial — 10/11/2026

EMP-T05 concluída localmente: serviço transacional usa sessão/tenant do contexto,
calendário aprovado e locks de colaborador/equipamento. Oito testes Postgres
locais passaram para prazo consumido pelo serviço, início imediato, limite,
atraso, manutenção, reenvio, concorrência entre pessoas e entre itens e rollback.

EMP-T06/07 parciais: procedures tRPC de catálogo, empréstimos próprios e
solicitação conectadas à tela; confirmação antecede a mutation, erros não
simulam sucesso e listas atualizam após confirmação. Testes de componente cobrem
sucesso/recusa/manutenção. Playwright com Auth local sintético navegou o catálogo,
testou limite, manutenção, vazio, teclado/foco e viewport 390 px; a tela de login
reflete cinco itens e 14 dias úteis.

Checks desta rodada: `npm test` 81/81, `npm run test:loans-local` 8/8,
`npm run test:loans-http-local` 1/1, `npm run test:loans-browser-local` 1/1,
`npm run lint` e `npx tsc --noEmit` passaram. Build normal tentou
remover artefato reparse-point da pasta OneDrive e falhou antes da compilação;
build isolado passou após restaurar a configuração original. Evidências em
[EMP-T05 a EMP-T07](docs/validacao-emp-t05-t07.md).

Limites atuais: RLS de leitura e rotas HTTP/Auth/cookies/browser passaram no
Postgres/Supabase locais; papel do deployment não comprovado. Em 10/11, a usuária
aprovou as telas autenticadas, o foco e os tamanhos de viewport. Fotos Pexels reais
e seus créditos ainda faltam; essa aprovação não cobre as imagens. Falta revisão
independente dos EMPs e validação da versão final. Build Next passou
em pasta isolada; build padrão para antes de
compilar ao limpar um reparse-point do OneDrive. Sem Git, serviço remoto,
produção, Storage remoto, publicação ou deploy.

Após correções compatíveis, Next.js está em 16.4.6 e Prisma em 7.10.1. `npm audit
--omit=dev` reporta zero vulnerabilidades de produção; o audit completo ainda
aponta sete alertas moderados em ferramentas de desenvolvimento.
