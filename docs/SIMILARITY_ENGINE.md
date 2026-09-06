# Q-SIM — Similarity Engine v1

## Objetivo

Adicionar um motor de similaridade em modo de recomendação utilizando somente os dados estruturados recuperados do snapshot V6.

## Limitação central

Os relatórios e propostas originais não estão disponíveis. Portanto, esta versão **não** executa análise semântica dos documentos e **não** cria evidências técnicas novas.

O motor utiliza apenas campos já presentes na base compactada de `app/index.html`:

- identificação/título do projeto;
- cliente;
- ano;
- áreas/modalidades registradas;
- softwares registrados;
- referências documentais existentes;
- resumo de checklist;
- status dos Gates recuperados.

## Score

O score é recalculado apenas entre dimensões disponíveis. Dados ausentes não são tratados automaticamente como diferença.

Pesos atuais:

- modalidade/áreas: 40%;
- software: 25%;
- título/objeto: 20%;
- referências documentais: 10%;
- mesmo cliente: 5%.

Esses pesos são provisórios para a base recuperada e devem ser revistos quando dados técnicos mais ricos voltarem a existir.

## Classificação

- 90–100%: Muito semelhante;
- 75–89%: Semelhante;
- 55–74%: Parcialmente semelhante;
- 35–54%: Baixa similaridade;
- 0–34%: Pouco relevante.

## Segurança epistemológica

O motor:

- não presume que ausência documental é não conformidade;
- não transforma histórico em regra de engenharia;
- não sugere condição de contorno, malha ou solver sem fonte técnica;
- não altera Checklist ou Gates automaticamente;
- apresenta sinais de Gates pendentes/ressalvas apenas como pontos para revisão documental.

## Interface

O módulo está em:

`app/knowledge.html`

Ele carrega a base diretamente de `app/index.html`, evitando duplicação dos dados recuperados.

## Próxima evolução

Quando houver novos documentos disponíveis, separar o motor em camadas:

1. similaridade estrutural;
2. similaridade técnica;
3. evidências documentais;
4. lições aprendidas;
5. recomendações com rastreabilidade e confiança.
