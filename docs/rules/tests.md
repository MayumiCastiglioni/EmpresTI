# Testes do EmpresTI

> Leitor: agente

## Quando
Ao criar, alterar ou remover testes ou declarar um critério de aceite atendido.

## Procedimento
1. Execute `npm test` (Vitest sem modo interativo). `npm run test:watch` serve
   para acompanhamento local. Demais checks: [checks.md](checks.md).
2. Teste funcional cita o ID do CA e o comportamento comprovado no nome.
   Teste de infraestrutura sem CA de produto identifica a tarefa técnica.
3. Exercite o caminho consumido pela aplicação: função isolada sem consumidor
   não comprova login, navegação real ou autorização.
4. Regras transacionais/RLS usam Postgres real local conforme ADR-001.
   Verifique destino; nunca use banco remoto ou dados reais.
5. Prove acesso permitido e negado: colega do mesmo tenant, outro tenant e
   ausência de sessão, conforme matriz aprovada. Owner/service role não prova RLS.
6. Procedimentos: confira retorno/erro e efeitos persistidos. HTTP: status e
   corpo. Concorrência: pedidos simultâneos, inclusive itens diferentes da mesma pessoa.

## Estado observado em 26/10/2026
Existem 26 testes padrão: roteamento auxiliar, formulário, procedures Auth,
proteção de sessão e origem das mutações. `npm test` passou. Workers limitados
a um para evitar timeout de inicialização junto aos containers locais.
Os dois testes explícitos de `npm run test:auth-local` usam aplicação em 127.0.0.1:3100,
recusam Supabase remoto e verificam cadastro/persistência/login/cookies/logout
com contas temporárias. Alteram apenas Auth local e removem as contas ao fim;
o verificador somente leitura não deve executá-lo. Não comprova RLS do inventário.
Os critérios próprios são LOGIN-01 a LOGIN-07 em docs/specs/001-login/spec.md;
os CA-01 a CA-09 do MVP permanecem com cobertura parcial.

## Cobertura a construir
- CA-01/CA-09: sessão, acesso ao catálogo, tRPC e isolamento.
- CA-02 a CA-04: 14 dias, limite, atraso, manutenção e concorrência.
- CA-05/CA-06: dados próprios, acesso de Operações e devolução autorizada.
- CA-07/CA-08: cadastro, rotas, foco, responsividade e movimento reduzido.

Não transformar aprovação, reserva, cancelamento ou danos em expectativas
antes da decisão registrada na spec. A versão anterior proibia colaborador
de devolver, divergindo do PRD/CA-05: conflito registrado em
[alinhamento-aulas.md](../alinhamento-aulas.md), sem alteração de produto.
