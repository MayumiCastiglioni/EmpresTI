# MIN-02 — prova automatizada de saúde e proteção

Data: 05/11/2026. Plano: [andar zero](plan-andar-zero.md).
Implementação: tests/health-local.integration.mjs; comando npm run test:health-local.

## Procedimento e limites

Após npm run build, o comando exige DATABASE_URL e NEXT_PUBLIC_SUPABASE_URL
locais em .env.local. Inicia Next compilado em porta temporária e valida
/health contra o Postgres local existente. Não instala serviços, cria contas,
aplica migrations, altera ambiente ou consulta tabelas do produto.

Uma segunda aplicação recebe DATABASE_URL fictícia, somente no seu processo,
apontando para um servidor TCP local de teste que não responde ao protocolo
Postgres. Assim, o caso exercita timeout real do driver sem desligar o banco
de trabalho. Processos, servidor TCP e sockets próprios são encerrados ao fim.
O teste não usa respostas mockadas; simula a indisponibilidade de rede local.

## Resultados

| Verificação | Resultado |
|---|---|
| AZ-02/04: conexão real, sem sessão | Passou: 200, corpo ok/up e Cache-Control no-store |
| AZ-04/LOGIN-03: /catalogo, /health-extra e /health/private anônimos | Passou: 307 para /login |
| AZ-02/04: servidor sem resposta | Passou: 503, corpo error/down e no-store, dentro do limite de 7 segundos da asserção |
| npm run test:health-local | Passou: três cenários; quatro testes reportados pelo Node incluindo o agrupador |
| npm test | Passou: 38 testes em 8 arquivos |
| npm run lint | Passou, código zero |
| npm run build | Passou, código zero, geração Prisma e TypeScript incluídos |
| Processos Next temporários após execução | Nenhum encontrado |

Não comprova RLS, isolamento entre pessoas/tenants, persistência de empréstimos,
autenticação real, migrations do zero ou deploy. O teste usa o banco local já
existente; a reconstrução limpa continua em MIN-05. Falha da Vercel no PR #1
permanece sem causa confirmada por falta de acesso ao log privado.
