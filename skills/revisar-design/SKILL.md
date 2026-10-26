---
name: revisar-design
description: Faça revisão estrutural de código de servidor do EmpresTI antes de uma alteração ou entrega. Use para encontrar mistura de transporte, regra de negócio, persistência, autorização e duplicação em routers, services e módulos TypeScript; não use para mudar a arquitetura ou implementar refatorações sem pedido.
---

# Revisar design de backend

Use esta skill para revisar a organização do código existente. Ela produz um diagnóstico; não autoriza mudanças por si só.

## Antes da revisão

1. Localize a tarefa aprovada, a spec e o critério de aceite que o código atende.
2. Leia `docs/adr/001-stack.md`, `docs/rules/restrictions.md`, `docs/rules/operation.md` e `docs/rules/tests.md` conforme o módulo revisado.
3. Entenda o caminho de dados e autorização antes de apontar um problema.

## Roteiro de revisão

- Declare a responsabilidade de cada módulo e suas dependências.
- Procure mistura entre camada de transporte, autorização, regra de domínio, persistência e formatação.
- Procure duplicação, dependências que impedem teste, contratos excessivos e abstrações sem uso real.
- Para cada achado, informe arquivo e linha, impacto, menor mudança possível e teste aplicável.

## Resultado esperado

Separe achados em: problema que precisa de correção, melhoria opcional e ponto já adequado. Caso não haja problema relevante, registre as camadas examinadas e por quê.

## Limites

- Não transforme preferência de estilo em requisito de produto.
- Não aplique refatoração, troca de dependência ou mudança de regra sem solicitação explícita.
- Não ignore a autorização tRPC e a defesa em profundidade por RLS previstas no ADR-001.
