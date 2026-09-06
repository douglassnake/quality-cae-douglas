# Q-SIM — Termo de Conclusão do MVP

## Objetivo concluído

A Q-SIM foi consolidada como uma plataforma estática e autossuficiente para consulta da base histórica recuperada de projetos CAE, acompanhamento dos Checklists/Gates preservados e reuso de conhecimento por similaridade.

## Entregas do MVP

1. **Base recuperada e preservada**
   - snapshot V6 mantido em `app/index.html`;
   - sem dependência obrigatória da antiga unidade `W:`;
   - sem dependência da pasta `Propostas_Relatorio`.

2. **Interface consolidada**
   - `app/final.html` como entrada principal;
   - Dashboard;
   - Projetos;
   - Checklist e Gates;
   - Conhecimento;
   - Busca;
   - Documentos;
   - Governança.

3. **Motor de Similaridade**
   - Top projetos relacionados;
   - score explicável;
   - pesos documentados;
   - indicação de diferenças/limitações;
   - recomendações não destrutivas.

4. **Governança de evidências**
   - ausência documental não vira não conformidade automaticamente;
   - não há criação de fatos técnicos ausentes;
   - novos documentos são opcionais;
   - histórico preservado até existir nova evidência verificável.

5. **Validação e regressão**
   - `tests/validate_qsim.py`;
   - GitHub Actions em `.github/workflows/validate.yml`.

## Limitações assumidas

Este MVP não tenta reproduzir uma V7/V8 que não foi recuperada. Também não inclui:

- autenticação;
- banco de dados transacional;
- reprocessamento semântico dos PDFs originais;
- upload/ingestão automática de novos documentos;
- edição colaborativa multiusuário;
- decisão automática de engenharia.

Esses itens ficam classificados como evolução pós-MVP.

## Critérios de aceite

O MVP é aceito quando:

- `app/final.html` existe e contém os módulos principais;
- a base compactada V6 continua presente;
- a aplicação não depende dos caminhos locais antigos;
- o motor de similaridade permanece em modo de recomendação;
- o CI executa sem falhas no `main`.

## Regra para futuras evoluções

Toda evolução deve:

1. preservar os dados recuperados;
2. manter rastreabilidade da fonte;
3. distinguir evidência, inferência e ausência de informação;
4. evitar recomendação prescritiva sem evidência;
5. preservar compatibilidade com a interface consolidada ou justificar formalmente a mudança.

## Estado

**MVP funcionalmente concluído, sujeito apenas à validação final do CI após merge.**
