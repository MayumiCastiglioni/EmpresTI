# Handoff - 11/11/2026

Tarefa atual: corrigir catálogo publicado indisponível após login.
Causa confirmada no código local: src/server/db.ts recusava todo Postgres remoto, mesmo em produção.
DEC-RUNTIME-SUPABASE registra correção local: Supabase direto/pooler somente em NODE_ENV=production.
Teste/dev continuam loopback; protocolo e override host/hostaddr recusados; RLS/membership preservados.
Configuração pura passou 15/15; TypeScript teve erro de literal no teste, corrigido com as const.
Suíte completa 94/94, configuração 15/15, lint e TypeScript passaram; ver docs/verificacao/runtime-supabase.md.
Build padrão falhou EPERM ao remover .next/build/chunks no OneDrive, antes de compilar.
Nenhum deploy, Git, migration ou acesso remoto executado nesta correção.
Versão exata de produção não inspecionada; não afirmar causa única nem catálogo funcional.
Após publicar: conferir DATABASE_URL privado, migrations e membership COLABORADOR/empresti.
Não usar conta professor para mutação; login/zero empréstimos reais permanecem pendentes.
Fotos: DEC-35 registra aceite visual das 12 em .cache/imagens/manifesto-candidatos.json.
Há 12 arquivos/patrimônios presentes; ressalvas técnicas/fontes/Storage permanecem separadas.
Rodada anterior: suite 85/85, componente 7/7, lint/TypeScript passaram; são históricos após esta correção.
EMP-R2/DADOS-R3 continuam NÃO PRONTA; EMP-R2A confirmou refresh DEC-24 estaticamente.
Postgres local antes bloqueado: EACCES 127.0.0.1:54322; não contornar com destino remoto.
ENTREGA/checklist/decisões atualizados; publicação/tag e aceite completo continuam pendentes.
Próxima ação: concluir checks atuais; publicar somente versão revisada e conferir catálogo autenticado.
