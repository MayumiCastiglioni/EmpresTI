# ADR-002 — Sistema visual Nocturne e estrutura de telas

**Status:** aceito  
**Contexto do produto:** [docs/layout.md](../layout.md) e [docs/PRD.md](../PRD.md)

## Contexto

O EmpresTI precisa de uma interface interna densa e operacional para catálogo, empréstimos e operações. O layout de referência define uma identidade Nocturne adaptada à primária `#001449`, seis telas e regras visuais que tornam os estados do negócio perceptíveis: disponibilidade, manutenção, atraso, limite de itens e prazo de devolução.

A ADR-001 escolheu Next.js, Tailwind e shadcn/ui, mas não definiu como a aparência, os componentes e as regras de negócio visíveis seriam organizados.

## Decisão

| Item | Escolha |
|---|---|
| Tema | Apenas modo escuro Nocturne; não haverá alternador de tema na v1. |
| Fonte visual | `docs/layout.md` é a fonte de verdade para tokens, componentes, páginas e comportamento visual. |
| Tokens | Cores, bordas, raios, espaçamentos, tipografia e transições serão centralizados como tokens reutilizáveis. |
| Implementação | Componentes React com estilos encapsulados; estilos globais ficam restritos a reset, fonte, tokens e animações compartilhadas. |
| Biblioteca de componentes | shadcn/ui pode fornecer comportamento acessível, mas sua aparência deve ser sobrescrita para obedecer aos tokens Nocturne. |
| Ícones | Phosphor Icons, conforme o mapeamento do layout. |
| Layout do app | Sidebar fixa de 236px + área principal; login sem sidebar. |
| Responsividade | A referência de 1440px define o desktop; adaptações menores preservam hierarquia, foco e ações principais. |

## Regras de implementação

- Usar `#001449` como fundo profundo de marca, hero e estados ativos; a ação visível usa `#5B7FE0` e seus tons claros.
- Superfícies são diferenciadas por borda e escurecimento; não usar sombras pesadas, gradientes fora dos três autorizados ou preto/branco puros.
- Ação primária é contornada. Botão preenchido é reservado apenas para confirmação em diálogo.
- Construir grupos com `flex` ou `grid` e `gap`; não usar espaçamento acidental por whitespace ou margens isoladas como estrutura de layout.
- Aplicar foco visível com `outline: 2px solid #5B7FE0` e respeitar `prefers-reduced-motion`.
- Manter a cópia seca e operacional, em português do Brasil, sem emojis e com datas no formato `dd/mmm`.
- Implementar as rotas previstas: `/login`, `/catalogo`, `/catalogo/:patrimonio`, `/meus-emprestimos`, `/operacoes/emprestimos` e `/operacoes/equipamentos/novo`.

## Regras de negócio que a interface deve evidenciar

- Limite de três itens por colaborador, com contador e segmentos visíveis.
- Prazo padrão de 14 dias, com data calculada e progresso de prazo.
- Atraso bloqueia nova solicitação e precisa apresentar motivo compreensível.
- Item em manutenção não aparece como disponível e não oferece ação de solicitação.

## Justificativa

- Um conjunto único de tokens impede que cada tela recrie cores, bordas e estados de forma diferente.
- O modo escuro e a baixa saturação favorecem leitura contínua em uma ferramenta de operação interna.
- Ligar estados visuais às regras do PRD reduz ambiguidades: não basta marcar atraso ou manutenção no banco; a pessoa precisa entender o efeito da regra na tela.
- Usar uma biblioteca apenas como base comportamental preserva acessibilidade sem abrir mão da identidade visual definida.
- Estilos encapsulados evitam que a implementação detalhada de uma tela altere outra por efeito colateral.

## Alternativas descartadas

- **Tema claro ou alternador de tema na v1** — contraria a referência visual e adiciona variantes sem necessidade de produto.
- **Aplicar o visual padrão de shadcn/ui** — acelera o início, mas não reproduz a densidade, os estados e a identidade Nocturne.
- **Valores de cor e espaçamento escritos diretamente em cada componente** — cria divergência visual e torna ajustes globais caros.
- **Sidebar diferente para Operações** — o layout define Operações como seção do mesmo app, não produto separado.
- **Animações decorativas ou longas** — competem com uma ferramenta operacional e prejudicam pessoas com sensibilidade a movimento.

## Consequências

- As telas terão aparência consistente e os estados críticos ficarão mais fáceis de identificar.
- Criar um componente exige respeitar tokens e variantes existentes antes de criar novos valores.
- A adoção visual do shadcn/ui terá custo de customização; ele não deve introduzir cores, raios ou sombras próprias.
- A implementação precisa validar contraste, foco de teclado, estados desabilitados e a versão com movimento reduzido.

## O que este ADR não decide

- Modelo de dados, permissões e transições de estado no servidor.
- Conteúdo definitivo de cada equipamento ou pessoa.
- Notificações, reserva futura e importação de planilha, que permanecem fora do escopo da v1.
- A estratégia específica de testes visuais ou captura de regressão.
