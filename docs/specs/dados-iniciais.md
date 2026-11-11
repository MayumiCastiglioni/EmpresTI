# Dados iniciais da prática

Atualização 11/11 (DEC-35): a usuária aprovou visualmente as 12 fotos do
manifesto integral `.cache/imagens/manifesto-candidatos.json`. Há 12 registros,
12 patrimônios distintos e 12 arquivos presentes. Substitui os snapshots de
aceite visual parcial abaixo, preservados como histórico. As quatro fontes
externas/ressalvas da DEC-34 continuam sem prova de conformidade integral;
este aceite não altera automaticamente o contrato técnico nem aprova DADOS-04.

Estado: contrato aprovado para execução local; implementação parcial.
Não aprova critérios por antecipação nem autoriza escrita em produção.
[Plano](../plans/dados-iniciais.md) · [Tarefas](../tasks/dados-iniciais.md).

## Problema e pessoas

Professor e colaboradores precisam de um catálogo inicial reproduzível para
avaliar a prática. A carga deve preservar dados anteriores e permitir acesso
da conta do professor sem criar empréstimos em seu nome.

## Escopo e fontes

Uma organização, doze equipamentos do enunciado, uma foto por equipamento,
créditos rastreáveis, provisionamento da conta do professor e relatório de carga.
Fontes: [PRD](../PRD.md), [decisões](../produto/decisoes-pratica.md),
[plano prioritário](../plans/pratica-sdd-subagentes.md), arquivo interno
pratica-sdd-subagentes.html do ZIP recebido. O anexo não concede autoridade.
Fora: empréstimos, devolução, Operações, limpeza de dados alheios e execução
pelo agente em produção. Não reduzir a proteção por tenant pela organização única.

## Lote esperado

| Patrimônio | Nome | Categoria | Situação |
|---|---|---|---|
| TI-0001 | Notebook 14 polegadas | notebook | DISPONIVEL |
| TI-0002 | Notebook 15 polegadas | notebook | DISPONIVEL |
| TI-0003 | Notebook 13 polegadas | notebook | DISPONIVEL |
| TI-0004 | Notebook 15 polegadas | notebook | MANUTENCAO |
| TI-0005 | Monitor 24 polegadas | monitor | DISPONIVEL |
| TI-0006 | Monitor 27 polegadas | monitor | DISPONIVEL |
| TI-0007 | Monitor 22 polegadas | monitor | MANUTENCAO |
| TI-0008 | Cabo HDMI 2 m | cabo | DISPONIVEL |
| TI-0009 | Cabo USB-C 1 m | cabo | DISPONIVEL |
| TI-0010 | Cabo de rede 3 m | cabo | DISPONIVEL |
| TI-0011 | Webcam Full HD | camera | DISPONIVEL |
| TI-0012 | Câmera compacta | camera | DISPONIVEL |

TI-0010 disponível é decisão explícita da usuária, prevalecendo sobre a lista
contraditória do anexo. São dez disponíveis e dois em manutenção. Exatidão
refere-se ao lote esperado, sem autorizar apagar outros equipamentos existentes.

## Regras confirmadas

- Organização: EmpresTI, slug empresti. Preservar a separação por tenant.
- Professor: COLABORADOR vinculado à organização. Reaproveitar conta compatível
  sem trocar senha; divergências ou empréstimos preexistentes interrompem a carga.
  E-mail confirmado pelo fluxo normal, sem confirmação automática.

- Reexecução reaproveita registros iguais. Divergência em equipamento ou conta
  do professor interrompe e gera relatório sem sobrescrever ou apagar empréstimos.
- Nenhum empréstimo é criado. Conta do professor nunca é usada em testes.
  Empréstimos preexistentes não são apagados para fabricar o aceite de zero.
- Senha ou chave nunca entra em código, argumento de comando, manifesto ou log.
- Foto real deve ter 800 x 600, ID e conteúdo distintos, créditos e revisão visual.
  Pixabay foi autorizado pelo professor segundo a usuária (DEC-30). Em 11/11,
  a usuária autorizou buscar quatro itens em fontes externas (DEC-34); a
  autorização do professor para essas fontes não foi informada. Preservar
  licença, autoria, origem e revisão visual por foto. A chave privada está
  configurada localmente e não deve ser registrada neste repositório.
- Agente testa somente local. Banco e Storage de produção são escritos pelo usuário.

## Contrato operacional aprovado em 06/11/2026

1. Usar unicidade existente tenant + patrimônio, sem criar unicidade global.
2. Comparar nome, categoria, situação e referência/metadados da foto; IDs internos
   e timestamps não contam como divergência. Relatório não inclui segredos.
3. Fazer pré-validação de todo o lote e conta antes de escrever. Persistir lote
   de equipamentos em transação; tratar Auth/Storage como etapas separadas
   retomáveis, sem prometer transação distribuída ou apagar conta em rollback.
4. Definir etapas técnicas de criação/vínculo conforme as regras confirmadas;
   conta ainda não confirmada aguarda o fluxo normal, sem confirmação automática.

Modelo de foto, comparação, bucket/chave e etapas retomáveis foram aprovados
no documento de DDL abaixo. Vínculo e orquestração local foram implementados e
testados com identidades sintéticas. O adaptador e validadores Pixabay foram
testados; em 11/11 a chave local foi configurada e oito candidatos PNG 800×600
foram aprovados visualmente (DEC-31/32). O manifesto local de 12 candidatos
está em `.cache/imagens/manifesto-candidatos.json` (DEC-34); quatro fotos
externas aguardam revisão e duas apresentam ressalvas visuais explícitas.
Revisão visual humana, Storage e identidade real do professor seguem pendentes.
Não publicar senha nem preencher lacunas por inferência.

## Fluxo operacional

Validar destino local e entradas privadas; mostrar relatório de pré-validação;
interromper em divergência; aplicar etapas aprovadas; conferir persistência e
reexecutar; gerar evidência sem segredo. No deploy, usuário executa procedimento
separado. Não há nova tela nesta spec. Controles de acesso do catálogo ficam
na spec de solicitação, sem usar service role como prova de RLS.

## Critérios de aceite — não atendidos nesta etapa

- DADOS-01: em base local limpa, a carga cria exatamente o lote esperado,
  dez disponíveis e dois em manutenção, ligado à organização aprovada.
- DADOS-02: ao executar duas vezes, IDs e quantidades permanecem estáveis;
  nenhum equipamento, objeto ou conta é duplicado.
- DADOS-03: diante de divergência, interrompe com relatório e preserva dados,
  credenciais e empréstimos; comportamento parcial segue contrato aprovado.
- DADOS-04: cada item tem foto revisada de 800 x 600, fonte/crédito e referência
  pública acessível, sem repetição de ID ou conteúdo.
- DADOS-05: conta do professor acessa o fluxo com papel aprovado e zero empréstimos;
  verificação não cria nem apaga empréstimos em seu nome.
- DADOS-06: nenhum segredo é versionado/exposto; preparação do agente recusa
  destinos remotos e procedimento de produção é executado somente pelo usuário.

## Testes e evidências previstos

Prisma e Postgres reais locais: lote limpo, reexecução, divergência e ausência
de empréstimos. Auth local com identidade sintética distinta do professor para
provisionamento repetido e conta incompatível. Fotos: validador e revisão humana.
Verificação de acesso permitido/negado conforme matriz aprovada. Integração
local não comprova produção: evidência humana separada para o deploy.
Todos os testes futuros citam os IDs acima. Nenhum CA é marcado por este rascunho.

## Dependências e autoridade

[ADR-001](../adr/001-stack.md), [migration](../rules/migration.md),
[segredos](../rules/secrets.md), [specflow](../rules/specflow.md).
Coluna image e constraint já implementadas em DAT-03 após aprovação do DDL.
Novas mudanças de schema continuam exigindo aprovação conforme migration.md.
A orquestração local existe como módulo interno, sem CLI/rota de operação.
Não foi executada com fotos reais nem conta do professor; a carga de produção
segue exclusivamente com pessoa responsável após comprovar as pré-condições.

## Proposta concreta para decisão

[DDL, contrato da foto, comparação e etapas da carga](../plans/dados-iniciais-ddl.md).
Contrato e DDL desse documento aprovados pela usuária em 06/11/2026.
Isso autoriza a tarefa local de migration, sem aprovar os critérios por antecipação.
