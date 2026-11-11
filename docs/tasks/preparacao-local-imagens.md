# Tarefa local de imagens

[Spec](../specs/preparacao-local-imagens.md); [plano](../plans/pratica-sdd-subagentes.md), PRA-03.

- [x] Implementar preparação e validação local (IMG-01 a IMG-04).
- [x] Teste sintético passou; não aprova fotos reais.
- [x] Checks gerais e revisão independente IMG-R2 aprovados para a fatia local.
- [x] Ferramenta local Pixabay, cache e validadores adaptados; testes simulados passaram em 11/11.
- [ ] Aquisição e revisão real: chave local configurada em 11/11; seis PNGs aprovados visualmente (DEC-31) e seis patrimônios sem candidato adequado; falta completar e validar o lote.

Checks desta tarefa: teste Node local passou; npm test 50/50; lint passou;
validador da skill aprovado. Build não repetido: utilitário local sem alteração
de runtime da aplicação. Revisão independente IMG-R2 aprovada após ampliar cobertura de IMG-01.

Atualização 11/11: adaptador Pixabay e validadores locais implementados.
Testes da skill 7/7, pré-validação 9/9, integração de imagem local 1/1, lint e
build isolado passaram. A fixture da conta do professor foi ajustada para usar
`SOLICITADO` como empréstimo legado ativo; `npm run test:initial-data-local`
passou 3/3. Detalhes no [plano técnico](../plans/adaptacao-pixabay.md). Naquele
momento nenhuma chamada real havia sido feita.

Atualização 11/11/2026: a variável local foi detectada sem revelar seu valor;
foram preparados seis candidatos 800×600 e um rascunho de manifesto em
`.cache/pixabay/manifesto-candidatos.json`. `npm run test:images-local` passou
1/1; `node --test skills/imagens-equipamentos/scripts/preparar.test.mjs` passou
2/2; dimensões, IDs e hashes dos seis arquivos conferidos. A revisão humana,
seis fotos substitutas, Storage e conta do professor permanecem pendentes.

Aceite de 11/11 (DEC-31): a usuária aprovou visualmente os seis PNGs
TI-0003/0004/0005/0008/0009/0010. A aprovação está no manifesto local parcial;
o lote completo e a validação IMG-03 continuam pendentes.
