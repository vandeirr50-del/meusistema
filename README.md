# Dashboard Day Trading com MetaTrader 5

Sistema completo de dashboard para day trading que conecta diretamente ao MetaTrader 5 para obter dados em tempo real dos ativos MinDolOct25 e Bra50Oct25.

## 🚀 Características

- **📊 Dados em Tempo Real**: Conecta diretamente ao MT5 via Python
- **📈 Gráficos Profissionais**: Candlestick interativo com volume
- **🔍 Indicadores Técnicos**: RSI, MACD, SMA, Bollinger Bands
- **⚡ Timeframes Múltiplos**: 1M, 5M, 15M, 30M, 1H, 4H, 1D
- **📱 Responsivo**: Funciona em mobile, tablet e desktop

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Tailwind CSS + ECharts
- **Backend**: Python + Flask + MetaTrader5 library
- **Dados**: MetaTrader 5 (MinDolOct25, Bra50Oct25)

## 📋 Pré-requisitos

### Sistema
- Node.js 18+
- Python 3.8+
- MetaTrader 5 instalado e funcionando
- Conta ativa no MT5 com acesso aos símbolos

### Símbolos Necessários
- **MinDolOct25**: Mini Dólar Outubro 2025
- **Bra50Oct25**: Mini Índice Outubro 2025

## 🛠️ Instalação

### 1. Clone e Configure o Frontend

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL da API
```

### 2. Configure o Backend

```bash
# Navegar para o backend
cd backend

# Instalar dependências Python
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com credenciais do MT5 (opcional)
```

### 3. Executar o Sistema

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
yarn dev
```

## 🔧 Configuração do MT5

1. **Abra o MetaTrader 5**
2. **Faça login** na sua conta
3. **Verifique os símbolos**: Certifique-se que MinDolOct25 e Bra50Oct25 estão disponíveis
4. **Execute o backend**: O sistema se conectará automaticamente

## 📊 Funcionalidades

### Dashboard Principal
- Lista de ativos com preços em tempo real
- Indicadores de alta/baixa/estabilidade
- Status de conexão com MT5

### Análise Detalhada
- Gráfico candlestick interativo
- Seletor de timeframe (1M a 1D)
- Zoom e navegação temporal
- Volume de negociação

### Indicadores Técnicos
- **RSI (14)**: Índice de Força Relativa
- **MACD**: Convergência/Divergência de Médias
- **SMA 20**: Média Móvel Simples
- **Bollinger %B**: Posição nas Bandas de Bollinger

### Sentimento do Mercado
- Análise automática baseada nos movimentos
- Gráfico visual de distribuição
- Percentuais de otimismo/pessimismo

## 🔌 API Endpoints

- `GET /api/health` - Status da API e conexão MT5
- `POST /api/connect` - Conectar ao MT5
- `GET /api/stocks` - Dados atuais dos ativos
- `GET /api/candlestick/<symbol>` - Dados OHLCV
- `GET /api/technical-indicators/<symbol>` - Indicadores técnicos
- `GET /api/market-sentiment` - Sentimento do mercado

## 🎯 Símbolos Suportados

| Símbolo | Nome | Descrição |
|---------|------|-----------|
| MinDolOct25 | Mini Dólar Outubro 2025 | Contrato futuro de dólar |
| Bra50Oct25 | Mini Índice Outubro 2025 | Contrato futuro do Ibovespa |

## 🚨 Troubleshooting

### Erro de Conexão MT5
1. Verifique se o MT5 está aberto e logado
2. Confirme que os símbolos estão disponíveis
3. Reinicie o backend Python

### API não responde
1. Verifique se o backend está rodando na porta 5000
2. Confirme o VITE_API_URL no .env
3. Verifique logs no terminal do backend

### Dados não aparecem
1. Clique em "Conectar MT5" no dashboard
2. Verifique se os símbolos existem na sua conta
3. Aguarde alguns segundos para sincronização

## 📈 Próximos Passos

1. **Conectar Supabase**: Para armazenar histórico de operações
2. **Deploy**: Usar o botão Publish para deploy
3. **Showcase**: Submeter para o Dualite Showcase
4. **Alertas**: Implementar notificações de sinais
5. **Mais Símbolos**: Adicionar outros ativos do MT5

## ⚠️ Aviso Importante

Este sistema é para fins educacionais e de demonstração. Sempre faça sua própria análise antes de tomar decisões de investimento. Day trading envolve riscos significativos.
