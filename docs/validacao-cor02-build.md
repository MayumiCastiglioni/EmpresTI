# COR-02 — recuperação do build

Data: 05/11/2026. Plano: [correções](plans/correcoes-aulas.md).
Entrega técnica; não corresponde a aprovação dos CAs funcionais do MVP.

## Atualização — 11/11/2026: build isolado fora do OneDrive

A solução histórica que definiu `distDir: build` não é mais a configuração
vigente. `next.config.ts` voltou ao padrão do Next (`.next`), necessário para
manter compatibilidade com a Vercel; o Preview do commit `bc259e6` passou. O
problema local é a limpeza de artefatos em uma pasta sincronizada e não exige
alterar a configuração global do OneDrive.

Decisão operacional: manter `npm run build` para CI/Vercel e disponibilizar
`npm run build:isolated` para builds locais feitos a partir do OneDrive. O
comando copia o código para uma pasta temporária fora do OneDrive, exclui
artefatos gerados e arquivos `.env*`, carrega variáveis locais sem copiá-las,
instala as dependências a partir do lockfile, executa o build normal e remove a
cópia temporária ao final. A cópia é única e criada pelo comando; a pasta-fonte
e sua saída não são apagadas.

Validação em 11/11: `npm run build:isolated` concluiu com código 0; Prisma
Client foi gerado, Next.js 16.4.6 compilou, TypeScript passou e as sete rotas
foram geradas. A instalação mostrou avisos de scripts de três pacotes não
aprovados pelo npm e avisos de obsolescência, mas não impediu o build. A pasta
temporária foi removida pelo próprio comando. Nenhum arquivo `.env` foi
copiado para ela. Configuração e relatório seguem locais, sem operação Git.

## Evidência e mudança

npm run build reproduziu EPERM na limpeza de .next/server/app/api.
A árvore existente contém diretórios com atributos ReparsePoint e ReadOnly;
o projeto está no OneDrive. A inspeção não encontrou processo Next ativo.
Isso localiza o problema na limpeza dessa saída, sem comprovar a causa interna
do serviço de sincronização. Nenhum processo alheio foi encerrado.

Usada a opção distDir documentada na versão instalada do Next.js:
node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/distDir.md.
Saída agora em build/, dentro do projeto e já ignorada no Git e ESLint.
Tipos gerados em build/types e build/dev/types; saídas antigas excluídas do
TypeScript para não misturar gerações. .next e .next-validation preservadas.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| npm run build, primeira execução com build/ | Passou, código 0, TypeScript incluído |
| npm run build, segunda execução | Passou, código 0; limpeza/reutilização da nova saída |
| npm test | Passou, 6 arquivos e 26 testes |
| npm run lint | Passou, código 0 |
| npm run start -- --port 3100 --hostname 127.0.0.1 | Iniciou e serviu a saída de produção local |
| GET /login e /cadastro sem sessão | 200; conteúdo Entrar/Criar conta encontrado |
| GET /catalogo e / sem sessão | 307 para /login |

O primeiro diagnóstico HTTP esperava Location absoluto; o servidor retornou
/login relativo, que é válido. O diagnóstico foi corrigido para normalizar a
URL e passou; nenhuma mudança de aplicação foi necessária para esse retorno.
Servidor iniciado para esta verificação encerrado ao final.

## Limites

Sem mudança visual, regra de negócio, schema, dependência ou credencial.
Integração real de autenticação não reexecutada; estes checks HTTP não provam
persistência de contas, empréstimos, RLS, papéis ou isolamento de dados.
Não houve commit, push, deploy ou mudança no banco nesta tarefa.
A configuração contorna a saída antiga bloqueada; não altera o OneDrive nem
garante que ele nunca atribua os mesmos atributos à nova pasta.
