# Handoff — Supabase, Prisma e regras de empréstimo

## Atualização de 2 de outubro de 2026

O commit desta etapa foi criado pelo responsável do projeto. As alterações foram feitas e validadas no repositório local `EmpresTI`; nenhuma alteração foi enviada ao banco Supabase em nuvem.

### Implementado

- Clientes Supabase para navegador e servidor, renovação de sessão por cookies em `utils/supabase/` e integração de borda em `proxy.ts`.
- Variáveis públicas configuradas em `.env.local` (ignorado pelo Git) e `.env.example` atualizado para a chave publicável.
- Dependências e scripts para Next.js, React, TypeScript, ESLint, Prisma e Supabase adicionados ao projeto.
- Modelo Prisma para organizações, vínculos de usuários, equipamentos, empréstimos e auditoria em `prisma/schema.prisma`.
- Configuração Prisma 7 em `prisma.config.ts` e duas migrações aplicadas ao Supabase local:
  - `20261002120101_init_inventory`: tipos, tabelas, índices e chaves estrangeiras.
  - `20261002120200_enforce_inventory_rules`: RLS, permissões e regras de consistência.

### Regras protegidas no banco local

- Isolamento de dados por organização e permissões para membro, Operações e Administrador.
- Um equipamento não pode ter dois empréstimos ativos.
- A solicitação reserva o equipamento imediatamente.
- Limite de três empréstimos ativos por pessoa e bloqueio de novas solicitações em caso de atraso.
- Fluxo permitido: `SOLICITADO → RETIRADO → DEVOLVIDO` ou `SOLICITADO → CANCELADO`.
- Devolução danificada ou incompleta transfere automaticamente o item para `MANUTENCAO`.

### Validações executadas

- `npx prisma validate`
- `npx prisma migrate status` — duas migrações aplicadas e banco local sincronizado.
- `npx prisma generate`
- `npx tsc --noEmit`
- ESLint direcionado aos arquivos alterados, sem erros.

O build do Next.js alcançou a compilação sem diagnóstico de código. O empacotamento não devolveu um status final no ambiente sincronizado pelo OneDrive; repeti-lo em CI ou fora dessa pasta é recomendado.

### Próximos passos

1. Ligar o projeto local ao Supabase remoto, obter uma `DATABASE_URL` direta e aplicar as migrações revisadas ao ambiente em nuvem.
2. Implementar login e o fluxo seguro de criação inicial de tenant/membership; as políticas RLS assumem que esses registros já existem.
3. Substituir os dados de demonstração de `app/page.tsx` por consultas e mutações persistidas.
4. Criar testes de integração para RLS, limite de empréstimos, atraso, concorrência, devolução e manutenção.
5. Implementar o serviço que grava ações em `audit_logs` e revisar as vulnerabilidades transitivas indicadas pelo `npm audit`.

### Atenções

- Somente o Supabase local do Docker recebeu tabelas e políticas; o Supabase em nuvem não foi alterado.
- Não versionar `.env.local`, senhas, URLs privadas ou chaves de serviço.
- A interface continua sendo um protótipo com dados em memória até que a persistência seja conectada.

### Registro negativo e limites da sessão

- O build do Next.js chegou à compilação, mas não devolveu o encerramento do
  empacotamento dentro da pasta sincronizada pelo OneDrive. Não trate isso como
  build aprovado; repita o comando em CI ou fora do diretório sincronizado.
- As migrações foram testadas apenas contra o Supabase local. Não repetir o
  teste contra o projeto remoto sem autorização explícita e uma conexão direta
  de banco configurada.
- A conexão do Supabase no frontend não torna a interface persistente por si
  só: enquanto não existirem consultas e mutações no servidor, os dados de
  demonstração continuam sendo a única fonte usada pela tela.

---

# Registro anterior — contexto histórico

## O que foi resolvido localmente

- Corrigida a inconsistência do item `EQ-008`, que possuía empréstimo ativo e aparecia como disponível.
- A lista de equipamentos oferecida em uma nova solicitação agora exclui itens já envolvidos em solicitação ou empréstimo ativo.
- O resumo por categoria passou a ser calculado a partir dos itens exibidos, incluindo a categoria Tablets.
- A data do cabeçalho acompanha a data atual do navegador.
- O atalho `Ctrl/⌘ + K` coloca o foco na busca; o modal de solicitação abre com foco no botão de fechar e pode ser fechado com `Esc`.

Essas correções são somente da demonstração local. Elas não impedem concorrência entre navegadores nem persistem após recarregar a página.

## Decisões necessárias

1. **Ciclo do empréstimo:** uma solicitação reserva o item imediatamente ou só depois de aprovada? Definir os estados oficiais, por exemplo `solicitado`, `aprovado`, `retirado`, `devolvido`, `cancelado` e `em manutenção`.
2. **Devolução com problema:** item danificado ou incompleto vai automaticamente para manutenção? Quem pode liberá-lo novamente?
3. **Atraso:** deve ser calculado na consulta pela data prevista ou gravado por tarefa agendada? A primeira opção é suficiente para a primeira versão.
4. **Acesso:** quais papéis existem e o que cada um pode fazer? Sugestão inicial: colaborador solicita; operações aprova e devolve; administrador cadastra pessoas e equipamentos.
5. **Histórico e LGPD:** por quanto tempo empréstimos e dados de pessoas devem permanecer guardados?

## Integrações e acesso que exigem responsável

- Criar ou fornecer o projeto Supabase e preencher as credenciais em `.env.local`.
- Definir quem terá acesso ao painel do Supabase e à Vercel.
- Confirmar se o repositório continuará no GitHub e se o deploy automático na Vercel deve ser mantido.
- Informar um canal de aviso para atrasos (e-mail, Teams ou outro); nenhum deve ser integrado sem essa definição.

## Trabalho técnico restante

1. Criar schema e migrations para equipamentos, pessoas, empréstimos, usuários e auditoria.
2. Implementar autenticação no Supabase e autorização por papel.
3. Substituir dados locais por consultas e mutações no servidor, com validação e transação para impedir reserva dupla.
4. Criar telas de cadastro/edição de equipamentos e pessoas, histórico e registro de devolução com condição do item.
5. Implementar filtros reais, paginação, testes de regras de empréstimo e testes de interface.
6. Atualizar o README e o ADR para refletir a arquitetura efetivamente implementada, ou construir os módulos hoje documentados (tRPC, Prisma, TanStack Query e shadcn/ui).

## Critério para considerar a primeira versão pronta

Uma pessoa autenticada consegue solicitar um item disponível; Operações aprova, registra retirada e devolução; o mesmo item não pode estar em dois empréstimos ativos; atrasos são visíveis; e cada alteração fica registrada no histórico.
