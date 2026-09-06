# Q-SIM — Plataforma de Qualidade CAE

Repositório oficial da plataforma **Q-SIM**, voltada à gestão da qualidade, rastreabilidade técnica e base de conhecimento de projetos de engenharia e simulação CAE.

## Referência atual

- **Layout:** manter o padrão consolidado da V6.
- **Checklist e Gates:** manter a lógica funcional evoluída na V7 e consolidada nas versões posteriores.
- **Versões futuras:** preservar a identidade visual e evoluir a lógica sem regressão funcional.

## Modelo atual de funcionamento

A Q-SIM deve funcionar de forma **autossuficiente a partir deste repositório**.

A plataforma NÃO depende mais de:

```text
W:\Douglas\PLATAFORMA_QUALIDADE
W:\Douglas\PLATAFORMA_QUALIDADE\Propostas_Relatorio
```

Esses caminhos devem ser tratados apenas como referências históricas de origem e nunca como dependências obrigatórias de execução.

## Base consolidada

Os dados já incorporados à plataforma são a fonte principal para continuidade do projeto, incluindo, quando existentes:

- projetos históricos;
- fichas técnicas;
- checklists;
- Gates de Qualidade;
- status históricos;
- justificativas técnicas;
- evidências extraídas;
- nomes de documentos de origem;
- páginas e seções;
- trechos documentais já incorporados;
- níveis de evidência e confiança;
- lições aprendidas;
- base histórica e rastreabilidade.

A ausência dos documentos originais não deve impedir a navegação, consulta, análise ou evolução da plataforma.

## Política para evidências históricas

Quando o documento original não estiver disponível:

- preservar o nome do documento;
- preservar a página, seção e trecho já extraídos;
- preservar a justificativa técnica associada;
- indicar que o documento original está indisponível, quando aplicável;
- não apagar ou invalidar evidências já consolidadas apenas porque o arquivo-fonte não pode mais ser acessado;
- não inventar novos dados para preencher lacunas.

## Novos documentos

Novos relatórios, propostas ou documentos técnicos poderão ser incorporados futuramente como fontes adicionais.

Eles devem ser tratados como entrada opcional, e não como requisito para funcionamento da plataforma.

Documentos de clientes e arquivos potencialmente confidenciais não devem ser publicados neste repositório público sem autorização explícita.

## Motor de Similaridade e Conhecimento

A primeira evolução sobre a base recuperada está disponível em:

```text
app/knowledge.html
```

O módulo trabalha em **modo de recomendação** e utiliza somente os campos estruturados que já existem na recuperação V6. Ele oferece:

- seleção de projeto de referência;
- Top 5 ou Top 10 projetos históricos relacionados;
- score de similaridade explicado por dimensão;
- classificação do nível de similaridade;
- indicação das diferenças e limitações do score;
- sinais de Checklist e Gates que merecem revisão documental.

O módulo não cria fatos técnicos ausentes, não presume não conformidade por ausência documental e não altera automaticamente Checklist ou Gates.

A metodologia está documentada em:

```text
docs/SIMILARITY_ENGINE.md
```

## Objetivos da plataforma

- consolidar projetos históricos de engenharia;
- manter ficha técnica rastreável por projeto;
- controlar Checklists e Gates de Qualidade;
- vincular evidências a documentos, páginas e revisões quando disponíveis;
- registrar lições aprendidas;
- apoiar novos projetos utilizando conhecimento histórico;
- evoluir o motor de similaridade e reuso de conhecimento conforme novas evidências fiquem disponíveis.

## Estrutura do repositório

```text
quality-cae-douglas/
├── app/                 # Aplicação/plataforma atual
├── data/                # Dados estruturados permitidos para versionamento
├── docs/                # Documentação técnica
├── scripts/             # Ferramentas auxiliares
├── tests/               # Testes
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## Fonte oficial de continuidade

A partir desta mudança, a ordem de prioridade é:

1. dados consolidados presentes na versão atual da Q-SIM;
2. evidências estruturadas já incorporadas;
3. arquivos novos adicionados futuramente;
4. documentos históricos originais, apenas se voltarem a estar disponíveis.

## Versionamento

- Não sobrescrever versões históricas de referência sem necessidade.
- V6 permanece referência visual.
- Checklist e Gates evoluídos devem permanecer preservados.
- Toda alteração relevante deve ser registrada em `CHANGELOG.md`.
- Evitar publicar documentos de clientes, propostas, relatórios e arquivos confidenciais.

## Desenvolvimento

O desenvolvimento deve ocorrer diretamente neste repositório.

O Codex e demais ferramentas de desenvolvimento não devem assumir que existe uma unidade `W:` ou outra pasta externa.

Qualquer importador futuro deve aceitar uma pasta de entrada configurável e opcional.
