document.addEventListener('DOMContentLoaded', function() {
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

    // Variável para rastrear o produto selecionado
    let currentProductType = null;

    // Função para gerar ID único do pedido
    function generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `K18-${timestamp}-${random}`.toUpperCase();
    }

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

    // Função para redirecionar diretamente para o carrinho com produto
    function redirectToCartWithProduct(productType) {
        const product = products[productType];
        if (!product) return false;

        try {
            // Mapear o tipo de produto para o ID correto da Yampi
            const yampiProductId = getYampiProductId(productType);
            if (!yampiProductId) {
                console.error('ID do produto não encontrado na configuração da Yampi');
                return false;
            }

            console.log('Redirecionando para checkout com produto:', yampiProductId);

            // URL direta para o checkout com produto
            const checkoutUrl = `https://${YAMPI_CONFIG.alias}.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
            
            // Redirecionar diretamente para o checkout
            window.location.href = checkoutUrl;
            
            console.log('✅ Redirecionando para checkout com produto');
            return true;
            
        } catch (error) {
            console.error('Erro ao redirecionar para carrinho:', error);
            return false;
        }
    }


    // Função para mapear tipo de produto para ID da Yampi
    function getYampiProductId(productType) {
        const mapping = {
            'k18-mask-single': 'k18-mask-single',
            'k18-kit-1': 'k18-kit-1', 
            'k18-kit-2': 'k18-kit-2'
        };
        return mapping[productType];
    }


    // Funcionalidade do checkout - Adicionar ao carrinho e redirecionar
    window.initiateCheckout = async function(productType) {
        console.log('initiateCheckout chamado com:', productType);
        console.log('Produtos disponíveis:', Object.keys(products));
        
        const product = products[productType];
        if (!product) {
            console.error('Produto não encontrado:', productType);
            return;
        }
        
        console.log('Produto encontrado:', product);

        // Definir produto atual
        currentProductType = productType;

        // Salvar dados do produto para referência
        const orderInfo = {
            product: product,
            product_type: productType,
            timestamp: new Date().toISOString(),
            order_id: generateOrderId()
        };
        
        localStorage.setItem('selected_product', JSON.stringify(orderInfo));
        
        // Log para debug
        console.log('Produto selecionado:', orderInfo);
        
        // Mostrar modal de loading
        document.getElementById('loadingModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        try {
            // Verificar se a configuração Yampi está carregada
            if (typeof YAMPI_CONFIG === 'undefined') {
                console.error('Configuração Yampi não carregada!');
                alert('Erro: Configuração da loja não carregada. Recarregue a página.');
                return;
            }
            
            // Redirecionar diretamente para o carrinho com produto
            console.log('Iniciando processo de compra...');
            const redirected = redirectToCartWithProduct(productType);
            
            if (!redirected) {
                // Fallback: redirecionar para o checkout diretamente com parâmetros do produto
                console.log('Usando fallback - redirecionamento direto para checkout');
                const yampiProductId = getYampiProductId(productType);
                const checkoutUrl = `https://${YAMPI_CONFIG.alias}.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
                console.log('Redirecionando para checkout:', checkoutUrl);
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error('Erro no processo de checkout:', error);
            // Fallback em caso de erro
            const yampiProductId = getYampiProductId(productType);
            const checkoutUrl = `https://${YAMPI_CONFIG.alias}.pay.yampi.com.br/checkout?product_id=${yampiProductId}&quantity=1&skipToCheckout=1`;
            console.log('Redirecionando para checkout (fallback):', checkoutUrl);
            window.location.href = checkoutUrl;
        }
    };

    // Fechar modal de loading
    window.closeLoadingModal = function() {
        document.getElementById('loadingModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Fechar modal ao clicar fora dele
    window.onclick = function(event) {
        const loadingModal = document.getElementById('loadingModal');
        const confirmModal = document.getElementById('orderConfirmationModal');
        
        if (event.target === loadingModal) {
            closeLoadingModal();
        }
        
        if (event.target === confirmModal) {
            closeOrderConfirmation();
        }
    };

    // Variável para armazenar dados do pedido atual
    let currentOrderData = null;

    // Função para mostrar confirmação do pedido
    function showOrderConfirmation(orderData) {
        currentOrderData = orderData;
        
        // Atualizar informações no modal de confirmação
        document.getElementById('confirmOrderId').textContent = orderData.order_id;
        document.getElementById('confirmProduct').textContent = getProductName();
        document.getElementById('confirmTotal').textContent = `R$ ${orderData.total.toFixed(2).replace('.', ',')}`;
        document.getElementById('confirmPayment').textContent = getPaymentMethodName(orderData.payment_method);
        document.getElementById('confirmCustomer').textContent = orderData.customer.name;
        document.getElementById('confirmTimestamp').textContent = new Date(orderData.timestamp).toLocaleString('pt-BR');
        document.getElementById('verificationOrderId').textContent = orderData.order_id;
        
        // Mostrar modal
        document.getElementById('orderConfirmationModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fechar modal de confirmação
    window.closeOrderConfirmation = function() {
        document.getElementById('orderConfirmationModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Função para obter nome do produto
    function getProductName() {
        if (currentProductType && products[currentProductType]) {
            return products[currentProductType].name;
        }
        return 'Produto K18';
    }

    // Função para obter nome do método de pagamento
    function getPaymentMethodName(method) {
        const methods = {
            'pix': 'PIX',
            'credit': 'Cartão de Crédito',
            'debit': 'Cartão de Débito',
            'boleto': 'Boleto Bancário'
        };
        return methods[method] || method;
    }

    // Função para criar mensagem do WhatsApp
    function createWhatsAppMessage(orderData) {
        return `🛍️ *NOVO PEDIDO K18*

📦 *Produto:* ${getProductName()}
💰 *Total:* R$ ${orderData.total.toFixed(2).replace('.', ',')}
💳 *Pagamento:* ${getPaymentMethodName(orderData.payment_method)}
🆔 *ID do Pedido:* ${orderData.order_id}

👤 *DADOS DO CLIENTE:*
• Nome: ${orderData.customer.name}
• E-mail: ${orderData.customer.email}
• Telefone: ${orderData.customer.phone}
• CEP: ${orderData.customer.zipcode}
• Endereço: ${orderData.customer.address}

⏰ *Data/Hora:* ${new Date(orderData.timestamp).toLocaleString('pt-BR')}

Por favor, confirme o pedido e envie as instruções de pagamento.`;
    }

    // Função para criar e-mail com dados do pedido
    function createEmailContent(orderData) {
        const product = getProductName();
        const paymentMethod = getPaymentMethodName(orderData.payment_method);
        
        return {
            subject: `Novo Pedido K18 - ${orderData.order_id}`,
            body: `
Novo Pedido Recebido - K18

DADOS DO PEDIDO:
- ID do Pedido: ${orderData.order_id}
- Produto: ${product}
- Total: R$ ${orderData.total.toFixed(2).replace('.', ',')}
- Forma de Pagamento: ${paymentMethod}

DADOS DO CLIENTE:
- Nome: ${orderData.customer.name}
- E-mail: ${orderData.customer.email}
- Telefone: ${orderData.customer.phone}
- CEP: ${orderData.customer.zipcode}
- Endereço: ${orderData.customer.address}

Data/Hora: ${new Date(orderData.timestamp).toLocaleString('pt-BR')}

Por favor, entre em contato com o cliente para confirmar o pedido e enviar as instruções de pagamento.

---
Este pedido foi gerado automaticamente pelo site K18.
            `.trim()
        };
    }

    // Função para enviar mensagem via WhatsApp
    window.sendWhatsAppMessage = function() {
        if (!currentOrderData) return;
        
        const message = createWhatsAppMessage(currentOrderData);
        const whatsappUrl = `https://wa.me/5521965950400?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Função para enviar e-mail
    window.sendEmail = function() {
        if (!currentOrderData) return;
        
        const emailContent = createEmailContent(currentOrderData);
        const emailUrl = `mailto:hjcarvalho7@gmail.com?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
        window.open(emailUrl, '_blank');
    };

    // Função para copiar dados do pedido
    window.copyOrderInfo = function() {
        if (!currentOrderData) return;
        
        const orderText = `
PEDIDO K18 - ${currentOrderData.order_id}

DADOS DO PEDIDO:
• ID: ${currentOrderData.order_id}
• Produto: ${getProductName()}
• Total: R$ ${currentOrderData.total.toFixed(2).replace('.', ',')}
• Pagamento: ${getPaymentMethodName(currentOrderData.payment_method)}

DADOS DO CLIENTE:
• Nome: ${currentOrderData.customer.name}
• E-mail: ${currentOrderData.customer.email}
• Telefone: ${currentOrderData.customer.phone}
• CEP: ${currentOrderData.customer.zipcode}
• Endereço: ${currentOrderData.customer.address}

Data/Hora: ${new Date(currentOrderData.timestamp).toLocaleString('pt-BR')}
        `.trim();
        
        navigator.clipboard.writeText(orderText).then(() => {
            alert('Dados do pedido copiados para a área de transferência!');
        }).catch(() => {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = orderText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Dados do pedido copiados para a área de transferência!');
        });
    };

    // Funcionalidade do FAQ (accordion)
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // Fechar outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Alternar o item atual
            item.classList.toggle('active');
            answer.classList.toggle('active');
        });
    });
    
    // Efeito de scroll suave para links internos
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animação de entrada para elementos quando aparecem na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.benefit-item, .kit, .faq-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Funcionalidade de contador para "TEMPO LIMITADO"
    function updateLimitedTime() {
        const limitedTimeElement = document.querySelector('.limited-time');
        if (limitedTimeElement) {
            // Aqui você pode adicionar lógica de countdown real
            // Por exemplo, contar para uma data específica
            limitedTimeElement.textContent = 'TEMPO LIMITADO';
        }
    }
    
    // Atualizar a cada segundo
    setInterval(updateLimitedTime, 1000);
    
    // Funcionalidade de zoom para imagens de produtos
    const productImages = document.querySelectorAll('.product-item, .product-bottle');
    
    productImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    console.log('Página K18 carregada com sucesso!');
    console.log('Configuração Yampi:', typeof YAMPI_CONFIG !== 'undefined' ? YAMPI_CONFIG : 'NÃO CARREGADA');
    
    // Teste adicional - verificar se os botões existem
    const buttons = document.querySelectorAll('.kit-buy-btn');
    console.log('Botões encontrados:', buttons.length);
    
    buttons.forEach((button, index) => {
        console.log(`Botão ${index + 1}:`, button);
        button.addEventListener('click', function(e) {
            console.log('Botão clicado via addEventListener:', e.target);
        });
    });
});