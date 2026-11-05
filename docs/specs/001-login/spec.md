# 001 — Login com Supabase Auth

Status: implementada e verificada localmente em 26/10/2026.
Evidências: [verification.md](verification.md).

Solicitação: autenticação funcional e contas de teste persistidas (26/10/2026).
Fontes: [PRD](../../PRD.md), [ADR-001](../../adr/001-stack.md) e
[MVP](../mvp.md) (CA-01/CA-09 parciais).

## Comportamento
- LOGIN-01: credenciais de conta existente são verificadas pelo Supabase Auth;
  senha incorreta e conta inexistente recebem a mesma mensagem, sem sessão.
- LOGIN-02: entrada válida cria cookie httpOnly, sameSite=lax e secure em produção;
  a resposta da API não expõe tokens; navegador segue ao catálogo.
- LOGIN-03: acesso anônimo às páginas internas redireciona ao login; erro do
  provedor não libera acesso. Usuário autenticado em /login segue ao catálogo.
- LOGIN-04: saída encerra sessão e volta ao login; página protegida não reabre sem sessão.
- LOGIN-05: formulário valida campos, informa falha e impede envios simultâneos.
- LOGIN-06: conta de teste é persistida em auth.users usando API administrativa
  somente no ambiente local; senha não é versionada nem registrada em logs.

## Limites e pendências
Decisão explícita do usuário em 26/10/2026: qualquer pessoa pode criar conta
pela tela de cadastro. Essa instrução substitui a proibição de cadastro aberto
do ADR-001 para esta entrega; o ADR foi preservado e requer reconciliação pelo time.
LOGIN-07: /cadastro persiste conta pelo Supabase Auth; se confirmação for exigida,
orienta confirmar e-mail sem liberar acesso; caso haja sessão, segue ao catálogo.
O usuário forneceu três contas de teste; senhas não constam nesta documentação.
Auth gerencia senha/hash: não criar tabela própria de senhas.
Tenant, memberships e permissões de Operações permanecem pendentes; login não
concede papel administrativo nem declara o CA-09 do MVP completamente atendido.
Sem mudança de schema Prisma ou banco remoto. Catálogo continua demonstrativo.

Plano: [plan.md](plan.md). Tarefas: [tasks.md](tasks.md).
