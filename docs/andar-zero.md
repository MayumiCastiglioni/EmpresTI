# Andar zero — prova da stack

Data do inventário: 05/11/2026. Isto não é uma spec de produto: verifica se a
stack do [ADR-001](adr/001-stack.md) funciona junta numa máquina limpa.
Referência: aula 8 fornecida pelo usuário. Execução proposta no
[plano do andar zero](plan-andar-zero.md), derivado de COR-03 do
[plano de correções](plans/correcoes-aulas.md).

Escopo repriorizado em 05/11: executar a fila mínima MIN-01 a MIN-06 do plano,
mantendo todos os critérios abaixo. Funcionalidades, ajustes visuais e práticas
complementares ficam no [planejamento posterior](plans/continuacao-posterior.md).

## Critérios da aula

- AZ-01: um comando único sobe a aplicação e o Postgres do zero.
- AZ-02: a aplicação conecta no banco; sem banco, erro claro e imediato.
- AZ-03: existe uma migration versionada e aplicada.
- AZ-04: GET /health devolve 200 e o status da conexão com o banco.
- AZ-05: uma página servida pelo front carrega e mostra o resultado de AZ-04.
- AZ-06: um comando roda os testes; existe pelo menos um teste sobre AZ-04.
- AZ-07: configuração via variável de ambiente, com .env.example versionado.
- AZ-08: .env no .gitignore, nenhum segredo no repositório.

## Evidências atuais

| Critério | Situação | Evidência e limite |
|---|---|---|
| AZ-01 | Parcial | Supabase configurado em supabase/config.toml, CLI e Docker disponíveis; npm run dev sobe somente Next. Sem comando único nem reconstrução comprovada |
| AZ-02 | Não comprovado | prisma.config.ts lê DATABASE_URL para a CLI; não há instância Prisma no servidor. Auth funcional não prova acesso Prisma ao Postgres |
| AZ-03 | Parcial | Duas migrations versionadas em prisma/migrations; aplicação atual e reconstrução local do zero não verificadas nesta tarefa |
| AZ-04 | Ausente | app/ não contém /health e o proxy exige sessão nas rotas não públicas |
| AZ-05 | Ausente | Não há página consumindo status real de conexão |
| AZ-06 | Parcial | COR-02 comprovou npm test com 26 testes; nenhum teste de health existe |
| AZ-07 | Parcial | .env.example é rastreado e contém nomes consumidos. DIRECT_URL é documentada mas a CLI lê DATABASE_URL; modelo usa exemplos remotos, que não comprovam configuração local segura |
| AZ-08 | Parcial | git check-ignore reconhece .env, .env.local e .env.before-login.local; git ls-files desses caminhos não retornou arquivos. Não houve varredura completa de conteúdo/histórico nesta tarefa |

Resultados de build e suíte de COR-02: [registro](validacao-cor02-build.md).
Não confundir arquivos existentes com critérios executados ou aprovados.

## Fora de escopo

Não implementar nem refazer login, catálogo, empréstimo, devolução, papéis ou
tenants. Não mudar regras do PRD, registrar conta ou consultar dados pessoais.
Não criar tabela só para provar conectividade: SELECT 1 é suficiente para
conexão; as migrations existentes exigem prova separada. Não apagar tabelas,
regravar migrations, fazer reset do banco de trabalho ou usar banco remoto.
O andar zero agora é uma verificação retroativa; não recomeçar o repositório.

## Ainda não decidido

O ADR-001 marca execução local como não decidida. O plano propõe aproveitar
Supabase CLI + Docker já disponíveis e Next no mesmo host. Aprovação do time
necessária antes de transformar isso em rotina obrigatória.
Driver de conexão Prisma, contrato operacional de health e procedimento de
banco descartável estão propostos, não aprovados, no plano.
Nenhuma pasta ou ferramenta nova se torna padrão por este inventário.
