# AGENTS.md

## Visão geral
Este projeto é um sistema web interno para controle de empréstimo de equipamentos. O objetivo principal é substituir a planilha compartilhada por um fluxo de solicitação, acompanhamento, devolução e gestão de itens em uso.

## Contexto e regras de negócio
O comportamento principal do produto está definido em [docs/PRD.md](docs/PRD.md) e deve ser respeitado em qualquer alteração.

- Cada colaborador pode ter no máximo 5 itens emprestados ao mesmo tempo (decisão do usuário em 06/11/2026, registrada no PRD).
- O prazo padrão de devolução é de 14 dias úteis, de segunda a sexta, excluindo feriados nacionais fixos do Brasil e o dia da solicitação; vencimento às 23h59min59s do 14º dia útil no fuso America/Sao_Paulo, com calendário de 2026 a 2030 antes da liberação.
- Quem estiver em atraso não pode solicitar novo empréstimo.
- Equipamentos em manutenção não aparecem como disponíveis.
- O fluxo inicial inclui login, catálogo, solicitação, devolução e painel de operações.
- O projeto não deve adicionar funcionalidades fora do escopo da primeira versão sem validação do time.

## Fontes de verdade

Cada artefato tem uma responsabilidade. Em caso de divergência, não escolha
sozinho: registre o conflito e peça uma decisão.

| Assunto | Fonte de verdade |
|---|---|
| Problema, pessoas usuárias e escopo do produto | `docs/PRD.md` |
| Decisões de arquitetura e tecnologias permitidas | `docs/adr/` |
| Regras operacionais e restrições para mudanças | `docs/rules/` |
| Comportamento e aceite de uma funcionalidade | sua spec em `docs/specs/` |
| Ordem de execução | plano e tasks correspondentes |
| Estado temporário de uma sessão e tentativas que falharam | `docs/handoff-proximos-passos.md` |

O handoff não substitui PRD, ADR ou spec; ele serve para retomar o trabalho sem
repetir tentativas e sem transformar suposições em decisão de produto.

## Leitura operacional

- Limites de autoridade: [restrictions](docs/rules/restrictions.md).
- Validação por tarefa: [checks](docs/rules/checks.md) e [testes](docs/rules/tests.md).
- Mudanças de dados: [migration](docs/rules/migration.md) e [secrets](docs/rules/secrets.md).
- Ciclo de funcionalidade: [specflow](docs/rules/specflow.md).
- Registro obrigatório de decisões e revisão do enunciado: [decisions](docs/rules/decisions.md).
- Fechamento e retomada: [handoff](docs/rules/handoff.md).
- Conflitos atuais e decisões pendentes: [alinhamento com as aulas](docs/alinhamento-aulas.md).
- Skills do projeto: `skills/<nome>/SKILL.md`; consulte a descrição antes de usar.

Arquivos Markdown em `docs/rules/` são procedimentos referenciados aqui;
frontmatter não comprova carregamento automático pelo ambiente do agente.

## Registro de decisões para a entrega

Toda decisão relevante deve ser registrada na mesma tarefa em
[decisões da prática](docs/produto/decisoes-pratica.md), refletida na fonte
competente e resumida no [ENTREGA.md](ENTREGA.md), com data, origem, responsável,
alternativas, motivo informado e estado real de implementação/validação.
Conversa e handoff não substituem esse registro. Preservar decisões substituídas
como histórico, sem deixar resumos atuais desatualizados. Seguir
[procedimento obrigatório](docs/rules/decisions.md), sem registrar segredos.
Antes das tarefas e da entrega final, revisar o
[checklist do enunciado](docs/checklist-enunciado.md); conflitos e pendências
não podem ser omitidos ou tratados como requisitos cumpridos.

## Skills e conexões externas

- Uma skill ensina um procedimento reutilizável; não deve repetir restrições de
  segurança ou regras de negócio já documentadas.
- Use uma skill apenas quando a tarefa a pedir ou quando sua descrição for
  diretamente aplicável.
- Antes de habilitar uma conexão externa (MCP, banco, deploy ou serviço),
  verifique quais permissões ela concede e mantenha as restrições de
  `docs/rules/restrictions.md`.

## Stack esperada
Com base em [docs/adr/001-stack.md](docs/adr/001-stack.md):

- Backend: Next.js (App Router)
- Frontend: Next.js (App Router), Client Components, Tailwind CSS e shadcn/ui
- Banco de dados: PostgreSQL, com Supabase como ambiente de dados e autenticação
- Autenticação: Supabase Auth com e-mail e senha, usando `@supabase/ssr` e cookie `httpOnly`
- API: tRPC
- ORM: Prisma
- Testes: Vitest, Testing Library, Testcontainers com Postgres real, `createCaller` do tRPC e Playwright
- Autorização: middlewares do tRPC (`protectedProcedure`, `tenantProcedure`, `adminProcedure`) e RLS em profundidade

## Estrutura do repositório
- docs/: documentação, PRD e ADRs
- src/: código principal da aplicação
- app/ ou páginas do Next.js: frontend e rotas da aplicação
- server/ ou modules/ (quando existir): lógicas de servidor, tRPC e serviços
- prisma/: schema e migrations do Prisma
- tests/: testes automatizados
- .env.example: variáveis de ambiente de exemplo

## Como rodar o projeto localmente
Se `.env.local` ainda não existir, copie o exemplo e ajuste apenas valores locais.
Não sobrescreva arquivos de ambiente existentes:

```bash
cp .env.example .env.local
```

### 1) Subir o banco local
Se o ambiente local seguir o padrão do Supabase:

```bash
supabase start
```

O repositório não possui Docker Compose. Iniciar Supabase não aplica as
migrations Prisma; siga `docs/rules/migration.md` para alterações de schema.

### 2) Rodar o projeto
```bash
npm install
npm run dev
```

Se o projeto usar pnpm ou yarn conforme a configuração final do repositório, usar o gerenciador correto que estiver definido no package.json.

### 3) Rodar os testes
```bash
npm run test
```

Ou, se o projeto usar a convenção de testes do Vitest:

```bash
npx vitest
```

### 4) Buildar o projeto
```bash
npm run build
```

## Convenções para agentes e modificações
- Respeitar rigorosamente as regras de negócio documentadas no PRD.
- Não inventar regras de negócio novas sem confirmação do time.
- Priorizar segurança, autenticação e autorização antes de qualquer ajuste funcional.
- Manter a tipagem estrita do TypeScript e evitar `any` sem justificativa.
- Cobrir mudanças relevantes com testes.
- Não expor segredos em código, logs, commits ou arquivos versionados.
- Não executar ações de git sem autorização explícita do usuário.

## Subagentes
- Ficam em agents/<nome>.md. O frontmatter diz quando delegar; o
  corpo é a instrução completa do subagente.
- Subagente não herda esta conversa: ao delegar, passe tudo que o
  arquivo dele pede como entrada.
- Se o harness não tiver subagentes, abra uma sessão nova e comece
  com: "Aja conforme agents/<nome>.md." e as entradas pedidas.

## Política de Git
- Não fazer `git commit`.
- Não fazer `git push`.
- Não criar branches, merge, tag ou push em nome do usuário sem autorização explícita.
- Qualquer operação de versionamento Git é responsabilidade exclusiva do usuário.

## Validação antes de concluir
Qualquer alteração deve ser validada com pelo menos:

1. execução local relevante;
2. testes afetados;
3. build quando houver mudança estrutural ou de runtime;
4. checagem de que a regra de negócio continua correta.

## Observações finais
Este arquivo serve como guia operacional para agentes e colaboração no projeto. O foco deve sempre ser manter o código alinhado ao PRD, à stack acordada em [docs/adr/001-stack.md](docs/adr/001-stack.md) e às boas práticas de segurança e qualidade.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
