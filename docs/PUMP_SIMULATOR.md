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

## Perfil topográfico automático e linha piezométrica (MVP 0.2)

1. Importe o KML do Google Earth com caminho no sentido captação → pivô.
2. Clique em **Obter altitudes automaticamente**. Uma requisição HTTPS do navegador consulta 80 pontos equidistantes ao longo da geometria em `api.open-meteo.com/v1/elevation`, usando o Copernicus DEM GLO-90 (~90 m). A API pública informa suporte a CORS e até 100 coordenadas por chamada. Não requer backend ou chave para uso não comercial, mas depende da conectividade, disponibilidade e política de uso da Open-Meteo. Para uso comercial, verificar os termos e a modalidade de API apropriada.
3. Se todas as amostras retornarem altitudes numéricas, o sistema mostra altitude inicial e final, mínimos e máximos, e atualiza automaticamente o desnível estático. Caso contrário, preserva os valores manuais e informa a falha.
4. Informe pressão exigida pelo pivô em bar (valor maior que zero). O gráfico mostra a linha piezométrica estimada e o texto destaca a pressão mínima, máxima e amostras com pressão manométrica negativa.

### Hipóteses e limites

A linha piezométrica para a distância acumulada `s` (comprimento geodésico `S`) é estimada por

`HGL(s) = z_destino + H_pressão_destino + (hf + hlocal)*(1 - s/S)`.

A pressão manométrica em cada amostra é `HGL(s) - z_terreno(s)` em mca. As perdas totais, inclusive as localizadas, são distribuídas uniformemente para a **visualização preliminar**. O cálculo pressupõe uma única tubulação com diâmetro constante, escoamento permanente e pressão na entrada do pivô. Não representa pressão do solo quando a tubulação está enterrada a profundidade diferente; as cotas do solo e da linha de centro do tubo podem divergir. Não calcula golpes de aríete, NPSH, sucção, ventosas, ar aprisionado, curvas reais da bomba nem tolerâncias da rede.

**Atenção:** MDE Copernicus GLO-90 mede relevo em resolução aproximada de 90 m, não substitui levantamento topográfico, cota da linha de centro da tubulação ou perfil hidráulico executivo. Confirmar datum vertical e direção do caminho. A pressão calculada depende diretamente da pressão requerida no pivô, que deve vir do fabricante. Não assumir a inclinação média nem o ganho acumulado como desnível terminal.

Fonte: https://open-meteo.com/en/docs/elevation-api e https://open-meteo.com/en/terms (atribuição obrigatória Open-Meteo e Copernicus). A API anterior OpenTopoData foi substituída porque sua instância pública não expõe CORS para o navegador, impedindo a integração direta ao GitHub Pages.
