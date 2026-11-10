# Manifesto e validação

## Fontes verificadas em 07/11/2026

- [API Pexels](https://www.pexels.com/api/documentation/): autenticação por
  Authorization, busca e recurso Photo. As diretrizes da API pedem link
  destacado para Pexels e crédito ao fotógrafo quando possível.
- [Help Center — chave API](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key):
  atualização de 07/11/2026 informa que a emissão de novas chaves está pausada.
  Esse aviso prevalece sobre a instrução genérica da documentação de que a chave
  é emitida imediatamente. Aquisição pela API fica bloqueada até a reabertura;
  não usar acesso direto à página como substituição.
- [Licença Pexels](https://www.pexels.com/license/): registrar a fonte vigente.
  A ausência de obrigatoriedade geral de atribuição na licença não elimina
  as diretrizes específicas de uso da API nem o contrato da atividade.

## Registro por equipamento

O manifesto deverá conter: patrimônio, tipo, consulta utilizada, ID Pexels,
URL da página da foto, nome e URL do fotógrafo, URL e data de consulta da
licença, caminho local final, largura/altura decodificadas, SHA-256,
responsável/data da revisão visual, estado e motivos de rejeição quando houver.
Não guardar cabeçalhos de autenticação ou respostas contendo credenciais.

Registrar também candidatos rejeitados, sem incluí-los no lote aprovado.
Uma mesma foto recortada de duas formas não é duas fotos distintas: conferir
unicidade tanto por ID Pexels quanto por hash final. Revisão visual deve
identificar fotos diferentes mas praticamente iguais; hash não detecta isso.

## Checks a implementar após aprovação da ferramenta

- Decodificar os arquivos reais e rejeitar dimensões diferentes de 800 x 600.
- Conferir conjunto exato dos patrimônios aprovados, sem falta ou duplicação.
- Rejeitar IDs Pexels repetidos e conteúdo final com mesmo hash.
- Rejeitar metadados/créditos ausentes e arquivos sem revisão visual aprovada.
- Falhar de forma explícita para arquivo corrompido ou candidato inadequado.
- Reexecutar preparação sem sobrescrever arquivo diferente silenciosamente.

Usar chave de objeto estável por patrimônio e versão/hash acordados na spec.
Na reexecução, conteúdo igual deve ser reaproveitado; divergência deve ser
mostrada para decisão humana. O bucket público, caminhos finais e política
de atualização dependem da spec de dados; não inventar esses contratos aqui.

## Execução local

Da raiz do projeto:

```text
node skills/imagens-equipamentos/scripts/preparar.mjs preparar origem.jpg destino.png
node skills/imagens-equipamentos/scripts/preparar.mjs validar manifesto.json diretorio-das-fotos
node --test skills/imagens-equipamentos/scripts/preparar.test.mjs
```

O diretório de destino deve existir. Arquivos são locais, sem upload ou rede.
Manifesto JSON: objeto com patrimoniosEsperados (lista de strings) e fotos.
Cada foto usa patrimonio, tipo, consulta, pexelsId (inteiro), origem, fotografo,
fotografoUrl, licencaUrl, licencaConsultadaEm, arquivo, largura, altura, sha256
mais revisao com estado aprovada, responsavel e data. URLs Pexels são conferidas
por domínio; o script não verifica sua existência ou prova aquisição pela API.
Use caminhos locais revisados: o utilitário não é uma barreira de isolamento
para manifestos não confiáveis. Rejeições visuais ficam em registro separado.

## Evidências e limites

Teste com imagens sintéticas exercita tamanho real, reutilização, recusa de
sobrescrita, duplicatas, créditos ausentes, revisão pendente e entrada corrompida.
Não há chave consultada, foto real baixada, revisão visual ou upload executado.
Não confundir aprovação desse teste com aceite da PRA-03 ou das fotos.
