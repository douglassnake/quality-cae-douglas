# Continuidade de Dados da Q-SIM

## Objetivo

Garantir que a Q-SIM continue funcionando e evoluindo mesmo sem acesso ao acervo original de propostas e relatórios.

## Camadas de informação

### 1. Base consolidada

Fonte principal da plataforma. Deve preservar os dados já incorporados às versões atuais da Q-SIM.

Exemplos:

- projeto e cliente;
- ficha técnica;
- modalidade CAE;
- materiais e fluidos;
- condições de contorno;
- malha;
- modelos físicos;
- resultados;
- checklist;
- Gates;
- lições aprendidas.

### 2. Evidência histórica estruturada

Deve permanecer utilizável mesmo quando o arquivo-fonte não existir mais localmente.

Campos recomendados:

- `source_document_name`
- `source_revision`
- `source_page`
- `source_section`
- `source_excerpt`
- `technical_summary`
- `evidence_type`
- `evidence_strength`
- `confidence`
- `source_availability`

Valores sugeridos para `source_availability`:

- `available`
- `unavailable_historical`
- `not_required`
- `unknown`

### 3. Novas fontes

Novos documentos podem ser incorporados futuramente por upload ou pasta configurável.

A importação deve ser opcional e não pode ser requisito para iniciar a aplicação.

## Regras

1. Não remover evidência consolidada apenas porque a fonte original não está mais acessível.
2. Não inventar conteúdo ausente.
3. Não transformar `source unavailable` em `non-conformity`.
4. Não depender de caminhos absolutos históricos.
5. Não usar a unidade `W:` como configuração padrão.
6. Importadores futuros devem receber a origem por parâmetro ou configuração.
7. O repositório deve ser suficiente para executar a plataforma e seus testes.

## Caminhos históricos

Os caminhos abaixo podem permanecer apenas em campos de auditoria/legado e nunca devem ser usados para leitura obrigatória:

```text
W:\Douglas\PLATAFORMA_QUALIDADE
W:\Douglas\PLATAFORMA_QUALIDADE\Propostas_Relatorio
```

## Segurança

O repositório é público. Não versionar documentos de clientes, propostas, relatórios completos ou outros arquivos potencialmente confidenciais sem autorização explícita.
