# EMP-R2 — revisão independente — 11/11/2026

Spec: `docs/specs/solicitar-emprestimo.md`. Escopo: implementação atual e
alterações não commitadas. Revisor: `revisao_emprestimos`, contexto limpo,
sem correções. Isolamento técnico: **NÃO COMPROVADO**, ambiente permite escrita.

| CA | Evidência (tests/) | Status | Lacuna |
|---|---|---|---|
| EMP-01 | loans-local.integration.ts:204; loans-http-local.integration.mjs:53 | NÃO COMPROVADO | Integrações de sessão/membership/RLS não executadas |
| EMP-02 | loans-local.integration.ts:255 | NÃO COMPROVADO | Atomicidade/persistência não executadas |
| EMP-03 | loans-local.integration.ts:288 | NÃO COMPROVADO | Recusa do sexto sem escrita depende do Postgres |
| EMP-04 | loan-calendar.test.ts:32; loans-local.integration.ts:143,306 | NÃO COMPROVADO | Fronteiras adicionadas; integração não executada |
| EMP-05 | loans-local.integration.ts:169,277 | NÃO COMPROVADO | Manutenção/inexistente/outro tenant não executados |
| EMP-06 | loans-local.integration.ts:320,348 | NÃO COMPROVADO | Concorrência depende do Postgres |
| EMP-07 | loan-calendar.test.ts:6; loans-local.integration.ts:196 | NÃO COMPROVADO | Consumidor persistente não executado |
| EMP-08 | loans-local.integration.ts:182,204; loans-http-local.integration.mjs:53 | NÃO COMPROVADO | Forja/RLS/API reais não executadas |
| EMP-09 | catalog-page.test.tsx:28,42; loans-browser-local.integration.mjs:94 | NÃO COMPROVADO | Componente passou 5/5 após correção de seletores; browser/fotos reais pendentes |
| EMP-10 | loans-local.integration.ts:373,409 | NÃO COMPROVADO | Rollback/reenvio não executados; atualização após conflito divergente da DEC-24 |

Achado: catch de confirmRequest apenas mostrava erro, sem atualizar consultas
na indisponibilidade, contrariando DEC-24. Teste existente de recusa por limite
também não exercitava esse conflito. Principal corrigiu posteriormente o
caso específico de indisponibilidade; essa correção não altera este parecer.

Checks independentes: lint passou (exit 0); reteste de componente passou 5/5.
Suíte completa inicial observou duas falhas de seletores EMP-09, corrigidas
depois; ainda sem conclusão no encerramento da revisão. Integrações não
executadas após diagnóstico local EACCES informado pelo principal. Build só
pelo principal. Fora de escopo: nada encontrado no caminho de solicitação;
transições legadas permanecem sem nova ação pública.

**Veredito: NÃO PRONTA** — faltam provas funcionais executadas, fotos reais
e alinhamento da atualização após conflito. [Fechamento](fechamento-2-4.md).

## Complemento EMP-R2A — após correção

O mesmo revisor, sem editar ou executar checks adicionais, confirmou
estaticamente que o achado DEC-24 foi resolvido: catch atualiza catálogo e
próprios empréstimos na indisponibilidade; falha ao recarregar recebe mensagem
genérica. Teste parametrizado cobre sucesso e falha, ambas as consultas,
preservação da recusa e ausência de sucesso indevido. O principal executou
7/7, sem atribuir execução ao revisor. Spec continua NÃO PRONTA por integrações
e fotos reais não comprovadas. Não substitui o snapshot EMP-R2 acima.
