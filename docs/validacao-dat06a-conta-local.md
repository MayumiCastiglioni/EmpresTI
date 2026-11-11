# DAT-06A — conta e vínculo locais

Spec: [dados iniciais](specs/dados-iniciais.md). Código:
src/server/initial-data/professor-local.ts. Ferramenta interna, sem rota ou CLI.

## Comportamento

Recusa Postgres/Supabase remotos antes de conectar; credenciais não entram no
relatório. Usa API administrativa local apenas para consultar a identidade pelo
ID. Não cria usuário Auth, confirma e-mail, troca senha ou eleva papel. Criação
da conta continua pelo cadastro/fluxo normal já existente; é etapa separada.
Conta ausente/inacessível ou e-mail divergente bloqueia; não confirmada aguarda.

No Prisma, transação com as mesmas travas da carga confere organização, zero
empréstimos da identidade e vínculo COLABORADOR; vínculo de outro papel ou outra
organização bloqueia sem alterar nada. Organização ausente é criada como
EmpresTI/empresti somente após verificações; vínculo ausente é criado como
COLABORADOR. Reexecução reaproveita sem update. Não usar este método como callback
da transação de equipamentos: são etapas distintas; callback futuro só confere
pré-condições, sem abrir outra transação com as mesmas travas.

Auth é externo à transação Postgres; não há promessa de transação distribuída
ou ausência absoluta de corrida com exclusão administrativa de conta. A carga
operacional precisa revalidar a identidade e os vínculos antes de gravar itens.
Também precisa pré-validar lote/fotos antes de qualquer etapa de provisionamento:
este módulo isolado não substitui a orquestração completa aprovada na spec.

## Evidência local

npm run test:initial-data-local: 2 testes de integração passaram (equipamentos
mais conta). Novo teste usa somente identidade aleatória example.test em Auth
local e banco separado empresti_image_clean_20261106, nunca conta do professor.
Cria fixture não confirmada, comprova bloqueio, depois verifica token de link
mágico da fixture para exercitar a confirmação. Não comprova entrega do e-mail
ou confirmação do professor em produção. Nenhuma chamada email_confirm:true
é feita pelo módulo ou por este teste.

Dois vínculos simultâneos criam um e reaproveitam outro; terceira execução mantém
ID/papel/timestamp. Login com a senha inicial continua válido. E-mail divergente,
papel OPERACOES e empréstimo sintético bloqueiam; papel/empréstimo ficam intactos.
Limpeza remove apenas organização/vínculo/empréstimo e conta sintéticos criados
pelo teste. Nenhuma conta de professor ou dado de trabalho foi alterado.

## Estado

Checks: 59 testes gerais e lint passaram. Integração local repetida após
correção de guarda de valor nulo passou novamente (2/2). Primeiro build falhou
na tipagem desse teste; correção aplicada e repetição do build aprovada
com saída zero, assim como repetição do lint.
DAT-06 completa e CAs finais ainda não aprovados:
faltam fluxo operacional, arquivos reais, integração com carga e revisão DAT-07.

Atualização de teste — 11/11/2026: a fixture do empréstimo existente agora
declara explicitamente `SOLICITADO`, o estado legado ativo aceito pelo contrato.
`npm run test:initial-data-local` passou novamente: 3 arquivos/3 testes.
