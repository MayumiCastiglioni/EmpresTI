# Evidências EMP-T05 a EMP-T07 — 10/11/2026

## Implementação local

- `src/server/loans/service.ts` calcula vencimento com o calendário aprovado,
  serializa pedidos por colaborador, bloqueia o equipamento em uma transação,
  verifica limite/atraso/disponibilidade e cria `RETIRADO` com início imediato.
- `src/server/api/inventory.ts` expõe catálogo, empréstimos próprios e pedido
  via tRPC. A identidade e o tenant vêm do middleware; o input aceita somente
  `equipmentId`. Imagens só são expostas quando metadados Pexels são válidos.
- `/catalogo` agora usa dados do servidor, mostra estados de carregamento/erro/
  lista vazia, confirma a ação imediata e atualiza catálogo/empréstimos após sucesso.
  O login informa limite de cinco e prazo de 14 dias úteis.
- O fluxo não implementa Operações, aprovação intermediária, devolução ou
  reserva futura, em conformidade com a fatia atual aprovada.

## Integração com Postgres local

`npm run test:loans-local`: 1 arquivo, 8 testes passaram com fixtures sintéticas;
o teste exige `DATABASE_URL` de loopback e remove os tenants e dados de fixture.

Os cenários exercitam sessão/tenant e catálogo; RLS direto como `authenticated`
para provar tenant e borrower; empréstimos próprios; input que tentava forjar o
colaborador; início imediato, cálculo do vencimento e atualização
do equipamento; manutenção/ausência/reenvio; quinto e sexto empréstimos; bloqueio
por atraso; concorrência entre itens diferentes para a mesma pessoa; concorrência
entre pessoas pelo mesmo equipamento; e rollback após falha sintética depois do
trigger.

## Checks executados

- `npm test`: 13 arquivos, 81 testes passaram.
- `npm run test:loans-local`: 8 testes passaram.
- `npm run test:loans-http-local`: 1 teste passou; sessão Supabase Auth local via
  cookie, GET de catálogo/empréstimos próprios, POST persistido e identidade
  forjada recusada; conta e registros sintéticos removidos ao final.
- `npm run test:loans-browser-local`: 1 teste Playwright passou com Supabase,
  Postgres e usuário sintéticos locais.
- `npm run lint`: passou.
- `npx tsc --noEmit`: passou.
- Auditoria inicial após instalar Playwright encontrou 14 avisos, incluindo
  Next.js crítico e Prisma alto. `npm audit fix` aplicou correções compatíveis:
  Next.js 16.4.6 e Prisma 7.10.1. Agora `npm audit --omit=dev` reporta zero
  vulnerabilidades de produção; o `npm audit` completo ainda lista sete alertas
  moderados em dependências de desenvolvimento (`minimatch`/TypeScript ESLint).
  Testes, lint, tipos, geração Prisma, fluxo Playwright e build passaram após a
  atualização.
- `npm run build`: a primeira execução parou antes de compilar ao tentar remover
  um arquivo gerado com atributo de reparse point na pasta `build` do OneDrive.
  Repeti o build em um diretório temporário isolado; compilação, TypeScript e
  geração estática passaram. `next.config.ts` e `tsconfig.json` foram restaurados.

## Migrations limpas e tela local

As quatro migrations Prisma foram aplicadas, em ordem, num Postgres 17 descartável
vazio; `prisma migrate status` confirmou o schema atualizado. O container de
verificação foi encerrado e removido depois do teste. A página `/login` respondeu
200 no Next local nessa verificação inicial; a sessão autenticada e a revisão
visual foram feitas depois, conforme a seção EMP-T07.

## EMP-T07 — navegador autenticado, foco e viewport

O teste `tests/loans-browser-local.integration.mjs` cria uma conta temporária,
membership e equipamento disponível/manutenção; obtém a sessão via endpoint
local e configura os cookies HttpOnly no contexto Chromium. O formulário de login
não é automatizado. O fluxo navegou em `/catalogo`, mostrou somente os empréstimos
do usuário de teste, confirmou solicitação e verificou estado/persistência.

Com cinco empréstimos ativos sintéticos, a tentativa do sexto retornou a recusa
esperada e não criou empréstimo para o item disponível. Após remover essas
fixtures, a solicitação normal passou. O teste também confirmou a ausência de
ação para equipamento em manutenção, foco inicial no botão de confirmar, ciclo
Tab/Shift+Tab, fechamento por Escape com retorno de foco, viewport de 390 px sem
overflow horizontal e ausência de erros JavaScript. O estado de catálogo vazio
foi exercitado interceptando apenas a resposta local da consulta tRPC.

As três capturas preservadas mostram o catálogo desktop, diálogo de confirmação
e tela móvel após empréstimo: [catálogo desktop](verificacao/emp-t07/20261110/catalogo-desktop.png),
[confirmação desktop](verificacao/emp-t07/20261110/confirmacao-desktop.png) e
[catálogo móvel](verificacao/emp-t07/20261110/catalogo-mobile.png). Em 10/11/2026,
a usuária revisou e aprovou as telas autenticadas, o foco e os tamanhos de viewport.
Essa aprovação cobre a apresentação e navegação revisadas; não cobre fotos reais,
créditos, validação do papel no deployment ou aceite integral da spec.

## Limites e pendências

Os testes de procedures usam `createCaller` e verificam sessão/tenant com fixture;
a leitura também executa como `authenticated` em transação local. O endpoint HTTP
e cookies do Auth foram testados no ambiente local; não houve validação do papel
configurado no deployment.
Testing Library verifica componentes; o fluxo Playwright e a conferência humana
de telas, foco e viewports foram concluídos e aprovados conforme a seção EMP-T07.
Não há fotos Pexels reais no banco/bucket, então somente o fallback visual foi
revisado; aquisição e revisão das fotos permanecem pendentes.

EMP-T05 está concluída localmente. EMP-T06/07 são parciais; critérios de aceite
integrais e verificação independente continuam pendentes. Fotos reais e créditos
também estão pendentes; somente o fallback foi revisado. Sem banco remoto, Storage
remoto, publicação ou deploy.
