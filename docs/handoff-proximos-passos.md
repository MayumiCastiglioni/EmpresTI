# Handoff — pendências para transformar o protótipo em produto

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
