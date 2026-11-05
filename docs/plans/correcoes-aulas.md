# Plano de correções das aulas

Data: 05/11/2026. Pedido: ajustar o projeto aos materiais e preparar publicação
no repositório MayumiCastiglioni/EmpresTI. Este plano não fecha decisões do time.

Fontes: [PRD](../PRD.md), [ADR-001](../adr/001-stack.md),
[ADR-002](../adr/002-layout-nocturne.md), [restrições](../rules/restrictions.md),
[conflitos](../alinhamento-aulas.md) e [tarefas do MVP](../tasks/mvp.md).

## Prioridade atual — escopo reduzido em 05/11/2026

Pedido do usuário: priorizar requisitos principais e registrar as demais
alterações para continuidade. Esta seção substitui a ordem ampla abaixo;
não altera PRD/ADR nem declara aceite de funcionalidades ainda demonstrativas.

| Prioridade | Entrega mínima | Critério de parada |
|---|---|---|
| P0 — já executada | Contexto fiel e build recuperado (COR-01/02/03 documental) | Preservar evidências e pendências; não refazer entregas |
| P1 — próxima | Conexão real via Prisma, GET /health e teste de sucesso/falha | AZ-02/04 e parte de AZ-06 comprovados, sem dados pessoais ou sessão obrigatória para health |
| P2 | Uma página mínima consumindo health | AZ-05 comprovado; sem redesenhar login/catalogo ou criar painel elaborado |
| P3 | Um comando de subida e prova local de migrations do zero | AZ-01/03 comprovados em ambiente descartável aprovado; banco de trabalho preservado |
| P4 | Conferir env/segredos e rodar checks finais | AZ-06/07/08 comprovados; registrar resultado dos oito AZ |
| P5 — entrega acadêmica complementar | Demonstrar uma skill, MCP auditado e verificador no menor caso útil | Provas das aulas 10/11 registradas; não instalar vários servidores/skills |
| P6 — GitHub | Preparar uma versão de revisão com escopo e limitações claros | Checks passam, segredos excluídos, branch de revisão; sem declarar MVP completo |

P1 a P4 são o núcleo de infraestrutura da aula 8, não toda a entrega do curso.
P5 permanece necessário para declarar concluídas as práticas das aulas 10/11;
pode ser uma segunda entrega, depois da base funcionar. Não rotular como
"todas as aulas atendidas" antes dessas demonstrações.

O [plano mínimo do andar zero](../plan-andar-zero.md) é o roteiro ativo.
As tarefas não imediatas estão no [planejamento posterior](continuacao-posterior.md).
A aprovação anterior para repriorizar não decide driver, execução local,
contrato de rotas ou permissões que as fontes ainda deixam abertos.

## Inventário amplo e aceite — referência para continuidade

| Tarefa | Entrega | Como verificar | Dependência |
|---|---|---|---|
| COR-01 | Contexto atualizado, procedimento de handoff e plano rastreável | Links válidos; fatos atuais separados dos históricos; sem mudança de runtime | Pedido atual |
| COR-02 | Diagnóstico e recuperação do build | Build termina com código zero; testes e lint passam | Plano técnico aprovado antes de alterar código/configuração |
| COR-03 | Inventário e plano do andar zero AZ-01 a AZ-08 | Proposta cobre subida local, conexão, migration, health, página, teste e configuração | Decisão de execução local; DDL aprovado se necessário |
| COR-04 | Decisões e reconciliação das fontes | Respostas de T-01 a T-06, responsáveis e matriz de acesso registradas | Time; ADRs só pelo time |
| COR-05 | Specs pequenas de autorização e empréstimo persistente | Testes de dados próprios, papéis, prazo, limite, atraso e concorrência em Postgres local | COR-04, plano e DDL aprovados |
| COR-06 | Telas restantes e alinhamento visual | CA-01 a CA-09, rotas, teclado e responsividade verificados | COR-05; C-08 resolvido |
| COR-07 | Skills, MCP e verificador demonstrados | Auditoria e provas de uso/recusa; verificador independente por spec | Configuração de conexão aprovada, acesso local mínimo |
| COR-08 | Publicação para revisão no GitHub | Revisão dos arquivos, ausência de segredos, testes/lint/build aprovados e branch publicada | COR-02 e escopo publicável definido; sem push na main |

Cada entrega deve ser decomposta antes de implementar código. Executar uma
tarefa, validar, relatar e parar conforme as restrições; este plano não libera
execução automática das fases dependentes de aprovação.

## Decisões que não serão presumidas

- Decidido em 05/11: solicitar já inicia o empréstimo (ver PRD).
  Contagem do prazo, horário/fuso e cancelamento seguem sem definição.
- Como tratar dano/incompletude, atraso e histórico? Ver T-01 a T-05.
- Organização única ou múltiplos tenants? Quem concede/revoga Operações?
- Cadastro público já autorizado precisa ser reconciliado pelo time com ADR-001.
- Phosphor/estilos encapsulados e shadcn devem seguir ADR vigente ou decisão
  substituta do time; não instalar alternativa por conveniência.
- A árvore paralela de ADRs e as perguntas duplicadas exigem consolidação
  decidida pelo time, sem exclusão automática.

## MCP — atividade da aula 10

Ausência de MCP não impede a aplicação, mas deixa sua demonstração pendente.
COR-07 deve auditar ferramentas, autenticação, escopo e bloqueios antes de
habilitar conexão. Priorizar conferência de schema/policies do banco local,
somente leitura imposta pelo servidor; nunca entregar DIRECT_URL ou credencial
administrativa ao agente. Não copiar configuração da pasta temporária sem
auditoria. Configuração do repositório deve ser compatível com o harness usado.
Provas: inventário de ferramentas, consulta real visível e recusa de operação
proibida. Nenhum segredo em arquivo versionado.

## Limites da publicação

Origem confirmada em 05/11: https://github.com/MayumiCastiglioni/EmpresTI.git.
Há alterações locais preexistentes de autenticação/documentação a preservar.
Não publicar como MVP concluído: catálogo e empréstimos ainda são demonstrativos.
Publicação inicial proposta: branch codex/alinhamento-aulas, após checks;
push na main, merge e deploy não estão liberados pelas regras vigentes.
Não incluir ambientes, contas, caches, node_modules ou saídas de build.

## Estado de COR-01

Critérios: DOC-C01 plano com dependências; DOC-C02 procedimento de retomada;
DOC-C03 diagnóstico atual; DOC-C04 operação sem afirmar login ausente;
DOC-C05 links conferidos e escopo documental preservado.
Validação desta entrega registrada no handoff após a checagem de links.

## Estado de COR-02 — concluída em 05/11/2026

Execução autorizada pelo pedido para começar o plano. Erro EPERM reproduzido
na limpeza de .next/server/app/api; nenhum servidor Next estava ativo.
Plano técnico apresentado: preservar a árvore existente, usar distDir build,
alinhar os tipos gerados e verificar build repetido, testes, lint e HTTP local.
next.config.ts usa build/; tsconfig inclui os tipos correspondentes e exclui
as duas saídas antigas. Sem biblioteca, variável ou regra de negócio nova.
Dois builds consecutivos, 26 testes e lint passaram; aplicação iniciada com
npm run start e rotas públicas/proteção anônima conferidas. Detalhes e limites:
[validação COR-02](../validacao-cor02-build.md).
Próxima tarefa: inventário e proposta do andar zero (COR-03), sem schema ou
serviço novo até aprovação e resolução das decisões técnicas necessárias.

## Estado de COR-03 — inventário e proposta concluídos em 05/11/2026

[Andar zero](../andar-zero.md) registra AZ-01 a AZ-08 e suas evidências;
[plano detalhado](../plan-andar-zero.md) contém decisões técnicas, arquivos
propostos e, na primeira proposta, tarefas AZ-T00 a AZ-T09. COR-03 entrega inventário/plano, não
declara execução ou aprovação dos oito critérios. Cliente Prisma no servidor,
health e página consumidora ausentes; prova de migrations do zero pendente.
Execução local segue não decidida no ADR-001. Após repriorização, a fila ativa
é MIN-01 a MIN-06; aprovar o plano técnico de MIN-01 antes de criar código,
instalar driver ou acessar banco. A antiga fila AZ-T não deve ser executada
em paralelo à nova.
