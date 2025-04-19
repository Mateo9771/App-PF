export default class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.nombre = product.nombre; // Cambiado de 'title' a 'nombre'
        this.descripcion = product.descripcion; // Cambiado de 'description' a 'descripcion'
        this.precio = product.precio;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
    }
}
