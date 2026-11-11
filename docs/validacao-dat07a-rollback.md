# DAT-07A — interrupção real e rollback

[Spec](specs/dados-iniciais.md), DADOS-03; teste em
tests/run-initial-data-local.integration.ts e helper tests/helpers/interrupt-postgres.ts.
Somente teste foi alterado; nenhum hook de falha adicionado ao código do produto.

## Experimento executado

Proxy TCP temporário escuta em 127.0.0.1 e encaminha ao Postgres local separado
empresti_image_clean_20261106. Observa fronteiras do protocolo e CommandComplete,
sem registrar payloads ou credenciais. Após o oitavo INSERT confirmado pelo servidor
(organização, vínculo e seis equipamentos), encerra as duas conexões antes do commit.
SSL desabilitado somente na conexão loopback do proxy para interpretar o protocolo.
Não altera Postgres, schema, policies ou dados de trabalho.

O fluxo rejeitou com erro real de conexão. Consultas diretas ao banco comprovaram:
nenhuma organização empresti, nenhum vínculo do usuário fixture e nenhum dos 12
patrimônios do lote permaneceu. A conta Auth sintética foi preservada; o código
não tentou compensar a falha apagando conta. Logo após, execução normal e duas
simultâneas passaram, comprovando que não houve lote parcial deixado pelo erro.

## Checks e limites

npm run test:initial-data-local: 3/3 integrações passaram incluindo a nova falha.
Suite geral: 59 testes passaram. Tipagem primeiro apontou chunk Buffer|string
no helper; normalização corrigida e tsc repetido passou. Integrações repetidas
3/3 aprovadas após a correção. Lint repetido aprovado. Build não repetido: apenas testes locais e
helper foram alterados, sem estrutura/runtime da aplicação modificado.
Não comprova origem, revisão humana das fotos, Storage público ou produção.
