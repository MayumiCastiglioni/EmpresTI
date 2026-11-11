# DAT-03 — migration da imagem

Data: 06/11/2026. Aprovação: usuária respondeu "Pode fazer" à proposta
[DDL e impacto](plans/dados-iniciais-ddl.md). Escopo: coluna opcional e constraint;
não aprova a spec completa de dados iniciais.

## Execução observada

- Prisma Migrate gerou 20261106112134_equipment_image com --create-only em
  banco local descartável; constraint de objeto adicionada antes da aplicação.
- Aplicada no banco descartável de atualização; equipamento sintético anterior
  permaneceu com nome/status preservados e image NULL.
- Reconstrução de todas as 3 migrations em segundo banco vazio passou.
- Aplicada a mesma migration no banco de desenvolvimento local configurado,
  127.0.0.1:54322; nenhuma migration anterior reaplicada ou editada.
- Cliente Prisma regenerado pelo prebuild.

## Teste explícito

npm run test:images-local usa tests/equipment-image-local.integration.mjs.
Exige Postgres local e banco separado empresti_image_validation_20261106,
com todas as migrations já aplicadas. Esse banco foi criado nesta sessão;
o comando não o cria nem reseta. Usa transação e rollback com dados sintéticos.
Não apontar o teste para o banco de trabalho. URL remota e overrides host/hostaddr
são recusados; valor da conexão nunca é impresso pelo teste.

Resultado: 1 teste passou. Objeto aceito; SQL NULL aceito; JSON array, string,
número e JSON null recusados por constraint. RLS: membro lê foto, outro tenant
e identidade vazia não leem; papel authenticated usado em vez do owner.
GRANT de leitura usado só dentro da transação, revertido no rollback; teste
isola políticas de linhas, não comprova grants finais da API em produção.
Bancos descartáveis foram preservados localmente para reprodução, sem reset
ou exclusão de banco de trabalho. Nenhuma conta Auth real foi usada.

## Limitações

Constraint valida apenas objeto, não o contrato completo de metadados. Validação
estrita da carga/servidor, fotos, Storage, Auth e duas execuções do lote serão
implementados nas tarefas seguintes. Nenhuma escrita remota ou Git executado.
Checks gerais: npm test 50/50 em 9 arquivos; npm run lint e npm run build
aprovados, todos com saída zero. npm run test:images-local passou na repetição.
Spec DADOS completa ainda não pronta; revisão independente de toda a carga
fica para DAT-07, após as implementações pendentes.

Revalidação em 06/11/2026: `npm run test:images-local` passou 1/1 novamente,
somente em Postgres local. Não acessou Supabase remoto nem alterou o escopo da
constraint ou a evidência anterior de reconstrução das migrations.
