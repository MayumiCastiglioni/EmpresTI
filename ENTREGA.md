# Entrega da prática

## Correção do catálogo publicado — 11/11/2026

Identificada guarda em src/server/db.ts que aceitava somente banco local,
inclusive em produção. Corrigida localmente para permitir Supabase no runtime
de produção, mantendo testes/desenvolvimento locais, RLS e membership.
[DEC-RUNTIME-SUPABASE](docs/produto/decisoes-pratica.md) e
[evidências/checks](docs/verificacao/runtime-supabase.md). Alteração não publicada
nesta sessão; catálogo remoto ainda não validado. O diagnóstico do código local
não comprova que seja a única pendência no deployment.
Validação desta correção: **94/94 testes**, configuração pura 15/15, lint e
TypeScript passaram. Build bloqueado por EPERM em `.next/build/chunks` no
OneDrive; nenhuma compilação aprovada nesta rodada e nenhum deploy realizado.

## Fotos — aceite atual de 11/11/2026

**As 12 fotos estão visualmente aprovadas pela usuária**, conforme instrução
explícita registrada em DEC-35 no [registro de decisões](docs/produto/decisoes-pratica.md).
Manifesto integral localizado: `.cache/imagens/manifesto-candidatos.json`;
revisão atualizada por foto, preservando histórico e ressalvas técnicas.
Substitui os resumos anteriores de oito aprovações e arquivo final não localizado.
O snapshot em `.cache/pixabay/` é parcial e histórico. Fontes mistas e ressalvas
de adequação permanecem registradas: aceite visual não comprova autorização do
professor para as fontes, validação técnica, Storage ou DADOS-04 integral.

## Versão para envio imediato — 11/11/2026

Resumo atual para avaliação: aplicação local implementada; **85/85 testes
padrão, 7/7 testes da interface, lint e TypeScript passaram** nesta sessão.
Foram corrigidas as consultas após indisponibilidade e ampliadas as provas
de prazo, atraso, proteção de dados e estados de interface.

A usuária informou que o manifesto foi concluído na conversa responsável pelas
fotos. Na conferência deste workspace, `.cache/pixabay/manifesto-candidatos.json`
ainda declara oito fotos aprovadas e quatro faltantes. O arquivo final não foi
identificado/validado nesta sessão; esse snapshot anterior não invalida o relato,
mas não serve como prova do lote final. Confirmar o artefato final da outra conversa.

Limitações que acompanham o envio: integrações Postgres bloqueadas por EACCES;
build padrão bloqueado por EPERM no OneDrive e build isolado por DNS do npm.
Migrations remotas, Storage/inventário reais, login normal do professor e zero
empréstimos não comprovados. Main, produção e tag final não atualizadas.
As revisões independentes permanecem NÃO PRONTA; não há aceite integral das
specs nem confirmação de produção funcional. Não enviar arquivos de ambiente,
credenciais ou a pasta de cache como substitutos dos artefatos finais revisados.

Este documento registra a versão disponível para envio, com pendências
explícitas; o prazo de envio não converte requisitos pendentes em cumpridos.

## Fechamento das partes 2, 3 e 4 — 11/11/2026

Entrega continua pendente. [DEC-FECH-234](docs/produto/decisoes-pratica.md)
registra a solicitação atual; fotos são tratadas em outra conversa.
Foram ampliadas provas de prazo/atraso, recusa sem escrita, inputs forjados e
estados da interface. Corrigida a atualização de consultas na recusa por
indisponibilidade prevista na DEC-24, com testes de atualização e erro.
[EMP-R2](docs/verificacao/emprestimos-r2.md) e
[DADOS-R3](docs/verificacao/dados-iniciais/r3.md) deram **NÃO PRONTA**;
isolamento técnico não comprovado. Integração Postgres não executou os 15
testes: connect EACCES 127.0.0.1:54322. Não confundir com os 9/9 históricos.
Lint e TypeScript passaram antes da correção de runtime; reteste de componente
intermediário passou 5/5. Checks finais constam no
[relatório de fechamento](docs/verificacao/fechamento-2-4.md).
Após correção DEC-24: componente final 7/7, lint e TypeScript passaram;
EMP-R2A confirmou resolução estática do achado. Suíte completa intermediária
82/83 (timeout logout); logout isolado 2/2. **Suíte final passou 85/85**.
Build isolado falhou na instalação por ENOTFOUND; build padrão falhou por
EPERM em `.next/build/chunks` no OneDrive. Nenhum build aprovado nesta rodada.
Migrations revisadas estaticamente, sem aplicação remota. Inventário/Storage,
login real e zero empréstimos do professor continuam não comprovados. Main,
produção e tag não alteradas: faltam gates funcionais e evidências reais.
Não houve mudança de schema nem operação Git; alterações não commitadas.

**Status: rascunho em andamento — não é declaração de entrega concluída.**
Atualizado em 11/11/2026. Plano: [prática](docs/plans/pratica-sdd-subagentes.md).
Respostas: [registro de decisões](docs/produto/decisoes-pratica.md).

## Links

- Repositório: https://github.com/MayumiCastiglioni/EmpresTI
- Produção: o Preview da branch `codex/alinhamento-aulas` passou; `main` e produção ainda não foram atualizadas. A causa da falha de `main` foi identificada como `NEXT_NO_ROUTES_MANIFEST` após uso de `distDir: build`; migrations e dados remotos continuam pendentes.
- Tag entrega-pratica: ainda não criada.

## 1. Conflitos: o que foi pedido contra o que já existia

| Pedido | Contrariava o quê | O que foi feito | Por quê | Onde registrado | Commit |
|---|---|---|---|---|---|
| Limite de 5 no briefing | Limite de 3 no PRD anterior | Usuária escolheu 5; migration, trigger e serviço locais aplicam o limite; integração Postgres passou | Escolha explícita: conforme briefing | PRD; spec MVP; PRAT-C01; DEC-02 | Não commitado |
| 14 dias úteis | Prazo de 14 dias sem contagem definida | Usuária escolheu úteis; calendário 2026–2030/23:59:59 integrado ao serviço e validado localmente | Escolha explícita da usuária | PRD; spec MVP; PRAT-C02; EMP-T02/05 | Não commitado |
| TI-0010 disponível no briefing | Lista de equipamentos o coloca em manutenção | Usuária escolheu disponível; nenhuma carga executada | Escolha explícita: conforme briefing | PRD; spec MVP; PRAT-C03 | Não commitado |
| Senha literal no arquivo de carga | Regras de segredos | Não foi criada carga nem versionada senha; forma privada ainda a especificar | Proibição vigente preservada | PRAT-C04; docs/rules/secrets.md | Pendente |
| Verificador corrigir teste | Independência e proibições do verificador | R1/R2 não corrigiram a fixture; R4 comprovou descoberta nativa e isolamento MXC local, com check 1/1 | Contrato vigente preservado; PRA-02 concluída somente para a fixture | PRAT-C05; DEC-28; docs/verificacao/prova-verificador/resultado.md | 12aa161, d8bdcbb (somente fixture; locais) |
| Catálogo sem crédito | Fonte original Pexels indisponível | Oito fotos Pixabay aprovadas; quatro candidatos externos registrados, com ressalvas e sem aceite visual | Usuária autorizou fontes externas em 11/11; autorização do professor para elas não informada | DEC-30/31/32/34; `.cache/imagens/manifesto-candidatos.json`; PRAT-C06 | Parcial |
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

[Procedimento criado](skills/imagens-equipamentos/SKILL.md), com ferramenta de
busca/download unitário e validadores Pixabay testados localmente. A chave foi
configurada localmente; oito PNGs (TI-0001/0002/0003/0004/0005/0008/0009/0010)
foram aprovados visualmente (DEC-31/32). TI-0006/0007/0011/0012 seguem sem
candidato adequado nas buscas documentadas; DEC-34 substituiu DEC-33 e autorizou
fontes externas. O manifesto local tem 12 candidatos, 12 hashes únicos e arquivos
800×600; oito têm aceite visual e quatro permanecem pendentes. TI-0006 tem
adesivo/etiquetas e TI-0012 retrata câmera de corpo grande, exigindo substituição
ou revisão antes de DADOS-04. Origem e crédito constam no manifesto ignorado pelo
Git. Manifesto final aceito, Storage e validação da conta continuam pendentes. A API exige cache de
24h e download local sem hotlink permanente. [API](https://pixabay.com/api/docs/) ·
[licença](https://pixabay.com/service/license-summary/). Evidências no
[plano de adaptação](docs/plans/adaptacao-pixabay.md).

## 5. O subagente verificador

O [contrato](agents/verificador-spec.md), o gatilho no
[specflow](docs/rules/specflow.md) e a configuração nativa em
.codex/agents/verificador-spec.toml foram preparados; `.codex/config.toml`
registra o papel do projeto. Na R4, o Codex descobriu e iniciou o agente
nativamente. O check passou 1/1 em uma sessão MXC read-only; escrita no projeto,
perfil e `.env*` foi negada, assim como conexão TCP. Apps/plugins e MCPs estavam
desativados, e o ambiente pessoal foi ignorado/filtrado.

PRA-02 está concluída apenas para a fixture técnica. A configuração está local,
ainda sem commit; não houve push, deploy ou acesso a serviço remoto. Isso não
aprova as specs do produto nem certifica isolamento em produção. Ver
[DEC-28](docs/produto/decisoes-pratica.md) e [evidência R4](docs/verificacao/prova-verificador/resultado.md).

## 6. O verificador em ação

Prova controlada real: [resultado e integridade](docs/verificacao/prova-verificador/resultado.md).

| Rodada | Estado da fixture | Resultado | Autocorreção |
|---|---|---|---|
| R1 | Erro plantado pelo principal | REPROVADO; asserção falhou | Nenhuma |
| R2 | Restaurada pelo principal | ATENDIDO; teste passou | Nenhuma |
| R4 | Restaurada; agente nativo sob MXC read-only | ATENDIDO; 1 teste passou | Nenhuma |

As respostas completas estão preservadas no resultado. A prova versionada
criou `12aa161` (erro) e `d8bdcbb` (restauração), somente para a fixture; ambos
estão locais, sem push. O teste terminou restaurado. A R4 concluiu PV-05 e PV-07
para esta fixture. A prova não aprova as specs de produto.

## 7. Uma regra sua que esta prática pôs à prova

A proibição de autocorreção foi exercitada: R1 reportou a falha e deixou o
erro intacto, conferido pelo principal antes da restauração. A R4 também
comprovou bloqueio técnico local de escrita e rede durante a prova; isso não
certifica outros ambientes nem produção.
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
Integrações sintéticas 3/3 passaram; não comprova fotos reais, Storage público
ou acesso do professor no deploy. Evidências em docs/validacao-dat05c-fluxo-local.md.

DAT-07A: interrupção após oito INSERTs no Postgres local comprovou rollback de
organização/vínculo/itens; Auth fixture preservado. DADOS-R1 terminou NÃO PRONTA
por falta de fotos/Storage/acesso professor/evidência humana; sem CA completo.
Fonte: docs/validacao-dat07a-rollback.md e docs/verificacao/dados-iniciais/r1.md.

[DADOS-R1](docs/verificacao/dados-iniciais/r1.md): veredito NÃO PRONTA para a spec
completa. Revisor reproduziu 59 testes/lint, mas não integrações com escrita;
fotos reais, Storage, acesso professor e roteiro humano continuam pendentes.
Não há CA completo aprovado por esta rodada.

Em 11/11, as revisões [EMP-R1](docs/verificacao/emprestimos-r1.md) e
[DADOS-R2](docs/verificacao/dados-iniciais/r2.md) também devolveram **NÃO PRONTA**.
Ambas registraram isolamento técnico não comprovado nesta sessão. O principal
corrigiu parte dos testes EMP depois do parecer; integração local passou 9/9
e lint passou, sem novo aceite independente. Seis fotos continuam faltando.

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

PRA-02: R1 detectou o erro plantado; R2 e R4 aprovaram a fixture restaurada,
sem autocorreção. R4 carregou o agente nativamente e passou 1/1 em sessão MXC
read-only, com escrita, perfil, `.env*` e rede bloqueados. Os commits locais
`12aa161` e `d8bdcbb` registram o erro/restauração. A PRA-02 está concluída
somente para a fixture; configuração local ainda não commitada, sem push ou
deploy. Detalhes em [resultado](docs/verificacao/prova-verificador/resultado.md)
e [DEC-28](docs/produto/decisoes-pratica.md).

PRA-03: testes da skill 7/7, pré-validação 9/9, `test:images-local` 1/1 e
`preparar.test.mjs` 2/2 passaram. Seis imagens reais têm dimensão/hash
conferidos e aprovação visual da usuária (DEC-31); seis patrimônios seguem sem foto
adequada. Nenhum upload ou acesso ao Storage remoto foi feito.

PRA-04: DDL de imagem aprovado e migration local concluída. DADOS-R1 retornou
NÃO PRONTA; a spec de dados permanece aberta por falta de fotos/Storage/conta real.

PRA-05: `npm run test:images-local` 1/1 e `npm run test:initial-data-local` 3/3
passaram com Postgres/Auth locais e fixtures sintéticas. Sem CLI/rota operacional,
fotos reais, Storage, conta do professor ou escrita de produção.

Tópico 4 do planejamento: a origem e a implementação Pixabay estão autorizadas;
chave local configurada, aquisição parcial. Faltam seis fotos adequadas e revisão
humana. Storage e validação da conta continuam sendo ações da pessoa responsável
em produção. A conta do professor não foi usada em testes; o
roteiro exige validar o fluxo normal e zero empréstimos sem compartilhar senha.
O teste com fixtures não é evidência de dados reais. A adaptação local está
implementada e `npm run test:initial-data-local` passou 3/3 após a fixture do
empréstimo legado declarar o estado `SOLICITADO`. Nenhuma chamada à API, leitura
de `.env.local` ou alteração remota foi realizada.
Detalhes e próximos passos: [plano de dados iniciais](docs/plans/dados-iniciais.md)
e [roteiro humano](docs/roteiro-humano-dados-iniciais.md).

Evidência consolidada: [PRA-02 a PRA-05](docs/validacao-pra02-pra05.md).

## Pipeline de acompanhamento

Por pedido explícito da usuária, a automação local do Codex chegou a ser ativada
para executar a pipeline a cada 15 minutos. A usuária pediu posteriormente que
fosse desativada; ela não está ativa. O prompt padrão permanece em
[docs/prompt-pipeline-automatica.md](docs/prompt-pipeline-automatica.md) como
referência para retomada manual. DEC-22 registra a ativação inicial e a
desativação posterior.

## Build local e revisão visual — 11/11/2026

O build local a partir do OneDrive agora pode ser executado com
`npm run build:isolated`: a cópia fora da pasta sincronizada passou em Prisma,
TypeScript e Next.js; arquivos `.env*` não são copiados e a cópia temporária é
removida. CI/Vercel continuam usando `npm run build` com `.next` padrão. Ver
[DEC-29](docs/produto/decisoes-pratica.md) e [evidência COR-02](docs/validacao-cor02-build.md).

As capturas de catálogo desktop, confirmação e catálogo móvel foram conferidas
em 11/11. A aprovação humana de 10/11 cobre as telas autenticadas, o foco e os
viewports. A leitura dos títulos, ações e textos da confirmação está boa; os
metadados são menores, mas legíveis. Não foi recomendada mudança global de fonte
nem houve alteração visual. Fotos reais e créditos continuam pendentes, fora do
aceite das capturas. [Revisão visual](docs/validacao-emp-t05-t07.md).

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
`npm run lint`, `npx tsc --noEmit` e build de produção passaram após atualização
das dependências e restauração do `distDir` padrão do Next.js. Evidências em
[EMP-T05 a EMP-T07](docs/validacao-emp-t05-t07.md).

Limites atuais: RLS de leitura e rotas HTTP/Auth/cookies/browser passaram no
Postgres/Supabase locais; papel do deployment não comprovado. Em 10/11, a usuária
aprovou as telas autenticadas, o foco e os tamanhos de viewport. Fotos reais
e seus créditos ainda faltam; essa aprovação não cobre as imagens. Falta revisão
independente dos EMPs e validação da versão final. Build Next passou localmente.

Commit `bc259e6` foi enviado para `codex/alinhamento-aulas`; seu Preview Vercel
concluiu com sucesso. O deploy de `main` em 05/11 falhou com
`NEXT_NO_ROUTES_MANIFEST`: o commit `3bcb029` usava `distDir: build`, mas a Vercel
procurava `.next`. A configuração padrão foi restaurada e a branch atual passou
no Preview. `main`/produção não foram atualizadas; migration e verificação remotas
seguem pendentes, sem escrita de produção pelo agente.

Após correções compatíveis, Next.js está em 16.4.6 e Prisma em 7.10.1. `npm audit
--omit=dev` reporta zero vulnerabilidades de produção; o audit completo ainda
aponta sete alertas moderados em ferramentas de desenvolvimento.
