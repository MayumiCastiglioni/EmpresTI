# Fechamento das partes 2, 3 e 4 — 11/11/2026

Estado: **pendente; não autoriza marcar entrega concluída**. Fotos são tratadas
em outra conversa; este documento não altera o manifesto nem seu aceite visual.

Atualização posterior DEC-35: por instrução explícita da usuária, o manifesto
integral `.cache/imagens/manifesto-candidatos.json` foi localizado e suas 12
fotos receberam aceite visual humano. Conferência: 12 registros, 12 patrimônios
distintos, 12 arquivos presentes. Substitui a pendência visual anterior;
ressalvas técnicas/fontes e comprovação de Storage permanecem separadas.

## Parte 2 — critérios locais

Correções posteriores a EMP-R1 em `tests/loans-local.integration.ts`:
- EMP-04: pedidos com clock do serviço a -1/0/+1 ms do vencimento; verifica
  persistência e equipamento na recusa. O trigger fica habilitado e usa seu
  relógio real: esta prova não injeta o relógio do banco nem prova sua fronteira.
- EMP-05: item de outro tenant e inexistente têm a mesma recusa, sem escrita.
- EMP-07: pedido que ultrapassa cobertura recusa sem criar empréstimo.
- EMP-08: campos borrowerId, tenantId, dueAt, requestedAt, checkedOutAt e status
  são recusados pelo parser; leitura RLS e tentativa de UPDATE por colega.
- EMP-09: novos testes de componente para carregamento, recuperação de erro,
  vazio e envio pendente, sem atualização otimista.

Integração atual: `npm run test:loans-local` saiu 1 com
`connect EACCES 127.0.0.1:54322` no beforeAll; **15 testes não executados**.
Não é reprovação de comportamento nem aprovação dos testes adicionados.
Resultados 9/9 anteriores são históricos. A conexão local está bloqueada neste
ambiente; não foi solicitada ampliação de permissões nem usado destino remoto.
Lint e TypeScript passaram nesta sessão. O reteste de componente passou 5/5
após corrigir dois seletores que esperavam ponto em vez de reticências.
Após a revisão, foi corrigido o refresh na recusa por indisponibilidade
(DEC-24), com dois cenários adicionais: atualização bem-sucedida e falha segura.
O componente final passou 7/7; não simula início de empréstimo quando recusado.
Build isolado foi tentado, mas npm ci falhou por ENOTFOUND registry.npmjs.org;
isso é falha de instalação, não resultado da compilação. O build padrão também
falhou (exit 1): EPERM ao remover `.next/build/chunks` no OneDrive, antes de
compilar a aplicação; Prisma Client foi gerado. Nenhum build foi aprovado nesta rodada.
Resultados dos demais checks e revisões são registrados no fechamento;
spec continua parcial. A prova HTTP EMP-08 foi ampliada para tenant/prazo/status/
início forjados e contagem persistida, mas não foi executada por depender do
mesmo ambiente local bloqueado.

Suíte padrão inicial: 81 passaram, 2 falharam (83 totais), antes da correção
dos seletores. A execução completa seguinte terminou com 82/83 e timeout
de 5000 ms em LOGIN-04 (logout); não cobre ainda os dois testes finais da
correção DEC-24. **Suíte final após todas as alterações: 85/85, 13 arquivos,
exit 0**. Não atribuir o timeout intermediário
a alteração de produto sem reprodução. As revisões EMP-R2 e DADOS-R3 continuam
NÃO PRONTA; seus relatórios preservam o snapshot e checks executados pelo revisor.
Lint e TypeScript também passaram após a correção de runtime.
Reteste isolado do logout passou 2/2 (exit 0), sem modificar teste, timeout ou
implementação. Isso não substitui uma execução completa aprovada.

## Parte 3 — evidências reais necessárias

Pessoa responsável executa o [roteiro existente](../roteiro-humano-dados-iniciais.md).
Não usar a conta do professor nos testes nem criar pedido para testar seu acesso.

| Evidência | Resultado exigido | Estado nesta sessão |
|---|---|---|
| Manifesto aprovado | 12 fotos, hashes distintos e revisão visual | Outra conversa; não conferido aqui |
| Storage | Verificador público: checked 12, issues vazia; chaves iguais ao manifesto | Não executado |
| Inventário | TI-0001 a TI-0012; 10 disponíveis, TI-0004/0007 em manutenção | Não consultado remotamente |
| Reexecução | Mesmos IDs/quantidades, sem sobrescrita em divergência | Não executada em produção |
| Professor | Login normal, e-mail confirmado normalmente, COLABORADOR/empresti | Não executado |
| Empréstimos | Listagem própria vazia e contagem autorizada igual a zero | Não comprovado |

Registrar data/hora de São Paulo, responsável, versão exata, contagens e
resultados sanitizados. Capturas não devem mostrar senha, cookies, tokens ou
chaves. Se houver empréstimo anterior, interromper e registrar a divergência;
não apagar dados para obter zero. O roteiro atual identifica a falta de uma
ferramenta operacional de carga de produção aprovada; não adaptar testes locais
removendo suas guardas para executar remotamente.

## Parte 4 — revisão e gates da publicação

Revisão estática das quatro migrations existentes, sem execução remota:

| Migration | Efeito e conferência necessária antes da aplicação |
|---|---|
| 20261002120101_init_inventory | Cria enums, tabelas, índices e FKs; conferir histórico existente, não reaplicar SQL avulso |
| 20261002120200_enforce_inventory_rules | Ativa RLS, policies, índice de ativo e trigger legado; depende de papel authenticated existente |
| 20261106112134_equipment_image | Adiciona image JSONB opcional e constraint de objeto; preserva registros sem imagem |
| 20261110122729_loan_immediate_limit_five_policies | Muda default, leitura própria, remove policies INSERT/UPDATE de loans e substitui trigger: cinco ativos, atraso, início imediato e locks; não converte legado |

O servidor cria empréstimos pelo Prisma; leitura usa SET LOCAL ROLE authenticated.
Confirmar papel/grants reais e compatibilidade com o runtime antes da liberação.
Não usar service role como prova de RLS. `prisma.config.ts` usa DATABASE_URL,
não DIRECT_URL: conferir destino sem imprimir seu valor. Conferir backup,
histórico/checksums e pendências; usar Prisma Migrate como dono único. Não editar
migration aplicada, usar reset, db push ou resolve para ocultar divergência.

Ordem para liberação: concluir fotos e checks locais → revisão independente →
responsável conferir/aplicar migrations e carga → acesso real e Storage →
conferir versão de main/produção → smoke autenticado sem usar conta do professor
para mutações → auditoria final do enunciado e ENTREGA → tag entrega-pratica.
Guardar versão/commit e URL observados, saída sanitizada das migrations,
responsável e resultado dos fluxos. Tag não deve apontar para versão diferente
da testada. Não sobrescrever tag existente.

Nenhuma aplicação remota, login real, atualização de main, publicação ou tag
foi feita nesta sessão. A solicitação da usuária inclui essas ações, mas seus
pré-requisitos ainda não foram comprovados. O enunciado original integral não
foi localizado nos arquivos de primeiro nível; o checklist é referência de
trabalho, não prova de releitura final do original.
