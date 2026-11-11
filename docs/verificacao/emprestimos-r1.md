# EMP-R1 — revisão independente da spec de empréstimos

Data: 11/11/2026. Spec: `docs/specs/solicitar-emprestimo.md`. Escopo: código,
migrations e testes que implementam a spec no workspace atual. O verificador
não editou arquivos. Isolamento técnico **não comprovado**: esta sessão permite
escrita e ferramentas externas; instruções em Markdown não constituem bloqueio.

| CA | Veredito | Evidência e lacuna |
|---|---|---|
| EMP-01 | NÃO COMPROVADO | `tests/loans-local.integration.ts:143`, HTTP `:53`; integrações não executadas pelo revisor. |
| EMP-02 | NÃO COMPROVADO | `tests/loans-local.integration.ts:182`; criação atômica depende de integração. |
| EMP-03 | REPROVADO | Teste `:215` não confere que quantidade de empréstimos permaneceu igual. |
| EMP-04 | REPROVADO | Teste `:231` não exercita antes/igual/depois do vencimento em pedidos. |
| EMP-05 | REPROVADO | Teste de indisponibilidade está rotulado EMP-02 e falta outro tenant/ausência de escrita. |
| EMP-06 | SEM TESTE | Cenários em `:245` e `:273` estão rotulados EMP-05. |
| EMP-07 | NÃO COMPROVADO | `tests/loan-calendar.test.ts:6`; recusa de API fora do calendário sem execução independente. |
| EMP-08 | REPROVADO | HTTP `:53` só tenta forjar `borrowerId`; faltam tenant, prazo e RLS com ID do CA. |
| EMP-09 | REPROVADO | Browser `:94` não executado pelo revisor; fotos/créditos reais e estados completos faltam. |
| EMP-10 | REPROVADO | Teste `:298` cobre rollback, não reenvio sem duplicar. |

`npm test` passou 81/81 na sessão do verificador. Integrações locais, lint e
build não foram executados pelo revisor. O principal havia executado o
Playwright local 1/1 nesta sessão, evidência separada que não altera o parecer.
Fora de escopo: nada encontrado. **Veredito: NÃO PRONTA.**

## Correção posterior pelo principal

Depois do parecer, o principal atualizou `tests/loans-local.integration.ts`:
EMP-03 passou a conferir a contagem inalterada, os cenários de concorrência
receberam ID EMP-06, o teste de indisponibilidade recebeu ID EMP-05 e foi
adicionado teste EMP-10 de reenvio sem duplicação. `npm run test:loans-local`
passou 9/9 e `npm run lint` passou. Esta correção não altera retroativamente
o veredito EMP-R1; falta nova revisão independente e os critérios restantes.
