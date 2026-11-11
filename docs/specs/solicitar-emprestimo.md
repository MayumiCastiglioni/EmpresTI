# Solicitar empréstimo — prática

## Correção de runtime publicado — 11/11/2026

No runtime `NODE_ENV=production`, a conexão Prisma pode usar o PostgreSQL
gerenciado do Supabase configurado em DATABASE_URL (host direto db.*.supabase.co
ou pooler *.pooler.supabase.com). Em desenvolvimento/testes, só loopback.
Protocolos diferentes de postgres/postgresql e parâmetros host/hostaddr são
recusados. Isso corrige a guarda local de desenvolvimento que impedia o
catálogo publicado; não altera autenticação, membership ou RLS, nem autoriza
testes/carga contra produção. Dados/migrations remotos continuam com validação
separada. Teste de configuração pura não comprova conexão real ou EMP-01 integral.

Estado: implementação local parcial; os critérios de aceite ainda não foram
aceitos integralmente e falta revisão independente.
[Plano](../plans/solicitar-emprestimo.md) · [Tarefas](../tasks/solicitar-emprestimo.md).
Fontes: [PRD](../PRD.md), [decisões](../produto/decisoes-pratica.md),
[ADR-001](../adr/001-stack.md), [plano ativo](../plans/pratica-sdd-subagentes.md).

## Problema e escopo

Colaborador vinculado à EmpresTI consulta catálogo e próprios empréstimos e
solicita um item disponível, iniciando imediatamente o empréstimo. Servidor e
banco garantem disponibilidade, limite, prazo, autoria e isolamento sob concorrência.
Fora desta fatia: retirada posterior, aprovação de Operações, reserva futura,
devolução, renovação, histórico/relatórios, notificações e concessão de acesso
Operações. Não apaga o escopo futuro de devolução do PRD.

## Regras confirmadas

- Organização EmpresTI / empresti, preservando tenant e autenticação existentes.
- Máximo cinco itens simultâneos por colaborador; atraso bloqueia novo pedido.
- Só equipamento disponível pode ser solicitado; manutenção não é disponibilidade.
- Solicitar inicia empréstimo e torna equipamento emprestado na mesma transação.
- Prazo: excluir data da solicitação em America/Sao_Paulo; contar 14 dias de
  segunda a sexta, exceto feriados nacionais fixos brasileiros; vence 23h59min59s nesse fuso.
- Identidade e vínculo vêm da sessão verificada no servidor. Cliente não escolhe
  borrowerId, tenantId, status, início ou dueAt. Listagem de empréstimos é própria.

## Contratos técnicos em implementação

- Reusar estado RETIRADO para empréstimo iniciado e checkedOutAt igual ao início;
  requestedAt e dueAt definidos pelo servidor. Não adicionar enum só para mudar nome.
- Contrato aprovado em 08/11/2026 (DEC-23): SOLICITADO legado e RETIRADO
  existentes contam para limite e bloqueiam novos pedidos quando atrasados.
  Preservar dados, sem conversão ou exclusão automática. Novos pedidos iniciam
  diretamente em RETIRADO, sem criar SOLICITADO/RESERVADO.
- Limite, atraso e disponibilidade verificados depois de serializar pelo membro
  (mesma pessoa, inclusive itens diferentes) e equipamento (pessoas diferentes).
  Ordem de locks consistente. Sem atualização otimista da UI antes do commit.
- Manter índice único de empréstimo ativo por equipamento. Adaptar trigger em
  nova migration para início imediato/cinco itens e checagem de concorrência;
  não alterar migration aplicada. Apresentar DDL e impacto antes da execução.
- protectedProcedure/tenantProcedure verificarão usuário Supabase e membership.
  tRPC lista só próprios empréstimos; RLS em profundidade deve permitir dados
  próprios e negar colega/outro tenant/sem sessão. Não expor procedure admin nova.
- Contrato aprovado em 08/11/2026 (DEC-24): reenvio para equipamento com
  empréstimo ativo é recusado com mensagem de indisponibilidade, sem duplicação
  nem exposição de dados de outra pessoa; a interface atualiza a consulta.
  Sem promessa de exatamente uma resposta de rede.

## Calendário e fronteiras propostas

[Referência e cobertura](../produto/calendario-emprestimos.md). Fonte proposta:
apenas os nove feriados nacionais fixos, por decisão da usuária em 06/11.
Sexta-feira da Paixão, Carnaval e Corpus Christi não são descontados.
Sem pontos facultativos/feriados estaduais ou municipais. Ano conferido até agora: 2026. A usuária exige cobertura de outros anos antes
da liberação; intervalo aprovado de 2026 a 2030. Não liberar sem cobrir todos
esses anos.
Não calcular além de anos cobertos: retornar indisponibilidade clara antes de
qualquer escrita até incorporar fonte revisada. Isso inclui atravessar dezembro.

Representação aprovada do vencimento: 23:59:59 em America/Sao_Paulo, persistido
como instante UTC em timestamptz. Atraso quando instante atual for maior que dueAt;
no instante igual ainda não há atraso. Precisão escolhida explicitamente pela usuária em 06/11/2026.
Clock do servidor fornecido ao cálculo; cliente só exibe o resultado confirmado.
Não somar 14 x 24 horas nem usar timezone da máquina para decidir o dia útil.
Exemplo conferido: pedido em 06/11/2026 no horário de São Paulo vence 27/11/2026
às 23h59min59s, excluindo finais de semana e 20/11.

## Fluxo mínimo da interface

1. Catálogo traz imagem/crédito, patrimônio/nome, situação e ação só se disponível.
   Estados de carregamento, erro e ausência de itens são explícitos.
2. Confirmar solicitação antes da mutation. Durante envio, botão indisponível;
   erro não altera inventário local como se tivesse sucesso.
3. Em sucesso, atualizar catálogo e próprios empréstimos, exibindo vencimento.
4. Em limite/atraso/indisponibilidade/conflito, explicar a recusa sem expor dados
   de outra pessoa; conservar navegação e permitir consultar estado atualizado.
5. Sem sessão, ir a login; sem vínculo, mostrar acesso indisponível sem criar
   membership automaticamente. Teclado/foco/labels e viewport móvel verificáveis.

## Critérios de aceite

- EMP-01: sessão válida e vínculo aprovados consultam catálogo e apenas próprios
  empréstimos. Colega, outro tenant e anônimo não obtêm dados privados.
- EMP-02: pessoa sem atraso e com até quatro ativos solicita disponível; inicia
  empréstimo, atualiza inventário e prazo atomicamente, sem reserva/espera.
- EMP-03: com cinco ativos, recusa e não altera empréstimos/equipamentos.
- EMP-04: com atraso, recusa sem escrita; casos imediatamente antes/igual/depois
  do vencimento exercitam a fronteira temporal aprovada.
- EMP-05: manutenção, item inexistente e item de outro tenant são recusados sem
  vazamento ou alteração de estado.
- EMP-06: dois usuários solicitando mesmo item produzem um único empréstimo;
  dois itens para a mesma pessoa com quatro ativos deixam no máximo cinco.
- EMP-07: prazo respeita finais de semana/feriados nacionais, exclusão do dia,
  virada de mês/ano, fuso e indisponibilidade explícita de calendário sem cobertura.
- EMP-08: inputs tentam forjar identidade/tenant/prazo e são rejeitados/ignorados
  conforme schema estrito da API; autoridade vem do servidor e RLS é testada.
- EMP-09: catálogo/confirmar/próprios empréstimos funcionam com dados persistentes,
  incluindo imagens/crédito, carregamento, erro, teclado e viewport móvel.
- EMP-10: falha transacional reverte mudanças; reenvio não duplica empréstimo ativo.

## Testes e evidência

Cálculo puro com clock fixo e fonte versionada. Postgres local real para regras,
locks, concorrência e RLS com papéis reais. createCaller tRPC com sessão/contexto
verificado; Testing Library para estados da UI; Playwright para fluxo completo.
Usar identidades sintéticas, nunca professor. Fotos reais e deploy não são
substituídos por fixtures. Cada teste cita o EMP correspondente; verificador
independente precisa de evidência executada antes de aceitar spec como pronta.

## Pendências e limites de validação

Legado e reenvio aprovados em 08/11/2026 (DEC-23/24); calendário/precisão e
cobertura 2026–2030 já definidos. Isso não aprova a spec integralmente.
Revisar o ADR/layout que ainda menciona três; agente não edita ADR.
Para esta fatia, DEC-26 aprova remover a policy `operations_manage_loans`, que
hoje permite UPDATE de empréstimos a OPERACOES/ADMIN; acesso de Operações fica
para decisão futura. Isso não altera o requisito futuro da tela de Operações no
PRD. DEC-27 aprovou o DDL exato após verificação isolada, e a migration foi
aplicada ao banco local em 10/11/2026. EMP-T05 implementou serviço transacional
e oito cenários Postgres locais; EMP-T06/07 conectaram procedures e tela do
colaborador com testes de componente. A leitura RLS foi provada no Postgres
local com o papel `authenticated`; endpoint HTTP com Auth/cookies passou no
ambiente local. Deployment continua sem prova. Também faltam EMP-09 no navegador
autenticado com fotos reais, critérios completos e revisão independente. As
quatro migrations passaram em reconstrução local descartável. Sem mudança remota,
instalação de biblioteca ou publicação.
