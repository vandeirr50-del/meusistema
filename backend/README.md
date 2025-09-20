# Backend MT5 Day Trading Dashboard

## Requisitos
- Python 3.8+
- MetaTrader 5 instalado e funcionando
- Conta ativa no MT5

## Instalação

1. Instale as dependências:
```bash
cd backend
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

3. Execute o servidor:
```bash
python app.py
```

## Endpoints da API

- `GET /api/health` - Verifica status da API
- `POST /api/connect` - Conecta ao MT5
- `GET /api/stocks` - Lista de ações com preços atuais
- `GET /api/candlestick/<symbol>` - Dados de candlestick
- `GET /api/technical-indicators/<symbol>` - Indicadores técnicos
- `GET /api/market-sentiment` - Sentimento do mercado

## Símbolos Suportados
- MinDolOct25 (Mini Dólar Outubro 2025)
- Bra50Oct25 (Mini Índice Outubro 2025)
