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

Estado: PV-06 concluído; PV-05 e descoberta nativa pendentes; PRA-02 parcial.

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

## Ações não executadas

Sem acesso a credenciais, dados reais, API Pexels, Storage ou banco remoto; sem
alteração de Vercel; sem carga, upload ou deploy de produção. Apenas os dois
commits exigidos pela prova PRA-02 foram criados; nenhum push foi feito. Outras
alterações existentes no workspace não foram incluídas nesses commits.
