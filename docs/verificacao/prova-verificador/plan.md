# Plano da prova

Spec: [spec.md](spec.md). Tarefas: [tasks.md](tasks.md).
Aplicar o verificador existente a fixture isolada, sem alterar testes reais.

1. Principal confere baseline e hashes dos dois arquivos.
2. Principal planta retorno "erro" na implementação; o teste fica intacto.
3. Verificador com contexto limpo executa apenas o check permitido e devolve
   tabela da rodada FALHA, sem corrigir o problema e sem receber seu diagnóstico.
4. Principal confirma que a implementação continua com o erro e teste intacto.
5. Principal restaura "ok"; nova rodada RESTAURADA com contexto limpo.
6. Registrar saídas reais, hashes e limites; não inventar commits ou isolamento.

O enunciado pede dois commits para documentar erro/restauração. Após autorização
explícita da usuária em 06/11/2026, foram criados localmente 12aa161 (erro) e
d8bdcbb (restauração), limitados aos arquivos da fixture. Não houve push.
Hashes não substituem o isolamento técnico; permissões amplas não são somente leitura.

## Atualização de execução — 10/11/2026

R4 completou a prova sob uma sessão Codex isolada: descoberta nativa do agente
registrado em .codex/config.toml, erro/restauração já documentados em R1/R2,
nenhuma autocorreção e check final aprovado. No MXC, escrita no projeto,
acesso ao perfil e a .env* foram negados (EPERM); a conexão TCP foi negada
(EACCES). O perfil restringiu a leitura ao repositório, negou o restante do
perfil, desligou a rede e usou ambiente core com variáveis de segredo filtradas.

Como o shell interno iniciou em C:\ e não podia atravessar a pasta pessoal,
o agente executou o mesmo check Node com WorkingDirectory no repositório e
NODE_OPTIONS=--preserve-symlinks --preserve-symlinks-main. Os argumentos do
teste permaneceram --test tests/fixtures/verificador-spec/status.test.mjs;
1 teste passou. Não houve alteração na fixture nem operação Git nesta rodada.
