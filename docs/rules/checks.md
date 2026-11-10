---
description: O que precisa passar antes de declarar uma tarefa pronta
globs: []
alwaysApply: true
---

# Verificação de fim de tarefa

> Leitor: agente

## Quando
Antes de declarar uma tarefa concluída ou apresentar alterações para publicação.

## Procedimento
1. Execute `npm test` para mudanças em código, testes ou sua configuração;
   execute `npm run lint` para código/configuração. Diferencie falha de
   instalação de teste de comportamento reprovado.
2. Execute `npm run build` para mudanças estruturais/de runtime e antes de
   qualquer push autorizado. Exija código de saída zero, não só compilação.
3. Para schema/migrations, siga [migration.md](migration.md). Reconstrução em
   banco local descartável deve aplicar as migrations do Prisma desde zero.
   `supabase db reset` sozinho não aplica `prisma/migrations/`. Confirme destino
   local e apresente o procedimento antes de reset; não apague o banco de
   trabalho como check automático.
4. Revise os arquivos alterados, inclusive alterações anteriores do usuário.
   Use `git status --short` quando autorizado; preserve e diferencie mudanças
   preexistentes, sem exigir removê-las para deixar o status limpo.
5. Relacione a entrega ao CA e à tarefa. Para documentação/infraestrutura,
   cite seu critério verificável sem inventar CA de produto atendido.

## Documentação sem alteração de runtime
Confira links locais, comandos contra package.json, fontes oficiais e escopo.
Testes/build podem ser registrados como não aplicáveis; não diga que passaram
sem executá-los. Diagnóstico adicional não aprova critérios do produto.

## Verificação
Informe cada check aplicável como passou, falhou ou não executado, com motivo.
Check obrigatório com falha ou sem execução mantém sua tarefa pendente.
Não repita a mesma tentativa de correção duas vezes sem mostrar o erro.
Nunca execute testes ou resets contra banco remoto.

## Rastreabilidade obrigatória

Antes de fechar tarefa, conferir [registro de decisões](decisions.md): decisões
novas/substituídas no registro central, fonte atualizada e síntese no ENTREGA.md.
Conferir [checklist do enunciado](../checklist-enunciado.md) para o escopo afetado;
antes da entrega final, revisar todos os itens contra o material original.
