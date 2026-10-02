# Testes do Emprest

## Comandos atuais

| Comando | Finalidade |
|---|---|
| `npm run lint` | Verifica padrões de código e problemas estáticos. |
| `npm run build` | Compila a aplicação para produção e valida os tipos. |

## Situação atual

O projeto ainda não possui testes automatizados de comportamento. Antes de conectar a aplicação ao banco, os cenários abaixo devem ser transformados em testes automatizados.

## Cenários essenciais

### Solicitações e disponibilidade

- Um item disponível pode receber uma solicitação.
- Um item com solicitação ativa, reserva ou empréstimo não pode receber outra solicitação.
- Um item devolvido e liberado pode voltar a ser solicitado.
- Um item em manutenção não pode ser solicitado.

### Empréstimos

- Apenas uma pessoa autorizada pode aprovar uma solicitação.
- A aprovação não pode ocorrer quando o item já tiver sido reservado por outra solicitação.
- A devolução libera o item quando sua condição for adequada.
- A devolução com dano move o item para manutenção.
- Um empréstimo cuja data prevista já passou deve aparecer como atrasado.

### Permissões e segurança

- Colaborador não pode aprovar, devolver ou editar equipamentos.
- Operações não pode administrar permissões sem autorização de administrador.
- Usuário só consegue visualizar dados do seu espaço de trabalho.
- Toda alteração importante gera um registro de auditoria.

## Estratégia proposta

1. Testes unitários para regras de disponibilidade, prazo e transição de estados.
2. Testes de integração para gravação no banco e prevenção de reserva dupla.
3. Testes de interface para solicitar, aprovar, retirar e devolver um equipamento.
4. Teste manual de acessibilidade: teclado, foco do modal, contraste e leitura por tecnologias assistivas.

## Critério mínimo antes de publicar

Executar `npm run lint` e `npm run build` sem erros, além de automatizar ao menos os fluxos de solicitação, aprovação, devolução e prevenção de empréstimo duplicado.
