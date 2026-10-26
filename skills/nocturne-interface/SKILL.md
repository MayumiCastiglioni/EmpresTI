---
name: nocturne-interface
description: Crie ou revise telas e componentes React do EmpresTI no sistema visual Nocturne. Use para trabalho de interface aprovado em rotas, catálogo, empréstimos ou operações; não use para decidir regras de negócio, autenticação ou arquitetura.
---

# Interface Nocturne

Use esta skill quando a tarefa envolver a aparência, estrutura ou acessibilidade de uma tela do EmpresTI.

## Antes de implementar

1. Leia a tela e o critério de aceite em `docs/specs/`, além de `docs/layout.md` e `docs/adr/002-layout-nocturne.md`.
2. Confirme se a mudança depende de uma decisão ainda aberta em `docs/perguntas-prd.md`. Não simule um fluxo persistente para contornar uma decisão pendente.
3. Reutilize um componente ou token existente antes de criar uma nova variante visual.

## Direção de implementação

- Preserve o tema Nocturne, a cópia operacional em pt-BR, foco visível e `prefers-reduced-motion` definidos no ADR-002.
- Modele estados de disponibilidade, manutenção, atraso, limite de três itens e prazo de 14 dias somente quando forem suportados pelo contrato da tela.
- Use layout com `flex` ou `grid` e `gap`; a sidebar é exclusiva das telas internas, nunca do login.
- Mantenha estados de carregamento, vazio, erro e indisponibilidade compreensíveis sem depender apenas de cor.

## Verificação

- Confira a rota em desktop e viewport estreito, incluindo navegação por teclado.
- Execute os checks aplicáveis em `docs/rules/checks.md` e registre qualquer limite de validação.
- Se `docs/layout.md`, a spec e o código entrarem em conflito, descreva o conflito e aguarde decisão.
