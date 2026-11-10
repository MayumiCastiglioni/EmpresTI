# DAT-05A — pré-validação de equipamentos

Parte independente da carga aprovada em [dados iniciais](specs/dados-iniciais.md).
Módulo: src/server/initial-data/preflight.ts. Testes: tests/initial-data-preflight.test.ts.
Função pura, sem cliente Prisma, rede, leitura de arquivos ou credenciais.
Não faz gravações, não integra ainda o fluxo operacional e não conclui CAs de produto.

## Comportamento

Lote fixo de 12 equipamentos, situações aprovadas e metadados estritos de imagem.
Compara nome/categoria/situação/imagem; ignora ordem das propriedades JSON.
Rejeita foto ausente/extra, ID/hash repetido, URL de outra fonte, data inválida,
objeto/caminho inconsistentes e campos extras, inclusive segredos acidentais.
Relatório contém apenas patrimônio conhecido e campo, sem ecoar valor recebido.
Divergência bloqueia o lote inteiro e esvazia propostas de criar/reaproveitar.
Registros externos ao lote permanecem intactos; função não altera entradas.

O adaptador deve fornecer somente equipamentos do tenant EmpresTI; o módulo
não substitui filtro de tenant, lock, transação ou autorização de servidor.
Metadados válidos não comprovam existência/tamanho do arquivo nem revisão visual:
validação de bytes, conta e Storage ocorrerá antes da futura persistência.
Resultado equipment-comparison-passed descreve apenas esta comparação.
Sem fotos reais, nenhum dado foi preparado para carga ou gravado nesta tarefa.

## Checks

npm test: 59 testes em 10 arquivos passaram; npm run lint passou.
Doze registros conferidos contra a spec. Build aprovado (saída zero), incluindo TypeScript.
Nenhum banco, Storage, Auth, Git ou ambiente alterado nesta tarefa.
