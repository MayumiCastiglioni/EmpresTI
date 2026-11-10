# Preparação local de imagens — fatia PRA-03

Origem: plano aprovado [prática](../plans/pratica-sdd-subagentes.md), PRA-03.
Escopo técnico independente da aquisição/API. Sharp autorizado pela usuária.
Não altera aplicação, schema, fonte de fotos ou permissões de produção.

## Critérios

- IMG-01: saída decodificada PNG 800 x 600 com recorte proporcional e hash SHA-256.
- IMG-02: reexecução reaproveita conteúdo igual e recusa sobrescrever diferente.
- IMG-03: manifesto confere conjunto exato, IDs Pexels e hashes únicos,
  créditos, dimensões e registro de revisão visual aprovada.
- IMG-04: entrada corrompida ou inconsistência falha explicitamente.

Implementar preparar.mjs e preparar.test.mjs dentro dos scripts da skill;
rodar teste local, suíte e lint; documentar comandos e limites. Revisão visual
continua humana: o script só confere seu registro. Fotos sintéticas dos testes
não são fotos para entrega. Aquisição real e upload ficam fora desta fatia.
Estado: fatia local aprovada em IMG-R2, após correção da cobertura de IMG-R1.
[Evidências](../verificacao/imagens-local/r2.md). PRA-03 completa segue pendente.

[Tarefas e estado](../tasks/preparacao-local-imagens.md).
