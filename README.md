# Q-SIM — Plataforma de Qualidade CAE

Repositório oficial da plataforma **Q-SIM**, voltada à gestão da qualidade, rastreabilidade técnica e base de conhecimento de projetos de engenharia e simulação CAE.

## Referência atual

- **Layout:** manter o padrão consolidado da V6.
- **Checklist e Gates:** manter a lógica funcional evoluída na V7 e consolidada nas versões posteriores.
- **Versões futuras:** preservar a identidade visual e evoluir a lógica sem regressão funcional.

## Diretório local de trabalho

```text
W:\Douglas\PLATAFORMA_QUALIDADE
```

## Fonte local de relatórios e propostas

```text
W:\Douglas\PLATAFORMA_QUALIDADE\Propostas_Relatorio
```

> Os relatórios e propostas não devem ser publicados automaticamente no GitHub. Devem permanecer como fonte local de dados, salvo autorização específica para versionamento.

## Objetivos da plataforma

- consolidar projetos históricos de engenharia;
- manter ficha técnica rastreável por projeto;
- controlar Checklists e Gates de Qualidade;
- vincular evidências a documentos, páginas e revisões;
- registrar lições aprendidas;
- apoiar novos projetos utilizando conhecimento histórico;
- evoluir para motor de similaridade e reuso de conhecimento.

## Estrutura recomendada

```text
quality-cae-douglas/
├── app/                 # Aplicação/plataforma atual
├── data/                # Dados estruturados permitidos para versionamento
├── docs/                # Documentação técnica
├── scripts/             # Importação, auditoria e publicação
├── tests/               # Testes
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## Versionamento

- Não sobrescrever versões históricas de referência sem necessidade.
- V6 permanece referência visual.
- Checklist e Gates evoluídos devem permanecer preservados.
- Toda alteração relevante deve ser registrada em `CHANGELOG.md`.
- Evitar publicar documentos de clientes, propostas, relatórios e arquivos confidenciais.

## Publicação local

O script `scripts/publish-current.ps1` foi preparado para sincronizar a versão atual da plataforma a partir da unidade `W:` para este repositório em uma máquina que tenha acesso à pasta local.
