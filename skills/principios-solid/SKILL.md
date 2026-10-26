---
name: principios-solid
description: Analise ou melhore responsabilidade, acoplamento, extensibilidade e testabilidade de código TypeScript do EmpresTI usando princípios SOLID. Use quando a solicitação mencionar SOLID ou uma mudança estrutural em services, routers ou módulos de domínio; não use para redefinir a arquitetura ou criar abstrações sem necessidade real.
---

# Princípios SOLID

Use SOLID como lente para uma mudança aprovada, não como um checklist para todo arquivo.

## Antes de analisar

1. Identifique a spec, o critério de aceite e o fluxo real do código.
2. Leia `docs/adr/001-stack.md` e as regras aplicáveis, em especial `docs/rules/restrictions.md` e `docs/rules/tests.md`.
3. Preserve as fronteiras definidas pelo ADR: interface, tRPC, serviço e Prisma têm responsabilidades distintas.

## Como avaliar

- Responsabilidade única: procure motivos independentes para o módulo mudar.
- Aberto/fechado e substituição: só proponha extensão quando existir uma variação real prevista pela spec.
- Segregação e inversão: reduza acoplamento apenas quando houver consumidores ou detalhes concretos que prejudiquem manutenção e testes.

Para cada achado, informe arquivo e linha, impacto observado, menor alternativa compatível com a spec, risco e teste que comprovaria a alteração. Diferencie uma violação concreta de preferência de estilo.

## Limites

- Não introduza factories, interfaces ou camadas sem segundo caso de uso ou problema demonstrável.
- Não substitua decisões de `docs/adr/` nem altere regras do PRD.
- Se a solicitação incluir refatoração, implemente apenas após a análise e aprovação do escopo.
