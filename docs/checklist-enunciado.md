# Revisão do enunciado — requisitos e possíveis pegadinhas

Atualização de fotos em 11/11: DEC-35 registra aprovação visual das 12 pela
usuária no manifesto integral `.cache/imagens/manifesto-candidatos.json`.
Substitui a pendência de aceite visual e a informação de manifesto final não
localizado. ENUN-06/08/09/10 continuam dependentes das demais provas de fonte,
adequação técnica e Storage; aprovação visual não certifica esses requisitos.

Envio imediato solicitado em 11/11: manifesto declarado concluído pela usuária,
mas artefato final não identificado nesta sessão; candidatos locais ainda
declaram oito aprovações. Não fechar ENUN-06/08/09/10 por esse relato isolado.
Suíte final 85/85, componente 7/7, lint e TypeScript passaram. ENUN-13/16/18
seguem pendentes de evidências integradas/reais e publicação. Resumo atual no
início de ENTREGA.md; nenhuma pendência foi convertida em atendimento pelo prazo.

Revisão das partes 2–4 em 11/11/2026:
[evidências atuais](verificacao/fechamento-2-4.md). ENUN-02/15/16 receberam
testes adicionais e correção de atualização após conflito; continuam parciais
até execução integrada e aceite completo. EMP-R2/DADOS-R3: NÃO PRONTA.
ENUN-10/13/17/18 continuam pendentes de evidência real, auditoria final e
publicação. Nenhum check antigo foi promovido a prova atual. Parte de fotos
permanece sob trabalho paralelo; não foi reavaliada nesta sessão.

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
| ENUN-05 | Pedido de autocorreção versus independência do verificador | R1 detectou a falha plantada; R2/R4 aprovaram só a fixture restaurada; não houve autocorreção; R4 comprovou isolamento local |
| ENUN-06 | Catálogo sem crédito versus contrato da skill/API | Pixabay autorizado (DEC-30); DEC-34 autorizou fontes externas para quatro candidatos; 12 registros, oito fotos aprovadas, quatro pendentes de aceite |
| ENUN-07 | sharp solicitado versus dependência não aprovada | Usuária autorizou; instalado/testado; ADR pelo time ainda pendente |
| ENUN-08 | Fonte original Pexels versus fonte alternativa autorizada | Professor autorizou Pixabay (DEC-30); fontes externas autorizadas pela usuária em DEC-34, sem autorização do professor informada; manifesto de candidatos preenchido, aceite integral pendente |
| ENUN-09 | Foto distinta, real, 800x600; sem pessoas/marca/texto/tela | Oito PNGs 800×600 distintos aprovados visualmente; quatro patrimônios ainda precisam de foto adequada e validação do lote |
| ENUN-10 | Upload idempotente, bucket público e crédito rastreável | Verificador GET/roteiro preparados; execução humana/objetos reais pendentes |
| ENUN-11 | Verificador com contexto limpo, gate, tabelas comparáveis e sem produção | R4 foi carregada nativamente e executada sob MXC read-only, sem MCPs/apps; veredito somente da fixture documentado |
| ENUN-12 | Erro plantado, restauração e dois commits de prova | Erro/restauração registrados nos commits locais `12aa161` e `d8bdcbb`; R4 confirma a fixture; sem push; isolamento efetivo comprovado apenas para esta prova local |
| ENUN-13 | Doze itens exatos, conta professor e zero empréstimos | Testes sintéticos locais passaram; carga/acesso reais não comprovados |
| ENUN-14 | Solicitação inicia empréstimo, sem retirada/aprovação intermediária | DEC-23, trigger, serviço, tRPC e tela iniciam `RETIRADO`/`EMPRESTADO`; Postgres, HTTP/Auth local, componente e navegador Playwright autenticado passaram; usuária aprovou visual/foco/viewport em 10/11 |
| ENUN-15 | Concorrência, limite, atraso e dados próprios na solicitação | Oito testes Postgres cobrem regras, concorrência e RLS; HTTP/Auth e navegador local confirmaram fluxo próprio e recusa no sexto ativo; papel do deployment e aceites completos pendentes |
| ENUN-16 | Duas specs com plano/tasks e aceites realmente verificados | EMP-R1 e DADOS-R2 independentes deram NÃO PRONTA; correções locais de testes EMP posteriores ainda exigem nova revisão; dados reais parciais |
| ENUN-17 | ENTREGA.md com conflitos/lacunas/alternativas/decisões e rodadas reais | DEC-26/27/30/31 e rodadas EMP-R1/DADOS-R2 documentadas; auditoria final e versão entregue pendentes |
| ENUN-18 | Site funcionando, GitHub e tag entrega-pratica na versão final | O deploy da `main` (commit `3bcb029`, 05/11) falhou com `NEXT_NO_ROUTES_MANIFEST`: a configuração dessa versão usava `distDir: build`, enquanto a Vercel procurava `.next`. A branch `codex/alinhamento-aulas`, commit `bc259e6`, usa o diretório padrão e seu Preview concluiu com sucesso. `main` não foi atualizada; migrations remotas, produção e tag final continuam pendentes |
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
