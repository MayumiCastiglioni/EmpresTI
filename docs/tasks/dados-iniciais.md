# Tarefas — dados iniciais

DEC-35 (11/11): aceite visual de todas as 12 fotos registrado no manifesto
integral de imagens. Etapa de aprovação visual concluída pela usuária;
adequação técnica/fontes/Storage e aceite completo de DADOS-04 continuam pendentes.

Rodada 11/11, partes 2–4: DADOS-R3 independente continua NÃO PRONTA; não houve
carga remota/Storage/login professor. Resultados locais históricos não comprovam
dados reais. [Evidência e pré-requisitos](../verificacao/fechamento-2-4.md).
Fotos são tratadas em outra conversa; nenhuma tarefa de fotos foi fechada aqui.

[Spec](../specs/dados-iniciais.md) · [Plano](../plans/dados-iniciais.md).

- [x] DAT-00: transcrever lote, incorporar decisões e preparar proposta documental.
- [ ] DAT-01: fechar lacunas e aprovar spec/plano (DADOS-01 a DADOS-06).
- [x] DAT-02: DDL/impacto/migração e contrato aprovados em 06/11/2026.
- [x] DAT-03: coluna/migration e testes locais da mudança aprovados; não conclui DADOS-01/06.
- [ ] DAT-04: fotos reais e manifesto revisados (DADOS-04).
- [ ] DAT-05: pré-validação e carga local (DADOS-01/02/03).
- [ ] DAT-06: provisionamento Auth/vínculo e testes sintéticos (DADOS-02/03/05/06).
- [ ] DAT-07: integração duas execuções, falhas e checks; revisão independente.
- [ ] DAT-08: roteiro e evidências humanas de produção, sem escrita pelo agente.

Estado acumulado abaixo: há implementação parcial local; nenhum CA da spec completa aprovado.

DAT-02: proposta concreta preparada em
[DDL/impacto/migração](../plans/dados-iniciais-ddl.md); aprovação recebida em 06/11/2026.

Evidências DAT-03: [validação](../validacao-dat03-imagem.md).

## DAT-05 em partes

- DAT-05A: pré-validação pura do lote/metadados e comparação de equipamentos.
  Implementação validada: 59 testes, lint e build aprovados;
  não lê banco/Auth/Storage nem autoriza escrita.
- DAT-05B: adaptador Prisma e persistência transacional testados;
  conferência real da conta/objetos no fluxo completo ainda pendente.

Aprovação da função isolada não comprova DADOS-01/02/03 no fluxo real.

[Evidências DAT-05A](../validacao-dat05a-preflight.md). DAT-05 completa permanece aberta.

DAT-05B: adaptador Prisma interno com transação/releitura/trava implementado;
integração Postgres passou com pré-condições sintéticas. Sem comando de carga real.
[Evidências](../validacao-dat05b-carga-local.md). Falta conectar conferência real
conta/fotos; DAT-05 completa permanece aberta.

DAT-06A: conferência de identidade Auth local e vínculo COLABORADOR implementados;
e-mail não confirmado aguarda; divergências/empréstimos bloqueiam sem alterar.
Integração com fixtures sintéticas passou. [Evidências](../validacao-dat06a-conta-local.md).
Sem CLI, sem criação/alteração de senha/confirmação pelo módulo. DAT-06 completa
aguarda orquestração real e revisão, não marcar antecipadamente.

DAT-05C: fluxo local integrado implementado, confere arquivos/conta/lote antes
 de criar organização/vínculo/equipamentos na mesma transação. Integração 3/3
passou com fixtures; arquivos reais e Storage ainda pendentes.
[Evidências](../validacao-dat05c-fluxo-local.md). DAT-07 deve provar rollback no
meio dos inserts, revisar critérios completos e não confundir fixtures com entrega.

DAT-07A: queda real de conexão após oito INSERTs confirmados; rollback observado
com zero resíduos de organização/vínculo/equipamentos e conta Auth preservada.
[Evidências](../validacao-dat07a-rollback.md). Revisão independente em andamento;
DAT-07 completa depende também das fotos reais/Storage/aceites finais.

DAT-07A e revisão parcial realizados. [DADOS-R1](../verificacao/dados-iniciais/r1.md)
retornou NÃO PRONTA: fotos/Storage/acesso professor/roteiro humano pendentes;
59 testes e lint reproduzidos, integrações não reexecutadas pelo revisor.
DAT-07 completa permanece aberta; próximos trabalhos atacam essas pendências.

DAT-08A: utilitário de leitura pública do Storage e roteiro humano parcial
preparados. Teste HTTP local passou; nenhuma consulta/upload de produção.
[Roteiro](../roteiro-humano-dados-iniciais.md). DAT-08 completa depende da
ferramenta de carga de produção, fotos e evidências humanas reais.

Snapshot de 11/11/2026, anterior à configuração da chave: nenhum arquivo de foto
do lote nem manifesto real foi encontrado. DAT-04/05/06/08 permaneciam abertas;
os testes sintéticos não satisfaziam esses aceites. Estado atual abaixo.

O [plano técnico de adaptação Pixabay](../plans/adaptacao-pixabay.md) foi
aprovado; a Tarefa 1 está implementada e validada com dados sintéticos. DAT-04
continua aberta até fotos reais, manifesto e revisão visual.

Revalidação local em 06/11/2026 para PRA-03/PRA-05: `test:images-local` 1/1,
`test:initial-data-local` 3/3, preparação de imagens 2/2 e verificador HTTP
simulado 1/1. Fixtures locais/sintéticas; DAT-01/04/05/06/07/08 permanecem
abertas para aceite completo.

Atualização 11/11/2026 — aquisição Pixabay: chave configurada localmente; seis
imagens candidatas reais foram baixadas e preparadas como PNG 800×600 para
TI-0003/0004/0005/0008/0009/0010. Foram rejeitados 21 candidatos por marcas,
texto, pessoas, conteúdo de tela, repetição visual ou tipo inadequado. TI-0001,
TI-0002, TI-0006, TI-0007, TI-0011 e TI-0012 seguem sem foto adequada. O rascunho
de manifesto fica em `.cache/pixabay/manifesto-candidatos.json`, sem segredo e
fora do controle de versão. Revisão humana, Storage, conta do professor e
critérios DADOS-04/05/06/08 continuam pendentes; não houve escrita remota.
