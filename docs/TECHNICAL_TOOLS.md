# Ferramentas Técnicas CAE/CFD — Q-SIM

## Objetivo

Adicionar à Q-SIM calculadoras locais para apoiar definição de condições de contorno, malha, passo de tempo e pós-processamento de simulações.

Todas as ferramentas executam no navegador. Nenhum valor digitado é enviado para servidor.

## Ferramentas V1

### 1. Reynolds, Mach e pressão dinâmica

Entradas: densidade, viscosidade dinâmica, velocidade, comprimento característico e velocidade do som.

Fórmulas:

- `Re = rho * U * L / mu`
- `Mach = U / a`
- `q = 0.5 * rho * U^2`

A ferramenta não classifica automaticamente o regime como laminar/turbulento porque o limite depende da geometria e do problema físico.

### 2. y+ e primeira camada

Estimativa inicial baseada em correlação de placa plana turbulenta.

Correlações disponíveis:

- `Cf = 0.026 Re^(-1/7)`
- `Cf = 0.0592 Re^(-1/5)`

Cálculo:

- `u_tau = U sqrt(Cf/2)`
- `y = y_plus * mu / (rho * u_tau)`
- espessura inicial aproximada da primeira camada: `2y`

O valor calculado é uma estimativa de pré-processamento. O y+ efetivo deve ser verificado após a solução CFD.

### 3. CFL, passo de tempo e resolução angular

Fórmulas:

- `CFL = U * dt / dx`
- `dt = CFL * dx / U`
- para rotação: `dt = delta_theta / (6 * rpm)`

Útil em análises transientes, rotores, hélices e regiões com células pequenas.

### 4. Cd / Cl e força equivalente

- `C = F / (0.5 * rho * U^2 * A)`
- `F = C * 0.5 * rho * U^2 * A`

Pode ser utilizado para arrasto, sustentação e outros coeficientes definidos com pressão dinâmica e área de referência.

### 5. GCI — Grid Convergence Index

Implementa procedimento de três malhas:

- h1: malha fina
- h2: malha média
- h3: malha grossa
- phi1, phi2, phi3: variável monitorada

Calcula:

- razões de refinamento r21 e r32;
- ordem aparente p por iteração;
- solução extrapolada;
- GCI21 e GCI32 com fator de segurança 1,25;
- indicador de faixa assintótica;
- alerta de convergência oscilatória quando aplicável.

Requer `h1 < h2 < h3` e uma definição consistente do tamanho representativo da malha.

### 6. Convecção térmica

- `q'' = h (Ts - Tinf)`
- `Q = h A (Ts - Tinf)`
- `h = Q / [A (Ts - Tinf)]`

### 7. Conversão de unidades

Grandezas disponíveis:

- pressão;
- velocidade;
- comprimento;
- temperatura;
- vazão volumétrica;
- força;
- torque.

## Governança técnica

As calculadoras são ferramentas de apoio e não substituem:

- definição correta do modelo físico;
- análise de sensibilidade;
- independência de malha/tempo;
- validação experimental, analítica ou bibliográfica;
- critérios normativos aplicáveis;
- julgamento de engenharia.

## Próximas ferramentas recomendadas

- estimativa automática de propriedades do ar por temperatura e pressão;
- dimensionamento completo de inflation layers;
- crescimento geométrico de camadas e espessura total;
- cálculo de perda de carga Darcy-Weisbach;
- cálculo de potência, torque e coeficientes de hélice;
- Strouhal e frequência de shedding;
- Rayleigh, Grashof, Prandtl e Nusselt;
- Biot e Fourier;
- calculadora de contatos e pressão estrutural;
- tensão equivalente e fator de segurança;
- conversor de aceleração/rotação;
- matriz de condições de contorno por modalidade de simulação;
- gerador de checklist técnico CFD/FEA/térmico/transiente.
