# Plano de fechamento da entrega — 10/11/2026

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
- **Verificador:** R1/R2 exercitaram falha e restauração numa fixture; falta provar
  carregamento nativo e isolamento técnico. Não aceitar as specs por essas rodadas.
- **Publicação:** causa do Preview Vercel não confirmada; falta log da falha.
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
| 4 | Provar descoberta/configuração nativa e isolamento do verificador; rodar prova controlada de erro, bloqueio de autocorreção e restauração. | Agente no ambiente suportado; gate por revisor independente. | Evidência mostra configuração carregada e limites efetivos; revisor independente confirma sem editar. |
| 5 | Solicitar revisão independente EMP-T08 e nova rodada da spec de dados depois de reunir evidências suficientes; principal corrige e pede nova revisão. | Revisor independente, depois agente. | Veredito por critério com reprodução e pendências explícitas; não autoaprovar. |
| 6 | Desbloquear imagens: obter chave Pexels se a emissão voltar ou pedir autorização formal do professor para uma fonte alternativa; então obter 12 imagens distintas, preparar manifesto e revisar conteúdo/crédito. | Usuária/professor decide a fonte e fornece acesso; agente prepara localmente. | Fonte autorizada; 12 imagens 800×600 aprovadas visualmente; créditos e origens conferidos. |
| 7 | Fechar DAT-01/04/05/06/07/08 com os insumos aprovados; repetir a carga local e os testes de idempotência, divergência e rollback. | Agente; fotos reais e verificação independente. | DADOS-01 a 06 demonstrados localmente sem usar a conta real como fixture. |
| 8 | Preparar operação real de fotos/Storage e conta do professor sem executar escrita remota pelo agente; conferir evidências humanas e zero empréstimos. | Usuária/time executa produção, com checklist preparado pelo agente. | Confirmação humana documentada, sem segredos, sem divergências e sem empréstimos indevidos. |
| 9 | Diagnosticar Preview Vercel a partir do log, corrigir localmente e revalidar. | Usuária fornece o log/acesso de leitura; agente analisa e corrige. | Causa comprovada, correção testada e preview validado pelo responsável. |
| 10 | Reler o enunciado completo, fechar ENTREGA.md por critério, validar links/evidências e conferir a versão exata. | Agente prepara; usuária/time revisa e autoriza a entrega. | Nenhuma pendência omitida; GitHub/Vercel e versão final conferidos. Tag final somente com autorização explícita. |

## Revisões humanas previstas

1. **Interface — concluída em 10/11:** a usuária revisou as capturas autenticadas
   em desktop/móvel, o foco e os viewports. Fotos reais e créditos continuam fora
   desse aceite e precisam de revisão própria.
2. **Fotos:** pedir a decisão do professor se Pexels continuar sem novas chaves; revisar
   fotos/manifesto antes de qualquer upload.
3. **Dados reais:** a responsável executa a carga/Storage de produção e confirma a conta
   do professor e zero empréstimos; nenhum segredo deve ser enviado na conversa.
4. **Vercel:** solicitar o log do Preview antes de atribuir causa ou propor alteração
   remota.
5. **Aceite final:** revisão independente das specs e aprovação da versão exata antes
   de tag/publicação.

## Regras de fechamento

- Manter decisões no registro central e nas fontes competentes; não criar decisão de
  produto por inferência.
- Manter o checklist do enunciado atualizado por tarefa. MCP não é gate de entrega
  segundo ENUN-20; não adicionar essa obrigação ao escopo.
- Dados reais, Storage, deployment, publicação e Git não são executados pelo agente
  sem autorização específica e evidência revisável.
- Não declarar spec pronta, produção funcional ou entrega concluída com base apenas
  em fixtures, build local ou uma revisão não independente.
