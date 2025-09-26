// Configurações da API Yampi
// IMPORTANTE: Nunca commite este arquivo com credenciais reais em produção
// Use variáveis de ambiente ou um sistema de configuração seguro

const YAMPI_CONFIG = {
    // Credenciais da API Yampi (atualizadas)
    alias: 'madududastore',
    token: 'd2lixXm5SjxpbxmUwEI5LRwJat04ZPIgiB0OvmcD',
    secretKey: 'sk_9WPSObynntXiRCsmplAdhN1gAHdBhi3lo34Eh',
    
    // URLs da API
    apiUrl: 'https://api.yampi.com.br/api/v1',
    checkoutUrl: 'https://madududastore.pay.yampi.com.br/checkout',
    
    // Configurações da loja
    store: {
        name: 'MaduDuda Store',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo'
    },
    
    // Mapeamento de produtos
    products: {
        'k18-mask-single': {
            id: 'k18-mask-single',
            name: 'Máscara de Reparo Molecular K18',
            price: 139.00,
            category: 'hair-care',
            yampi_product_id: 'k18-mask-single' // ID real na plataforma Yampi
        },
        'k18-kit-1': {
            id: 'k18-kit-1', 
            name: 'Kit 1 - Máscara K18 (2 Produtos)',
            price: 278.00,
            category: 'hair-care-kits',
            yampi_product_id: 'k18-kit-1' // ID real na plataforma Yampi
        },
        'k18-kit-2': {
            id: 'k18-kit-2',
            name: 'Kit 2 - Máscara K18 (3 Produtos)',
            price: 417.00,
            category: 'hair-care-kits',
            yampi_product_id: 'k18-kit-2' // ID real na plataforma Yampi
        }
    },
    
    // Configurações de pagamento
    payment: {
        methods: ['pix', 'credit_card', 'debit_card', 'boleto'],
        pixDiscount: 0.05, // 5% de desconto no PIX
        installments: {
            min: 1,
            max: 12,
            interest: 0 // Sem juros
        }
    }
};

// Exportar configuração (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YAMPI_CONFIG;
}
