# Manifesto e validação — Pixabay

## Fonte e condições consultadas em 11/11/2026

- [API Pixabay](https://pixabay.com/api/docs/): exige chave no parâmetro `key`.
  Respostas de busca precisam ser cacheadas por 24 horas; não fazer downloads
  sistemáticos em massa. URLs de imagem não podem ser hospedadas por hotlink
  permanente: baixar o arquivo e servir a cópia aprovada no Storage do projeto.
  Se a aplicação exibir resultados de busca, informar que as imagens são do
  Pixabay.
- [Licença Pixabay](https://pixabay.com/service/license-summary/): atribuição
  do autor não é obrigatória, mas é apreciada; verificar direitos de terceiros,
  marcas/logos e usos proibidos. Para rastreabilidade e conforme DEC-30, o
  catálogo manterá crédito com nome do autor e link para Pixabay.
- [Termos Pixabay](https://pixabay.com/service/terms/): a licença resumida
  não substitui a licença completa nem libera uso de marca, imagem de pessoa ou
  propriedade sem verificar direitos adicionais.
- [Pexels — emissão de chave](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key):
  conferida em 11/11; novas chaves continuam pausadas. DEC-30 substitui essa
  fonte pelo Pixabay após autorização formal do professor informada pela usuária.

## Registro por equipamento

O manifesto deverá conter: patrimônio, tipo, consulta de busca, ID Pixabay,
URL da página da imagem (`pageURL`), nome do autor, URL de perfil, URL/data da
licença consultada, arquivo original baixado (para auditoria local), caminho
final PNG, largura/altura decodificadas, SHA-256, responsável/data da revisão
visual, estado e motivos de rejeição. Não guardar chave, cabeçalho ou URL de API
que contenha a chave. Não usar URLs temporárias CDN como origem permanente.

Registrar candidatos rejeitados separadamente, sem incluí-los no lote aprovado.
Uma mesma foto recortada de duas formas não constitui duas fotos distintas:
conferir unicidade do ID e do hash. Revisão visual também deve identificar fotos
diferentes mas praticamente iguais; hash não detecta semelhança visual.

## Checks

- Decodificar arquivos e rejeitar dimensões diferentes de 800 x 600.
- Conferir o conjunto exato dos 12 patrimônios, sem falta ou duplicação.
- Rejeitar IDs Pixabay repetidos e conteúdo final com hash repetido.
- Exigir metadados de origem/crédito e aprovação de revisão visual humana.
- Rejeitar arquivos corrompidos ou imagens com pessoas, marcas/logos, texto ou
  telas legíveis, conforme o enunciado.
- Reexecutar preparação sem sobrescrever arquivo diferente silenciosamente.

A chave de Storage continua estável por patrimônio/hash. Na reexecução,
conteúdo igual é reaproveitado; divergência exige revisão humana. Bucket,
caminhos e política já estão definidos na spec de dados. Upload permanece
responsabilidade humana.

## Execução local

O script local `scripts/buscar-pixabay.mjs` pesquisa e baixa um ID por vez. O
suporte Pixabay foi aplicado aos validadores; ainda depende de chave local,
imagens reais e revisão visual para produzir um manifesto de entrega aprovado.

O fluxo é: consultas pontuais pela API com respostas cacheadas por 24h; selecionar
resultados manualmente; baixar somente cada candidato escolhido; preparar com
Sharp; preencher manifesto; revisar visualmente; validar IDs, hashes, dimensões
e créditos. A chave fica em `.env.local`, nunca na linha de comando, manifesto,
cache, logs ou Vercel.

## Estado atual e limites — 11/11/2026

A chave está configurada localmente e houve consultas e downloads individuais.
Oito candidatos reais foram preparados em PNG 800×600 e aprovados visualmente
pela usuária (DEC-31/32); quatro patrimônios
seguem sem foto adequada. Os metadados
e as rejeições estão no manifesto parcial local
`.cache/pixabay/manifesto-candidatos.json`. Nenhuma foto entrou no catálogo
ou foi enviada ao Storage. DADOS-04/PRA-03
continuam abertas; os testes sintéticos não substituem essas evidências.
