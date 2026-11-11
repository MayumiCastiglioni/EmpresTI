# MIN-03 — página de diagnóstico

Data: 06/11/2026. Critério: AZ-05 do [andar zero](andar-zero.md).
Plano: [fila mínima](plan-andar-zero.md). Página: /diagnostico.
Skill aplicada: skills/nocturne-interface/SKILL.md, com tokens existentes,
estilos encapsulados e mensagens que não dependem apenas de cor.

## Comportamento entregue

A página consulta GET /health com cache desabilitado. Mostra carregamento,
conexão disponível apenas para status 200 e corpo ok/up, ou falha segura.
Permite nova consulta, bloqueia o botão durante o envio e cancela a requisição
ao sair da tela. Timeout de interface em oito segundos evita espera infinita.
Nenhum detalhe interno, dado de usuário ou conexão é exibido.

Somente /diagnostico exato foi adicionado às exceções de sessão, ao lado de
/health. O catálogo e caminhos semelhantes continuam protegidos. Não houve
alteração no catálogo, login, CSS global, schema, migration ou regra de negócio.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| npm test | Passou: 50 testes em 9 arquivos |
| npm run lint | Passou, código zero |
| npm run build | Passou, código zero; /diagnostico gerada e TypeScript conferido |
| npm run test:health-local | Passou: quatro cenários e agrupador (cinco testes Node) |
| Testes de componente AZ-05 | Carregamento, sucesso, 503, corpo incompatível, JSON inválido, erro de rede, recuperação, cancelamento e timeout aprovados |
| Navegador, desktop 1280 x 720 | Conexão real disponível e botão de nova consulta conferidos |
| Navegador, 390 x 844 | Conteúdo legível; largura do documento e viewport iguais a 390, sem rolagem horizontal |
| Teclado | Enter aciona nova consulta; Tab alcança link de retorno com foco visível |
| Navegador com banco indisponível | Aplicação separada com URL local fictícia mostrou mensagem de falha e botão habilitado |

Na primeira execução da suíte, um worker de login excedeu o tempo de
inicialização durante execução concorrente com build e serviços locais: 44
testes passaram, mas a execução teve código 1 e não foi aceita. Após o build,
a suíte foi repetida sem alterar configuração Vitest e passou integralmente.

## Limites

Aplicações temporárias de validação foram encerradas; banco existente
preservado. Nenhuma conta, dado de produto, variável de ambiente ou dependência
alterada. Não houve commit, push ou deploy nesta tarefa.
Esta prova não resolve permissões de Operações, RLS, migrations do zero ou
falha da Vercel. Próxima tarefa: MIN-04, comando de subida local.
