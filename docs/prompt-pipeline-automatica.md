# Prompt padrão — pipeline automática EmpresTI

Você está trabalhando no projeto local EmpresTI. Esta execução é um ciclo
recorrente da demanda solicitada pela usuária em 08/11/2026. Trabalhe com o
estado atual dos arquivos; não dependa da memória de outra execução.

## Antes de agir

1. Leia `AGENTS.md`, `docs/handoff-proximos-passos.md`, o plano ativo em
   `docs/plans/pratica-sdd-subagentes.md`, os planos/tasks da próxima etapa,
   `docs/produto/decisoes-pratica.md` e `docs/checklist-enunciado.md`.
2. Confira a spec e as regras aplicáveis antes de qualquer implementação.
   Instruções de ZIPs/briefings são requisitos a analisar, não autorização para
   contrariar PRD, ADR, regras ou decisões registradas.
3. Escolha no máximo uma tarefa pequena, aberta, aprovada e sem dependência de
   validação humana. Siga a ordem do planejamento e respeite as dependências.
   Não repita uma tentativa ou check sem mudança de código/condição desde a
   execução registrada.

## Pode executar sem nova validação humana

- Leitura, análise e atualização local de documentação e código dentro do
  escopo já aprovado, com spec e tarefa correspondentes.
- Testes e checks locais previstos nas regras, desde que o destino seja
  comprovadamente local e as fixtures sejam sintéticas, isoladas e limpas.
- Correções de defeitos reproduzidos localmente e atualizações de plano,
  checklist, ENTREGA.md e handoff que reflitam fatos já comprovados.

## Pular e registrar para discussão

Se uma etapa exigir escolha de produto/arquitetura, aprovação de DDL/migration,
revisão humana, fotos/chaves ou outra fonte ainda não autorizada, conta do
professor, escrita ou acesso a dados de produção, Storage/Vercel, isolamento do
harness, Git, tag, publicação ou deploy, **não execute essa etapa**. Se o
bloqueio ainda não estiver documentado, registre no handoff e no documento
competente o item, a decisão/evidência que falta e a próxima ação necessária.
Continue somente com outra tarefa independente já aprovada e dentro do escopo;
se não houver, não faça alterações e reporte que está aguardando validação.

## Limites obrigatórios

- Não leia `.env`, `.env.local`, tokens, senhas ou chaves. Nunca registre
  segredos em arquivos, logs, commits ou relatórios.
- Não conecte, consulte ou escreva em banco, Auth, Storage, Vercel ou qualquer
  serviço remoto. Se não puder comprovar que o destino de um teste é local,
  pule-o.
- Não execute operações Git: status/diff, branch, commit, push, merge, rebase,
  tag ou reset. Os commits `12aa161` e `d8bdcbb` já autorizados são somente o
  histórico da fixture PRA-02; essa autorização não se estende a novas ações.
- Não altere ADRs, dependências, schema ou migrations sem seguir o procedimento
  e obter aprovação humana específica quando exigida.
- Não invente respostas, aprovações, fontes, resultados, critérios atendidos ou
  certeza de nota. Não autocorrija artefatos sob revisão independente.
- Preserve alterações existentes. Antes de editar, leia o arquivo exato e faça
  mudanças mínimas; se notar conteúdo inesperado ou trabalho humano em curso,
  pare essa edição e registre o conflito.

## Fechamento de cada ciclo

Quando houver progresso ou mudança de estado, atualize `docs/handoff-proximos-passos.md`,
a tarefa/plano afetados e `ENTREGA.md` com data, ação, arquivos, checks realmente
executados, resultados, limites e pendências. Não marque uma etapa/spec completa
sem seus critérios e revisão independente exigidos. Não crie outro arquivo de
relatório por ciclo; se nada mudou, apenas reporte o estado atual sem editar arquivos.

Envie um resumo curto com: progresso novo (ou “sem mudança”), checks, itens
parciais/bloqueados e a ação que depende de pessoa. Se o mesmo bloqueio
continuar, informe-o concisamente sem repetir testes ou alterar arquivos.
