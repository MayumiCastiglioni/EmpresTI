# EmpresTI

Sistema interno de empréstimo de equipamentos. Objetivo e escopo: [PRD](docs/PRD.md).

## Estado atual

Existem `/login`, `/cadastro` e `/catalogo`. Login/cadastro usam Supabase Auth
por tRPC, com sessão em cookies httpOnly e saída. Páginas internas exigem sessão.
Equipamentos, solicitações e devoluções ainda usam demonstração em memória.
Schema Prisma e duas migrations com RLS/triggers existem, mas não comprovam
integração dos empréstimos com a interface nem autorização por tenant/papel.

| Área | Arquitetura aprovada | Implementação observada |
|---|---|---|
| Aplicação | Next.js App Router e TypeScript strict | Configurados; build com geração Prisma passou em 05/11/2026 |
| API/autorização | tRPC e middlewares de sessão, tenant e administração | tRPC de autenticação implementado; tenant/papéis pendentes |
| Dados | PostgreSQL/Supabase via Prisma | Schema/migrations existentes; health consulta Postgres local via Prisma; inventário em memória |
| Login | Supabase Auth com @supabase/ssr | Login, cadastro, sessão httpOnly, proteção e logout testados localmente |
| Interface | Tailwind, shadcn/ui e Nocturne | Tailwind importado, tokens e CSS próprio; shadcn/ui pendente |
| Testes | Vitest, Testing Library, Postgres real, createCaller e Playwright | 50 testes em 9 arquivos passaram em 06/11; health HTTP e diagnóstico no navegador conferidos; Auth tem evidência histórica de 26/10; isolamento pendente |

## Fontes e continuidade

- [AGENTS.md](AGENTS.md): contexto e ponteiros para regras.
- [ADRs oficiais](docs/adr/001-stack.md): decisões vigentes; a árvore paralela
  `docs/arquitetura/decisoes/` exige reconciliação pelo time e não autoriza bibliotecas adicionais.
- [Spec](docs/specs/mvp.md), [plano](docs/plans/mvp.md) e [tarefas](docs/tasks/mvp.md).
- [Login e cadastro](docs/specs/001-login/spec.md): decisão do usuário permitindo cadastro público e aceite da autenticação.
- [Restrições](docs/rules/restrictions.md) e [checks](docs/rules/checks.md).
- [Alinhamento com as aulas](docs/alinhamento-aulas.md): conflitos e decisões pendentes.
- [Handoff](docs/handoff-proximos-passos.md): estado temporário da sessão.

## Desenvolvimento local

O projeto usa npm e package-lock.json. Em instalação limpa, use `npm ci`.
Copie `.env.example` para `.env.local` somente se o arquivo local não existir;
nunca sobrescreva credenciais existentes. Use serviços locais nos testes.

```sh
npm run db:generate
npm run dev
npm test
npm run lint
npm run build
```

A saída do Next.js fica em `build/`, configurada por `distDir`; `npm run start`
usa essa mesma saída. As pastas antigas `.next` e `.next-validation` foram
preservadas e excluídas da checagem TypeScript. A troca contorna o erro EPERM
observado ao limpar a árvore `.next` sincronizada pelo OneDrive; não altera
telas ou regras de negócio. Validação: [COR-02](docs/validacao-cor02-build.md).

### Testar autenticação local

O Supabase local precisa estar iniciado e `.env.local` apontar para ele.
Execute `npm run dev -- --port 3100 --hostname 127.0.0.1` e, em outro terminal,
`npm run test:auth-local`. O teste recusa Supabase remoto, usa conta temporária
com senha aleatória e a remove ao terminar. Não imprime cookies ou credenciais.

As três contas solicitadas pelo usuário foram criadas no Auth local. As senhas
não ficam no repositório. Configuração remota anterior foi preservada em
`.env.before-login.local` (ignorado); não trocar para ela ao executar testes.
Cadastro público foi autorizado pelo usuário nesta sessão, substituindo para
esta entrega a proibição do ADR-001; a divergência está registrada na spec.
Confirmação por e-mail segue a configuração do Supabase; localmente está dispensada.

Supabase local: configuração em `supabase/config.toml`; iniciar com
`supabase start` quando CLI/Docker estiverem disponíveis. As migrations da
aplicação ficam em `prisma/migrations/`, sob responsabilidade do Prisma,
conforme [migration.md](docs/rules/migration.md). Iniciar Supabase não aplica
essas migrations por si só. Não há docker-compose.yml neste projeto.

## Verificação de saúde local

GET `/health` consulta somente `SELECT 1` via Prisma e retorna 200/up ou
503/down, sem detalhes de conexão e com cache desabilitado. Essa rota exata
não exige sessão; catálogo e caminhos semelhantes continuam protegidos.
Nesta etapa o cliente recusa DATABASE_URL remota: a prova é de infraestrutura
local, não liberação de conexão em produção. `npm run build` gera o cliente
Prisma automaticamente; `npm run db:generate` prepara uma instalação para testes.

Validação de 05/11: Postgres local respondeu 200; um processo separado com
destino local indisponível respondeu 503. Nenhum schema, migration ou dado de
produto foi alterado. A página `/diagnostico` foi implementada e validada em
06/11 com carregamento, sucesso, falha e nova consulta. Demonstração MCP pendente.
Planos: [mínimo](docs/plan-andar-zero.md) e
[continuidade](docs/plans/continuacao-posterior.md).

Para repetir a integração de saúde, mantenha o Postgres/Supabase local iniciado
e `.env.local` com DATABASE_URL e NEXT_PUBLIC_SUPABASE_URL locais. Execute:

```sh
npm run build
npm run test:health-local
```

O teste inicia e encerra suas próprias aplicações em portas temporárias,
consulta a conexão real sem gravar dados, confere a proteção do catálogo e
simula uma conexão sem resposta usando credenciais fictícias em processo
isolado. Não muda `.env.local`, não cria contas e não para o banco existente.
Resultados: [validação MIN-02](docs/validacao-min02-health.md).
O comando também confere a entrega HTTP da página de diagnóstico e sua
exceção exata de acesso. Tela e estados: [MIN-03](docs/validacao-min03-diagnostico.md).

## Publicação

A rotina local não exige vincular projeto remoto. Deploy, migrations remotas
e push não fazem parte de um check. Consulte as restrições; configuração e
estado atual do deploy não foram verificados nesta revisão.
