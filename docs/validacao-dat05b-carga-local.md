# DAT-05B — adaptador de persistência local

Spec: [dados iniciais](specs/dados-iniciais.md). Arquivo:
src/server/initial-data/load-local.ts. Parte interna da carga, sem rota/CLI.

## Implementação e limites

Recusa conexão fora de Postgres local e overrides host/hostaddr antes de conectar.
Cria snapshot dos metadados para impedir alteração pelo chamador durante awaits.
Valida lote antes de abrir conexão; dentro de transação Prisma bloqueia escrita
concorrente em tenants/equipment/memberships/loans, confere organização por slug
empresti e nome EmpresTI, relê equipamentos só desse tenant e compara novamente.
Somente cria os ausentes; não faz update, delete, upsert nem cria empréstimos.

A trava é de tabela e conservadora para carga local pontual: bloqueia também
escritas de outros tenants nessas tabelas enquanto a transação estiver aberta.
Não é proposta de estratégia para solicitações de empréstimo do produto.

Pré-condições externas são uma função injetada que precisa confirmar a conta,
bytes/revisão das fotos e objetos. Retorno false bloqueia, erro aborta. A função
real dessas verificações ainda será implementada em DAT-06/integração de fotos.
Não existe comando público para passar true e carregar dados reais. Callbacks
sintéticos dos testes demonstram persistência, não aprovam essas pré-condições.

## Execução reproduzível

npm run test:initial-data-local usa vitest.initial-data.config.mts, ambiente Node.
Requer banco local separado empresti_image_clean_20261106, com migrations já
aplicadas na tarefa anterior; não cria banco nem executa reset automaticamente.
Recusa organização empresti preexistente antes de criar fixture; usa ID aleatório.
Limpeza remove apenas o tenant sintético criado pelo teste, após os cenários.
Não usa a conta do professor, bucket ou arquivos reais e não altera banco de trabalho.

## Evidências observadas

Teste de integração real passou: pré-condição false/erro impede escrita;
duas execuções simultâneas resultam em 12 criados numa e 12 reaproveitados na outra;
terceira execução preserva IDs e timestamps; duas manutenções; zero empréstimos;
divergência interrompe antes da pré-condição e preserva registros/observações;
conexão remota é recusada. Cenário de falha no meio dos inserts ainda não
injetado: não apresentar falha anterior à escrita como prova desse rollback.

Checks: integração Postgres 1/1; npm test 59/59 em 10 arquivos; lint e build
aprovados com saída zero. CAs completos dependem de Auth/fotos e revisão DAT-07.

Atualização: [DAT-07A](validacao-dat07a-rollback.md) provou rollback após
oito INSERTs confirmados e queda real da conexão, sem mudança de schema.
