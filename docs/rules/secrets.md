---
description: Onde cada variável de ambiente vive e qual chave usar
globs: ["**/.env*", "app/**", "src/**", "prisma/**", "next.config.*"]
alwaysApply: false
---

# Variáveis de ambiente e chaves

> Leitor: agente

## Quando

Ao criar ou usar qualquer variável de ambiente, ao instanciar o cliente do
banco, ou ao escrever código que lê configuração.

## Chaves previstas

As variáveis usadas pelo projeto devem estar documentadas em `.env.example`,
sem valores reais:

- `NEXT_PUBLIC_SUPABASE_URL`: pública; pode ser usada pelo cliente e pelo
  servidor.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chave pública publicável usada pelo código; pode ser usada pelo
  cliente. A proteção dos dados depende da autenticação e das políticas de
  acesso do banco.
- `NEXT_PUBLIC_APP_URL`: URL pública prevista em `.env.example`; ainda não é
  consumida pelo código da aplicação.
- `SUPABASE_SERVICE_ROLE_KEY`: privada; somente no servidor. Bypassa as
  políticas do banco e nunca pode aparecer em componente de cliente ou em
  variável com prefixo `NEXT_PUBLIC_`.
- `DATABASE_URL`: privada; conexão de runtime do Prisma. Somente no servidor.
- `DIRECT_URL`: privada; prevista em `.env.example`, mas ainda não lida por
  `prisma.config.ts`. A CLI Prisma atual usa `DATABASE_URL`; não suponha que
  preencher `DIRECT_URL` altera o destino das migrations.

Somente `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
e `DATABASE_URL` são consumidas pelo código/configuração atual. Não adicionar
Sentry ou variáveis de outra integração sem decisão arquitetural e autorização.

## Procedimento

1. Antes de criar uma variável nova, verifique se uma variável existente já
   atende ao caso. Não crie nomes alternativos para a mesma configuração.
2. Uma variável nova deve existir nos três lugares apropriados, sem valor
   versionado: `.env.local` na máquina local, `.env.example` no repositório e
   painel da Vercel nos ambientes necessários, como Preview e Production.
3. Ao criar uma variável, informe na resposta em quais lugares ela foi
   configurada e o que ainda precisa ser feito manualmente.
4. Use `NEXT_PUBLIC_` somente para valores que possam ser lidos pelo
   navegador. Nunca use esse prefixo para segredo, token, senha ou conexão de
   banco.
5. Leia variáveis privadas apenas em código de servidor, configuração de
   build ou ferramentas de CI autorizadas.
6. Mantenha o `.env.example` completo, atualizado e sem valores reais.

## Verificação

- Uma busca por `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` ou `DIRECT_URL`
  no código que roda no navegador não retorna ocorrências.
- `.env.example` contém todas as variáveis usadas pelo projeto e nenhum valor
  real.
- `.env.local` não é versionado.
- O build não depende de uma variável que esteja ausente do `.env.example`.

## Não faça

- Não escreva valor de chave, senha, token ou segredo em resposta, commit,
  log, comentário ou arquivo versionado.
- Não crie uma variável apenas no `.env.local`. Isso quebra outros ambientes e
  pode fazer o erro aparecer somente no build da Vercel.
- Não altere o painel da Vercel nem o projeto Supabase remoto sem autorização
  explícita.
- Não use a `SUPABASE_SERVICE_ROLE_KEY` para contornar uma policy de acesso.
  Se a policy atrapalhar o fluxo correto, pare e informe o conflito.
- Não coloque `DATABASE_URL`, `DIRECT_URL` ou qualquer chave privada em código
  de cliente.
- Não comite `.env`, `.env.local` ou arquivos com valores reais.
