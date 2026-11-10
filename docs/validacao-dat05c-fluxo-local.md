# DAT-05C — fluxo local integrado

[Spec](specs/dados-iniciais.md). Código src/server/initial-data/run-local.ts.
Operação interna de desenvolvimento, sem rota HTTP, CLI ou upload.

## Ordem e garantias locais

Recusa destinos remotos; copia metadados/revisão; valida todos os 12 PNGs antes
de abrir conexão. Usa nomes fixos TI-0001.png a TI-0012.png no diretório informado;
resolve caminho real e recusa arquivo que escape por link simbólico. Confere
assinatura via decoder, decodificação completa, 800 x 600 e SHA-256. Revisão exige
responsável, estado aprovado e data válida. Isso confere o registro humano,
não detecta automaticamente pessoas/logos/texto nem prova origem pela API.

Em transação única, trava as quatro tabelas, relê/valida organização e lote,
consulta identidade no Auth local, confere confirmação, zero empréstimos e papel,
revalida arquivos, e só então cria organização/vínculo ausentes e equipamentos.
Não chama o módulo de provisionamento em outra transação dentro da trava.
Todos os writes Postgres desse fluxo ficam na mesma transação. Auth só é lido.
Não há transação distribuída com Auth/arquivos e não se promete impedir alteração
externa do arquivo após o último check ou exclusão administrativa de usuário.

## Evidência observada

npm run test:initial-data-local passou 3/3 integrações. Novo cenário cria
arquivos sintéticos temporários, conta aleatória local e organização fixture.
Revisão ausente, e-mail não confirmado e identidade divergente bloqueiam sem
criar organização. Duas cargas simultâneas criam um único lote; terceira execução
preserva IDs/timestamps. Um vínculo COLABORADOR, zero empréstimos; divergência
e arquivo corrompido bloqueiam preservando dados. Remotos recusados.
Limpeza remove apenas próprios fixtures e diretório temporário. Professor e
banco de trabalho não foram usados. Não injetou falha no meio dos INSERTs;
este cenário ainda precisa de prova específica de rollback parcial em DAT-07.

## Limites de aceite

local-loaded significa persistência de fixtures/arquivos locais válidos.
Não confere objeto público do Storage, não faz upload, não prova fotos reais
Pexels ou cadastro/entrega de e-mail do professor. Conta existente precisa ser
criada/confirmada pelo fluxo normal antes de entrar aqui. Não liberar entrega
nem marcar DADOS-04/05 completos com base em fixtures sintéticas.
Sem mudanças de schema ou permissões novas. Checks: 3 integrações locais,
59 testes gerais, lint e build passaram, todos com saída zero.

Atualização: [DAT-07A](validacao-dat07a-rollback.md) provou rollback após
oito INSERTs confirmados e queda real da conexão, sem mudança de schema.

Revalidação em 06/11/2026: `npm run test:initial-data-local` passou 3/3,
com Auth/Postgres locais e identidades/arquivos sintéticos. A limpeza própria
das fixtures foi executada pelo teste; não houve escrita remota ou uso da conta
do professor.
