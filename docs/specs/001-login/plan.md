# Plano — 001 Login

Implementação solicitada pelo usuário após plano geral aprovado.
Restrições: ADR-001 (Supabase Auth, SSR/httpOnly, tRPC) e rules/secrets.

1. Instalar somente os pacotes tRPC já previstos na arquitetura.
2. Criar contexto/roteador de autenticação e adapter Next; sessão apenas no servidor.
3. Conectar formulário, mensagens de erro, proteção no proxy e saída.
4. Testar procedures, cookies, rotas e formulário; build/lint; teste real local.
5. Criar primeira conta de teste local sem persistir a senha no repositório.
6. Verificação independente e atualização de handoff. Cadastro público autorizado
   explicitamente pelo usuário; implementar /cadastro com confirmação quando exigida.
