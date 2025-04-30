export default class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.nombre = product.nombre; 
        this.descripcion = product.descripcion; 
        this.precio = product.precio;
        this.stock = product.stock;
        this.category = product.category;
    }
}
