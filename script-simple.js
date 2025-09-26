// Configuração dos produtos
const products = {
    'k18-mask-single': {
        name: 'Máscara de Reparo Molecular K18',
        price: 139.00,
        installments: 'ou 12x de R$ 11,58',
        yampiId: 'k18-mask-single'
    },
    'k18-kit-1': {
        name: 'Kit K18 - 2 Produtos',
        price: 278.00,
        installments: 'ou 12x de R$ 23,17',
        yampiId: 'k18-kit-1'
    },
    'k18-kit-2': {
        name: 'Kit K18 - 3 Produtos',
        price: 417.00,
        installments: 'ou 12x de R$ 34,75',
        yampiId: 'k18-kit-2'
    }
};

// Função para mapear tipo de produto para ID da Yampi
function getYampiProductId(productType) {
    const mapping = {
        'k18-mask-single': 'k18-mask-single',
        'k18-kit-1': 'k18-kit-1', 
        'k18-kit-2': 'k18-kit-2'
    };
    return mapping[productType];
}

// Função para redirecionar diretamente para o carrinho com produto
function redirectToCartWithProduct(productType) {
    const product = products[productType];
    if (!product) {
        console.error('Produto não encontrado:', productType);
        return false;
    }

    try {
        // Mapear o tipo de produto para o ID correto da Yampi
        const yampiProductId = getYampiProductId(productType);
        if (!yampiProductId) {
            console.error('ID do produto não encontrado na configuração da Yampi');
            return false;
        }

        console.log('Redirecionando para checkout com produto:', yampiProductId);

        // URL direta para o checkout com produto
        const checkoutUrl = `https://madududastore.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
        
        // Redirecionar diretamente para o checkout
        window.location.href = checkoutUrl;
        
        console.log('✅ Redirecionando para checkout com produto');
        return true;
        
    } catch (error) {
        console.error('Erro ao redirecionar para carrinho:', error);
        return false;
    }
}

// Função principal de checkout
window.initiateCheckout = async function(productType) {
    console.log('initiateCheckout chamado com:', productType);
    console.log('Produtos disponíveis:', Object.keys(products));
    
    const product = products[productType];
    if (!product) {
        console.error('Produto não encontrado:', productType);
        alert('Produto não encontrado: ' + productType);
        return;
    }
    
    console.log('Produto encontrado:', product);

    // Verificar se a configuração Yampi está carregada
    if (typeof YAMPI_CONFIG === 'undefined') {
        console.error('Configuração Yampi não carregada!');
        alert('Erro: Configuração da loja não carregada. Recarregue a página.');
        return;
    }

    // Mostrar modal de loading se existir
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    try {
        // Redirecionar diretamente para o carrinho com produto
        console.log('Iniciando processo de compra...');
        const redirected = redirectToCartWithProduct(productType);
        
        if (!redirected) {
            // Fallback: redirecionar para o checkout diretamente com parâmetros do produto
            console.log('Usando fallback - redirecionamento direto para checkout');
            const yampiProductId = getYampiProductId(productType);
            const checkoutUrl = `https://madududastore.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
            console.log('Redirecionando para checkout:', checkoutUrl);
            window.location.href = checkoutUrl;
        }
    } catch (error) {
        console.error('Erro no processo de checkout:', error);
        // Fallback em caso de erro
        const yampiProductId = getYampiProductId(productType);
        const checkoutUrl = `https://madududastore.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
        console.log('Redirecionando para checkout (fallback):', checkoutUrl);
        window.location.href = checkoutUrl;
    }
};

// Função para rolar até os kits de compra
window.scrollToKits = function() {
    const kitsSection = document.querySelector('.product-kits');
    if (kitsSection) {
        kitsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

console.log('Script simples carregado!');
console.log('Função initiateCheckout disponível:', typeof window.initiateCheckout);
