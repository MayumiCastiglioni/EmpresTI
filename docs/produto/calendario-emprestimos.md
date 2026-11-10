# Calendário de empréstimos — contrato atual

Fonte de produto: [PRD](../PRD.md), [DEC-19](decisoes-pratica.md).
Contrato: [spec](../specs/solicitar-emprestimo.md).
Decisão atual: somente nove feriados nacionais fixos, 2026–2030 inclusive,
segunda a sexta; excluir dia da solicitação; vence 23:59:59 America/Sao_Paulo.
Não descontar Sexta-feira da Paixão, Carnaval, Corpus Christi ou feriados locais.

## Fontes das datas fixas, conferidas em 06/11/2026

- [Lei 662/1949, texto atualizado na Câmara](https://www2.camara.leg.br/legin/fed/lei/1940-1949/lei-662-6-abril-1949-347136-normaatualizada-pl.pdf):
  01/01, 21/04, 01/05, 07/09, 02/11, 15/11 e 25/12.
- [Lei 6.802/1980 na Câmara](https://www2.camara.leg.br/legin/fed/lei/1980-1987/lei-6802-30-junho-1980-357065-norma-pl.html): 12/10.
- [Lei 14.759/2023 na Câmara](https://www2.camara.leg.br/legin/fed/lei/2023/lei-14759-21-dezembro-2023-795091-norma-pl.html): 20/11.

Anos futuros usam as datas fixas dessas regras vigentes, não portarias futuras
supostamente já publicadas. Mudança legal ou regra institucional exige revisão,
versionamento e testes. Não fazer consulta externa em cada solicitação nem
introduzir API/pacote sem aprovação. O código não se atualiza sozinho com novas leis.

## Cálculo isolado implementado e validado

src/server/loans/calendar.ts: calendário imutável versão br-2026-2030-v1-fixed-only;
função pura recebe instante e calendário. Usa Intl com fuso explícito para extrair
o dia civil e converter 23:59:59 de volta a UTC. Contagem em datas civis, nunca
14 períodos de 24 horas a partir do instante da solicitação.

Cada ano percorrido precisa estar coberto. Se o pedido ou prazo extrapolar
2026–2030, lança erro antes de qualquer persistência. Ex.: pedido no fim de 2030
que venceria em 2031 não é calculado até extensão revisada. Não grava dado nessa função.
Atraso: agora maior que o instante de vencimento; igual ainda não está atrasado.
Precisão do vencimento .000 milissegundos, conforme instante 23:59:59 aprovado.

## Histórico da fonte substituída

A primeira proposta usava o calendário MGI 2026, que inclui a Sexta-feira da Paixão.
[Portaria 11.460/2025](https://progep.ufes.br/sites/progep.ufes.br/files/field/anexo/portaria_mgi_11460_-_dou_30-12-2025_-_feriados_e_pontos_facultativos_2026.pdf)
foi consultada, mas a usuária escolheu somente feriados fixos. Essa proposta não
é a política implementada. Cobertura só de 2026 e precisão 23:59:00 foram rejeitadas.
Fontes Planalto inicialmente bloquearam acesso; a conferência foi feita na Câmara.
