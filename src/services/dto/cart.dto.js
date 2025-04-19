// PF/src/services/dto/cart.dto.js
export class CartDTO {
    constructor(cart) {
        this._id = cart._id;
        this.products = cart.products.map(product => ({
            productId: product.product,
            quantity: product.quantity
        }));
        this.total = cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0);
    }
}
