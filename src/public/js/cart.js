// PF/src/public/js/cart.js

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();

            const productId = button.getAttribute('data-product-id');
            console.log('Product ID:', productId);

            if (!productId) {
                alert('Error: ID del producto no válido.');
                return;
            }

            const quantityInput = document.getElementById(`quantity-${productId}`);
            if (!quantityInput) {
                console.error(`Input no encontrado para quantity-${productId}`);
                alert(`Error: No se encontró el input de cantidad para el producto ${productId}`);
                return;
            }

            const quantity = parseInt(quantityInput.value);
            if (isNaN(quantity) || quantity < 1) {
                alert('Por favor, ingrese una cantidad válida.');
                return;
            }

            try {
                let cartId = localStorage.getItem('cartId');
                const jwtToken = localStorage.getItem('jwtToken');

                if (!jwtToken) {
                    alert('Error: Debes iniciar sesión para agregar productos al carrito.');
                    window.location.href = '/login';
                    return;
                }

                if (cartId) {
                    const cartCheckResponse = await fetch(`/api/carts/${cartId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    });

                    if (!cartCheckResponse.ok) {
                        console.log('Carrito no encontrado, limpiando localStorage y creando uno nuevo');
                        localStorage.removeItem('cartId');
                        cartId = null;
                    }
                }

                if (!cartId) {
                    console.log('Creando nuevo carrito...');
                    const response = await fetch('/api/carts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    });

                    const result = await response.json();
                    if (response.ok && result._id) {
                        cartId = result._id;
                        localStorage.setItem('cartId', cartId);
                        console.log('Nuevo carrito creado:', cartId);
                    } else {
                        throw new Error(result.message || 'No se pudo crear el carrito');
                    }
                }

                console.log('Enviando solicitud:', { cartId, productId, quantity });

                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify({ quantity })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Producto agregado al carrito exitosamente');
                } else {
                    throw new Error(result.message || 'Error al agregar el producto al carrito');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    });
});