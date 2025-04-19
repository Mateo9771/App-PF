// public/js/realTimeProducts.js
const socket = io();

// Escuchar actualizaciones de productos en tiempo real
socket.on("updateProducts", (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `${product.title} - $${product.price} 
            <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
        productList.appendChild(li);
    });
});

// Enviar nuevo producto
document.getElementById("product-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;

    socket.emit("newProduct", { title, price });
});

// Eliminar producto
function deleteProduct(id) {
    socket.emit("deleteProduct", id);
}