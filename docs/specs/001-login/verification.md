# Verificação — 001 Login

26/10/2026. Verificação independente pelo subagente verificador-spec.
Após correções de cobertura, veredito: **PRONTA**.

| Critério | Evidência | Resultado |
|---|---|---|
| LOGIN-01 | auth-router, login-page e auth-local.integration | ATENDIDO |
| LOGIN-02 | auth-router, auth-middleware, auth-route e integração | ATENDIDO |
| LOGIN-03 | auth-middleware e integração | ATENDIDO |
| LOGIN-04 | logout-button, auth-router e integração com cookie jar | ATENDIDO |
| LOGIN-05 | login-page e auth-router | ATENDIDO |
| LOGIN-06 | integração: createUser, getUserById e login real | ATENDIDO |
| LOGIN-07 | login-page, auth-router e integração: signup persistido | ATENDIDO |

Checks do principal: npm test 26/26; npm run test:auth-local 2/2;
npm run lint e npm run build com código zero.
O verificador inspecionou os testes de integração e recebeu esses resultados;
não repetiu operações de criação/remoção no banco por sua restrição de leitura.

Contas solicitadas verificadas individualmente por HTTP: mayumi@email.com,
daniel@email.com e marcelo.grilo@email.com. Senhas não registradas neste documento.
Cadastro público autorizado pelo usuário, exceção ao ADR registrada na spec.
Nenhum banco remoto ou deploy alterado. Inventário permanece demonstrativo;
tenant/memberships e papéis não são declarados implementados por esta spec.
