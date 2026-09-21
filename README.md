# Emprest

Sistema de controle de **empréstimo de equipamentos**: registra quem está com qual item e permite que as equipes de Colaboradores e Operações acompanhem solicitações e devoluções.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) — TypeScript `strict` |
| API | tRPC (Route Handler em `app/api/trpc/[trpc]/route.ts`) |
| Banco de dados | Supabase (Postgres + Auth + RLS) via Prisma |
| Estado de servidor | TanStack Query (`@trpc/react-query`) |
| Estilização | Tailwind CSS + shadcn/ui |
| Deploy | Vercel |

> Decisões detalhadas em [docs/adr/001-stack.md](docs/adr/001-stack.md).

## Estrutura

```
docs/          — PRD, decisões de arquitetura (ADR) e perguntas em aberto
supabase/      — configuração local do Supabase (config.toml, migrações)
.env.example   — modelo de variáveis de ambiente (copie para .env.local)
```

## Configuração inicial

1. Instale as dependências com `npm install` (quando o código da aplicação existir).
2. Copie `.env.example` para `.env.local` e preencha as chaves do Supabase.
3. Conecte a CLI ao projeto remoto: `supabase link --project-ref <REF>`.

## Deploy

O repositório está conectado à **Vercel** via GitHub (`MayumiCastiglioni/EmpresTI`). Cada `git push` na `main` dispara um deploy automático.
