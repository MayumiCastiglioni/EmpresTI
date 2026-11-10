---
name: imagens-equipamentos
description: Seleciona e prepara fotos reais de equipamentos pela API Pexels, com manifesto, revisão visual e entrega local para upload humano. Use para as imagens do catálogo; não para gerar ilustrações.
---

# Imagens de equipamentos

Estado: preparação local implementada; aquisição e fotos reais ainda pendentes.
Leia [manifesto e validação](references/manifesto-validacao.md) antes de executar.
Consulte as restrições do projeto em docs/rules/restrictions.md e secrets.md;
esta skill não concede permissões adicionais nem substitui decisões do time.

## Entradas e condições

Receba lista aprovada de patrimônios e tipos, diretório local de saída e
política aprovada de processamento. Sharp foi autorizado pela usuária em 06/11;
consulte docs/produto/decisoes-pratica.md. Preserve crédito Pexels. A proposta
Pixabay ainda não substitui o contrato da atividade; esclarecer autorização
da troca antes de buscar fotos. O Help Center oficial, verificado em 07/11/2026,
continua informando que a emissão de novas chaves Pexels está pausada. Sem chave emitida, marque
aquisição como bloqueada e não contorne a API por busca/download direto.
Sem ferramenta aprovada e executável para medir/redimensionar, registre a
pendência: não declare 800 x 600 garantidos por parâmetro de URL.

## Procedimento

1. Pesquise somente pela API Pexels. Consulte a documentação oficial da API
   para autenticação e resposta. Use credencial privada no cabeçalho Authorization,
   nunca no cliente, URL, manifesto ou evidência. Não peça a chave no chat.
2. Selecione candidatos compatíveis com o tipo de equipamento. Preserve ID,
   fotógrafo, links de origem e licença antes de baixar. Não substitua por
   busca web, outro banco de imagens ou geração por IA.
3. Revise cada candidato e seu recorte final. Rejeite pessoas, marcas/logos ou
   textos legíveis e telas com conteúdo. Registre motivos; uma busca sem a
   palavra pessoa não comprova ausência de pessoas na foto.
4. Produza arquivos locais com ferramenta aprovada. Confira por código as
   dimensões decodificadas exatas 800 x 600 e calcule hash do arquivo final.
   Não estique uma imagem inadequada: procure outro candidato se o recorte
   prejudicar a identificação do equipamento.
5. Valide manifesto completo, patrimônios exatos, IDs Pexels e hashes únicos.
   Registre revisão visual distinta da validação automática. Não marque foto
   aprovada só por ter tamanho correto. Se não houver foto adequada, reporte
   o equipamento pendente; não improvise outra origem.
6. Entregue arquivos e manifesto local para revisão. O usuário fará o upload
   em produção, seguindo o procedimento idempotente aprovado na spec de dados.
   Não abra conexão de escrita nem inclua credenciais Supabase neste processo.

## Saída e limite de conclusão

Informe quantidade selecionada/aprovada/rejeitada, motivos, checks executados,
pendências e localização do manifesto. Preserve crédito Fotos: Pexels com link
no contrato de entrega e os dados de cada fotógrafo; a tela aguarda resolução
de PRAT-C06. Sem scripts executados, revisão visual e evidência de reexecução,
não declare a PRA-03 concluída. O upload humano também não é prova automática
de que a produção recebeu os arquivos corretos.

## Depois do upload humano

Consultar [roteiro humano](../../docs/roteiro-humano-dados-iniciais.md) para
verificação pública por scripts/verificar-storage.mjs. Ele somente lê as chaves
esperadas e valida bytes/dimensões/hash; não faz upload ou aprova revisão visual.
O agente valida contra servidor local de teste; conferência remota fica com humano.
