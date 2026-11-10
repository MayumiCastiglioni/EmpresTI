# Handoff — 10/11/2026

Próximo roteiro: [plano de fechamento](plans/fechamento-entrega.md).

## Estado

EMP-T03/04/05 concluídas; EMP-T06/07 parciais. HTTP/Auth/cookies e Playwright local passaram; quatro migrations passaram em Postgres descartável. Evidências: `docs/validacao-emp-t03-auth.md`, `docs/validacao-emp-t05-t07.md`.
Commit `bc259e6` está em `codex/alinhamento-aulas`; Vercel Preview passou. O log de `main` (05/11) apontou `NEXT_NO_ROUTES_MANIFEST`: aquela versão usava `distDir: build`, mas a Vercel procurava `.next`. O commit atual usa o diretório padrão; `main`/produção não foram atualizadas.

## Checks

`npm test` 81/81; loans Postgres 8/8; HTTP e Playwright 1/1 cada; lint, TypeScript e build passaram após Next.js 16.4.6/Prisma 7.10.1.
Auditoria npm de produção: zero vulnerabilidades; sete moderadas restantes em ferramentas de dev.

## Pendências

EMP-T07: telas/foco/viewports aprovados em 10/11; faltam fotos reais e créditos. EMP-T08/PRA-02: revisão independente, isolamento e carregamento nativo.
PRA-03/04/05: fotos, Storage e conta do professor; produção exige execução humana. Operações: acesso futuro pendente.
Produção: migration remota precisa de revisão e execução pela pessoa responsável; nenhuma escrita remota foi feita pelo agente.

## Próxima ação

Seguir o plano de fechamento a partir do verificador independente e concluir fotos reais; manter a produção bloqueada até revisão humana das migrations e dados.
