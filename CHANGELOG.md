# Changelog

## 2026-09-06 — MVP consolidado concluído

### Adicionado

- `app/final.html` como interface principal consolidada;
- Dashboard com visão do portfólio;
- navegação por projetos;
- visão de Checklist e Gates históricos;
- motor de similaridade e reuso de conhecimento integrado;
- busca transversal por projeto, cliente, área, software, documento e Gate;
- área de documentos referenciados;
- painel de governança e limitações conhecidas;
- `tests/validate_qsim.py`;
- workflow `.github/workflows/validate.yml`;
- `docs/PROJECT_COMPLETE.md`.

### Consolidado

- `app/index.html` permanece como snapshot/base recuperada da V6;
- `app/knowledge.html` permanece como módulo isolado de similaridade;
- ausência dos documentos originais não impede operação do MVP;
- recomendações não modificam Checklist/Gates automaticamente;
- não conformidade não é inferida a partir de ausência documental.

### Estado

- MVP considerado concluído após merge e aprovação do workflow `Validate Q-SIM` no `main`.

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
- rastreabilidade histórica já incorporada;
- política de não publicar documentos técnicos/confidenciais sem autorização.
