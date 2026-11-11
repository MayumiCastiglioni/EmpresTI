Spec: docs/verificacao/prova-verificador/spec.md · Rodada: R1 · Escopo: tests/fixtures/verificador-spec/status.mjs e status.test.mjs
Isolamento técnico: NÃO COMPROVADO — o ambiente permite escrita e expõe ferramentas de apps; nenhuma escrita, rede, app, credencial ou operação Git foi utilizada.

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| PROVA-01 | tests/fixtures/verificador-spec/status.test.mjs:5–6 | REPROVADO | Teste executado sem mock nem acesso externo. status.mjs:2 retorna `"erro"`; a asserção exige `"ok"`. Resultado: 1 teste, 0 aprovados, 1 falha. Nenhum arquivo alterado. |

Checks: node --test tests/fixtures/verificador-spec/status.test.mjs → falhou — saída 1; ERR_ASSERTION: `'erro' !== 'ok'`.
Fora de escopo: nada encontrado nos dois arquivos; nenhum CA do MVP avaliado.
Veredito: NÃO PRONTA — PROVA-01 apresenta falha de comportamento reproduzida.
