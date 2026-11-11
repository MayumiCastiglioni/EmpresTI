# Plano de fechamento da entrega — 10/11/2026

## Rodada atual das partes 2–4 — 11/11/2026

[Relatório](../verificacao/fechamento-2-4.md): testes ampliados, correção DEC-24,
componente 7/7 e revisão complementar estática confirmada. EMP-R2/DADOS-R3
continuam NÃO PRONTA. Integração local bloqueada por EACCES antes dos 15 testes;
build isolado bloqueado na instalação por DNS. Dados reais/Storage/acesso do
professor, main/produção e tag continuam pendentes. Esta atualização não altera
o trabalho paralelo de fotos e não transforma os checks históricos em atuais.

Este roteiro organiza o trabalho até a entrega, com gates de revisão e produção.
É uma estimativa de execução, não uma nota: o avanço geral foi estimado em cerca
de 55%, sem pesos oficiais para as etapas.
[Plano principal](pratica-sdd-subagentes.md) ·
[Solicitação](solicitar-emprestimo.md) · [Dados iniciais](dados-iniciais.md) ·
[Checklist do enunciado](../checklist-enunciado.md).

## Estado consolidado

- **Empréstimos:** EMP-T03/04/05 concluídas localmente; EMP-T06/07 parciais.
  O endpoint HTTP local com Auth/cookies passou; migrations foram reconstruídas
  em Postgres descartável. As telas autenticadas, foco e viewports foram aprovados
  pela usuária em 10/11; faltam fotos reais, revisão independente, deployment e
  aceite completo.
- **Dados iniciais:** preparação, comparação, persistência, vínculo, rollback e
  consulta pública foram testados localmente com dados sintéticos. A spec segue
  **NÃO PRONTA**: sem fotos reais/manifesto revisado, Storage, conta real do
  professor ou evidência da operação de produção.
- **Verificador:** R4 carregou o agente nativo sob MXC read-only; escrita, perfil,
  .env* e rede foram bloqueados. O resultado aprova somente a fixture, não as specs
  de produto. Revisão independente EMP-T08 segue pendente.
- **Publicação:** log da falha de `main` obtido: `NEXT_NO_ROUTES_MANIFEST`; a
  versão daquela branch configurava `distDir: build`, divergindo de `.next` esperado
  pela Vercel. A correção está na branch `codex/alinhamento-aulas`; Preview do
  commit `bc259e6` passou. `main` e produção não foram atualizadas.
- **Dependências:** correções compatíveis atualizaram Next.js para 16.4.6 e Prisma
  para 7.10.1. `npm audit --omit=dev` agora reporta zero vulnerabilidades de
  produção; o audit completo mantém sete alertas moderados em ferramentas de dev.
- **Entrega:** `ENTREGA.md` é rascunho; auditoria final do enunciado e conferência
  da versão exata ainda não foram feitas.

## Ordem de execução

| Ordem | Tarefa | Responsável / dependência | Critério para avançar |
|---|---|---|---|
| 1 | **Concluída em 10/11:** sincronizar resumo do plano principal e handoff; ligar os documentos de evidência e deixar explícito que snapshots antigos são históricos. | Agente; sem decisão nova. | Resumo ativo atualizado; links conferidos; handoff com 18 linhas. |
| 2 | **Automação concluída em 10/11:** fluxo Playwright local com conta sintética cobriu sucesso, recusa real do sexto empréstimo, catálogo vazio, manutenção, teclado/foco e viewport de 390 px. | Agente; apenas Auth/Postgres locais. | `npm run test:loans-browser-local` passou; conta, empréstimos e equipamentos sintéticos removidos. Capturas preservadas para revisão. |
| 3 | **Concluída em 10/11:** usuária revisou e aprovou as telas autenticadas, o foco e os tamanhos de viewport. | Aprovação explícita da usuária nesta conversa. | Registrada em `docs/validacao-emp-t05-t07.md` e `ENTREGA.md`; fotos reais seguem fora desta aprovação. |
| 4 | **Concluída em 10/11 para a fixture técnica:** descoberta/configuração nativa, erro controlado, ausência de autocorreção, restauração e isolamento MXC comprovados. | Rodadas independentes R1/R2/R4; ver evidência PRA-02. | Check permitido passou 1/1 e probes de escrita/perfil/.env/rede foram bloqueados. Isto não aprova specs de produto nem segurança de produção. |
| 5 | **Parcial em 11/11:** EMP-R1 e DADOS-R2 devolveram NÃO PRONTA. O principal corrigiu parte dos testes EMP; faltam seis fotos, evidências reais e nova revisão. | Revisor independente, depois agente. | Veredito por critério com reprodução e pendências explícitas; não autoaprovar. |
| 6 | **Parcial em 11/11:** seis imagens aprovadas pela usuária (DEC-31); seis patrimônios seguem sem foto adequada. Completar lote e manifesto. | Agente prepara localmente; aprovação visual é humana. | 12 imagens distintas 800×600 aprovadas; créditos/origens conferidos; manifesto validado. |
| 7 | Fechar DAT-01/04/05/06/07/08 com os insumos aprovados; repetir a carga local e os testes de idempotência, divergência e rollback. | Agente; fotos reais e verificação independente. | DADOS-01 a 06 demonstrados localmente sem usar a conta real como fixture. |
| 8 | Preparar operação real de fotos/Storage e conta do professor sem executar escrita remota pelo agente; conferir evidências humanas e zero empréstimos. | Usuária/time executa produção, com checklist preparado pelo agente. | Confirmação humana documentada, sem segredos, sem divergências e sem empréstimos indevidos. |
| 9 | **Concluída em 10/11:** inspecionar log do deploy de `main` (05/11), corrigir o diretório de build localmente e validar na Vercel. | CLI Vercel em modo de leitura; nenhuma configuração remota alterada. | Log mostrou `NEXT_NO_ROUTES_MANIFEST`; o commit `bc259e6` usa o diretório `.next` padrão e o Preview terminou com sucesso. Produção segue sem promoção. |
| 10 | Reler o enunciado completo, fechar ENTREGA.md por critério, validar links/evidências e conferir a versão exata. | Agente prepara; usuária/time revisa e autoriza a entrega. | Nenhuma pendência omitida; GitHub/Vercel e versão final conferidos. Tag final somente com autorização explícita. |

## Revisões humanas previstas

1. **Interface — concluída em 10/11:** a usuária revisou as capturas autenticadas
   em desktop/móvel, o foco e os viewports. Fotos reais e créditos continuam fora
   desse aceite e precisam de revisão própria.
2. **Fotos:** fonte Pixabay autorizada; seis candidatos em rascunho e seis fotos
   pendentes. Revisão humana e conclusão do manifesto antes de qualquer upload.
3. **Dados reais:** a responsável executa a carga/Storage de produção e confirma a conta
   do professor e zero empréstimos; nenhum segredo deve ser enviado na conversa.
4. **Vercel:** diagnóstico do log e Preview corrigido concluídos; produção ainda
   exige revisar a migration remota e seguir o gate humano antes de promover.
5. **Aceite final:** revisão independente das specs e aprovação da versão exata antes
   de tag/publicação.

## Atualização dos tópicos 2 e 3 do planejamento recebido — 11/11/2026

- **Build no OneDrive:** mantido `next.config.ts` no padrão exigido pela Vercel;
  criado e executado `npm run build:isolated`, que compila fora da pasta
  sincronizada. Resultado 0; veja [COR-02](../validacao-cor02-build.md) e
  [DEC-29](../produto/decisoes-pratica.md). O build padrão da CI/Preview continua
  sendo `npm run build`.
- **Revisão visual:** as capturas já tinham aprovação humana em 10/11 para telas,
  foco e viewports. Em 11/11 as três capturas foram conferidas novamente; não foi
  identificado motivo para ampliar globalmente as fontes. A leitura dos metadados
  menores permanece possível; fotos e créditos reais não foram aprovados nessa
  revisão. Sem alteração de UI; detalhes em [EMP-T05/T07](../validacao-emp-t05-t07.md).

## Regras de fechamento

- Manter decisões no registro central e nas fontes competentes; não criar decisão de
  produto por inferência.
- Manter o checklist do enunciado atualizado por tarefa. MCP não é gate de entrega
  segundo ENUN-20; não adicionar essa obrigação ao escopo.
- Dados reais, Storage, deployment, publicação e Git não são executados pelo agente
  sem autorização específica e evidência revisável.
- Não declarar spec pronta, produção funcional ou entrega concluída com base apenas
  em fixtures, build local ou uma revisão não independente.

## Atualização — suíte local de dados — 11/11/2026

A fixture de `tests/professor-local.integration.ts` agora cria o empréstimo legado
com `SOLICITADO`, estado ativo aprovado em DEC-23 e permitido pelo trigger para
uma nova linha. `npm run test:initial-data-local` passou 3/3; `npm test` passou
81/81 e lint passou. Isso corrige o check local, sem provar a conta real do
professor ou concluir DAT-04/05/06/07/08.
