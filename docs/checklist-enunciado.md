# Revisão do enunciado — requisitos e possíveis pegadinhas

Fonte: `pratica-sdd-subagentes (1).zip` / `pratica-sdd-subagentes.html` e
materiais de aula recebidos. O texto completo do enunciado (seções 00–07) foi
relido e comparado em 07/11/2026. Esta revisão não significa que os requisitos
estejam atendidos nem substitui a conferência final da versão a entregar.
[Plano](plans/pratica-sdd-subagentes.md) · [Decisões](produto/decisoes-pratica.md).

## Matriz de conferência

| ID | Conferir contra o material original | Situação/evidência atual |
|---|---|---|
| ENUN-01 | Briefing pede 5 enquanto PRD antigo dizia 3 | DEC-02, trigger e serviço recusam o sexto; integração Postgres passou. Revisão independente/entrega ainda pendentes |
| ENUN-02 | 14 dias úteis versus prazo antigo sem calendário | DEC-19: só fixos; cálculo 2026–2030/23:59:59 testado isoladamente e consumido no serviço local; fronteiras/runtime ainda pendentes |
| ENUN-03 | TI-0010 manutenção na lista versus disponível no briefing | Decidido disponível; só TI-0004/0007 manutenção; lote conferido |
| ENUN-04 | Senha literal solicitada versus proibição de segredos | Não versionar valor; conferir preparação e evidências finais sem segredo |
| ENUN-05 | Pedido de autocorreção versus independência do verificador | R1/R2 realizadas; verificador não corrigiu; isolamento efetivo pendente |
| ENUN-06 | Catálogo sem crédito versus contrato da skill/API | UI aceita crédito Pexels e exibe metadados quando válidos; nenhuma foto real foi adquirida |
| ENUN-07 | sharp solicitado versus dependência não aprovada | Usuária autorizou; instalado/testado; ADR pelo time ainda pendente |
| ENUN-08 | Fonte exclusiva Pexels versus proposta de Pixabay | Em 07/11, Help Center Pexels ainda informa emissão de novas chaves pausada; Pixabay não aprovado; fotos reais pendentes |
| ENUN-09 | Foto distinta, real, 800x600; sem pessoas/marca/texto/tela | Scripts locais testados; fotos reais e revisão visual ainda pendentes |
| ENUN-10 | Upload idempotente, bucket público e crédito rastreável | Verificador GET/roteiro preparados; execução humana/objetos reais pendentes |
| ENUN-11 | Verificador com contexto limpo, gate, tabelas comparáveis e sem produção | Rodadas documentadas; descoberta nativa/isolamento ainda não comprovadas |
| ENUN-12 | Erro plantado, restauração e dois commits de prova | Prova comportamental registrada nos commits locais `12aa161` e `d8bdcbb`; sem push; isolamento e carregamento nativo ainda pendentes |
| ENUN-13 | Doze itens exatos, conta professor e zero empréstimos | Testes sintéticos locais passaram; carga/acesso reais não comprovados |
| ENUN-14 | Solicitação inicia empréstimo, sem retirada/aprovação intermediária | DEC-23, trigger, serviço, tRPC e tela iniciam `RETIRADO`/`EMPRESTADO`; Postgres, HTTP/Auth local, componente e navegador Playwright autenticado passaram; usuária aprovou visual/foco/viewport em 10/11 |
| ENUN-15 | Concorrência, limite, atraso e dados próprios na solicitação | Oito testes Postgres cobrem regras, concorrência e RLS; HTTP/Auth e navegador local confirmaram fluxo próprio e recusa no sexto ativo; papel do deployment e aceites completos pendentes |
| ENUN-16 | Duas specs com plano/tasks e aceites realmente verificados | Spec de empréstimos em implementação parcial; EMP-T03/04/05 validadas localmente, EMP-T06/07 parciais, revisão independente pendente; dados parciais |
| ENUN-17 | ENTREGA.md com conflitos/lacunas/alternativas/decisões e rodadas reais | DEC-26/27 e EMP-T04/05 documentados; auditoria final por item e evidências da versão entregue pendentes |
| ENUN-18 | Site funcionando, GitHub e tag entrega-pratica na versão final | PR #1 aparece merged em 05/11, mas o check do Vercel Preview falhou; o log/detalhe não foi acessível nesta sessão, então a causa permanece não confirmada. Publicação/tag final pendentes |
| ENUN-19 | Limites da prática versus funcionalidades futuras do PRD | Devolução/Operações adiadas nesta fatia, sem apagar escopo futuro |
| ENUN-20 | O enunciado menciona agentes, rules, skills e MCPs disponíveis | O texto permite usar essas ferramentas; MCP não aparece como entrega obrigatória. Nenhum MCP de projeto encontrado ou uso comprovado nesta atividade; não alegar aula demonstrada |

## Revisões planejadas

- Por tarefa: conferir linha aplicável, trecho original, decisão e teste/evidência.
- Antes de revisão independente: percorrer cada critério, incluindo requisitos
  não funcionais, independência, formatos e restrições de produção.
- Antes de publicar/tag: reler integralmente o ZIP e o material relevante;
  verificar se houve nova versão, comparar nomes/quantidades/formato da entrega
  e abrir os links/arquivos da versão exata que será entregue.
- Fechamento: pessoa responsável e data por item, localização/trecho da fonte,
  evidência reproduzível e estado atendido/pendente/conflito. Sem evidência,
  não marcar atendido; aprovação local não substitui produção.

Se o professor autorizar exceção, guardar referência e motivo sem segredo;
registrar mudança no contrato antes de declarar o requisito original cumprido.
