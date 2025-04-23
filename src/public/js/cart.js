document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn');

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.productId;
      const quantityInput = document.getElementById(`quantity-${productId}`);

      if (!quantityInput || isNaN(quantityInput.value) || parseInt(quantityInput.value) <= 0) {
        return alert('Por favor, ingresá una cantidad válida.');
      }

      const quantity = parseInt(quantityInput.value);
      let cartId = localStorage.getItem('cartId');

      try {
        // Si no hay carrito, crearlo
        if (!cartId) {
          const createRes = await fetch('/api/carts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });

          if (!createRes.ok) {
            const errText = await createRes.text();
            console.error('Error al crear carrito:', errText);
            return alert('No se pudo crear el carrito.');
          }

          const cartData = await createRes.json();
          cartId = cartData._id;
          localStorage.setItem('cartId', cartId);
        }

        // Confirmar que cartId esté bien definido
        if (!cartId || cartId === 'undefined') {
          console.error('Carrito no válido:', cartId);
          return alert('Carrito inválido. Intentalo de nuevo.');
        }

        // Agregar producto
        const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity })
        });

        const isJSON = res.headers.get('content-type')?.includes('application/json');
        const responseData = isJSON ? await res.json() : { message: await res.text() };

        if (res.ok) {
          alert('Producto agregado al carrito.');
        } else {
          alert(`Error: ${responseData.message || 'Error al agregar producto.'}`);
        }
      } catch (error) {
        console.error('Error general:', error);
        alert('Hubo un problema al agregar el producto.');
      }
    });
  });
});
