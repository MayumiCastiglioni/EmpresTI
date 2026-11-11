# Proposta de DDL — foto do equipamento

Estado: aprovado pela usuária em 06/11/2026 ("Pode fazer").
Migration gerada e aplicada em bancos descartáveis e banco de desenvolvimento
locais. Teste Postgres, 50 testes gerais, lint e build aprovados.
[Evidências](../validacao-dat03-imagem.md).
[Spec](../specs/dados-iniciais.md) · [Plano](dados-iniciais.md) ·
[Tarefas](../tasks/dados-iniciais.md) · [Procedimento](../rules/migration.md).

## Mudança proposta

Adicionar uma coluna opcional image do tipo JSONB em equipment, representada
por image Json? no Prisma. Uma foto por equipamento; valores ausentes continuam
NULL. Manter as tabelas, IDs, índices de tenant/patrimônio e políticas existentes.

DDL pretendido (somente proposta para revisão):

```sql
ALTER TABLE "equipment" ADD COLUMN "image" JSONB;
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_image_object_check"
CHECK ("image" IS NULL OR jsonb_typeof("image") = 'object');
```

O constraint será incluído no SQL da nova migration gerada pelo Prisma Migrate.
Não executar SQL avulso nem alterar migrations anteriores.

## Contrato proposto de image

Objeto com provider (pixabay, conforme DEC-30), sourceId
como string, sourceUrl, photographer, photographerUrl, licenseUrl,
licenseCheckedAt (data ISO), bucket, objectKey, width 800, height 600 e sha256.
A referência pública é derivada do endereço público do Storage, bucket e chave;
não armazenar URL assinada expirada nem credencial. Dados de revisão visual
permanecem no manifesto de evidências, fora do catálogo público.

A coluna JSONB permite uma adição pequena sem criar tabela ou ciclo de joins.
Alternativa: colunas separadas tipadas para cada metadado, com mais constraints
no banco. JSONB exige validação estrita do objeto na carga e no servidor;
a checagem SQL acima comprova só que é objeto, não dimensões ou autenticidade.
Sem essa validação, a implementação da carga não poderá ser aprovada.
Unicidade de fotos será conferida no lote por ID e hash; este DDL não impõe
unicidade de campos internos do JSON para todo o banco.

## Propostas operacionais a aprovar com a spec

- Preservar unicidade atual (tenant_id, asset_tag), não criar unicidade global.
- Comparar nome, categoria, situação e todos os metadados de image. IDs e datas
  internas de criação/atualização não geram divergência. Campos antigos opcionais
  (serial, observações, local de retirada) são preservados e não preenchidos
  pela carga. Encontrar diferença nos campos comparados interrompe antes da escrita.
- Bucket público proposto: equipment-images. Chave estável proposta:
  empresti/<patrimonio>/<sha256>.png. Mesmo conteúdo reaproveita a chave;
  conteúdo divergente exige revisão, sem sobrescrever nem excluir objetos antigos.
- Pré-validar lote, conta e manifesto antes da escrita. Equipamentos persistidos
  em uma transação. Auth/Storage são etapas separadas e retomáveis; falha não
  autoriza apagar conta, objeto ou equipamento como compensação automática.
- Conta compatível: papel COLABORADOR e vínculo EmpresTI, sem redefinir senha;
  confirmação de e-mail segue fluxo normal. Divergências ou empréstimos interrompem.

Bucket/chave são propostas; não criar bucket nem políticas Storage nesta tarefa.
Permissões de upload de produção e execução da carga ficam com o usuário.

## Impacto nos dados e usos

Linhas existentes recebem NULL, sem backfill, exclusão, mudança de status ou
alteração de empréstimos/contas. Novas fotos não se tornam obrigatórias para
equipamentos anteriores; carga de 12 itens exige foto pelo seu próprio contrato.
Nenhuma tabela nova: RLS continua habilitada em equipment e as mesmas policies
cobrem a coluna. Isso não substitui testes reais de acesso por tenant e ausência
de sessão. Verificar o que pode ser exposto no objeto antes de escrever dados.

Busca em src não encontrou consumidor persistente de Equipment; inventário
continua demonstrativo. Prisma schema/client serão afetados. Catálogo tRPC,
leitura da foto e crédito serão implementados em tarefa própria, sem alegar
que adicionar a coluna já entrega a interface ou protege os dados por si só.

## Plano de migration e validação após aprovação

1. Conferir destino local sem revelar valores de conexão. Preservar banco de
   trabalho; reconstrução limpa usa banco descartável separado e autorizado.
2. Adicionar image Json? no Prisma. Gerar uma nova migration com Prisma Migrate;
   acrescentar constraint ao SQL da nova migration antes de aplicar.
3. Aplicar somente local. Conferir linha anterior com image NULL e metadado válido;
   SQL escalar/array rejeitado. Validar modelo/client sincronizados.
4. Reconstruir todas as migrations desde zero em Postgres local descartável;
   não assumir que supabase db reset aplica Prisma.
5. Testar acesso de membro, outro tenant e sem sessão com papéis reais;
   testar carga repetida/conflitos nas tarefas seguintes.
6. Rodar testes, lint e build; revisão independente antes de declarar aceite.

Reversão: não remover coluna automaticamente, pois fotos já registradas seriam
perdidas. Em falha, interromper e diagnosticar; eventual migration corretiva
ou remoção exige novo impacto e aprovação. Nenhum procedimento remoto autorizado.
