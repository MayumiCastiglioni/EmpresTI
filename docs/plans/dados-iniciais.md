# Plano — dados iniciais

[Spec](../specs/dados-iniciais.md) · [Tarefas](../tasks/dados-iniciais.md).
Estado: decisões centrais e contrato de DDL aprovados; implementação local parcial.
PRA-04/DAT-01 ainda abertas: a spec completa não recebeu veredito PRONTA; DADOS-R1
retornou NÃO PRONTA por falta de fotos reais, Storage, acesso real do professor
e evidências humanas. Ver tarefas e decisões antes de retomar.

1. Reconciliar a spec e tarefas com as decisões já confirmadas e manter como
   pendentes os critérios que dependem de fotos reais, Storage e conta do professor.
2. Tratar a pausa da API Pexels (reconfirmada em 07/11): aguardar reabertura ou obter autorização
   formal do professor para outra origem; não trocar a fonte por inferência.
3. Após fotos reais e revisão visual, completar manifesto e validar localmente.
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
Aquisição Pexels bloqueada pela pausa oficial de novas chaves; critérios de foto,
Storage e acesso do professor seguem sem aceite final.
