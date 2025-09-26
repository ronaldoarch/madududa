# Página K18 - Máscara de Reparo Molecular

## 🚀 Como Executar

### Opção 1: Servidor Python (Recomendado)
```bash
# No diretório do projeto, execute:
python -m http.server 8000

# Depois acesse:
http://localhost:8000
```

### Opção 2: Servidor Node.js
```bash
# Instale o http-server globalmente:
npm install -g http-server

# No diretório do projeto, execute:
http-server -p 8000

# Depois acesse:
http://localhost:8000
```

### Opção 3: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no arquivo `index.html`
3. Selecione "Open with Live Server"

## ⚠️ Importante - Erro de CORS

**NÃO abra o arquivo `index.html` diretamente no navegador** (duplo clique), pois isso causará erro de CORS ao tentar acessar a API da Yampi.

### Por que acontece o erro?
- Arquivos abertos diretamente têm origem `null`
- APIs externas (como Yampi) bloqueiam requisições de origem `null`
- É necessário usar um servidor web local

## 📁 Estrutura do Projeto

```
madududa/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js               # JavaScript principal
├── yampi-config.js         # Configurações da API Yampi
├── assets/                 # Pasta de imagens
│   ├── frasco-k18.png      # Imagem do frasco
│   ├── antes.jpg           # Imagem "antes" do tratamento
│   ├── depois.jpg          # Imagem "depois" do tratamento
│   ├── prova-cientifica.jpg # Banner de prova científica
│   └── README.md           # Instruções das imagens
└── README.md               # Este arquivo
```

## 🛒 Funcionalidades

- ✅ **Design Responsivo** - Funciona em desktop e mobile
- ✅ **Checkout Integrado** - Conectado com API da Yampi
- ✅ **Múltiplas Formas de Pagamento** - PIX, cartão, boleto
- ✅ **Validação de CEP** - Busca automática de endereço
- ✅ **Desconto PIX** - 5% de desconto no PIX
- ✅ **Formatação Automática** - Telefone, CEP, cartão

## 🔧 Configuração da Yampi

As credenciais da API estão configuradas em `yampi-config.js`:

```javascript
const YAMPI_CONFIG = {
    alias: 'madududastore',
    token: 'd2lixXm5SjxpbxmUwEI5LRwJat04ZPIgiB0OvmcD',
    secretKey: 'sk_9WPSObynntXiRCsmplAdhN1gAHdBhi3lo34Eh'
};
```

### Como Funciona o Redirecionamento:
1. **Cliente clica** no botão "COMPRAR AGORA" (dos kits)
2. **Modal de loading** aparece brevemente
3. **Redirecionamento automático** para checkout específico da Yampi
4. **URL específica**: `madududastore.pay.yampi.com.br/checkout?skipToCheckout=1&tokenReference=5Z77QDD1Z5`
5. **Checkout direto** com token de referência
6. **Finalização da compra** na plataforma Yampi

### ✅ Vantagens do Checkout como Visitante:
- **Sem cadastro obrigatório** - cliente compra imediatamente
- **Processo mais rápido** - menos fricção na conversão
- **Maior taxa de conversão** - sem barreiras de login
- **Experiência fluida** - direto para o pagamento
- **Dados coletados** apenas para entrega e cobrança

### Informações de Contato:
- **WhatsApp**: (21) 96595-0400
- **E-mail**: hjcarvalho7@gmail.com
- **Loja Yampi**: [madududastore.pay.yampi.com.br](https://madududastore.pay.yampi.com.br)

## 🎨 Cores da Marca

- **Verde Principal**: `#C3D600`
- **Verde Secundário**: `#5CBD78`

## 📱 Produtos Configurados

1. **Máscara Single** - R$ 139,00
2. **Kit 1** - R$ 139,00  
3. **Kit 2** - R$ 227,00

## 🔍 Troubleshooting

### Erro "Failed to fetch"
- ✅ Certifique-se de estar usando um servidor web local
- ✅ O checkout agora redireciona para a Yampi (sem erro de API)
- ✅ Teste a conexão com a internet

### Imagens não aparecem
- ✅ Adicione as imagens na pasta `assets/`
- ✅ Use os nomes exatos especificados no `assets/README.md`

### Checkout não funciona
- ✅ Abra o console do navegador (F12) para ver erros
- ✅ Verifique se a API da Yampi está funcionando
- ✅ Teste com dados válidos

## 📞 Suporte

Para dúvidas ou problemas, entre em contato:
- **E-mail**: suporte@k18balelo.com
