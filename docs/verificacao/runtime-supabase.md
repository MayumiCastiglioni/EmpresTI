# Runtime Supabase — 11/11/2026

Gatilho: screenshot do catálogo com ambas as listagens indisponíveis após login.
Diagnóstico confirmado no código local: getDatabase recusava todos os hosts
não loopback, inclusive na produção. Isso basta para impedir consulta de
membership e os dados quando o runtime aponta ao Supabase remoto. A versão
exata publicada não foi inspecionada, portanto não comprova causa única.

Correção local: validação extraída para databaseConnectionString, permitindo
Supabase direto/pooler exclusivamente em produção; teste/dev continuam locais.
Mantidas guardas de protocolo e override de host, sem alterar RLS/membership.
URLs inválidas geram erro genérico sem incluir credenciais na mensagem.

Testes puros cobrem Supabase permitido em produção/negado em dev e testes,
hosts externos ou com sufixo falso, protocolos e override de host recusados.
Não instanciam conexão remota nem usam dados reais. A validação de configuração
não comprova EMP-01 integral, papel real do banco ou carga de inventário.

Checks atuais: configuração pura 15/15, lint e TypeScript passaram. O primeiro
TypeScript apontou literal string amplo em NODE_ENV do teste; corrigido com
`as const` e reteste passou. **Suíte completa passou 94/94 em 13 arquivos,
exit 0**. Build padrão
falhou antes de compilar a aplicação com EPERM ao remover `.next/build/chunks`
no OneDrive; Prisma Client foi gerado. Build isolado não repetido: tentativa
anterior nesta sessão falhou em npm ci por DNS do registry. Nenhum build
aprovado para esta correção. Nenhuma conexão remota foi aberta pelos testes.

Para conferir após uma publicação autorizada desta correção: DATABASE_URL
privada da Vercel deve apontar ao Supabase correto; migrations devem estar
aplicadas e conta vinculada a empresti. Ler catálogo e empréstimos próprios,
sem conceder papel de Operações/ADMIN como atalho nem criar empréstimos do
professor. A ausência de equipamentos seria um estado vazio; o print mostra
erro de consulta, que não prova ausência de inventário.
