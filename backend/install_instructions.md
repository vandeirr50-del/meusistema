# Instruções de Instalação do Backend MT5

## Passo a Passo

### 1. Instalar Dependências Python

Abra o terminal na pasta `backend` e execute:

```bash
pip install -r requirements.txt
```

### 2. Verificar Pré-requisitos

- ✅ **MetaTrader 5 instalado**
- ✅ **Conta ativa e logada no MT5**
- ✅ **Símbolos disponíveis**: MinDolOct25, Bra50Oct25

### 3. Executar o Backend

```bash
python app.py
```

### 4. Verificar Funcionamento

O servidor deve iniciar na porta 5000. Você verá logs como:

```
INFO - Iniciando servidor Flask...
INFO - Símbolos configurados: ['MinDolOct25', 'Bra50Oct25']
INFO - Conectado ao MT5 - Conta: [número da conta]
```

### 5. Testar API

Abra no navegador: `http://localhost:5000/api/health`

Deve retornar:
```json
{
  "status": "online",
  "mt5_connected": true,
  "timestamp": "2025-01-xx..."
}
```

## Troubleshooting

### Erro: ModuleNotFoundError
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### MT5 não conecta
1. Verifique se o MT5 está aberto
2. Verifique se está logado na conta
3. Reinicie o MT5 e tente novamente

### Símbolos não encontrados
1. No MT5, vá em "Exibir" → "Símbolos"
2. Procure por "MinDolOct25" e "Bra50Oct25"
3. Clique duas vezes para adicionar ao Market Watch
