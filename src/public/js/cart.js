// PF/src/public/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  buttons.forEach(button => {
      button.addEventListener('click', async () => {
          // Corregir el nombre del atributo dataset
          const productId = button.dataset.productId; // Cambiar a button.dataset.productId
          if (!productId) {
              alert('Error: No se encontró el ID del producto.');
              console.error('data-product-id no está definido en el botón:', button);
              return;
          }

          const quantityInput = document.getElementById(`quantity-${productId}`);
          if (!quantityInput || isNaN(quantityInput.value) || parseInt(quantityInput.value) <= 0) {
              return alert('Por favor, ingresá una cantidad válida.');
          }
          const quantity = parseInt(quantityInput.value);

          let cartId = localStorage.getItem('cartId');
          console.log('CartId inicial desde localStorage:', cartId);

          try {
              // Usar el token desde localStorage para consistencia
              const token = localStorage.getItem('jwtToken');
              if (!token) {
                  alert('Por favor, inicia sesión para añadir productos al carrito.');
                  window.location.assign('/api/sessions');
                  return;
              }

              if (!cartId) {
                  console.log('Creando nuevo carrito...');
                  const createRes = await fetch('/api/carts', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                      },
                      credentials: 'include',
                  });

                  if (!createRes.ok) {
                      const errData = await createRes.json().catch(() => ({
                          message: createRes.statusText,
                      }));
                      console.error('Error al crear carrito:', createRes.status, errData);
                      localStorage.removeItem('cartId');
                      if (createRes.status === 401 || createRes.status === 403) {
                          alert('Sesión expirada. Por favor, iniciá sesión nuevamente.');
                          window.location.assign('/api/sessions');
                          return;
                      }
                      alert(`No se pudo crear el carrito: ${errData.message || 'Error desconocido'}`);
                      throw new Error('Error al crear carrito');
                  }

                  const cartData = await createRes.json();
                  console.log('Respuesta completa del servidor:', cartData);
                  let cartIdFromResponse;
                  if (cartData._id) {
                      cartIdFromResponse = cartData._id;
                  } else if (cartData.payload && cartData.payload._id) {
                      cartIdFromResponse = cartData.payload._id;
                  } else if (cartData.cart && cartData.cart._id) {
                      cartIdFromResponse = cartData.cart._id;
                  } else {
                      console.error('Estructura de respuesta inválida:', cartData);
                      localStorage.removeItem('cartId');
                      alert('Error: No se pudo obtener el ID del carrito.');
                      throw new Error('Estructura de respuesta inválida');
                  }
                  cartId = cartIdFromResponse;
                  localStorage.setItem('cartId', cartId);
                  console.log('Carrito creado con ID:', cartId);
              }

              if (!cartId || cartId === 'undefined') {
                  console.error('Carrito no válido:', cartId);
                  localStorage.removeItem('cartId');
                  alert('Carrito inválido. Intentalo de nuevo.');
                  throw new Error('Carrito inválido');
              }

              console.log('Agregando producto al carrito:', cartId, productId);
              const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({ quantity }),
                  credentials: 'include',
              });

              const isJSON = res.headers.get('content-type')?.includes('application/json');
              const responseData = isJSON
                  ? await res.json()
                  : { message: await res.text() || 'Error desconocido' };

              if (res.ok) {
                  alert('Producto agregado al carrito.');
              } else {
                  if (res.status === 401 || res.status === 403) {
                      localStorage.removeItem('cartId');
                      alert('Sesión expirada. Por favor, iniciá sesión nuevamente.');
                      window.location.assign('/api/sessions');
                      throw new Error('Error de autenticación');
                  }
                  alert(`Error: ${responseData.message || 'Error al agregar producto.'}`);
                  throw new Error(responseData.message || 'Error al agregar producto');
              }
          } catch (error) {
              console.error('Error general:', error.message);
              localStorage.removeItem('cartId');
              alert('Hubo un problema al agregar el producto.');
          }
      });
  });
});