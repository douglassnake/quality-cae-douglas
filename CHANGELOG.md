# Changelog

## 2026-09-06 — Continuidade sem pasta histórica

### Alterado

- removida a dependência obrigatória da unidade `W:`;
- removida a dependência obrigatória de `Propostas_Relatorio`;
- definido o repositório como fonte principal de continuidade da Q-SIM;
- preservação das evidências já incorporadas mesmo quando o documento original não estiver mais disponível;
- script de publicação atualizado para operar sobre `app/index.html` no próprio repositório;
- documentada a estratégia de continuidade de dados em `docs/DATA_CONTINUITY.md`.

### Mantido

- V6 como referência visual;
- Checklist e Gates evoluídos como referência funcional;
- rastreabilidade histórica já incorporada;
- política de não publicar documentos técnicos/confidenciais sem autorização.

### Próximo passo

Adicionar em `app/index.html` a versão consolidada mais recente da Q-SIM e, quando aplicável, separar progressivamente dados estruturados da camada de apresentação.
