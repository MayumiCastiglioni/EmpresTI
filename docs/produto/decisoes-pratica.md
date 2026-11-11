# Decisões e pendências da prática

## DEC-35 — aprovação visual integral das fotos — 11/11/2026

Origem/responsável: usuária, instrução explícita "declare todas as fotos como
aprovadas". Alternativas: manter quatro aceites visuais pendentes ou aprovar o
lote integral atual. Escolha: aprovar visualmente as 12 fotos de TI-0001 a
TI-0012 em `.cache/imagens/manifesto-candidatos.json`. Motivo: não informado.
Estado: aceite humano registrado por foto; substitui a pendência de aceite
visual da DEC-34. Aprovações anteriores e ressalvas técnicas foram preservadas
no manifesto. O manifesto Pixabay é um snapshot histórico parcial; o lote
integral atual está no manifesto de imagens, com fontes mistas.
Não equivale a autorização do professor para novas fontes, validação técnica,
conformidade integral com o enunciado, upload ou aceite DADOS-04. As ressalvas
de adequação dos itens e compatibilidade dos validadores continuam explícitas.
Sem alterações de runtime, Git ou escrita remota; não commitado.

## DEC-ENVIO-IMEDIATO — 11/11/2026

Origem/responsável: usuária pediu fechamento para envio em menos de um minuto e
informou manifesto concluído na conversa de fotos. Alternativas: aguardar todos
os gates ou preparar envio imediato com limitações explícitas. A solicitação é
preparar envio imediato; motivo informado: precisa enviar o projeto agora.
Estado: documentação de envio atualizada, sem aceite integral nem dispensa de
validação. O manifesto de candidatos local ainda informa oito aprovações;
artefato final não identificado nesta sessão. Não substituir evidência ausente
por aprovação presumida. Testes padrão 85/85, componente 7/7, lint e TypeScript
passaram; builds/integrações/produção mantêm os bloqueios documentados.
Não houve operação Git, escrita remota ou tag; registro não commitado.

## DEC-FECH-234 — escopo de fechamento — 11/11/2026

Origem/responsável: solicitação explícita da usuária para executar partes 2, 3
e 4; parte 1 fica em outra conversa. Alternativas: fechar só os critérios locais
ou avançar também na validação real/publicação. Escolha: trabalhar nas três
partes solicitadas, mantendo os gates e evidências do plano existente. Motivo
informado: parte das fotos já está sendo feita por outra conversa.
Estado: autorização de tarefa recebida, execução parcial, não aceite final.
O agente ampliou testes e corrigiu atualização das consultas após conflito
conforme DEC-24 (implementação, sem nova regra de negócio). Conexão de testes
locais foi bloqueada com EACCES; dados reais e produção não foram alterados.
Decisão operacional do agente: não contornar guardas locais nem antecipar
publicação/tag com revisões NÃO PRONTA. Evidências e pré-requisitos em
[fechamento 2–4](../verificacao/fechamento-2-4.md),
[EMP-R2](../verificacao/emprestimos-r2.md) e
[DADOS-R3](../verificacao/dados-iniciais/r3.md). Não commitado; nenhum Git executado.

Data: 06/11/2026. Registro da PRA-01 do
[plano prioritário](../plans/pratica-sdd-subagentes.md).
Fonte de negócio: [PRD](../PRD.md). Este registro não é ADR nem aceite de código.
Responsável pelas escolhas de produto: usuária, nesta conversa;
escolhas operacionais do agente são identificadas separadamente.

## Respostas recebidas

| ID | Alternativas apresentadas | Escolha e motivo informado | Onde refletida |
|---|---|---|---|
| PRAT-C01 | Manter 3 do PRD ou adotar 5 do briefing | Adotar 5, conforme briefing | PRD, AGENTS e spec MVP |
| PRAT-C02 | 14 dias corridos ou úteis | 14 dias úteis; calendário 2026–2030, regra e precisão definidos nas atualizações abaixo | PRD, AGENTS e specs; cálculo isolado implementado, integração com solicitação pendente |
| PRAT-C03 | TI-0010 em manutenção pela lista ou disponível pelo briefing | Disponível, conforme briefing; 2 em manutenção e 10 disponíveis | PRD, spec MVP e plano da prática |

Solicitação imediata já estava decidida em 05/11. Não há etapa de aprovação
de Operações nesta fatia. Devolução e tela de Operações ficam fora da prática,
sem apagar seu escopo futuro no PRD.

## Tratamentos vigentes e propostas — não confundir com novas aprovações

- PRAT-C04: regras de segredos continuam proibindo senha em código/Git.
  Proposta a detalhar na spec de dados: entrada privada na execução humana,
  sem senha literal, log ou reprodução deste valor no ENTREGA.md.
- PRAT-C05: verificador continua impedido de corrigir testes. R1 detectou o erro e não o corrigiu; R2 aprovou a fixture restaurada. R4 comprovou descoberta nativa e isolamento MXC read-only para a fixture (1/1); evidência: `docs/verificacao/prova-verificador/resultado.md`. A prova versionada em commits locais `12aa161` e `d8bdcbb` continua sem push. DEC-28 registra a configuração operacional e seus limites.
- PRAT-C06: em 11/11, a usuária confirmou autorização formal do professor para
  usar Pixabay nas 12 fotos. Manter crédito do autor e link Pixabay para
  rastreabilidade; fotos, manifesto e implementação da fonte seguem pendentes.
- PRAT-C07: sharp autorizado pela usuária em 06/11 para processamento local;
  registrar instalação e validação abaixo. ADR será atualizado pelo time.

## Lacunas que ainda bloqueiam contratos afetados

- Calendário de dias úteis, feriados aplicáveis, inclusão do dia da solicitação,
  horário e fuso. Não assumir que útil significa somente segunda a sexta.
- Identidade concreta da organização/tenant e vínculo de colaboradores/professor;
  organização única já confirmada.
- Conta existente, confirmação de e-mail e provisionamento idempotente, sem
  usar a conta do professor para testes nem apagar seus dados para obter zero.
- Escopo da unicidade de patrimônio e destino/visibilidade dos metadados de foto.
- Campos a comparar na carga; política confirmada: preservar e reportar divergências.

## Divergências existentes a corrigir nas tarefas de implementação

Migration de regras ainda contém limite de 3 e reserva antes da retirada.
ADR-002/layout e documentos históricos ainda podem mencionar três itens ou
prazo antigo. São evidências de trabalho pendente, não motivo para mudar
migrations aplicadas nem editar ADR pelo agente. Conferir usos ao implementar.

As duas specs da prática ainda serão criadas e receberão essas decisões antes
da aprovação. O [MVP](../specs/mvp.md) foi atualizado sem marcar CA atendido.

## Atualização recebida — imagens e ferramenta

Em 06/11, usuária autorizou explicitamente adicionar sharp para processamento
local de fotos. PRAT-C07 resolvido quanto à autorização; atualização do ADR
fica com o time, sem edição pelo agente.
Usuária informou dificuldade de obter imagens Pexels e proposta de usar Pixabay;
aceitou manter crédito caso necessário. Não foi apresentado erro técnico,
resposta de API ou confirmação do professor alterando o contrato Pexels.
A alternativa Pixabay ficou pendente até a confirmação formal do professor em
11/11. A decisão atual consta em DEC-30; o crédito de autor/fonte será preservado.

Fontes consultadas em 06/11:
- https://www.pexels.com/api/documentation/ — diretrizes pedem link para Pexels.
- https://pixabay.com/api/docs/ — solicita identificar a origem em resultados
  de busca e proíbe hotlink permanente; trocar API não resolve acesso por si só.
- https://pixabay.com/service/license-summary/ — licença geral dispensa atribuição,
  mas isso não altera o contrato da atividade ou as diretrizes específicas da API.

Próximo diagnóstico: obter mensagem/código de erro ou etapa em que a aquisição
Pexels falha, sem expor chave. Nenhuma falha autenticada foi reproduzida pelo agente.

Usuária esclareceu: bloqueio na criação da chave Pexels; não conseguem gerá-la.
Não é erro de busca/download reproduzido. A aquisição Pexels fica pendente; a
alternativa Pixabay foi aprovada depois por DEC-30. Não contornar autenticação
nem usar chave alheia.

Atualização factual em 11/11/2026: o Help Center oficial da Pexels foi conferido
novamente e continua informando que a emissão de novas chaves está pausada. A
checagem do workspace não encontrou fotos reais nem manifesto do lote. [Fonte
oficial](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key).

Sharp 0.35.5 registrado em devDependencies e package-lock.json. Instalação
concluída (saída 0); teste em memória decodificou saída PNG com 800 x 600.
Isso não valida fotos, revisão visual ou aquisição. npm informou 15 alertas
no conjunto de dependências (9 moderados, 5 altos, 1 crítico), sem atribuição
de causa ao sharp; triagem pendente, sem executar correção automática.

## Decisões para carga inicial — 06/11/2026

Usuária confirmou uma única organização nesta versão. Isso não autoriza remover
tenant_id nem a proteção por tenant da arquitetura existente.
Na reexecução, reaproveitar dados iguais; dados diferentes de equipamento ou
conta do professor interrompem a carga e geram relatório de divergência,
sem sobrescrever dados ou apagar empréstimos. Falta definir identidade concreta
da organização e campos/etapas de comparação na spec; nenhuma carga executada.

## Identificação e acesso confirmados — 06/11/2026

Usuária aprovou organização EmpresTI, slug empresti. Professor terá papel
COLABORADOR e vínculo com essa organização. Reaproveitar conta compatível
sem trocar senha; parar se houver divergências ou empréstimos preexistentes.
Confirmação do e-mail pelo fluxo normal, sem confirmação automática.
Registrado na spec de dados; não implica carga executada nem autorização de DDL.

## Aprovação de modelo e contrato — 06/11/2026

Usuária respondeu "Pode fazer" à proposta docs/plans/dados-iniciais-ddl.md:
image JSONB opcional com constraint de objeto, impacto aditivo e migration local;
contrato de imagem, comparação e etapas operacionais aprovados como descritos.
Não autoriza escrita em produção, aquisição de outra fonte ou remoção de dados.

## Calendário confirmado — 06/11/2026

Usuária escolheu segunda a sexta, excluindo feriados nacionais do Brasil.
Aprovou excluir o dia da solicitação e vencer às 23h59 do 14º dia útil no
horário de São Paulo (America/Sao_Paulo). PRAT-C02 resolvido quanto à regra.
PRD/AGENTS/spec MVP atualizados; servidor/migration ainda não implementam isso.
Registros anteriores de calendário pendente são históricos e substituídos aqui.
Documentar fonte dos feriados/anos na futura spec, sem inventar exceções locais.

## Cobertura e precisão — 06/11/2026

Usuária rejeitou liberar calendário somente com 2026: exige outros anos antes
da liberação. Intervalo ainda precisa ser delimitado. Escolheu fim do minuto,
23:59:59 em America/Sao_Paulo; atraso somente quando agora for maior que dueAt.
PRD/AGENTS/specs atualizados; proposta anterior de 23:59:00 substituída.
Sem código ou critério aprovado por esse registro.

Resposta seguinte: cobertura de 2026 a 2030 inclusive, confirmada pela usuária.
Intervalo não está mais pendente; resta conferir fonte/regras/datas e implementar.

## Índice atual para relatório de entrega

Este índice consolida escolhas registradas acima, sem apagar o histórico.
Origem: respostas da usuária nesta conversa, exceto item operacional identificado.
Motivos que não foram informados não devem ser inventados na entrega.

| ID | Data | Decisão atual | Estado e referência |
|---|---|---|---|
| DEC-01 | 05/11/2026 | Solicitação inicia empréstimo, sem espera/aprovação | PRD/spec solicitação; código pendente |
| DEC-02 | 06/11/2026 | Limite cinco, conforme briefing | PRAT-C01; trigger antigo ainda precisa correção |
| DEC-03 | 06/11/2026 | 14 dias úteis; seg–sex, menos feriados nacionais, sem dia inicial | PRAT-C02/PRD; cálculo isolado feito, integração pendente |
| DEC-04 | 06/11/2026 | Vence 23:59:59 America/Sao_Paulo; atraso depois | Spec/calendário; cálculo isolado testado, consumo pendente |
| DEC-05 | 06/11/2026 | Cobertura 2026–2030 antes da liberação | Substitui proposta só 2026; cálculo isolado cobre o período |
| DEC-06 | 06/11/2026 | TI-0010 disponível; só TI-0004/0007 manutenção | PRAT-C03; lote conferido, carga real pendente |
| DEC-07 | 06/11/2026 | Uma organização, EmpresTI / empresti | PRD/spec dados; tenant permanece |
| DEC-08 | 06/11/2026 | Professor COLABORADOR; reutilizar conta compatível sem mudar senha | Spec dados; teste sintético, acesso real pendente |
| DEC-09 | 06/11/2026 | Confirmação normal de e-mail, sem confirmação automática | Spec dados; implementação local respeita |
| DEC-10 | 06/11/2026 | Reaproveitar iguais, parar/reportar divergências; não apagar empréstimos | Spec dados; teste local, produção pendente |
| DEC-11 | 06/11/2026 | sharp autorizado para processamento local | PRAT-C07; instalado/testado, ADR a cargo do time |
| DEC-12 | 06/11/2026 | Manter crédito do autor e origem quando necessário | Atualizado para Pixabay em DEC-30; tela ainda precisa refletir o provedor |
| DEC-13 | 06/11/2026 | image JSONB opcional com check de objeto | DDL aprovado e migration local aplicada |
| DEC-14 | 06/11/2026 | tenant+patrimônio; comparar nome/categoria/situação/metadados | Contrato DDL aprovado; testes locais |
| DEC-15 | 06/11/2026 | equipment-images e chave empresti/patrimonio/sha256.png | Contrato aprovado; upload real humano pendente |
| DEC-16 | 06/11/2026 | Etapas Auth/Storage retomáveis, sem compensação destrutiva automática | Contrato aprovado; Storage real não executado |
| DEC-17 | 06/11/2026 | Anotar pendências do verificador e continuar trabalho independente | Retomada técnica fechada só para fixture em DEC-28; specs de produto permanecem pendentes |
| DEC-18 | 06/11/2026 | Registrar decisões e revisar pegadinhas como regra | Pedido explícito; AGENTS/rules/checklist atualizados |
| DEC-19 | 06/11/2026 | Usar somente os nove feriados nacionais fixos | Decisão aprovada; cálculo isolado implementado, integração pendente |
| DEC-20 | 06/11/2026 | Cálculo puro determinístico, sem consulta externa por solicitação | Decisão operacional do agente; calendário isolado testado |
| DEC-21 | 06/11/2026 | Validar sessão/membership local sem conexão remota | Decisão operacional do agente; RLS/runtime seguem pendentes |
| DEC-22 | 08/11/2026 | Pipeline a cada 15 minutos; pular aprovações humanas | Prompt documentado; automação depois desativada a pedido da usuária |
| DEC-23 | 08/11/2026 | Preservar/contar registros legados; novos empréstimos iniciam RETIRADO | Documentada; implementação pendente |
| DEC-24 | 08/11/2026 | Recusar reenvio para equipamento já emprestado | Documentada; implementação pendente |
| DEC-26 | 10/11/2026 | Remover policy UPDATE de empréstimos para OPERACOES/ADMIN nesta fatia | Policy removida no banco local pela migration DEC-27 |
| DEC-27 | 10/11/2026 | Aprovar o DDL EMP-T04 após teste isolado e aplicá-lo localmente | Migration aplicada; suíte, lint e build passaram; fluxo completo pendente |
| DEC-28 | 10/11/2026 | Registrar agente verificador nativo e executá-lo sob MXC read-only | R4 passou 1/1 somente na fixture; sem prova de produção |
| DEC-29 | 11/11/2026 | Compilar a partir do OneDrive em cópia temporária externa, mantendo Next padrão | `npm run build:isolated` passou; `npm run build` segue para CI/Vercel |
| DEC-30 | 11/11/2026 | Usar API Pixabay nas 12 fotos, com autorização formal do professor informada pela usuária | Fonte aprovada; chave local configurada; oito fotos aprovadas em DEC-31/32, quatro sem candidato adequado |
| DEC-31 | 11/11/2026 | Aprovar visualmente as seis fotos candidatas apresentadas | TI-0003/0004/0005/0008/0009/0010 aprovadas; DEC-32 aprovou mais duas |
| DEC-32 | 11/11/2026 | Aprovar visualmente as fotos de TI-0001/0002 | Oito aprovadas no total; TI-0006/0007/0011/0012 ainda sem candidato adequado |
| DEC-33 | 11/11/2026 | Manter somente Pixabay na busca das quatro fotos restantes | Confirmado pela usuária; quatro itens ainda pendentes após nova rodada de busca |
| DEC-34 | 11/11/2026 | Buscar as quatro fotos restantes em fontes externas e registrar a limitação da busca Pixabay | Substitui DEC-33; manifesto de 12 candidatos preenchido, quatro sem aceite visual |

DEC-30 resolve a escolha da fonte: Pixabay foi autorizado formalmente pelo
professor, segundo confirmação da usuária em 11/11. A proposta não está mais
pendente; chave local, implementação, fotos reais, manifesto, revisão visual e
Storage continuam pendentes. O plano técnico está em
[adaptacao-pixabay.md](../plans/adaptacao-pixabay.md) e aguarda aprovação antes
de código, conforme as restrições do projeto.
Tratamentos vigentes de senha e autocorreção seguem regras existentes; não
apresentar como nova autorização de exceção. Registro de ADR só pelo time.

Escolha operacional do agente (06/11/2026): trava conservadora de tabelas para
carga local pontual, descrita em validacao-dat05b-carga-local.md. Não é decisão
de produto da usuária nem estratégia aprovada para o fluxo de empréstimos.

DEC-18 — motivo informado pela usuária: reportar decisões ao entregar e evitar
perda de nota por pegadinhas. Fonte: pedido explícito desta conversa. Implementada
como documentação; não equivale a auditoria final do enunciado ou garantia de nota.

## DEC-19 — feriados fixos somente — 06/11/2026

Origem/responsável: resposta explícita da usuária nesta conversa.
Alternativas: manter Sexta-feira da Paixão do calendário MGI como data móvel ou
usar apenas os nacionais fixos. Escolha: apenas feriados nacionais fixos.
Sexta-feira da Paixão, Carnaval e Corpus Christi não descontam dias úteis se
caírem de segunda a sexta. Motivo: não informado. Substitui proposta de usar
integralmente as entradas nacionais do MGI. Fontes competentes atualizadas;
cálculo isolado implementado e validado, sem integração/banco/CA completo aprovado.

## DEC-20 — escolha operacional do cálculo — 06/11/2026

Responsável: agente, dentro da implementação autorizada de EMP-T02.
Separar calendário imutável versionado e cálculo puro com instante/calendário
injetados; usar Intl com America/Sao_Paulo explícito, sem biblioteca ou API nova.
Alternativa descartada: inferir fuso da máquina ou consultar serviço por pedido.
Motivo técnico: resultado determinístico testável, sem alterar stack aprovada.
Não é nova regra de produto nem decisão arquitetural atribuída à usuária.
DEC-19 fixa o conteúdo da política; fontes das datas na documentação do calendário.
Implementado como módulo isolado; integração em empréstimos ainda pendente.

## DEC-21 — limite atual para validação de tenant — 06/11/2026

Responsável: agente, decisão operacional de escopo para EMP-T03. Alternativas
consideradas: consultar membership pelo Supabase (conflita com o ADR, que escolhe
Prisma para acesso a dados); usar Prisma remoto (o conector atual rejeita URLs
não locais e a permissão da conexão de runtime não foi verificada); ou concluir
somente a validação de sessão até definir o caminho Prisma. Escolha: implementar
e testar a sessão autenticada e deixar tenantProcedure pendente, sem consulta
remota. Motivo: preservar o ADR e a barreira de acesso local existente. Não é
decisão de produto nem autorização para conexão/ação de produção. Retomar após
definir e validar o acesso Prisma de runtime e a prova local de membership.

### Atualização EMP-T03 — 07/11/2026

O agente implementou `tenantProcedure` consultando o vínculo `empresti` por
Prisma; 8 testes unitários e 1 integração com Postgres local e fixture sintética
passaram. A mudança não altera DEC-21: RLS e runtime seguem sem prova; o helper
ainda recusa destinos remotos e nenhum serviço remoto foi consultado.

## DEC-22 — pipeline local recorrente — 08/11/2026

Origem/responsável: pedido explícito da usuária nesta conversa. Alternativas:
continuar manualmente ou agendar ciclos recorrentes. Escolha: executar a pipeline
local do projeto a cada 15 minutos, trabalhando no máximo uma tarefa aprovada e
independente por ciclo. Etapas que dependam de aprovação ou validação humana são
ignoradas e registradas para discussão; os ciclos devem reportar mesmo quando
nada mudar, sem repetir checks nem editar arquivos só para gerar status.
Motivo informado: manter o trabalho autônomo em andamento e receber status
periódico. Implementação: `docs/prompt-pipeline-automatica.md` e automação local
Codex `EmpresTI — pipeline a cada 15 min` (ativada inicialmente). A usuária
posteriormente pediu a desativação; esse pedido substitui a recorrência ativa.
Sem checks de código nesta alteração documental/operacional. Limites: o escopo e bloqueios de
`AGENTS.md` continuam vigentes; não inclui Git, serviço remoto, produção,
publicação ou deploy.

## DEC-23 — registros legados — 08/11/2026

Origem/responsável: usuária, resposta explícita "aprovo 1 e 2" nesta conversa,
à tabela de propostas de legado e reenvio. Escolha: SOLICITADO e RETIRADO
existentes contam para o limite de cinco e bloqueiam novos pedidos quando
atrasados. Preservar dados sem conversão ou exclusão automática; novos pedidos
iniciam diretamente em RETIRADO. Alternativas: tratamento do legado ainda
estava em aberto; a proposta apresentada foi preservar e contar, sem converter.
Motivo informado: não informado. Estado: aprovada e refletida em PRD/spec/tasks;
implementação e testes do comportamento pendentes. Não aprova DDL/migration.
Substitui a pendência de legado registrada anteriormente, preservada como histórico.

## DEC-24 — reenvio de solicitação — 08/11/2026

Origem/responsável: mesma resposta explícita da usuária "aprovo 1 e 2".
Alternativas documentadas na spec: retornar estado atual ou recusar com conflito.
Escolha aprovada: se equipamento já tem empréstimo ativo, recusar com mensagem
de indisponibilidade e atualizar a consulta; nunca duplicar empréstimo nem
revelar dados de outra pessoa. Motivo informado: não informado. Estado: aprovada
na documentação; implementação e validação funcional pendentes. EMP-T01 fechada
somente quanto às decisões, sem aceite integral da spec nem autorização de DDL.
Substitui a pendência de reenvio anterior; histórico preservado.

## PROP-25 — leitura própria em RLS — 08/11/2026

Proposta do agente, não decisão aprovada da usuária. Origem: preparação de
EMP-T04 prevista no handoff e EMP-01/08. Alternativas: restringir a policy SELECT
existente aos próprios registros ou manter leitura ampla e confiar apenas no filtro
tRPC. Proposta: restringir também RLS, conforme defesa em profundidade da spec.
Motivo técnico: a policy atual permite leitura de colegas do mesmo tenant.
[DDL/impacto/plano](../plans/solicitar-emprestimo-policies.md). Restrição alcança
OPERACOES/ADMIN; matriz futura e runtime ainda requerem revisão. Nenhum SQL foi
executado ou aprovado como conjunto até 10/11. DEC-26 aprovou retirar a policy
UPDATE de OPERACOES/ADMIN nesta fatia; em seguida, o conjunto foi aprovado e
aplicado localmente por DEC-27. A spec e seus critérios de aceite continuam
pendentes de integração e validação end-to-end.

## DEC-26 — remover UPDATE de empréstimos para Operações/Admin nesta fatia — 10/11/2026

Origem/responsável: resposta explícita da usuária nesta conversa, confirmando
"remover nesta fatia" após a proposta de retirar a policy existente que permite
UPDATE a OPERACOES/ADMIN. Alternativas: manter a policy
`operations_manage_loans` ou removê-la nesta fatia e deixar esse acesso para
decisão futura. Escolha: removê-la em uma nova migration; o fluxo atual da
atividade não concede atualização de empréstimos a esses papéis. Motivo
informado: alinhar esta fatia ao escopo da atividade e deixar o acesso futuro
para decisão posterior. Estado: decisão de escopo aprovada; a policy histórica
foi removida no banco local pela migration
`20261110122729_loan_immediate_limit_five_policies`. A decisão de escopo não
aprovou sozinha as demais alterações: o conjunto SQL foi aprovado depois da
verificação isolada, conforme DEC-27. Aplicação apenas local; runtime RLS e
produção não foram validados.

## DEC-27 — aprovar e aplicar DDL local de empréstimos — 10/11/2026

Origem/responsável: resposta explícita da usuária nesta conversa, condicionando
o ok à confirmação de funcionamento. Alternativas: adiar a aplicação até
verificar o DDL ou aprovar o conjunto específico após teste. Escolha: aprovar o
SQL consolidado em `docs/plans/solicitar-emprestimo-policies.md`, atualizar o
default Prisma para `RETIRADO` e aplicar somente no Postgres local após a
verificação isolada. Motivo informado: a usuária pediu confirmação prévia de que
funcionava antes de autorizar. Estado: aprovado e aplicado localmente pela
migration `20261110122729_loan_immediate_limit_five_policies`; SQL testado em
Postgres descartável 17.11; `npm test` 78/78, lint e build passaram. O produto
end-to-end, runtime/RLS privilegiado e ambiente de produção não foram validados.
Evidências: `docs/validacao-emp-t04-loans.md`.

## DEC-28 — configuração local isolada do verificador — 10/11/2026

Origem/responsável: escolha operacional do agente para concluir PRA-02 dentro
do contrato aprovado; não é decisão de produto nem aprovação humana adicional.
Alternativas consideradas: manter apenas instruções textuais; ampliar permissões
do agente; ou registrar configuração e executar em sessão restrita. Escolha:
registrar o papel em `.codex/config.toml` apontando para
`.codex/agents/verificador-spec.toml`, ignorar a configuração pessoal na sessão
de prova e executar sob perfil MXC read-only, com rede, apps/plugins e MCPs
desativados, ambiente filtrado e negações efetivas de escrita, perfil, `.env*`
e TCP. Para contornar o diretório inicial do shell sem ampliar permissões, o
Node foi iniciado diretamente com o diretório de trabalho do repositório e
preservação de links.

Motivo técnico: a documentação oficial do Codex define que `config_file` é
resolvido relativamente ao arquivo que declara o agente e permite configuração
de projeto; perfis de permissão e MXC oferecem restrições efetivas de arquivo e
rede. Fontes: [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents),
[referência de configuração](https://learn.chatgpt.com/docs/config-file/config-reference),
[permissões](https://learn.chatgpt.com/docs/permissions) e
[Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox).
Estado: descoberta nativa confirmada na R4; teste permitido passou 1/1; provas
de escrita/acesso ao perfil/`.env*` retornaram EPERM e TCP retornou EACCES.
Arquivos de configuração e documentação estão apenas locais, ainda sem commit;
nenhum push, deploy, serviço remoto ou alteração da fixture ocorreu na R4.
Escopo: conclui PRA-02 somente para a fixture técnica; não aprova specs de
produto nem certifica isolamento/segurança de produção.

## DEC-29 — procedimento de build local fora do OneDrive — 11/11/2026

Origem/responsável: decisão operacional do agente ao executar o tópico 2 do
planejamento trazido pela usuária; não altera stack nem configuração de produção.
Alternativas: alterar a configuração global do OneDrive, manter `distDir: build`,
documentar apenas uma cópia manual ou automatizar a cópia temporária. Escolha:
manter `next.config.ts` no padrão `.next` e adicionar `npm run build:isolated`,
que compila uma cópia temporária fora do OneDrive. `npm run build` continua sendo
o caminho padrão da CI/Vercel.

Motivo técnico: o erro local ocorre ao limpar saída com atributos especiais na
pasta sincronizada; mudar `distDir` já divergiu da convenção esperada pela
Vercel. A cópia temporária evita a pasta afetada sem mover o projeto nem alterar
o deploy. Implementação em `scripts/build-isolated.mjs` e `package.json`.
Validação: `npm run build:isolated` passou em 11/11; Prisma Client, compilação
Next.js 16.4.6, TypeScript e sete rotas passaram. Foram instalados 614 pacotes
na cópia temporária, removida ao final. Nenhum `.env*` foi copiado; as variáveis
locais foram carregadas em memória. npm reportou avisos de scripts de três
pacotes pendentes de aprovação e avisos de obsolescência, sem falha de build.
Estado: procedimento operacional implementado e validado, arquivos locais sem
commit. Não modifica fontes, OneDrive, banco, CI ou Vercel.

## DEC-30 — fonte Pixabay aprovada para as fotos iniciais — 11/11/2026

Origem/responsável: resposta explícita da usuária informando que obteve
autorização formal do professor para usar Pixabay como alternativa para as
12 fotos. Alternativas: aguardar reabertura de chaves Pexels, usar Pixabay com
essa autorização, ou manter fotos reais pendentes. Escolha: usar a API Pixabay
para adquirir as 12 fotos reais do lote. Motivo registrado: a usuária já havia
informado que não consegue criar chave Pexels; o Help Center confirmou em 11/11
que a emissão de novas chaves segue pausada.

Crédito: manter nome do autor e link Pixabay para rastreabilidade e conforme a
preferência anterior da usuária de manter crédito quando necessário. A licença
Pixabay não exige atribuição, mas a API pede identificar a origem quando
resultados de busca forem exibidos; o catálogo do projeto exibirá foto do item,
não resultados de busca. Não declarar atribuição como obrigação legal.

Requisitos técnicos consultados na [API Pixabay](https://pixabay.com/api/docs/),
na [licença](https://pixabay.com/service/license-summary/) e nos
[termos](https://pixabay.com/service/terms/): chave obrigatória na consulta,
cache de respostas por 24 horas, sem downloads sistemáticos em massa e sem
hotlink permanente; baixar localmente e publicar no Storage do projeto. A chave
deve permanecer privada e nunca aparecer em logs, manifestos, URL registrada ou
cliente web. Estado: fonte aprovada; adaptador e validadores locais implementados
e testados em 11/11. Em atualização de 11/11, a chave foi configurada localmente
e oito candidatos PNG foram aprovados visualmente (DEC-31/32); quatro patrimônios ainda não têm foto
adequada. Não houve upload. Próxima etapa:
completar as fotos faltantes, revisar o manifesto e obter aprovação humana antes
do uso no catálogo. Nenhuma migration é necessária:
`image` já guarda provedor e metadados em JSONB. Evidências e pendências estão
no [plano técnico](../plans/adaptacao-pixabay.md).

## DEC-31 — aceite visual parcial das fotos — 11/11/2026

Origem e responsável: aprovação explícita da usuária nesta conversa, após
apresentação das seis prévias. Alternativas: aprovar ou rejeitar cada candidata;
a usuária respondeu “aprovado” para o conjunto. Motivo: não informado.
Aplicação: TI-0003, TI-0004, TI-0005, TI-0008, TI-0009 e TI-0010 estão
registradas como visualmente aprovadas no manifesto local de candidatos.
TI-0001, TI-0002, TI-0006, TI-0007, TI-0011 e TI-0012 ainda não têm foto
adequada. Não há manifesto completo, Storage validado nem aceite DADOS-04.
Estado Git: não commitado. Não houve escrita remota.

## DEC-32 — aceite visual de mais dois notebooks — 11/11/2026

Origem e responsável: aceite explícito da usuária nesta conversa após as
prévias de TI-0001 e TI-0002. Alternativas: aprovar ou rejeitar cada foto.
Escolha: aprovar as duas propostas Pixabay, IDs 593327 e 1478822. Motivo: não
informado. Os PNGs 800×600, créditos, IDs e hashes estão no manifesto parcial
local `.cache/pixabay/manifesto-candidatos.json`; os arquivos aprovados foram
guardados em `.cache/pixabay/review-ready/` sem sobrescrever os arquivos
anteriores. Estado: oito fotos visualmente aprovadas no total. TI-0006,
TI-0007, TI-0011 e TI-0012 seguem sem foto adequada; manifesto integral,
Storage e catálogo não validados. Não houve escrita remota nem operação Git.

## DEC-33 — manter Pixabay como única fonte nesta busca — 11/11/2026

Origem/responsável: resposta explícita da usuária nesta conversa à consulta
sobre as quatro fotos restantes. Alternativas apresentadas: fotos próprias,
outra fonte autorizada pelo professor ou continuar somente no Pixabay.
Escolha: continuar somente no Pixabay. Motivo: não informado.
Estado: consultas pontuais adicionais e inspeção visual não encontraram fotos
adequadas para TI-0006, TI-0007, TI-0011 e TI-0012. Os IDs rejeitados e motivos
constam no manifesto parcial local. A busca pode continuar, mas a aprovação da
fonte não comprova a existência de quatro fotos aptas nem libera o lote.

## DEC-34 — fontes externas para os quatro itens restantes — 11/11/2026

Origem/responsável: instrução explícita da usuária nesta conversa para buscar
fora do Pixabay, registrar a limitação da busca e preencher o manifesto;
substitui DEC-33. Alternativas: continuar buscando apenas no Pixabay, deixar os
quatro itens sem foto ou buscar em fontes externas. Escolha: fontes externas.
Motivo informado: concluir o manifesto rapidamente. As buscas documentadas no
Pixabay não encontraram candidatos compatíveis; isso não prova inexistência em
todo o acervo. A autorização do professor para fontes além do Pixabay não foi
informada. Estado: 12 candidatos e 12 hashes distintos no manifesto local
`.cache/imagens/manifesto-candidatos.json`; oito fotos têm aceite visual anterior
e quatro aguardam aceite. A câmera de TI-0012 não representa bem uma câmera
compacta e o monitor TI-0006 tem adesivo/etiquetas; substituir ou resolver essas
ressalvas antes de DADOS-04. Nenhum upload ou operação Git ocorreu.
