# DAT-08A — verificação pública e roteiro humano

Utilitário: skills/imagens-equipamentos/scripts/verificar-storage.mjs.
Teste: verificar-storage.test.mjs na mesma pasta.
[Roteiro](roteiro-humano-dados-iniciais.md), [spec](specs/dados-iniciais.md).

Implementado GET público para 12 chaves do contrato, sem cookie/chave/autorização,
sem redirect e com limite técnico de tempo/tamanho. Confere decodificação PNG,
800 x 600 e hash; relatório só apresenta patrimônio/campo e contagem, sem URLs
com credencial ou conteúdo de resposta. Aceita origem Supabase padrão HTTPS e
loopback para teste; não lê .env ou cria variável nova. Domínios personalizados
não suportados nesta versão. Manifesto inválido falha antes de rede.

Teste contra servidor HTTP efêmero 127.0.0.1 passou: 12 objetos válidos aceitos;
404, bytes corrompidos, imagem de hash diferente, dimensões erradas, redirect e
timeout bloqueados. Cabeçalhos sem Authorization/Cookie e método GET conferidos.
Não foi executado contra Storage real, local ou produção; não aprova DADOS-04.
Roteiro parcial descreve upload humano sem sobrescrita, conferência e limites;
não fornece carga remota inexistente nem contorna a guarda local da aplicação.

Checks atuais: teste Node passou; suíte geral 59/59 em 10 arquivos e lint passaram.
Build não repetido: scripts da skill e documentação, sem runtime da aplicação alterado.
Não repetidas integrações de banco/Auth por não haver alteração nesses módulos.
Sem env, banco, conta, bucket, Storage, Git ou deploy alterados nesta tarefa.

Revalidação em 06/11/2026: `node --test skills/imagens-equipamentos/scripts/verificar-storage.test.mjs`
passou 1/1 com servidor HTTP local efêmero. Nenhuma URL Supabase/Storage real
foi consultada.
