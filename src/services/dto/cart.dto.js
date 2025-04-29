// PF/src/services/dto/cart.dto.js
export class CartDTO {
    constructor(cart) {
        this._id = cart._id ? cart._id.toString() : null; // Convertir _id a string
        this.products = cart.products ? cart.products.map(product => ({
            productId: product.product ? product.product._id.toString() : null, // Convertir productId a string
            quantity: product.quantity || 1
        })) : [];
        this.total = cart.products && cart.products.length > 0
            ? cart.products.reduce((acc, p) => {
                const price = p.product && p.product.price ? p.product.price : 0; // Manejar price undefined
                return acc + price * (p.quantity || 1);
            }, 0)
            : 0;
    }
}