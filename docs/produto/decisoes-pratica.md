# Decisões e pendências da prática

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
- PRAT-C05: verificador continua impedido de corrigir testes. R1 detectou o erro e não o corrigiu; R2 aprovou a fixture restaurada.
  Prova versionada em commits locais `12aa161` e `d8bdcbb`; isolamento técnico e carregamento nativo permanecem pendentes em PRA-02.
- PRAT-C06: usuária aceitou manter crédito se necessário; preservar Fotos: Pexels
  com link para fotos dessa fonte. Alternativa Pixabay e aprovação da troca
  permanecem pendentes; não atribuir fotos Pixabay ao Pexels.
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
A alternativa Pixabay fica registrada para avaliação, sem substituição silenciosa
na entrega. O crédito exigido no uso da API Pexels será preservado.

Fontes consultadas em 06/11:
- https://www.pexels.com/api/documentation/ — diretrizes pedem link para Pexels.
- https://pixabay.com/api/docs/ — solicita identificar a origem em resultados
  de busca e proíbe hotlink permanente; trocar API não resolve acesso por si só.
- https://pixabay.com/service/license-summary/ — licença geral dispensa atribuição,
  mas isso não altera o contrato da atividade ou as diretrizes específicas da API.

Próximo diagnóstico: obter mensagem/código de erro ou etapa em que a aquisição
Pexels falha, sem expor chave. Nenhuma falha autenticada foi reproduzida pelo agente.

Usuária esclareceu: bloqueio na criação da chave Pexels; não conseguem gerá-la.
Não é erro de busca/download reproduzido. Aquisição autenticada fica pendente.
Ainda sem confirmação de autorização do professor para Pixabay ou disponibilidade
de chave desse serviço. Não tentar contornar autenticação ou usar chave alheia.

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
| DEC-12 | 06/11/2026 | Manter crédito quando necessário | PRAT-C06; Pexels com link, tela pendente |
| DEC-13 | 06/11/2026 | image JSONB opcional com check de objeto | DDL aprovado e migration local aplicada |
| DEC-14 | 06/11/2026 | tenant+patrimônio; comparar nome/categoria/situação/metadados | Contrato DDL aprovado; testes locais |
| DEC-15 | 06/11/2026 | equipment-images e chave empresti/patrimonio/sha256.png | Contrato aprovado; upload real humano pendente |
| DEC-16 | 06/11/2026 | Etapas Auth/Storage retomáveis, sem compensação destrutiva automática | Contrato aprovado; Storage real não executado |
| DEC-17 | 06/11/2026 | Anotar pendências do verificador e continuar trabalho independente | PRA-02 diferida, não aceita como concluída |
| DEC-18 | 06/11/2026 | Registrar decisões e revisar pegadinhas como regra | Pedido explícito; AGENTS/rules/checklist atualizados |
| DEC-19 | 06/11/2026 | Usar somente os nove feriados nacionais fixos | Decisão aprovada; cálculo isolado implementado, integração pendente |
| DEC-20 | 06/11/2026 | Cálculo puro determinístico, sem consulta externa por solicitação | Decisão operacional do agente; calendário isolado testado |
| DEC-21 | 06/11/2026 | Validar sessão/membership local sem conexão remota | Decisão operacional do agente; RLS/runtime seguem pendentes |
| DEC-22 | 08/11/2026 | Pipeline a cada 15 minutos; pular aprovações humanas | Prompt documentado; automação depois desativada a pedido da usuária |
| DEC-23 | 08/11/2026 | Preservar/contar registros legados; novos empréstimos iniciam RETIRADO | Documentada; implementação pendente |
| DEC-24 | 08/11/2026 | Recusar reenvio para equipamento já emprestado | Documentada; implementação pendente |
| DEC-26 | 10/11/2026 | Remover policy UPDATE de empréstimos para OPERACOES/ADMIN nesta fatia | Policy removida no banco local pela migration DEC-27 |
| DEC-27 | 10/11/2026 | Aprovar o DDL EMP-T04 após teste isolado e aplicá-lo localmente | Migration aplicada; suíte, lint e build passaram; fluxo completo pendente |

Proposta pendente: Pixabay diante de impossibilidade de gerar chave Pexels.
Não é decisão aprovada de troca da fonte exigida na atividade.
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
