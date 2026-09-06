# Q-SIM — Plataforma de Qualidade CAE

Repositório oficial da plataforma **Q-SIM**, voltada à gestão da qualidade, rastreabilidade técnica e base de conhecimento de projetos de engenharia e simulação CAE.

## Entrada principal do MVP

A interface consolidada está em:

```text
app/final.html
```

Ela reúne:

- Dashboard;
- Projetos;
- Checklist e Gates históricos;
- Motor de Similaridade e Reuso de Conhecimento;
- Busca transversal;
- Referências documentais;
- Governança e limitações conhecidas.

`app/index.html` permanece como snapshot/base recuperada da V6 e fonte dos dados compactados. `app/knowledge.html` permanece como módulo isolado de referência do motor de similaridade.

## Referências de produto

- **V6:** referência visual e snapshot recuperado.
- **V7/V8:** não estão disponíveis como arquivos recuperáveis neste repositório; não são simuladas artificialmente.
- **MVP consolidado:** `app/final.html`, construído somente sobre dados estruturados disponíveis.

## Modelo autossuficiente

A Q-SIM não depende mais de:

```text
W:\Douglas\PLATAFORMA_QUALIDADE
W:\Douglas\PLATAFORMA_QUALIDADE\Propostas_Relatorio
```

Esses caminhos são apenas referências históricas. Nenhuma funcionalidade atual deve exigir acesso a eles.

## Base consolidada e evidências

A fonte de continuidade é a informação já estruturada na recuperação V6. Quando um documento original estiver indisponível:

- preservar nome/referência documental;
- preservar dados já extraídos;
- não inventar conteúdo ausente;
- não transformar ausência documental em não conformidade;
- não recalcular conformidade sem nova evidência verificável.

Novos documentos podem ser incorporados futuramente como entrada opcional.

## Similaridade e conhecimento

O motor utiliza somente campos recuperados e funciona em **modo de recomendação**. Ele compara:

- modalidade/áreas;
- software;
- título/objeto;
- referências documentais;
- cliente.

O score é explicável e não altera automaticamente Checklist, Gates ou parâmetros técnicos. Metodologia detalhada: `docs/SIMILARITY_ENGINE.md`.

## Estrutura

```text
quality-cae-douglas/
├── .github/workflows/validate.yml
├── app/
│   ├── index.html       # snapshot/base V6 recuperada
│   ├── knowledge.html   # módulo isolado de similaridade
│   └── final.html       # interface principal do MVP
├── docs/
│   ├── DATA_CONTINUITY.md
│   ├── SIMILARITY_ENGINE.md
│   └── PROJECT_COMPLETE.md
├── scripts/
├── tests/
│   └── validate_qsim.py
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## Validação

O workflow `Validate Q-SIM` executa `python tests/validate_qsim.py` em pull requests e pushes para `main`.

A validação verifica, entre outros pontos:

- presença da base compactada;
- presença dos módulos principais;
- ausência de dependência obrigatória da antiga unidade `W:`;
- avisos de continuidade documental;
- caráter não destrutivo das recomendações.

## Estado do projeto

O projeto é considerado **MVP concluído** quando o PR final for integrado e o workflow de validação estiver aprovado.

O escopo concluído é uma plataforma estática, autossuficiente e auditável sobre a base recuperada. Evoluções futuras — autenticação, banco transacional, ingestão de novos documentos e reanálise semântica — são melhorias pós-MVP e não requisitos para operação da versão atual.
