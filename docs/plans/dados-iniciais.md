# Plano — dados iniciais

[Spec](../specs/dados-iniciais.md) · [Tarefas](../tasks/dados-iniciais.md) ·
[plano técnico Pixabay](adaptacao-pixabay.md).
Estado: decisões centrais e contrato de DDL aprovados; implementação local parcial.
PRA-04/DAT-01 ainda abertas: a spec completa não recebeu veredito PRONTA; DADOS-R1
retornou NÃO PRONTA. A aquisição Pixabay está parcial: seis candidatos preparados,
seis fotos adequadas faltantes; seis imagens têm aprovação visual (DEC-31). Storage e acesso real do
professor também aguardam evidências. Ver tarefas e decisões antes de retomar.

1. Reconciliar a spec e tarefas com as decisões já confirmadas e manter como
   pendentes os critérios que dependem de fotos reais, Storage e conta do professor.
2. Pixabay aprovado em 11/11 pelo professor (DEC-30); chave local configurada.
   Continuar apenas com consultas pontuais e downloads individuais, respeitar o
   cache de 24 horas e evitar buscas repetidas/download em massa/hotlink.
3. Completar as seis fotos faltantes; depois revisar o conjunto e manifesto
   localmente antes de qualquer upload.
   Upload de produção segue com humano; não habilitar escrita remota.
4. Reexecutar testes locais da carga integrada, preservação, reentrada e falha;
   revisar o caminho operacional antes de declarar DAT-05/06/07 concluídas.
5. Obter verificação independente das specs com isolamento explicitamente
   qualificado; corrigir pelo principal e repetir sem fabricar aprovação.
6. Preparar execução humana de produção; conferir evidências reais sem executar
   carga remota. Somente após aceites registrar DADOS como atendidos.

Cada passo é tarefa separada: checks e relato antes de prosseguir. Bloqueio
em foto não deve ser ocultado por imagem fictícia nem tratado como conclusão.

## Decisões incorporadas

EmpresTI / empresti; professor COLABORADOR; conta compatível reaproveitada sem
alterar senha; divergências/empréstimos interrompem; confirmação normal de e-mail.
Contrato de imagem/comparação/etapas aprovado em 06/11; migration local aplicada.
Pexels segue sem novas chaves, mas a alternativa Pixabay foi autorizada; a
chave Pixabay, fotos, Storage e acesso real do professor seguem sem aceite final.

## Snapshot do tópico 4 antes da configuração local — 11/11/2026

Conferência local: o repositório não contém fotos reais do lote nem manifesto
preenchido. Os testes de imagem/carga existentes usam fixtures sintéticas e não
validam licença, origem, aparência, Storage real ou a conta do professor. O Help
Center da Pexels confirma que novas chaves seguem pausadas; a usuária informou
autorização formal do professor para Pixabay (DEC-30). `PIXABAY_API_KEY` está
ausente, então nenhuma chamada ou foto foi obtida.

O plano para adaptar ferramenta, validadores, provedor e crédito está em
[adaptacao-pixabay.md](adaptacao-pixabay.md), aprovado e executado na Tarefa 1.
Os testes simulados passaram; a chave local, fotos reais, manifesto e revisão
visual seguem pendentes.

Naquele snapshot, DAT-04 estava bloqueada pela ausência da chave. DAT-05/06/07
continuavam limitadas aos testes sintéticos locais; DAT-08 não foi executada em
produção. Upload de Storage, conferência da
conta real e verificação de zero empréstimos ficam com a pessoa responsável,
conforme o roteiro humano. Nenhuma credencial foi exibida nem serviço remoto
alterado.

## Atualização de aquisição Pixabay — 11/11/2026

A chave local foi configurada e houve consultas/downloads individuais. Seis
candidatos 800×600 estão preparados para TI-0003/0004/0005/0008/0009/0010; seis
patrimônios seguem sem foto adequada. O rascunho de manifesto, créditos e
rejeições está em `.cache/pixabay/manifesto-candidatos.json`. As seis imagens
preparadas receberam aceite visual (DEC-31), sem envio ao Storage. DAT-04/05/06/07/08 continuam abertas;
execução de produção e validação da conta permanecem com a pessoa responsável.
