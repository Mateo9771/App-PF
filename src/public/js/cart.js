document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
  
    buttons.forEach(button => {
      button.addEventListener('click', async () => {
        const productId = button.dataset.productId;
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantityInput.value);
        const cartId = localStorage.getItem('cartId'); // O lo podés obtener de alguna forma del usuario logueado
  
        try {
          const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert('Producto agregado al carrito.');
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error al agregar al carrito:', error);
          alert('Hubo un error. Ver consola.');
        }
      });
    });
  });
  