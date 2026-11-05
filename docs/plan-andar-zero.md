# Plano mínimo — comprovação do andar zero

Repriorizado em 05/11/2026 a pedido do usuário. Substitui a proposta detalhada
anterior AZ-T00 a AZ-T09. Requisitos: [andar zero](andar-zero.md).
Ordem geral: [correções](plans/correcoes-aulas.md).
Demais alterações: [continuidade posterior](plans/continuacao-posterior.md).
Restrições: [ADR-001](adr/001-stack.md), [checks](rules/checks.md),
[migration](rules/migration.md) e [restrictions](rules/restrictions.md).

## Escopo imediato

Comprovar a ligação página → backend → Postgres, os testes, a subida local e
as migrations. Reutilizar Next, npm, Supabase, Prisma e a suíte existentes.
Não refazer o projeto, criar tabela de diagnóstico, redesenhar catálogo ou
implementar funcionalidades de empréstimo nesta etapa.

## Fila mínima

| Tarefa | Trabalho | Aceite |
|---|---|---|
| MIN-01 | Conectar Prisma no servidor e expor GET /health | Consulta real SELECT 1; status HTTP e corpo comprovam sucesso e falha; sem dados sensíveis; AZ-02/04 |
| MIN-02 | Testar health e suas exceções exatas de acesso | Sucesso/falha, banco indisponível, ausência de sessão e catálogo protegido; teste cita AZ; parte de AZ-06 |
| MIN-03 | Página simples que consulta /health | Mostra resultado real, carregamento e falha; AZ-05 |
| MIN-04 | Um comando sobe Next e Postgres locais | Não sobrescreve env, não usa destino remoto e não aplica reset automático; AZ-01 |
| MIN-05 | Provar migrations desde zero em banco local descartável | Destino aprovado, dados atuais preservados, migrations existentes aplicadas por Prisma Migrate; AZ-03 e prova limpa de AZ-01 |
| MIN-06 | Conferir configuração/segredos e executar validação final | Testes incluindo health, lint e build passam; env documentado; cada AZ tem evidência; AZ-06/07/08 |

O inventário e MIN-01 estão concluídos. Em 05/11/2026, a consulta Prisma
SELECT 1 por /health retornou 200/up no Postgres local. Uma segunda aplicação,
com destino local indisponível e sem mudar .env.local ou parar o banco,
retornou 503/down em 206 ms. Corpo mínimo e Cache-Control no-store conferidos.
Catálogo e caminhos semelhantes a health continuaram protegidos.
Validação final: npm test (38 testes/8 arquivos), npm run lint e npm run build
com geração Prisma automática passaram. A integração real de Auth não foi
reexecutada; não houve schema/migration nem dado de produto alterado.
MIN-02 complementa a cobertura existente; MIN-03 a MIN-06 seguem pendentes.
Se MIN-01 exigir arquivos de teste para verificar sua entrega, criá-los junto
com ela; MIN-02 complementa a cobertura, não posterga validação obrigatória.
Cada MIN termina com execução local e checks pertinentes antes da seguinte.

## Propostas técnicas a confirmar antes de implementar

- Execução local: usar Supabase CLI/Docker já disponíveis e Next no host.
  ADR-001 ainda diz não decidido; não substituir isso por decisão do agente.
- Conexão: Prisma no servidor; avaliar driver compatível com a versão instalada
  antes de propor instalação. Não trocar ORM nem contratar serviço novo.
- GET /health: a aula pede essa rota; preservar o caminho tRPC aprovado pelo
  ADR. Proposta: adaptador HTTP delega ao procedimento operacional tRPC, com
  uma única consulta. Confirmar esse contrato antes de codificar.
- Health sem sessão deve funcionar mesmo sem Auth; liberar somente o caminho
  exato e manter o catálogo protegido. A página terá apenas o acesso necessário
  à demonstração, definido no plano técnico de MIN-03.
- Sucesso: 200 com estado mínimo da conexão; indisponibilidade: erro controlado,
  proposto 503, sem mensagem interna. Resposta rápida é necessária; o limite
  técnico deve ser justificado e verificado, sem impor três segundos por hábito.
- MIN-05 exige procedimento com portas/volumes/destino apresentado e aprovado.
  Não executar reset, criar DDL ou alterar banco de trabalho por esta proposta.

## Organização mínima

app/ contém Route Handlers e página de prova; src/server/ contém cliente Prisma
e operação de saúde; router tRPC existente expõe a operação; tests/ contém as
verificações. Arquivos exatos serão listados no plano técnico da tarefa,
reutilizando o existente antes de criar módulo novo. Sem scaffold paralelo.

## Limites e provas

Migrations já criam domínio e usam role authenticated: a reconstrução precisa
considerar pré-requisitos locais, sem editar migrations já aplicadas. RLS e
isolamento funcional ficam para o planejamento posterior; aplicar migrations
não comprova autorização. A regra de segurança continua vigente.

Não declarar AZ aprovado por arquivo presente, teste simulado ou resultado
histórico. A lista de oito critérios permanece em andar-zero.md; este corte
simplifica implementação, não elimina critérios. Conforme ajuste autorizado
posteriormente pelo usuário, a demonstração auditada de um MCP integra a
entrega acadêmica principal após a base; skills/verificador continuam previstos.
O inventário de continuidade não representa dispensa dessa demonstração.
Não declarar todas as aulas ou MVP concluídos ao terminar apenas este plano.

## Validação desta revisão documental

Conferir links, oito AZ preservados no documento de critérios e consistência
da prioridade nos planos/handoff. Sem mudança de runtime: testes, lint e build
não precisam ser repetidos; não registrar execução nova dos checks de COR-02.
