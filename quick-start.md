# 🚀 Como Executar o Frontend

## Passo 1: Instalar Dependências
```bash
yarn install
```

## Passo 2: Executar o Frontend
```bash
yarn dev
```

## ✅ Verificar se funcionou
- O Vite deve iniciar na porta **5173**
- Você verá no terminal algo como:
```
  VITE v6.3.5  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🔗 Acessar o Dashboard
Abra seu navegador e acesse: **http://localhost:5173/**

## 🐍 Para usar dados reais do MT5:
1. **Execute o backend primeiro:**
   ```bash
   cd backend
   python app.py
   ```
2. **Depois execute o frontend:**
   ```bash
   yarn dev
   ```
3. **No dashboard, clique em "Conectar MT5"**

## 📱 O que você verá:
- Dashboard responsivo funcionando
- Status de conexão MT5
- Dados simulados (se MT5 não estiver conectado)
- Interface completa para day trading

## 🔧 Se der erro:
- Verifique se o Node.js está instalado
- Execute `yarn install` primeiro
- Certifique-se que não há outro serviço na porta 5173
