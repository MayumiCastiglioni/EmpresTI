# PRD — Empréstimo de Equipamentos Internos
Versão 1 · escrito pelo time de Operações

## Problema
O controle de quem pegou qual equipamento (notebooks, monitores,
cabos, câmeras) é feito hoje numa planilha compartilhada. Ninguém
sabe o que está disponível, itens somem, e a devolução só é
registrada se alguém lembrar de atualizar a linha.

## Quem usa
- Colaborador: vê o catálogo, pede um item emprestado, devolve.
- Operações: cadastra equipamentos, vê quem está com o quê e
  registra devolução no balcão.

## O que precisa existir na primeira versão
1. Login. Cada pessoa vê os próprios empréstimos.
2. Catálogo de equipamentos com a situação de cada um.
3. Solicitar empréstimo de um item disponível.
4. Devolver um item que está comigo.
5. Tela de Operações com todos os empréstimos em aberto.

## Regras que Operações já decidiu
- Cada pessoa pode estar com no máximo 5 itens ao mesmo tempo (decisão de 06/11/2026).
- O prazo padrão de devolução é de 14 dias úteis, de segunda a sexta, excluindo feriados nacionais fixos do Brasil e o dia da solicitação; vencimento às 23h59min59s do 14º dia útil no fuso America/Sao_Paulo.
- Quem tem item em atraso não pode pegar outro emprestado.
- Equipamento em manutenção não aparece como disponível.

## O que NÃO entra nesta versão
- Reserva com data futura.
- Notificação por e-mail.
- Importação da planilha atual.

## Como saberemos que deu certo
Operações consegue abandonar a planilha depois de duas semanas
de uso.
## Esclarecimento de produto — 05/11/2026

Decisão informada pela usuária nesta conversa: a solicitação já inicia o
empréstimo. Não há etapa de espera pela retirada para iniciar o empréstimo.
O prazo padrão continua sendo 14 dias; detalhes de contagem, horário e fuso
não foram definidos por esta resposta.
O modelo definitivo de concessão de acesso de Operações continua pendente.
Uma organização (EmpresTI / empresti) foi confirmada para esta versão em
06/11/2026. Em 10/11/2026, a usuária decidiu retirar, nesta fatia da atividade,
a policy existente que permite UPDATE de empréstimos a OPERACOES/ADMIN e deixar
esse acesso para decisão futura (DEC-26). Isso não elimina do PRD o requisito
futuro da tela de Operações. Após teste isolado, o SQL específico foi aprovado
por DEC-27 e aplicado somente no banco local; runtime e produção seguem sem prova.

## Decisões da prática — 06/11/2026

A usuária aprovou explicitamente nesta conversa:
- Alterar o limite anterior de três para cinco empréstimos simultâneos.
- Adotar 14 dias úteis, com calendário ainda a definir. Este esclarecimento
  substitui o prazo não detalhado do registro de 05/11; não autoriza inferir
  feriados, inclusão do dia inicial, horário ou fuso.
- Na carga da atividade, TI-0010 fica disponível. Somente TI-0004 e TI-0007
  ficam em manutenção: 10 disponíveis e 2 em manutenção entre os 12 itens.

Motivo informado nas escolhas: seguir o briefing nos pontos acima, resolvendo
suas divergências com o PRD e com a lista de equipamentos. Essas são decisões
aprovadas de produto/dados; não comprovam implementação. Código, migrations,
layout e trechos de ADR que ainda mencionam três itens precisam de reconciliação
nas tarefas afetadas; nenhum ADR foi alterado nesta decisão.

## Decisão de escopo — 06/11/2026

A primeira versão atende uma única organização, confirmado pela usuária.
A carga inicial reaproveita dados iguais e interrompe/reporta divergências
nos equipamentos ou conta do professor, preservando dados e empréstimos existentes.
O contrato detalhado será definido na spec antes da implementação da carga.

## Contagem de prazo confirmada — 06/11/2026

A usuária definiu segunda a sexta, excluindo feriados nacionais fixos do Brasil.
Excluir o dia da solicitação, considerando sua data em America/Sao_Paulo.
Vencimento às 23h59min59s do 14º dia útil nesse mesmo fuso. Substitui as pendências
anteriores de calendário/início/horário/fuso; ainda não implementado.
A fonte dos feriados e cobertura dos anos precisam ser documentadas na spec;
não tratar ponto facultativo ou feriado local como nacional por inferência.

## Cobertura e precisão do calendário — 06/11/2026

Usuária exige cobertura de 2026 a 2030 antes da liberação. Vencimento exatamente
às 23:59:59 em America/Sao_Paulo, com atraso após esse instante. Substitui a
proposta de cobertura somente 2026 e precisão 23:59:00. Conferência e cálculo
continuam pendentes de implementação e testes.

## Legado e reenvio aprovados — 08/11/2026

DEC-23: registros existentes em SOLICITADO e RETIRADO contam para o limite de
cinco e bloqueiam novos pedidos quando atrasados. Preservar dados, sem conversão
ou exclusão automática. Novos pedidos iniciam diretamente em RETIRADO.
DEC-24: reenvio para equipamento com empréstimo ativo é recusado com mensagem
de indisponibilidade e atualização da consulta, sem duplicação nem exposição
de dados de outra pessoa. Decisões aprovadas; implementação ainda pendente.
