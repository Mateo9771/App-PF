// public/js/products.js

const socket = io(); // Conecta al servidor de sockets

socket.on("updateProducts", (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpia la lista antes de llenarla

    products.forEach(product => {
        const li = document.createElement("li");
        li.textContent = `${product.title} - ${product.price} USD`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteProduct(product.id);

        li.appendChild(deleteButton);
        productList.appendChild(li);
    });
});

function deleteProduct(id) {
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log(`Producto ${id} eliminado`);
        }
    });
}
