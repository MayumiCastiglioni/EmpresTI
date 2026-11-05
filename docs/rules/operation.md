# Operação do Emprest

> Rascunho com conflitos pendentes: aprovação, reserva, administrador e
> tratamento de danos abaixo não constituem decisões aprovadas do produto.
> Consulte C-01, C-02, C-05 e C-11 em
> [alinhamento-aulas.md](../alinhamento-aulas.md). Este arquivo não substitui
> PRD/spec nem define o contrato de autoridade do agente, que está em restrictions.

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

O inventário funciona com dados de demonstração no navegador. Login, cadastro
e saída estão implementados conforme a [spec 001-login](../specs/001-login/spec.md).
Persistência do inventário e permissões de tenant/Operações seguem pendentes no
[MVP](../tasks/mvp.md). Alertas e histórico não recebem aprovação por este
rascunho. Este arquivo trata da operação do produto; o contrato do operador
do agente, discutido na aula 9, ainda depende das escolhas do usuário.
