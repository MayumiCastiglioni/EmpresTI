# Plano prioritário — prática SDD, skill e subagente

Data: 06/11/2026. Pedido: refazer o planejamento após leitura do novo enunciado.
Fonte recebida: pratica-sdd-subagentes (1).zip, arquivo interno
pratica-sdd-subagentes.html. Seus briefings são pedidos a analisar, não decisões
que substituem automaticamente [PRD](../PRD.md), [ADRs](../adr/001-stack.md)
ou [restrições](../rules/restrictions.md).

Para a ordem atual de fechamento, critérios e revisões humanas, seguir o
[plano de fechamento](fechamento-entrega.md). As seções históricas abaixo
registram o estado na data indicada; não substituir as evidências mais recentes.

Este é o roteiro ativo. Substitui a prioridade de concluir todo o andar zero
antes de construir as entregas. O [plano anterior](../plan-andar-zero.md) e o
[inventário amplo](correcoes-aulas.md) permanecem como suporte e histórico.
Não declara aprovadas as duas specs, dependências, DDL ou ações de produção.

## Ordem de execução

| Etapa | Entrega | Aceite e dependências |
|---|---|---|
| PRA-01 | Registrar conflitos, lacunas e decisões do usuário | Tabela de conflitos abaixo respondida; regras confirmadas nas fontes corretas antes da implementação afetada |
| PRA-02 | Adaptar e provar o verificador existente | Acionamento obrigatório, contexto limpo, saída comparável, sem autocorreção nem capacidade de escrita em produção; erro plantado e restauração com evidências |
| PRA-03 | Criar skill imagens-equipamentos | Contrato Pexels atendido e auditado; geração/preparação local separada do upload humano; scripts verificam tamanho, duplicidade e manifesto; revisão visual documentada |
| PRA-04 | Aprovar spec, plano e tarefas de dados iniciais | 12 equipamentos exatos, situações decididas, imagem/crédito, idempotência, conta do professor e zero empréstimos especificados; tenant e identidade definidos |
| PRA-05 | Implementar dados e imagens localmente | DDL/impacto aprovados antes de schema; migrations novas, scripts e testes locais; rodar carga duas vezes sem duplicar; professor não usado como conta de teste; verificador aprova spec |
| PRA-06 | Aprovar spec, plano e tarefas de solicitar empréstimo | Limite e prazo decididos; catálogo, próprios empréstimos, estados e conflitos simultâneos com critérios identificados |
| PRA-07 | Implementar solicitação persistente e telas mínimas | Solicitar inicia empréstimo; indisponibilidade, atraso, limite e concorrência garantidos no servidor/banco; dados próprios protegidos; testes e verificador aprovam spec |
| PRA-08 | Recuperar publicação e preparar aplicação humana em produção | Obter log Vercel e corrigir causa comprovada; preparar configuração/carga/upload sem segredos; usuário executa escrita no banco e Storage do deploy |
| PRA-09 | Completar ENTREGA.md e conferir produção | Decisões acumuladas desde PRA-01, alternativas, fontes/linhas, commits, rodadas reais, erro plantado e tabelas finais; conta própria para testes e professor com zero empréstimos |
| PRA-10 | Marcar e entregar a versão final | Links GitHub/Vercel funcionando; usuário autoriza ou executa tag entrega-pratica após validação; nada posterior à tag contado como entregue |

Cada etapa será decomposta em tarefas pequenas e verificáveis. Seguir o ciclo
SDD existente: aprovar spec/plano antes de código, uma tarefa por vez, checks
e relato. Manter o rascunho do ENTREGA.md atualizado ao longo da prática,
sem inventar decisões, rodadas de revisão ou evidências retroativas.
O diagnóstico da Vercel pode ocorrer antes de PRA-08 se o log chegar; não
modificar configurações remotas nem atribuir causa sem evidência.

## Conflitos a decidir e registrar — PRA-01

| ID | Trechos em conflito | Estado/encaminhamento |
|---|---|---|
| PRAT-C01 | Briefing limita a 5; PRD limitava a 3 | Usuária escolheu 5; documentação, migration, trigger e serviço aplicam o limite no caminho local; integração Postgres passou |
| PRAT-C02 | Briefing pede 14 dias úteis; PRD dizia 14 dias sem fechar contagem | Regra resolvida: 14 úteis, feriados nacionais fixos, 2026–2030, 23:59:59 São Paulo; cálculo consumido pelo serviço e validado localmente |
| PRAT-C03 | Lista põe TI-0010 em manutenção; briefing de dados deixa somente TI-0004/TI-0007 em manutenção | Resolvido: TI-0010 disponível; TI-0004/TI-0007 em manutenção, 10 disponíveis; lote ainda não carregado com dados reais |
| PRAT-C04 | Briefing pede senha literal no arquivo de carga; regras proíbem segredo em código/Git | Não versionar senha; propor entrada por variável privada/entrada humana, sem registrar valor no ENTREGA.md |
| PRAT-C05 | Tech lead pede que verificador corrija teste; contrato exige independência | R1/R2 da fixture não corrigiram; isolamento técnico e carregamento nativo ainda não comprovados |
| PRAT-C06 | Briefing pede catálogo sem crédito; contrato da skill exige Fotos: Pexels com link | Usuária aceita manter crédito; UI o exibe quando os metadados são válidos; fotos reais pendentes |
| PRAT-C07 | Briefing manda instalar sharp; ADR não o lista | Sharp autorizado e instalado para processamento local; atualização de ADR continua com o time |

O enunciado confirma a decisão já registrada: solicitação inicia o empréstimo,
sem aprovação de Operações ou fila. A prática exclui devolução e tela de
Operações desta fatia; isso não remove essas funcionalidades do escopo futuro
do PRD. Reconciliar as migrations atuais, que ainda reservam antes da retirada.

## Lacunas que condicionam as duas specs

- EmpresTI/empresti e organização única confirmadas; vínculo do professor como
  COLABORADOR e confirmação normal também decididos. A identidade real e a prova
  de acesso continuam pendentes; testes locais usam conta sintética.
- Unicidade tenant + patrimônio, modelo de imagem e regra de reexecução aprovados;
  coluna image já existe na migration local. Fotos reais e objetos ainda faltam.
- Pexels exige API; emissão de novas chaves foi informada como pausada em
  06/11/2026. Pixabay não foi aprovado como substituição pelo professor.
- Delimitar permissões mínimas para visualizar dados próprios, solicitar e
  consultar catálogo; concessão de Operações continua fora desta fatia.

## Contrato mínimo da skill — PRA-03

Somente API Pexels com credencial privada; nenhuma imagem gerada por IA ou
busca em outra origem. Uma foto distinta por equipamento; manifesto registra
ID, autor, URL de origem, licença e caminho de destino. Garantir dimensões
reais 800 x 600 por código, não só parâmetro ou pedido em linguagem natural.
Revisar pessoas, marcas/logos legíveis, textos e telas com conteúdo; registrar
quantidade e motivos de rejeição. Não tratar revisão visual como garantia de
um script que apenas confere dimensões.

Preparar arquivos localmente. Upload idempotente ao bucket público de produção
fica com o usuário. Auditar separação de credenciais, ferramentas e permissões
para que a proibição não dependa só da memória do agente. Documentar a fonte
oficial da API e a aprovação das ferramentas antes da execução.

## Estado atual aproveitável

Login/cadastro/logout, proteção de páginas, Prisma local, health e diagnóstico
implementados. EMP-T03/04/05 estão concluídas localmente; EMP-T06/07 parciais,
com testes HTTP e Playwright autenticado local aprovados; usuária aprovou telas,
foco e viewport em 10/11. PRA-02 tem duas rodadas versionadas, mas isolamento nativo não foi
provado. A preparação e carga sintéticas existem; fotos reais, Storage e acesso
do professor faltam. A conta sintética não prova acesso de produção.

## O que fica em suporte ou para depois

MIN-04/05: executar apenas a parte necessária para rodar/reconstruir e testar
as novas specs; não transformar orquestração em projeto separado. MIN-06 e
checks continuam obrigatórios nas entregas, inclusive segredos e build.
MCP continua previsto no alinhamento geral das aulas: usar/auditar quando
ajudar a prática, com acesso mínimo; não bloqueia por si só as cinco entregas
listadas neste enunciado. Não declarar aula 10 integralmente demonstrada sem prova.

Adiar devolução, painel de Operações, histórico/relatórios, renovação, redesign
amplo, expansão de skills/MCPs e limpeza geral de documentação. Ver
[continuidade posterior](continuacao-posterior.md). Não adiar autorização,
isolamento e concorrência necessários às funcionalidades que serão entregues.

## Limites de autoridade e produção

O agente prepara e testa localmente; usuário executa toda escrita em banco e
Storage de produção. Não colocar chaves, tokens ou senha do professor em
arquivos versionados, comandos/logs ou evidências. Não usar sua conta nos testes.
Não editar ADRs pelo agente, alterar schema sem DDL aprovado nem executar Git
sem autorização específica. Este plano não cria tag, branch, commit ou deploy.

## Execução PRA-01 — 06/11/2026

Limite, natureza do prazo e situação TI-0010 respondidos pela usuária e
registrados no PRD e spec MVP. Calendário e PRAT-C06/C07 seguem pendentes;
PRAT-C04/C05 continuam sob as proibições vigentes de segredo/autocorreção.
Registro central: [decisões e pendências](../produto/decisoes-pratica.md).
[ENTREGA.md](../../ENTREGA.md) iniciado como rascunho, sem inventar resultados.
PRA-01 está parcialmente concluída: as tarefas independentes de verificação
podem ser planejadas, mas não liberar código de prazos/imagens antes das
respectivas decisões e specs. Nenhuma migration ou regra de servidor alterada.

## Execução PRA-02 — 06/11/2026

Contrato, gatilho e configuração nativa preparados. Prova controlada com duas
rodadas independentes: R1 detectou o erro sem editar; principal restaurou;
R2 aprovou somente a fixture. Evidências: [resultado](../verificacao/prova-verificador/resultado.md).
PRA-02 permanece parcial: isolamento técnico e carregamento nativo não
comprovados. Os dois commits locais foram criados após autorização posterior;
não houve push. Não declarar as specs de produto ou segurança de produção aprovadas.

## Continuidade autorizada — pendências diferidas

Em 06/11 a usuária pediu registrar as pendências e continuar as etapas.
PRA-02 fica aberta para correção posterior: comprovar bloqueio técnico de
escrita/acesso a produção e descoberta nativa do TOML. Os dois commits foram
criados em rodada posterior após autorização específica; a evidência atual está
em docs/verificacao/prova-verificador/resultado.md. Não tratar o adiamento de
PV-05 como aceite.

PRA-03 iniciada: skill imagens-equipamentos e referência de manifesto criadas.
Procedimento documental apenas; scripts, fotos e validação executável pendentes
por PRAT-C06/C07. Sem dependência instalada, aquisição ou upload nesta etapa.

## Respostas sobre imagens — 06/11/2026

Sharp autorizado para preparação local; crédito Pexels pode ser mantido.
Usuária propôs Pixabay diante de dificuldade na aquisição. Diagnóstico do erro
e confirmação de alteração do contrato da atividade pendentes; não substituir
Pexels nem declarar fotos obtidas sem evidência. Registro central atualizado.

Ferramenta local instalada: sharp 0.35.5 (desenvolvimento), teste de saída
800 x 600 em memória aprovado; 50 testes e lint aprovados. Sem fotos adquiridas.
Bloqueio confirmado: criação da chave Pexels. Alertas npm registrados para triagem.

## Fatia local PRA-03 — processamento

[Spec técnica](../specs/preparacao-local-imagens.md) e
[tarefas](../tasks/preparacao-local-imagens.md): utilitário local preparado,
com teste sintético passando. Comandos na referência da skill. Não faz rede,
consulta credenciais, altera banco ou publica. Aquisição real e aprovação
independente continuam pendentes; não declarar PRA-03 concluída.

## Revisão local de imagens e decisões de carga — 06/11/2026

IMG-R1 encontrou lacuna de cobertura em IMG-01 (PNG/recorte/hash independente),
sem defeito funcional reproduzido. Principal acrescentou teste com faixas de cor
para distinguir recorte de esticamento; dois testes locais passaram. IMG-R2 aprovou a fatia local, com 50 testes gerais
e lint aprovados. Evidências em docs/verificacao/imagens-local/r2.md.
Usuária confirmou organização única e carga que reaproveita iguais e interrompe
para reportar divergências, sem sobrescrever equipamentos/conta ou apagar empréstimos.

## PRA-04 — proposta de dados iniciais

[Spec](../specs/dados-iniciais.md), [plano](dados-iniciais.md) e
[tarefas](../tasks/dados-iniciais.md) preparados; lote conferido com o ZIP,
com situação TI-0010 corrigida conforme decisão da usuária.
DAT-00 documental concluída; DAT-01 depende de decisões e aceite do contrato.
Sem DDL, migration, implementação, carga ou CA aprovado nesta etapa.

## DAT-02 — proposta de schema preparada

[DDL/impacto/migração](dados-iniciais-ddl.md) apresenta coluna image JSONB opcional,
contrato e alternativa tipada, comparação da carga e proposta de bucket/chave.
Aguardar aprovação explícita antes de gerar migration ou alterar schema.

## DAT-03 — execução autorizada

Usuária aprovou DDL e contrato; nova migration 20261106112134_equipment_image
gerada pelo Prisma e aplicada somente local. Atualização com linha preexistente
e reconstrução limpa passaram; teste Postgres de constraint/RLS passou.
[Evidências e limites](../validacao-dat03-imagem.md). Checks gerais aprovados: 50 testes, lint e build.

## DAT-05A — comparação antes da carga

Pré-validação pura implementada em src/server/initial-data/preflight.ts:
lote exato, metadados de imagem, comparação e relatório de divergências.
Sem leitura/escrita de banco ou uso da conta do professor. Não confundir com
carga completa: DAT-05B ainda exige Prisma/transação, arquivos, conta e concorrência.
[Evidências e limites](../validacao-dat05a-preflight.md).

## DAT-05B — persistência local interna

Adaptador Prisma de equipamentos implementado com conferência por tenant,
transação e trava conservadora para a carga. Integração Postgres local comprovou
repetição/concorrência sem duplicatas e bloqueio por divergência. Sem CLI/rota;
ainda depende da conferência real de conta/fotos, não de flags do usuário.
[Evidências](../validacao-dat05b-carga-local.md). DAT-05 segue parcialmente aberta.

## DAT-06A — identidade e vínculo locais

Módulo interno consulta Auth local e cria/reaproveita vínculo COLABORADOR;
confirmação pendente, identidade divergente, papel divergente ou empréstimos
bloqueiam sem alteração. Testes sintéticos reais Auth/Postgres passaram, com
limpeza dos próprios fixtures. Sem CLI ou alteração da conta do professor.
[Evidências e limites](../validacao-dat06a-conta-local.md). Fluxo completo pendente.

## DAT-05C — orquestração local

Fluxo interno único valida arquivos/revisão e conta/lote antes de escrever;
organização, vínculo e itens persistem na mesma transação. Integração real local
3/3 passou com imagens/contas sintéticas. Sem CLI, upload ou dados do professor.
[Evidências](../validacao-dat05c-fluxo-local.md). Próxima validação: falha no meio
dos inserts e revisão independente parcial; aquisição/Storage reais continuam pendentes.

## DAT-07A — falha no meio da gravação

Proxy TCP de teste interrompeu conexão após oito INSERTs confirmados no Postgres
local; rollback de organização/vínculo/itens comprovado e conta Auth preservada.
Sem mudanças de schema/produto. [Evidências](../validacao-dat07a-rollback.md).
Revisão independente DADOS-R1 em curso, sem antecipar aprovação da spec completa.

DADOS-R1 concluída: [resultado](../verificacao/dados-iniciais/r1.md) NÃO PRONTA.
Preparar checagem Storage e roteiro humano; fotos e acesso real dependem de
evidência própria, sem aprovar por fixtures. Não liberar tag/entrega completa.

## DAT-08A — preparo da verificação pública

Utilitário GET sem credencial e roteiro humano parcial preparados. Teste de
servidor HTTP local aprovado; 59 testes e lint passaram. Nenhum objeto remoto
consultado ou publicado. [Evidências](../validacao-dat08a-storage.md).
Fotos reais, carga operacional de produção e comprovação humana continuam abertas.

## PRA-06 — calendário decidido

Regra aprovada: segunda a sexta, feriados nacionais brasileiros excluídos,
sem contar dia da solicitação; vence às 23h59 do 14º dia útil em America/Sao_Paulo.
Próxima tarefa: spec/plano/tasks de solicitação e fonte oficial dos feriados,
com testes de fim de semana, feriado, virada de mês/ano e conversão de fuso.
Sem implementação do prazo nesta atualização documental.

## PRA-06 — especificação de empréstimos preparada

[Spec](../specs/solicitar-emprestimo.md), [plano](solicitar-emprestimo.md) e
[tarefas](../tasks/solicitar-emprestimo.md) propostos com EMP-01 a EMP-10.
Auditados conflitos: trigger ainda limita 3/reserva, policy atual permite ler
empréstimos de colegas; contexto tenant/protegido ainda não implementado.
Fonte MGI 2026 documentada; exemplo de prazo conferido. Aprovações de cobertura
e precisão solicitadas. Nenhum código, migration ou CA alterado nesta tarefa.

Atualização de decisão: calendário deve cobrir 2026 a 2030 antes da liberação;
vencimento 23:59:59 de São Paulo. Cobertura só de 2026 e 23:59:00 não aprovados.
Próxima tarefa EMP-T02 prepara fonte/regras/datas/cálculo e testes, sem migration.

## Revisão transversal obrigatória — pedido da usuária

Regra permanente: [registro de decisões](../rules/decisions.md). Toda tarefa
atualiza registro central/fonte competente/ENTREGA.md antes de fechar.

Adicionar as verificações abaixo à ordem das etapas existentes, sem substituir
os checks funcionais ou marcar requisitos pendentes como cumpridos:

- ENU-T01: revisar o trecho do ZIP/aula aplicável antes da implementação da tarefa;
  comparar instrução do anexo com PRD/ADR/regras e registrar conflitos.
- ENU-T02: manter [matriz de pegadinhas](../checklist-enunciado.md) e evidências
  a cada decisão, mudança de fonte/escopo e rodada do verificador.
- ENU-T03: em PRA-09, reler integralmente o enunciado e conferir as cinco entregas,
  formatos, restrições, conta professor, fotos, produção, rodadas e commits.
- ENU-T04: antes de PRA-10, conferir a versão exata que será entregue: links,
  arquivo ENTREGA.md, evidências e tag. Não criar tag com pendência ocultada.

Estado: regra/matriz inicial criadas; ENU-T03/04 ainda não executadas. Revisão
final registra fonte/trecho, responsável/data e prova por item; sem pesos de nota
inventados e sem confundir uma proposta do grupo com exceção autorizada pelo professor.

## EMP-T02 — cálculo isolado

DEC-19 confirmou apenas nacionais fixos, sem Sexta-feira da Paixão.
Cálculo implementado em src/server/loans/calendar.ts e testado nos cinco anos,
fuso, virada de mês/ano, bissexto e fronteira de atraso. 70 testes e lint passaram;
build aprovado. [Evidências](../validacao-emp-t02-calendario.md).
EMP-T03 iniciada: sessão autenticada parcial; vínculo/negações ainda pendentes.
Propostas de legado/reenvio e DDL/trigger/policy continuam exigindo revisão própria.

## EMP-T03 — sessão autenticada parcial (registro de 06/11)

`protectedProcedure` consulta `supabase.auth.getUser()`, disponibiliza somente
o usuário retornado pelo provedor e falha fechada em ausência de sessão/falha
de serviço. Cinco testes unitários, lint e suíte/build são registrados em
[validacao-emp-t03-auth.md](../validacao-emp-t03-auth.md). Ainda não há
`tenantProcedure` nem prova de membership. O Prisma atual aceita somente banco
local; Supabase como caminho de dados contrariaria o ADR-001. DEC-21 registra a
pausa operacional. Próximo passo: definir/verificar acesso Prisma de runtime e
testar vínculo com Postgres local sem consultar dados reais.

## PRA-02 a PRA-05 — estado da execução de 06/11/2026

- **PRA-02 parcial:** commits locais `12aa161` (falha intencional na fixture) e
  `d8bdcbb` (restauração); R1 reprovou e R2 aprovou a fixture. Ambos marcaram
  isolamento técnico como não comprovado. Descoberta nativa da TOML também não
  foi comprovada. PV-05 permanece aberto; não houve push.
- **PRA-03 parcial:** preparação local aprovada nos checks; novas chaves Pexels
  estão oficialmente pausadas. Sem fotos reais, revisão visual ou upload.
  Pixabay não foi autorizado como fonte alternativa.
- **PRA-04 parcial:** decisões e DDL local de imagem registrados; DADOS-R1
  retornou NÃO PRONTA. Spec segue aberta, sem aceite completo DADOS-01 a 06.
- **PRA-05 parcial:** integrações locais sintéticas passaram (imagens 1/1;
  carga inicial 3/3). Sem fotos, conta do professor, Storage ou carga de produção.
- **Checks gerais desta rodada:** suíte 75/75, lint e build passaram. Evidências
  completas: [relatório PRA-02 a PRA-05](../validacao-pra02-pra05.md).

Próxima retomada: resolver PV-05 e comprovar carregamento nativo do verificador;
obter uma fonte de imagens autorizada e fotos reais; completar os critérios
DADOS-01 a 08 com evidência permitida; então solicitar nova revisão independente.
Nenhum critério pendente deve ser marcado como concluído apenas pelos checks locais.

## Execução EMP-T03 e auditoria do enunciado — 07/11/2026

`tenantProcedure` foi acrescentado com lookup Prisma do usuário verificado no
tenant `empresti`. Oito testes unitários e 1 integração em Postgres local com
usuários sintéticos passaram; `npm test` (78/78), `test:health-local` (5/5), lint
e build passaram. Sem RLS, endpoint de produto ou caminho de runtime; EMP-T03
segue parcial. Ver [evidências](../validacao-emp-t03-auth.md).

O ZIP foi lido integralmente (seções 00–07). Checklist atualizado: prova PRA-02
tem commits locais; MCP não é uma sexta entrega; PR #1 está merged, mas o Preview
Vercel falhou e seus detalhes não puderam ser lidos. A auditoria confirma que
fotos/Storage/conta do professor e os fluxos EMP em produção seguem pendentes.
Pexels confirmou em 07/11 que novas chaves continuam pausadas; Pixabay não foi
aprovado. Não houve acesso a Vercel/Supabase remoto nem Git neste trabalho.
