# Q-SIM — Bombeamento e Topografia (MVP 0.1)

## Acesso
Abra a aba **Bombas e Topografia** na página principal, ou diretamente `app/pumps.html`. É uma aplicação estática compatível com GitHub Pages, sem backend.

## Importação do Google Earth
1. No Google Earth Pro, crie um **Caminho** no sentido captação → destino.
2. Clique com o botão direito no caminho e selecione **Salvar lugar como...**, formato **KML** (não KMZ).
3. Importe no simulador. São aceitos arquivos até 5 MB, com um `LineString` de 2 até 20.000 coordenadas.
4. Confirme distância, direção, cotas e diâmetro interno real. Se o KML contiver apenas valores de altitude iguais a zero (comum em caminhos apoiados no terreno), informe o desnível manualmente. O aplicativo **não inventa altitudes** e **não consulta automaticamente a API do Google**.

## Modelo de engenharia
- Escoamento permanente de água a cerca de 20 °C (densidade 1000 kg/m³, viscosidade cinemática 1,004e-6 m²/s).
- Darcy–Weisbach: `hf = f*(L/D)*v²/(2g)`.
- Regime laminar: `f = 64/Re`; demais regimes: aproximação explícita de Haaland.
- Perdas localizadas: `hK = ΣK*v²/(2g)`.
- `AMT = desnível estático + hf + hK + pressão residual em mca`.
- `P elétrica = ρgQ*AMT/(rendimento_bomba*rendimento_motor)`; consumos e custos estimados com horários informados.
- O comprimento inicial importado é a distância horizontal geodésica dos pontos amostrados; é editável para comprimento hidráulico efetivo.
- O cálculo considera duas condições terminais simplificadas, sem diferenças adicionais de cargas cinéticas. Não é modelo de distribuição por múltiplos ramais.

## Limitações fundamentais
- O arquivo KML não garante cotas de terreno; `altitudeMode=clampToGround` e alturas zeradas não fornecem perfil topográfico numérico.
- Elevações KML precisam de verificação de datum e precisão; não substituem levantamento.
- A AMT estática é diferença de cotas terminais, **não** soma de todas as subidas intermediárias.
- O sistema **não** calcula pressão local ao longo do percurso, NPSH, cavitação, golpe de aríete, pressão máxima ou curva de fabricante, nem recomenda modelo comercial.
- O mapa usa Leaflet + tiles OpenStreetMap por CDN. Dados KML são processados no navegador sem upload a servidor. Tiles e recursos CDN são solicitados a serviços externos.
- Em sistemas que operem por gravidade, AMT não positiva deve ser tratada separadamente.
- Para projetos executivos, analisar sucção, entradas/saídas, reservatórios, válvulas, transientes e curva de bomba em campo.

## Evoluções
Perfil hidráulico com linha piezométrica, aquisição opcional de modelo digital de elevação licenciado, curvas reais de bombas e testes automatizados de engenharia.

## Pressão de entrada do pivô (variável)
- Campo editável **Pressão exigida na entrada do pivô (bar)**; valor inicial 0 indica **não informado** e gera aviso.
- Conversão física: `H_pressão = P_bar * 100000 / (rho * g)`, com `rho = 1000 kg/m³` e `g = 9,80665 m/s²`.
- Esta parcela entra na AMT como pressão residual no ponto de entrega, sem atribuir um valor genérico a nenhum modelo de pivô.
- Quando o fabricante informar a pressão de serviço, inserir o valor para atualizar AMT, potência e consumo. A pressão nominal depende do projeto, dos emissores e das perdas internas.
