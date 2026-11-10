# Spec funcional — EmpresTI v1

**Status:** proposta para implementação  
**Fontes:** [PRD](../PRD.md), [layout](../layout.md), [ADR-001](../adr/001-stack.md)

## Objetivo

Substituir a planilha compartilhada por um fluxo interno em que colaboradores consultam equipamentos, registram empréstimos e devoluções, e Operações acompanha os empréstimos em aberto.

## Usuários e escopo

- **Colaborador:** entra no sistema, consulta o catálogo, solicita equipamento disponível e registra a devolução de item que está com ele; vê os próprios empréstimos.
- **Operações:** consulta todos os empréstimos em aberto, registra devoluções no balcão e cadastra equipamentos.
- A v1 não inclui reservas futuras, notificações por e-mail ou importação da planilha.

O cadastro de usuários, a atribuição do papel de Operações e o provisionamento do primeiro acesso não estão definidos. Não implementar cadastro aberto nem presumir uma forma de conceder esses acessos.

**Atualização autorizada em 26/10/2026:** o usuário decidiu permitir cadastro
público por tela, detalhado em [001-login](001-login/spec.md). Esta decisão
substitui a proibição de cadastro aberto acima para a funcionalidade de acesso.
Atribuição de papéis, membership e provisionamento do primeiro operador
continuam pendentes; cadastro no Auth não concede esses privilégios.

## Regras de negócio

1. Uma pessoa pode manter no máximo cinco itens emprestados ao mesmo tempo.
2. O prazo padrão de devolução é de 14 dias úteis.
3. Uma pessoa com item em atraso não pode iniciar outro empréstimo.
4. Equipamento em manutenção não pode ser apresentado como disponível nem solicitado.
5. Operações deve poder registrar a devolução no balcão.
6. Decisão de 05/11/2026: solicitar já inicia o empréstimo, sem esperar retirada
   física. Fonte: esclarecimento de produto no PRD.

Não inferir estados intermediários, cancelamento, tratamento de item danificado, retenção de histórico ou processo de atualização automática de atraso sem a decisão correspondente em [perguntas do PRD](../perguntas-prd.md).

## Telas e rotas

As rotas seguem o [layout](../layout.md), com idioma pt-BR e a identidade visual escura definida nele.

| Tela | Rota | Requisitos funcionais |
|---|---|---|
| Login | `/login` | Entrada com e-mail e senha. Autenticação deve usar Supabase Auth e `@supabase/ssr`, conforme ADR-001. Fluxo de provisionamento ainda depende de decisão. |
| Catálogo | `/catalogo` | Exibir equipamentos e situação; permitir busca/filtro de catálogo; mostrar limite de cinco, prazo de 14 dias úteis e bloqueio por atraso. Só item disponível pode iniciar solicitação. |
| Detalhe | `/catalogo/:patrimonio` | Exibir estado, descrição e dados do equipamento; para item disponível, apresentar prazo calculado e ação de solicitação. Confirmar antes de registrar o empréstimo. |
| Meus empréstimos | `/meus-emprestimos` | Exibir os empréstimos atuais do usuário, prazo e ação de devolução; oferecer navegação ao catálogo. |
| Empréstimos em aberto | `/operacoes/emprestimos` | Exibir todos os empréstimos abertos para Operações, realçar atrasos e permitir registrar devolução. Acesso restrito ao papel autorizado, cuja atribuição precisa ser definida. |
| Cadastrar equipamento | `/operacoes/equipamentos/novo` | Cadastrar uma unidade física com nome, categoria, patrimônio, número de série, local de retirada, situação inicial e observações. Equipamento em manutenção não aparece como disponível. |

## Fluxos

1. **Solicitar:** catálogo → detalhe de item disponível → confirmação → empréstimo registrado → item passa a indisponível e aparece em Meus empréstimos.
2. **Devolver:** Meus empréstimos ou Empréstimos em aberto → confirmar/registrar devolução → empréstimo deixa de estar em aberto. A próxima situação do equipamento, especialmente quando há dano, depende de decisão.
3. **Cadastrar:** Operações → formulário de equipamento → salvar → equipamento fica registrado com a situação inicial escolhida.

Decisão de 05/11/2026: a confirmação da solicitação inicia o empréstimo.
Cancelamento, detalhes de contagem do prazo e permissões ainda precisam ser
fechados. As migrations atuais reservam no INSERT e exigem retirada separada;
essa divergência deve ser corrigida em tarefa própria com DDL aprovado,
sem editar migrations já aplicadas.

## Critérios de aceitação

- **CA-01:** usuário autenticado consulta catálogo com situação correta por equipamento.
- **CA-02:** usuário com menos de cinco itens e sem atraso consegue solicitar equipamento disponível; empréstimo recebe prazo de 14 dias úteis.
- **CA-03:** equipamento indisponível ou em manutenção não pode ser solicitado.
- **CA-04:** usuário que atingiu o limite de cinco ou possui atraso não consegue iniciar empréstimo e recebe explicação na interface.
- **CA-05:** colaborador consulta apenas os próprios empréstimos e pode registrar devolução do item que está com ele.
- **CA-06:** Operações autorizada consulta todos os empréstimos em aberto e pode registrar devolução.
- **CA-07:** Operações autorizada cadastra uma unidade física com os campos definidos; situação de manutenção não é exibida como disponível.
- **CA-08:** interface implementa as seis telas, rotas, responsividade e tokens definidos no layout, com foco de teclado visível e respeito a `prefers-reduced-motion`.
- **CA-09:** autorização é aplicada nos procedimentos tRPC e protegida em profundidade por RLS, conforme ADR-001 e decisão de tenant/papéis.

## Dependências e decisões pendentes

Antes de fechar os contratos de dados e fluxos, responder às questões 1–5 de [perguntas-prd.md](../perguntas-prd.md): devolução danificada/incompleta; cálculo de atraso; possível cancelamento (início imediato decidido em 05/11/2026); provisionamento e concessão de acesso; histórico de devoluções.

Também é necessário decidir tenant e matriz de permissões, que o ADR-001 deixa em aberto. Não implementar uma regra provisória para essas lacunas. Alterações de schema devem seguir [rules/migration.md](../rules/migration.md) e usar Prisma Migrate como único dono de migrations.

## Fora desta spec

Reservas futuras, notificações por e-mail, importação de planilha, gestão de usuários, relatórios/histórico não aprovado e qualquer integração não listada no PRD.

## Atualização de 06/11/2026 — decisões da prática

Limite alterado para cinco e prazo para 14 dias úteis por decisão explícita da
usuária, registrada no PRD. Critérios de prazo não podem ser aprovados enquanto
implementação e testes do calendário aprovado não estiverem concluídos. TI-0010 será disponível
na carga da atividade; somente TI-0004/TI-0007 em manutenção. Esta atualização
não marca CA atendido e não substitui as duas specs específicas ainda a criar.

Atualização de prazo: segunda a sexta, excluindo feriados nacionais fixos brasileiros
e o dia da solicitação; vence às 23h59min59s do 14º dia útil em America/Sao_Paulo.
Decisão do PRD de 06/11; nenhum CA marcado atendido por esta atualização documental.
