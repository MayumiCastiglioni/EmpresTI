---
name: imagens-equipamentos
description: Seleciona e prepara fotos reais de equipamentos pela API Pixabay, com manifesto, revisão visual e entrega local para upload humano. Use para as imagens do catálogo; não para gerar ilustrações.
---

# Imagens de equipamentos

Estado: Pixabay autorizado em 11/11 (DEC-30); ferramenta local implementada.
Em 11/11, a chave foi configurada localmente; oito fotos foram aprovadas
visualmente. Quatro
patrimônios ainda não têm candidato adequado; o manifesto é rascunho e nenhuma
foto foi enviada ao catálogo.
Leia [manifesto e validação](references/manifesto-validacao.md) antes de executar.
Consulte as restrições do projeto em docs/rules/restrictions.md e secrets.md;
esta skill não concede permissões adicionais nem substitui decisões do time.

## Entradas e condições

Receba lista aprovada de patrimônios e tipos, diretório local de saída e
política aprovada de processamento. Sharp foi autorizado pela usuária em 06/11;
consulte docs/produto/decisoes-pratica.md. O professor autorizou Pixabay para
as 12 fotos. Preserve crédito de autor e origem. `PIXABAY_API_KEY` é privada,
deve ser configurada localmente e nunca enviada no chat. Sem a chave, marque a
aquisição como bloqueada. Pexels permanece indisponível; não misture fontes.
Sem ferramenta aprovada e executável para medir/redimensionar, registre a
pendência: não declare 800 x 600 garantidos por parâmetro de URL.

## Procedimento

1. Pesquise somente pela API Pixabay, seguindo a
   [documentação oficial](https://pixabay.com/api/docs/). A chave é exigida no
   parâmetro `key`: o script local lê `.env.local`, monta a URL em memória e
   nunca a imprime, registra ou grava em cache. Não exponha a chave ao navegador
   nem a peça no chat.
2. Cacheie respostas de pesquisa por pelo menos 24 horas. Faça consultas
   pontuais, revisadas por pessoa; não faça downloads sistemáticos em massa.
   Preserve ID, autor, página da imagem, perfil do autor e licença antes de baixar.
   Não substitua por busca web, outra fonte ou geração por IA.
3. Revise cada candidato e seu recorte final. Rejeite pessoas, marcas/logos ou
   textos legíveis e telas com conteúdo. Registre motivos; uma busca sem a
   palavra pessoa não comprova ausência de pessoas na foto.
4. Produza arquivos locais com ferramenta aprovada. Confira por código as
   dimensões decodificadas exatas 800 x 600 e calcule hash do arquivo final.
   Não estique uma imagem inadequada: procure outro candidato se o recorte
   prejudicar a identificação do equipamento.
5. Valide manifesto completo, patrimônios exatos, IDs Pixabay e hashes únicos.
   Registre revisão visual distinta da validação automática. Não marque foto
   aprovada só por ter tamanho correto. Se não houver foto adequada, reporte
   o equipamento pendente; não improvise outra origem.
6. Baixe arquivos para processamento local; hotlink permanente de URLs Pixabay
   é proibido. Entregue arquivos e manifesto local para revisão. O usuário fará
   o upload em produção conforme o procedimento aprovado. Não abra conexão de
   escrita nem inclua credenciais Supabase neste processo.

### Comandos locais

```bash
node skills/imagens-equipamentos/scripts/buscar-pixabay.mjs buscar "notebook"
node skills/imagens-equipamentos/scripts/buscar-pixabay.mjs baixar 123456 ./dados/imagens/notebook.jpg
```

O download aceita apenas um ID presente em busca cacheada ainda válida por 24h,
salva em arquivo novo e valida redirecionamentos HTTPS somente para hosts do
Pixabay. O usuário seleciona cada ID; não há comando em lote. O cache fica em
`.cache/pixabay/`, ignorado pelo Git, sem guardar a chave ou a URL autenticada.

## Saída e limite de conclusão

Informe quantidade selecionada/aprovada/rejeitada, motivos, checks executados,
pendências e localização do manifesto. Preserve crédito do autor e link Pixabay
para rastreabilidade. Sem scripts adaptados, revisão visual e evidência de
reexecução, não declare a PRA-03 concluída. O upload humano também não prova
automaticamente que a produção recebeu os arquivos corretos.

## Depois do upload humano

Consultar [roteiro humano](../../docs/roteiro-humano-dados-iniciais.md) para
verificação pública por scripts/verificar-storage.mjs. Ele somente lê as chaves
esperadas e valida bytes/dimensões/hash; não faz upload ou aprova revisão visual.
O agente valida contra servidor local de teste; conferência remota fica com humano.
