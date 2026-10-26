---
name: graficos-operacoes
description: Escolha e implemente indicadores ou gráficos para Operações no EmpresTI quando uma spec aprovada definir a pergunta de negócio e os dados necessários. Não use para inventar métricas, filtros ou bibliotecas.
---

# Gráficos de Operações

Use esta skill somente quando uma tela de Operações precisar responder a uma pergunta explícita sobre equipamentos, solicitações ou empréstimos.

## Antes de implementar

1. Localize a pergunta, o critério de aceite e o contrato de dados na spec correspondente.
2. Consulte `docs/PRD.md`, `docs/rules/operation.md`, `docs/layout.md` e `docs/adr/002-layout-nocturne.md`.
3. Se não houver pergunta mensurável, período e dados disponíveis, proponha um indicador simples ou peça a decisão; não adicione um gráfico por decoração.

## Direção de implementação

- Escolha a menor visualização que responda à pergunta: indicador, lista, comparação, evolução ou composição.
- Declare de onde vêm dimensão, medida, período, filtros e estados dos dados. Não preencha lacunas de backend com números fictícios em uma tela funcional.
- Aplique tokens Nocturne, rótulos legíveis, alternativa textual, contraste, foco e comportamento responsivo.
- Inclua estados de carregamento, vazio, erro e dados insuficientes quando o contrato de dados existir.

## Verificação

- Cada série, filtro e texto deve corresponder a um critério de aceite.
- A leitura não pode depender apenas de cor, animação ou interação de ponteiro.
- Execute os checks aplicáveis em `docs/rules/checks.md` e os cenários de interface em `docs/rules/tests.md`.
