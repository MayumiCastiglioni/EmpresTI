# Alinhamento do EmpresTI com as aulas

Data-base: 26/10/2026. Registro de evidências e reconciliação; não substitui
PRD, ADR, spec ou decisão do time.

## Revisão de 05/11/2026

O diagnóstico inicial abaixo é histórico; as continuidades registram correções
posteriores. Login e API de autenticação existem; inventário segue demonstrativo.
Na auditoria de 05/11, npm test passou (26 testes/6 arquivos), lint passou e
build falhou com EPERM em .next/server/app/api, na pasta do OneDrive.
Integração real de Auth, RLS, concorrência, migrations do zero e navegador não
foram reexecutados. Falta de revalidação não é defeito funcional demonstrado.

Não encontrados artefatos/prova completa de AZ-01 a AZ-08 nem contrato do
operador do agente. MCP não é requisito da aplicação, mas sua auditoria e
demonstração são pendência prática da aula 10. Não habilitar servidor sem
auditoria de escopo/permissões. RLS/policies entram somente na segunda migration,
divergindo do procedimento atual; não reescrever migration já aplicada.

Plano atual: [correcoes-aulas](plans/correcoes-aulas.md). COR-01 atualiza contexto
e retomada; não resolve os conflitos de produto e arquitetura abaixo.

## D-01 — Contexto fiel ao projeto

Escopo: atualizar orientações conforme fatos observados, registrar conflitos
e preparar decisões. Sem alteração de produto, ADRs, banco ou dependências.

Critérios desta entrega:

- DOC-01: README distingue arquitetura aprovada de implementação existente.
- DOC-02: checks citam comandos reais e separam documentação, runtime e banco.
- DOC-03: conflitos têm evidência, impacto e decisão pendente.
- DOC-04: handoff curto registra estado e tentativas negativas, sem recomendar
  ações remotas como próximo passo.
- DOC-05: links locais resolvem e alterações anteriores são preservadas.

## Comparação com as aulas

| Aulas | Evidência existente | Trabalho necessário |
|---|---|---|
| 1–2 | AGENTS, regras e protótipo | Distinguir fatos de intenção; comprovar carregamento de regras |
| 3 | Handoff com tentativas negativas | Resumo atual, sem histórico acumulado competindo com decisões |
| 4–6 | PRD, ADRs, restrições e tarefas | Resolver divergências antes dos contratos afetados |
| 7 | Spec com CA-01 a CA-09 | Cada CA ligado a teste do fluxo real; execução em fatias |
| 8 | Next.js strict e build aprovado na revisão inicial | Provar tela → servidor → banco e suíte executável |
| 9 | Regras de checks, testes e migrations | Comandos reais e procedimento de verificação coerente |
| 10 | Cinco skills em skills/ | Provar descoberta/uso; nenhuma configuração MCP local identificada |
| 11 | agents/verificador-spec.md e ponteiros locais | Compatibilizar caminhos e validar integração do verificador |

## Registro de conflitos

| ID | Evidências em divergência | Encaminhamento |
|---|---|---|
| C-01 | Spec mantém ciclo pendente; migration enforce_inventory_rules reserva no INSERT e permite retirada/cancelamento | Time decide ciclo, início do prazo e estados que contam no limite; spec antes de telas/migrations |
| C-02 | Pergunta 1 do PRD aberta; trigger envia dano/incompleto para manutenção | Time decide destino e responsável pela liberação |
| C-03 | PRD/CA-05 permitem devolver o próprio item; regra anterior de testes proibia; policy UPDATE só permite Operações/ADMIN | Registrar matriz aprovada e reconciliar testes/API/banco; nenhuma permissão alterada nesta entrega |
| C-04 | CA-05 exige dados próprios; tenant_members_can_read_loans permite todos do tenant | Corrigir autorização em tarefa própria; testar negativa para colega do mesmo tenant |
| C-05 | ADR-001 deixa tenant/papéis/provisionamento abertos; schema já contém Tenant/Membership/ADMIN | Time define organização, concessão/revogação e primeiro acesso; bloqueia login completo e tRPC |
| C-06 | AGENTS define docs/adr/ como oficial; README apontava docs/arquitetura/decisoes/001-stack.md, com escolhas adicionais | README aponta a fonte já oficial; time reconcilia árvore paralela; ADRs preservados |
| C-07 | Perguntas em docs/perguntas-prd.md e docs/produto/perguntas-em-aberto.md | Confirmar consolidação antes de remover cópia; não registrar respostas em dois lugares |
| C-08 | ADR-002 pede Phosphor e estilos encapsulados; código usa Lucide/CSS global; shadcn/ui ausente | Cumprir ADR ou obter decisão arquitetural; não instalar biblioteca nem editar ADR nesta entrega |
| C-09 | Checks anteriores tinham placeholders/reset Supabase; migrations estão em prisma/migrations | Comandos corrigidos; reconstrução Prisma do zero ainda precisa de prova em banco local descartável |
| C-10 | Handoff anterior recomendava migrations remotas; restrictions proíbe | Orientação removida da retomada; nenhuma ação remota nesta etapa |
| C-11 | operation.md descreve aprovação, reserva e administrador; PRD/spec não fecharam tudo | Sinalizar como rascunho conflitante; time decide antes de virar contrato |
| C-12 | Verificador esperava spec/plan/tasks juntos; MVP está em três pastas e specflow permite legado | Corrigido nesta continuidade: verificador reconhece os três caminhos legados e segue links nas demais specs; nenhum arquivo movido |
| C-13 | secrets.md lista ANON_KEY/SITE_URL e Sentry; código usa PUBLISHABLE_KEY, exemplo usa APP_URL; prisma.config lê DATABASE_URL, não DIRECT_URL | Alinhar inventário documental ao código; destino de migrations deve ser conferido pela variável realmente consumida |

## Falhas técnicas para tarefas posteriores

- Login apenas navega; proxy consulta usuário sem negar acesso anônimo.
  Renovação de sessão não comprova política httpOnly exigida pelo ADR.
- Interface em memória, prazo arbitrário/data fixa, sem bloqueio de limite ou
  atraso no pedido. Quatro rotas previstas ausentes; API tRPC ausente.
- Contagem SQL bloqueia equipamento, sem serialização por pessoa: risco de
  ultrapassar limite em pedidos simultâneos de itens diferentes. Hipótese
  estática; ainda sem reprodução em Postgres real.
- due_at obrigatório sem regra de 14 dias nas migrations; definir e provar
  o cálculo pelo fluxo persistido.
- Pessoas, histórico e métricas demonstrativas não autorizam ampliação da v1.

## Decisões do time

Registrar respostas com data/responsável nas fontes de produto e spec.
As perguntas não constituem aprovação de qualquer alternativa.

1. T-04: responsável técnico provisiona contas ou Operações convida pela
   aplicação? Quem concede/revoga acesso? Cadastro aberto é vedado pelo ADR.
   **Resposta recebida nesta sessão:** usuário precisa consultar o time;
   permanece pendente, sem implementação de provisionamento.
2. T-06: organização única ou várias? Quem pertence a cada uma e quais ações
   cabem a colaborador, Operações e administrador?
3. T-03: solicitar empresta ou reserva até retirada? Aprovação/cancelamento
   existem? Quando começam os 14 dias e quais estados contam no limite?
4. T-01: dano/incompleto vai para manutenção automaticamente? Quem libera?
5. T-02: instante/fuso do atraso e cálculo em consulta ou estado mantido?
   Não introduzir job sem decisão arquitetural.
6. T-05: histórico visível na v1, para quem e por quanto tempo?

## Próximas entregas

1. D-01: contexto documental, conflitos e retomada (esta entrega).
2. T-09: recuperar execução do Vitest sem atualizar stack; comprovar cobertura real.
3. T-04/T-06: decisões; spec pequena de acesso com plano e tarefas aprovados.
4. T-11: autenticação/rotas protegidas, com testes do caminho real.
5. T-22/T-23 e CA-01 a CA-04: primeira fatia persistente após decisões de ciclo;
   DDL revisado antes de migration, testes locais de isolamento/concorrência.
6. CA-05 a CA-09: demais fluxos e verificação independente.

Cada entrega termina com checks e relato conforme restrictions. Nenhum CA
funcional é declarado atendido por esta correção documental.

## Validação de D-01

- DOC-01/DOC-02: inventário comparado a package.json, rotas, configuração
  Prisma e clientes Supabase; comandos dev/test/test:watch/lint/build existem.
- DOC-03: C-01 a C-13 registrados sem mudar PRD, ADRs ou comportamento.
- DOC-04: handoff com 25 linhas; decisões e estado remoto não presumidos.
- DOC-05: 30 links locais verificados sem falhas; ponteiros de subagentes
  preexistentes preservados; docs/rules/specflow.md não editado nesta entrega.
- Diagnóstico adicional: `npm test` executado novamente e falhou antes dos
  testes com ERR_MODULE_NOT_FOUND para o chunk cac.CLrZKo1g.js do Vitest.
  T-09 permanece pendente; nenhum teste de produto aprovado por esta execução.
- Lint/build não repetidos: entrega exclusivamente documental, sem mudança
  de runtime; ambos haviam passado na revisão inicial desta conversa.
- Banco, migrations e deploy não executados. Nenhuma dependência instalada.

## Continuidade — recuperação de T-09

O usuário autorizou continuar os ajustes independentes das decisões do time.
Instalação local restaurada com `npm ci --ignore-scripts --no-audit --no-fund`:
592 pacotes instalados, sem alterações em package.json/package-lock.json.
Scripts de instalação de pacotes não foram executados nesta recuperação.
Não atualizar dependências para resolver avisos de obsolescência nesta tarefa.

Adicionado tests/login-page.test.tsx: renderização real do componente com
Testing Library, rótulos dos campos e aviso de limitação do protótipo.
Resultado: 2 arquivos / 3 testes aprovados; build de produção aprovado.
Lint aprovado; INFRA-01 a INFRA-03 de T-09 atendidos.
O teste comprova infraestrutura React/DOM; não comprova login nem CA funcional.
O verificador agora reconhece os caminhos legados do MVP (C-12).

## Continuidade — login e cadastro

Decisão posterior do usuário em 26/10/2026: cadastro público permitido pela
tela e três contas de teste. A spec [001-login](specs/001-login/spec.md) registra
a exceção explícita ao ADR-001 sem reescrevê-lo. C-05/T-04 avançam na criação
de identidade; memberships, tenant e atribuição de Operações seguem pendentes.

Implementados cadastro/login/logout por tRPC e Supabase Auth, cookies httpOnly
e bloqueio das páginas internas. Conta autenticada não recebe papel de Operações.
Catálogo e empréstimos permanecem demonstrativos. Nenhuma migration foi alterada.

Docker/Supabase local iniciados. `.env.local` passou a usar serviços locais;
conteúdo anterior preservado em `.env.before-login.local`, ambos ignorados.
As três contas foram persistidas em auth.users localmente; senhas fora do código.
Nenhum usuário ou banco remoto alterado. Nenhum painel Vercel modificado.

Validação: 26 testes padrão, 2 testes reais locais de autenticação, lint e build
passaram. O teste real recusa destino remoto e remove contas temporárias.
Falha inicial de workers sob concorrência com Docker resolvida limitando Vitest
a um worker. Origem das mutações considera Host público, com teste de regressão
para normalização de hostname do Next. Não presumir origem só pelo request.url.

## Decisão recebida — 05/11/2026

C-01/T-03 parcialmente resolvido pela usuária: a solicitação já inicia o
empréstimo. PRD, spec MVP e perguntas atualizados. A migration que reserva no
INSERT e aguarda retirada continua divergente; nenhum SQL foi alterado.
Cancelamento e detalhes da contagem do prazo seguem pendentes.
C-05/T-04/T-06: acesso de Operações pendente; organização única sugerida com
incerteza, sem confirmação. Não inferir autorização para remover tenants.
