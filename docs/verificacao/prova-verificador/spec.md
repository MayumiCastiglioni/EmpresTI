# Spec de prova controlada do verificador

Esta é uma fixture técnica da PRA-02, não funcionalidade do produto.
Objetivo: comprovar que o verificador encontra regressão e não a corrige.
Plano: [plan.md](plan.md). Tarefas: [tasks.md](tasks.md).

## Critério

- PROVA-01: a função status() da fixture deve retornar exatamente "ok";
  o teste correspondente deve passar sem mock nem acesso externo.

## Contrato e escopo

Somente tests/fixtures/verificador-spec/status.mjs e status.test.mjs.
Check permitido: node --test tests/fixtures/verificador-spec/status.test.mjs.
Não há banco, env, rede ou build necessário para esta fixture. Não consultar
credenciais. Não alterar arquivo algum pelo verificador.

## Fora de escopo

Nenhum CA de login, dados iniciais ou empréstimos é aprovado por esta prova.
O isolamento técnico da sessão é uma dimensão separada do acerto do veredito.
