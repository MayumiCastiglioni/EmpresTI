# Plano — adaptação Pixabay e fotos reais

Data: 11/11/2026. Fonte autorizada pela usuária após confirmação de autorização
formal do professor; decisão registrada em [DEC-30](../produto/decisoes-pratica.md).
Estado: plano aprovado pela usuária em 11/11/2026. Tarefa 1 implementada e
validada localmente. Tarefa 2 está parcial: chave local configurada, oito
PNGs 800×600 aprovados visualmente pela usuária (DEC-31/32) e quatro patrimônios
ainda sem candidato adequado. Seguir as
[restrições do projeto](../rules/restrictions.md) nas próximas tarefas.

## Objetivo e limites

Desbloquear DAT-04/PRA-03 para adquirir e preparar as doze fotos reais usando a
API Pixabay, preservando autoria/origem e a revisão visual. Não inclui alteração
de banco, upload em Storage de produção, deploy, acesso a conta real do professor
ou qualquer escrita remota. Não é necessária migration: `image` já é JSONB.

A chave `PIXABAY_API_KEY` será apenas local para a ferramenta de aquisição. Não
será usada pela aplicação, exposta ao navegador, incluída no manifesto/cache/log,
nem adicionada à Vercel. A usuária configurou a variável em `.env.local`; o valor
não foi impresso nem incluído nos arquivos de trabalho.

## Tarefa 1 — suporte local à API e metadados Pixabay

### Arquivos a criar

- `skills/imagens-equipamentos/scripts/buscar-pixabay.mjs`: adaptador local de
  busca e download unitário por ID, sem dependência de Next ou acesso a serviços
  do projeto.
- `skills/imagens-equipamentos/scripts/buscar-pixabay.test.mjs`: testes com
  `fetch` simulado para respostas válidas, erros, cache, redirecionamento e
  garantia de que chave/URL privada não aparecem na saída.

### Arquivos a atualizar

- `.env.example`: declarar `PIXABAY_API_KEY=` sem valor.
- `.gitignore`: ignorar cache e respostas locais da API.
- `docs/rules/secrets.md`: explicar que essa chave é ferramenta local e não vai
  para Vercel, navegador, manifestos ou logs.
- `skills/imagens-equipamentos/SKILL.md` e
  `skills/imagens-equipamentos/references/manifesto-validacao.md`: comandos,
  campos do manifesto e limites da API.
- `skills/imagens-equipamentos/scripts/preparar.mjs` e
  `preparar.test.mjs`: validar ID, página Pixabay, perfil do autor, licença,
  hash, dimensão e revisão humana conforme o novo formato.
- `skills/imagens-equipamentos/scripts/verificar-storage.mjs` e seu teste:
  aceitar os metadados Pixabay do lote, sem fazer escrita no Storage.
- `src/server/initial-data/preflight.ts` e
  `tests/initial-data-preflight.test.ts`: validar `provider: "pixabay"`, origem,
  crédito e IDs únicos no lote inicial.
- `tests/equipment-image-local.integration.mjs`: fixture sintética com o novo
  provedor, sem migrar nem acessar dados remotos.
- `tests/initial-data-local.integration.ts` e
  `tests/run-initial-data-local.integration.ts`: fixtures sintéticas do novo
  provedor para os fluxos locais existentes.
- `app/catalogo/page.tsx`: exibir link de origem coerente com o provedor guardado
  e manter o crédito do autor aprovado em DEC-30.
- `docs/specs/dados-iniciais.md`, `docs/specs/preparacao-local-imagens.md`,
  `docs/plans/dados-iniciais.md`, `docs/tasks/dados-iniciais.md`,
  `docs/checklist-enunciado.md` e `ENTREGA.md`: refletir somente o que foi
  implementado e validado.

### Resultado da Tarefa 1 — 11/11/2026

Implementados adaptador de busca/download unitário, cache de 24 horas,
allowlist de hosts/redirecionamentos, limite de tamanho, erros sem URL
autenticada e recusa de sobrescrita. Os validadores de manifesto, pré-carga,
leitura do Storage e crédito do catálogo agora reconhecem Pixabay. Nenhuma
migration foi criada.

Checks: testes da skill 7/7; pré-validação 9/9; `npm run test:images-local` 1/1;
lint e `npm run build:isolated` passaram. `npm run test:initial-data-local`
passou em dois dos três arquivos; o arquivo de professor falha ao criar
empréstimo num estado recusado pelo trigger (`New loans must start as
SOLICITADO`), sem relação com esta tarefa. Nenhuma chamada real à API foi feita.

### Comportamento e segurança

1. Fazer buscas humanas e específicas para cada tipo de equipamento pela API
   oficial; limitar os resultados por consulta e permitir selecionar um ID.
2. Guardar respostas da busca localmente por 24 horas, sem guardar a chave. Não
   automatizar buscas repetidas nem downloads em massa.
3. Baixar somente a foto escolhida, sem hotlink permanente; limitar tamanho,
   tempo e hosts HTTPS permitidos, sem encaminhar a chave ao host da imagem.
4. Redigir erros antes de exibi-los, pois a API recebe a chave no parâmetro
   `key`. A ferramenta não deve imprimir a URL autenticada nem corpo de erro que
   possa reproduzir a credencial.
5. Registrar no manifesto ID Pixabay, `pageURL`, autor (`user`), URL do perfil,
   consulta, licença consultada, arquivo local, dimensões, hash e campos de
   revisão. Rejeitar IDs ou conteúdo duplicados.
6. Preservar o formato JSONB atual e impedir que a chave entre no client bundle,
   banco, Storage metadata ou arquivos versionados.

Base: [documentação da API](https://pixabay.com/api/docs/), que exige chave,
cache de 24 horas, veda downloads sistemáticos em massa e hotlink permanente;
[termos](https://pixabay.com/service/terms/) e
[resumo da licença](https://pixabay.com/service/license-summary/). Fotos com
pessoas identificáveis, marcas/logos legíveis ou conteúdo inadequado ao
enunciado serão rejeitadas na revisão visual; a licença não substitui essa
verificação.

## Tarefa 2 — adquirir e revisar as doze fotos

Pré-condição atendida em 11/11/2026: a chave está configurada localmente. Foram
feitas consultas pontuais e downloads individuais. Há seis candidatos preparados
para TI-0003, TI-0004, TI-0005, TI-0008, TI-0009 e TI-0010. Vinte e um candidatos foram
separados por mostrarem marca, texto, pessoa, conteúdo em tela, repetição visual
ou equipamento inadequado. TI-0001, TI-0002, TI-0006, TI-0007, TI-0011 e TI-0012
seguem sem candidato adequado. O manifesto em `.cache/pixabay/manifesto-candidatos.json`
é parcial; a usuária aprovou visualmente os seis candidatos (DEC-31), mas o
lote de 12 ainda não está validado nem liberado para o catálogo.

Conjunto esperado: TI-0001 a TI-0012, doze IDs e hashes únicos, fotos reais,
arquivos locais legíveis, metadados completos e aprovação visual registrada. As
fotos sintéticas dos testes não entram no manifesto de entrega.

## Tarefa 3 — Storage e conta do professor

Continuam separadas da aquisição. Não escrever em produção. A pessoa responsável
faz upload idempotente no bucket `equipment-images`, confirma leitura pública e
valida a conta do professor pelo fluxo normal, sem compartilhar senha. O roteiro
humano registra a evidência sem dados pessoais desnecessários. DAT-05/06/08 não
são concluídas somente com os testes locais.

## Validação prevista

Após cada tarefa, parar e reportar seus checks antes de seguir, como exige o
procedimento do projeto. Para a implementação local: testes do adaptador com
respostas simuladas, `preparar.test.mjs`, `verificar-storage.test.mjs`,
`npm run test:images-local`, `npm run test:initial-data-local`, lint e
`npm run build:isolated`. Nenhum teste chamará Pixabay enquanto a chave estiver
ausente. Os critérios reais de DAT-04 exigem ainda doze fotos, manifesto e
revisão humana; isso não fica comprovado pelos testes sintéticos.

## Estado atual — 11/11/2026

A chave está configurada localmente e houve uso da API Pixabay. Oito PNGs reais
foram aprovados visualmente e quatro patrimônios ainda precisam de fotos
adequadas. O manifesto de candidatos está em `.cache/pixabay/manifesto-candidatos.json`
(diretório ignorado pelo Git), com origem, crédito, IDs, dimensões, hashes e
rejeições. A usuária aprovou visualmente as oito imagens apresentadas (DEC-31/32).
DAT-04/PRA-03 continuam abertas até completar os quatro patrimônios sem foto e
validar o manifesto integral; não houve upload ao Storage. A conta do professor permanece com a
pessoa responsável. Não houve escrita em banco/Storage remoto, deploy ou operação Git.

### Nova rodada de busca — 11/11/2026

Foram feitas consultas específicas e downloads individuais pela API. Duas fotos
de notebook, TI-0001 (Pixabay 593327) e TI-0002 (Pixabay 1478822), foram
recortadas para 800×600 em `.cache/pixabay/review-proposed/` e registradas no
manifesto parcial como **pendentes de revisão visual**. As seis fotos antes
aprovadas permanecem com esse estado. TI-0006, TI-0007, TI-0011 e TI-0012
seguem sem foto adequada. As rejeições desta rodada incluem marca/texto,
equipamento diferente e duplicação visual; os motivos por ID constam no
manifesto local. Posteriormente, a usuária aprovou as duas fotos (DEC-32).
Ela confirmou continuar somente no Pixabay para as quatro restantes (DEC-33).
Buscas adicionais não encontraram candidatos adequados; não houve upload ao
Storage.
