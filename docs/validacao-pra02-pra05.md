# PRA-02 a PRA-05 — execução e limites

Data: 06/11/2026. Pedido da usuária: executar PRA-02, PRA-03, PRA-04 e PRA-05.
Resultado geral: trabalho local avançou; as quatro etapas não podem ser marcadas
como integralmente concluídas por causa dos bloqueios e critérios abaixo.

## PRA-02 — prova do verificador

- Baseline da fixture passou: `node --test tests/fixtures/verificador-spec/status.test.mjs`.
- Commit `12aa161` contém somente os dois arquivos da fixture com o retorno
  incorreto; o check falhou com 1 teste/1 falha. R1 independente reportou
  PROVA-01 REPROVADO e não editou os arquivos.
- O principal confirmou o erro e o hash intacto do teste:
  `60e2102172f0d3ab4fbc5a639fe438537dcf6dff2b24b53f50842242d0415e8a`.
- Commit `d8bdcbb` restaurou o retorno esperado. R2, sem receber diagnóstico de
  R1, passou 1 teste e reportou PROVA-01 ATENDIDO somente para a fixture.
- O status da fixture ficou limpo. Os commits são locais; não houve push.
- R1 e R2 marcaram isolamento técnico **NÃO COMPROVADO**. As ferramentas da
  sessão permitem escrita e acesso externo. A ferramenta de colaboração acionou
  explicitamente o papel `verificador-spec`; isso não prova descoberta do TOML
  `.codex/agents/verificador-spec.toml` pelo carregamento nativo.

Estado em 06/11: PV-06 concluído; PV-05 e descoberta nativa pendentes; PRA-02 parcial.

### Atualização de fechamento PRA-02 — 10/11/2026

R4 descobriu e iniciou nativamente o agente configurado em .codex/config.toml,
com as instruções de .codex/agents/verificador-spec.toml. O verificador leu a
spec e a fixture, não editou arquivos e reportou PROVA-01 ATENDIDO após 1/1 teste.
Resposta preservada em [rodada-r4](verificacao/prova-verificador/rodada-r4.md).

O pai usou MXC read-only com rede desligada, leitura restrita ao repositório,
perfil pessoal e quatro arquivos .env* negados, apps/plugins desativados, tabela
MCP vazia, configuração pessoal ignorada e variáveis de segredo filtradas.
Probes: escrita no projeto e acesso ao perfil/.env* → EPERM; TCP local → EACCES.
Como o shell começou na raiz do sistema e não podia entrar no OneDrive, o check
foi iniciado com WorkingDirectory do projeto e NODE_OPTIONS de preservação de
links; os argumentos permaneceram --test e o caminho permitido da fixture.

Estado atual: PV-01–PV-07 concluídos; PRA-02 concluída apenas para a prova técnica
da fixture. Nenhuma spec do produto, segurança de produção ou critério EMP/DADOS
foi aprovada por essa rodada. Nenhuma operação Git foi executada; commits antigos
12aa161 e d8bdcbb continuam locais e sem push.

## PRA-03 — imagens

A fatia local da skill continua aprovada apenas para preparação/validação.
Checks executados nesta rodada:

- `node --test skills/imagens-equipamentos/scripts/preparar.test.mjs`: 2/2.
- `node --test skills/imagens-equipamentos/scripts/verificar-storage.test.mjs`: 1/1, contra servidor HTTP local efêmero.

O Help Center oficial da Pexels informa que a emissão de novas chaves está
pausada em 06/11/2026:
https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key.
Nenhuma chave foi consultada. Não há foto real, manifesto real, revisão visual,
upload ou verificação de Storage; Pixabay não foi autorizado pelo professor.

Estado: aquisição real bloqueada; PRA-03 parcial. Não contornar a API por busca
ou download direto e não declarar fotos sintéticas como entrega.

## PRA-04 — spec de dados

Spec, plano e tarefas existem. Organização EmpresTI/empresti, papel do professor,
confirmação normal, preservação de dados e contrato da coluna de imagem foram
registrados; a usuária aprovou o DDL de imagem e ele já foi aplicado somente local.
DADOS-R1 retornou **NÃO PRONTA**; nenhum aceite completo DADOS-01 a DADOS-06 foi
aprovado. A spec depende de evidências de fotos reais/Storage e conta do professor
para os critérios de aceite. A pausa de emissão Pexels foi adicionada à skill,
ao plano e ao checklist; não equivale à autorização de outra fonte.

Estado: PRA-04 parcial; manter spec aberta e refletir as evidências quando os
bloqueios externos forem resolvidos.

## PRA-05 — carga local

Checks executados nesta rodada, todos somente em serviços/fixtures locais:

- `npm run test:images-local`: 1/1; coluna image, constraint e leitura tenant.
- `npm run test:initial-data-local`: 3/3; conta Auth sintética, fixtures locais,
  transação, reexecução, concorrência e preservação/conflicto.

Esses testes não usam fotos reais nem a conta do professor e não consultam o
Storage de produção. A orquestração segue como módulo interno sem CLI/rota de
carga; o roteiro humano não executa uma carga de produção. Upload, validação
pública, criação/confirmação real da conta e conferência de zero empréstimos
continuam com a pessoa responsável, sem escrita pelo agente.

Estado: testes da implementação local passaram; DAT-01/04/05/06/07/08 e PRA-05
permanecem abertos para aceite completo.

## Snapshot anterior do tópico 4 — 11/11/2026, antes da configuração local

O workspace foi conferido por tipos de arquivo: não contém fotos reais dos doze
equipamentos nem manifesto do lote. As fotos de validação existentes são somente
capturas da interface, não assets de produto. O Help Center oficial da Pexels
continua informando que novas chaves estão pausadas. Depois dessa conferência,
a usuária informou autorização formal do professor para Pixabay (DEC-30), mas
`PIXABAY_API_KEY` está ausente. Nenhuma API, conta de professor, Storage ou banco
remoto foi acessado.

Naquele snapshot, nenhuma chamada real havia sido feita e a chave não estava
configurada. O estado foi substituído pela atualização abaixo.

## Aquisição Pixabay — atualização 11/11/2026

A chave foi configurada localmente e foram feitas consultas e downloads
individuais. Seis PNGs candidatos 800×600 foram preparados para
TI-0003/0004/0005/0008/0009/0010. Vinte e um candidatos foram rejeitados com motivos
registrados; TI-0001/0002/0006/0007/0011/0012 ainda precisam de fotos adequadas.
O rascunho de manifesto fica em `.cache/pixabay/manifesto-candidatos.json`.
`npm run test:images-local` passou 1/1; `node --test
skills/imagens-equipamentos/scripts/preparar.test.mjs` passou 2/2; dimensões,
IDs e hashes dos seis PNGs foram conferidos; a usuária aprovou esses seis
visualmente (DEC-31). A revisão integral de 12 fotos, Storage,
conta do professor e qualquer escrita de produção continuam pendentes. Ver
[plano Pixabay](plans/adaptacao-pixabay.md) e [roteiro humano](roteiro-humano-dados-iniciais.md).

## Ações não executadas

Sem acesso a credenciais, dados reais, API Pexels, Storage ou banco remoto; sem
alteração de Vercel; sem carga, upload ou deploy de produção. Apenas os dois
commits exigidos pela prova PRA-02 foram criados; nenhum push foi feito. Outras
alterações existentes no workspace não foram incluídas nesses commits.
