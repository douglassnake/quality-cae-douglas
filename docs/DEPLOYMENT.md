# Q-SIM — Publicação estática

## Entrada

O arquivo raiz `index.html` redireciona para `app/final.html`, que é a interface principal do MVP.

## Dependências

Nenhuma dependência de servidor, banco de dados ou pasta externa é necessária para navegação do MVP atual.

Arquivos essenciais:

- `index.html`
- `app/final.html`
- `app/index.html`

`app/final.html` lê a base compactada preservada em `app/index.html`.

## GitHub Pages

O repositório está preparado para hospedagem estática a partir da branch `main` com raiz `/`.

O arquivo `.nojekyll` evita processamento Jekyll desnecessário.

Caso GitHub Pages seja habilitado nas configurações do repositório, a raiz deve abrir automaticamente a plataforma.

## Validação após publicação

Confirmar:

1. raiz redireciona para `app/final.html`;
2. Dashboard carrega a quantidade de projetos;
3. Projetos permite busca e filtro por ano;
4. seleção de projeto abre Checklist/Gates;
5. Conhecimento mostra Top 5 relacionados;
6. Busca retorna projetos;
7. Documentos exibe referências recuperadas;
8. nenhum recurso depende da unidade `W:`.

## Segurança

O repositório é público. Não adicionar relatórios, propostas, anexos de cliente ou documentos confidenciais sem autorização explícita.
