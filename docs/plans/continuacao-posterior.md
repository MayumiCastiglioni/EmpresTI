# Continuidade após os requisitos principais

Atualização em 06/11/2026: o
[plano da nova prática](pratica-sdd-subagentes.md) tem prioridade. Verificador,
skill de imagens e persistência mínima foram promovidos à entrega atual.
As entradas abaixo são referência de continuidade, não motivo para adiar
autorização ou testes essenciais às duas specs da atividade.

Data: 05/11/2026. Retomar após P1 a P4 do
[plano prioritário](correcoes-aulas.md). Isto é uma lista de trabalho futuro,
não autorização de implementação nem ampliação do [PRD](../PRD.md).
Specs/plano/tarefas funcionais existentes: [MVP](../tasks/mvp.md).

## Entrega acadêmica complementar

- [ ] POST-01 (COR-07): demonstrar uma skill pertinente e seu não acionamento
  em tarefa vizinha; usar as skills existentes, sem biblioteca de skills nova.
- [ ] POST-02 (COR-07): auditar e demonstrar um MCP útil, em escopo local e
  somente leitura imposto pelo servidor; comprovar inventário, consulta real e
  recusa de ação proibida. Não copiar .mcp.json temporário sem auditoria.
- [ ] POST-03 (COR-07): verificar a spec de login com contexto independente;
  revalidar integração real local quando autorizada, sem aprovar critério só
  por teste simulado. Exercitar limites do verificador sem editar testes reais.
- [ ] POST-04 (COR-04): completar contrato do operador, conforme aula 9,
  com permissões por ação e escolha de modelo pelo humano. Distinguir da
  operação do produto em docs/rules/operation.md.

## Antes de usar empréstimos reais

- [ ] POST-05 (T-01 a T-06): obter decisões de dano, contagem do prazo,
  cancelamento, histórico, organização e concessão/revogação de Operações.
  Já decidido: solicitar inicia empréstimo. Organização única ainda é indicação.
- [ ] POST-06 (C-01/C-03/C-04/C-05; COR-05): corrigir ciclo e autorização:
  dados próprios do colaborador, devolução própria, permissões de Operações e
  isolamento. Reconciliar migrations que ainda reservam antes da retirada.
- [ ] POST-07 (T-20 a T-24): implementar persistência do inventário pelo
  caminho tRPC/Prisma aprovado; garantir limite de três, prazo de 14 dias,
  bloqueio por atraso e manutenção, inclusive em concorrência por pessoa.
- [ ] POST-08 (T-12 a T-19): completar rotas, solicitação, devolução e telas
  de Operações com dados reais, estados vazios, carregamento e erros.
- [ ] POST-09 (T-24 a T-28): testes de RLS/isolamento com identidades reais
  de teste em Postgres local, fluxos de navegador e verificação de cada CA.

Esses itens podem esperar na demonstração acadêmica de infraestrutura, mas
são bloqueadores para apresentar o produto como substituto da planilha.
Não reduzir isolamento, liberar Operações ou ligar dados reais para contornar
as pendências. Alterações SQL exigem DDL aprovado e migration nova.

## Conformidade visual e documental

- [ ] POST-10 (C-08; COR-06): resolver divergência Phosphor/Lucide,
  encapsulamento CSS e shadcn conforme ADR vigente ou decisão do time;
  validar teclado, contraste, responsividade e movimento reduzido.
- [ ] POST-11 (C-06/C-07): reconciliar árvore paralela de ADRs e perguntas
  duplicadas, sem apagar fontes ou decisões por conta própria.
- [ ] POST-12: reconciliar cadastro público autorizado com o ADR-001 pelo
  time; preservar autorização registrada na spec até decisão explícita.
- [ ] POST-13: definir exclusão do handoff temporário no Git. .gitignore não
  remove arquivo já rastreado; nenhuma remoção do histórico está autorizada.
- [ ] POST-14: se EPERM reaparecer em build/, investigar sincronização do
  OneDrive; manter saídas antigas preservadas, sem exclusão automática.

## Melhorias de implementação que não são exigências literais da aula

- Elaborar /diagnostico além de uma página mínima ou redesenhar telas.
- Fixar exatamente três segundos de timeout: era proposta, não requisito;
  ainda é necessário provar resposta rápida e controlada quando o banco falha.
- Criar módulos/camadas extras além do necessário para o fluxo e seus testes.
- Automatizar histórico completo de segredos ou instalar múltiplos MCPs.
  A conferência dos arquivos a publicar continua obrigatória antes do push.

As tarefas AZ-T00 a AZ-T09 da primeira proposta foram reagrupadas no
[plano mínimo](../plan-andar-zero.md). Sua numeração anterior é referência
histórica, não uma segunda fila de execução. Revisar escopo e dependências
antes de retomar cada item; uma tarefa por vez, com checks.
