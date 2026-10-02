# Operação do Emprest

## Objetivo

O Emprest controla solicitações, empréstimos e devoluções de equipamentos compartilhados. A operação deve garantir que cada item tenha uma situação clara e que duas pessoas não recebam o mesmo equipamento ao mesmo tempo.

## Papéis previstos

| Papel | Responsabilidades |
|---|---|
| Colaborador | Consulta equipamentos e cria solicitações. |
| Operações | Aprova ou recusa solicitações, registra retirada, devolução e condição do item. |
| Administrador | Gerencia pessoas, equipamentos, categorias e permissões. |

## Fluxo operacional

1. A pessoa solicita um equipamento disponível, indicando a data prevista de devolução.
2. Operações revisa a solicitação e aprova ou recusa o pedido.
3. Na retirada física, Operações registra que o item foi entregue.
4. Na devolução, Operações registra a condição do item e encerra o empréstimo.
5. Se o item estiver danificado ou incompleto, ele deve ficar em manutenção até ser liberado por uma pessoa autorizada.

## Situações do equipamento

| Situação | Significado |
|---|---|
| Disponível | Pode receber nova solicitação. |
| Reservado | Há uma solicitação aprovada aguardando retirada. |
| Emprestado | Está com uma pessoa. |
| Manutenção | Não pode ser solicitado até ser liberado. |

## Rotina de acompanhamento

- No início do dia, revisar solicitações pendentes e itens com devolução prevista para hoje.
- Verificar empréstimos em atraso e contatar a pessoa responsável conforme a política definida.
- Registrar toda retirada e devolução no momento em que ela ocorre.
- Conferir periodicamente itens em manutenção e atualizar seu estado quando forem liberados.

## Limites atuais

A interface atual funciona com dados de demonstração no navegador. Login, banco de dados, histórico permanente, alertas e controle de permissões ainda dependem da implementação indicada em [handoff-proximos-passos.md](../handoff-proximos-passos.md).
