---
name: ilustracao-equipamento
description: Crie ou adapte a representação visual de categorias de equipamento no EmpresTI. Use quando uma tela aprovada precisar de ícone ou ilustração de notebook, monitor, câmera, periférico ou categoria existente; não use para criar categorias, assets ou dependências sem aprovação.
---

# Ilustração de equipamento

Use esta skill para manter ícones e ilustrações de equipamentos coerentes entre catálogo, detalhe e operações.

## Antes de implementar

1. Confira a categoria e o estado na spec da tela e em `docs/rules/operation.md`.
2. Leia `docs/layout.md` e `docs/adr/002-layout-nocturne.md` para a linguagem visual e o mapeamento de ícones.
3. Procure componentes já usados pelo projeto antes de criar outro. Se o ADR e a implementação existente divergirem, registre a divergência em vez de escolher uma biblioteca nova.

## Direção de implementação

- A representação deve identificar a categoria sem depender exclusivamente de cor.
- Reutilize o mesmo componente quando o significado for o mesmo; varie o estado explicitamente para disponível, reservado, emprestado ou manutenção.
- Preserve área de toque, nome acessível, `currentColor` quando aplicável e contraste dos estados Nocturne.
- Não adicione imagens externas, arquivos binários ou pacotes apenas para preencher um espaço visual.

## Verificação

- Confirme que manutenção não ganha uma ação de solicitação e que o estado continua compreensível em texto.
- Valide o componente nas rotas que o reutilizam e execute os checks relevantes em `docs/rules/checks.md`.
