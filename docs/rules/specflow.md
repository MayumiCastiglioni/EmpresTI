# Fluxo de especificação

Este processo evita que uma ideia de melhoria vá direto para o código sem regras claras de negócio, interface e validação.

## 1. Descrever a necessidade

Registrar em linguagem simples:

- Quem precisa da melhoria?
- Qual problema ela resolve?
- O que deve acontecer ao final?
- O que fica explicitamente fora do escopo?

Exemplo: “Operações precisa registrar devoluções danificadas para impedir que o item volte ao catálogo antes da manutenção.”

## 2. Definir regras e estados

Antes de desenvolver, decidir:

- Quem pode executar cada ação.
- Quais dados são obrigatórios.
- Quais estados existem antes e depois da ação.
- O que deve acontecer em erros, cancelamentos e conflitos.

Decisões ainda abertas devem ser incluídas em [produto/perguntas-em-aberto.md](../produto/perguntas-em-aberto.md).

## 3. Especificar o fluxo

Para cada melhoria, documentar:

1. Ponto de início da pessoa usuária.
2. Campos e validações da tela.
3. Resultado em caso de sucesso.
4. Mensagem e comportamento em caso de falha.
5. Alterações esperadas em inventário, histórico e notificações.

## 4. Implementar em partes pequenas

Uma melhoria deve incluir, quando aplicável:

- Modelo de dados e validação no servidor.
- Regra de negócio que impeça estados inválidos.
- Interface acessível e compreensível.
- Testes dos cenários essenciais.
- Atualização dos documentos de operação e testes.

## 5. Revisar antes de concluir

A melhoria só está pronta quando:

- O fluxo funciona do início ao fim.
- Não cria empréstimos duplicados nem expõe dados indevidos.
- Os comandos de qualidade passam.
- O comportamento e as limitações estão documentados.

## Modelo para novas especificações

```md
# Nome da melhoria

## Problema

## Pessoas envolvidas

## Escopo

## Fora do escopo

## Regras de negócio

## Fluxo da interface

## Critérios de aceite

## Casos de teste
```
