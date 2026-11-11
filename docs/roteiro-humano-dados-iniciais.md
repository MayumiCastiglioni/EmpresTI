# Roteiro humano — dados iniciais e fotos

Estado: preparação parcial, não executar como entrega completa agora.
[Spec](specs/dados-iniciais.md) · [Tarefas](tasks/dados-iniciais.md).
Agente não executou upload, SQL remoto, deploy ou verificação de conta real.

Atualizado em 11/11/2026: Pixabay está autorizado (DEC-30) e a chave local foi
configurada. Seis PNGs foram aprovados visualmente pela usuária (DEC-31); seis patrimônios ainda não
têm foto adequada e o manifesto é parcial. Não iniciar upload nem validação
real da conta até o lote de 12 fotos e a revisão humana estarem concluídos.

## Antes de começar

Usar Pixabay conforme DEC-30; não apresentar imagens sintéticas dos testes como
fotos da entrega. Completar 12 PNGs reais, revisão visual documentada, metadados
e manifesto conforme a skill. Não pôr credencial no chat ou em arquivo versionado.

Confirmar projeto correto, organização EmpresTI/empresti e identidade autorizada
do professor por canal privado. Conta usa cadastro/confirmação normal e papel
COLABORADOR; não redefinir senha nem confirmar e-mail administrativamente.
Divergência ou empréstimo preexistente interrompe, sem apagar dados.

## Publicação dos arquivos — somente pessoa responsável

1. Conferir os arquivos locais com os validadores da skill e revisão humana.
2. No projeto autorizado, conferir bucket equipment-images e acesso público.
   Se não existir ou permissões divergirem, registrar para definição/configuração
   humana; este roteiro não cria bucket nem policy e não concede acesso público
   de escrita. Configuração pública permite leitura, não upload anônimo.
3. Cada arquivo usa chave empresti/<patrimonio>/<sha256>.png. Antes de enviar,
   verificar se já existe: conteúdo igual reaproveita; diferente interrompe e
   pede revisão. Não sobrescrever/apagar objeto anterior ou usar upsert cego.
4. Fazer upload manual somente dos ausentes. Arquivos públicos não contêm senha,
   dados pessoais ou telas reais. Se falhar parcialmente, registrar o que existe
   e retomar pelos ausentes após conferência; não apagar objetos para recomeçar.

## Conferência pública de leitura — executável pelo responsável

Usar JSON com propriedade photos, mapa TI-0001 a TI-0012 contendo os metadados
aprovados de image. É o formato do fluxo local, não uma lista de arquivos nem
arquivo de ambiente. Não contém senha/token. Substituir projeto e caminho:

```text
node skills/imagens-equipamentos/scripts/verificar-storage.mjs https://SEU-PROJETO.supabase.co fotos.json
```

Saída esperada: public-files-verified, checked 12 e issues vazia, código zero.
O comando só faz GET público, sem cookie/chave, sem redirect, sem upload. Confere
PNG decodificável 800 x 600 e SHA-256 igual ao manifesto; 404, conteúdo divergente,
redirect ou timeout bloqueiam. Não comprova quem publicou ou duplicatas fora das
12 chaves esperadas; responsável confere objetos adicionais no painel.
Não prova créditos, licença, origem ou revisão visual: checagens complementares
continuam necessárias. Limite técnico 5 MB por objeto; imagens maiores precisam
de preparação/revisão, não de contornar o verificador. Cada GET tem limite de 5 s.

## Banco, carga e aplicação — ainda não liberados por este roteiro

Migration foi validada somente local. Execução remota exige revisão humana do
ambiente, migrations e dados; nenhuma instrução aqui troca DATABASE_URL para
remoto ou contorna a guarda local dos módulos. Falta ferramenta operacional de
produção aprovada; não usar os testes como script de carga nem rodar seeds locais
apontando para o deploy. Não afirmar que este roteiro já executa essa parte.

Após ferramenta/release apropriados e carga humana aprovada: conferir 12 patrimônios,
10 disponíveis/2 manutenção, metadados persistidos e reexecução sem duplicar.
Confirmar cadastro/acesso do professor sem usar sua conta para solicitar itens;
verificação de zero empréstimos pela pessoa responsável, preservando dados.
Confirmar catálogo e crédito do autor com link Pixabay para essas fotos;
essa integração da interface ainda está pendente.

## Evidências a registrar sem segredos

Data/responsável, versão revisada, projeto público, resultado dos validadores,
12 chaves/hashes, contagens antes/depois, conflitos e decisões, acesso autorizado
e zero empréstimos, links GitHub/Vercel. Não registrar senha, chave ou token de sessão.
Só depois da revisão independente e aceite real atualizar ENTREGA.md e preparar tag.

Fontes oficiais consultadas em 06/11/2026:
[Downloads públicos](https://supabase.com/docs/guides/storage/serving/downloads),
[Bucket público e permissões de escrita](https://supabase.com/docs/guides/storage/buckets/fundamentals).
