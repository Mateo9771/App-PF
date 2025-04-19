// PF/src/services/daos/cart.dao.js
import CartModel from '../models/cart.model.js';
import { CartDTO } from '../dto/cart.dto.js';

class CartDAO {
    // Crear un carrito nuevo para un usuario
    async createCart(userId) {
        const newCart = new CartModel({ user: userId, products: [] });
        await newCart.save();
        return new CartDTO(newCart);
    }

    // Obtener un carrito por ID de usuario
    async getCartByUserId(userId) {
        const cart = await CartModel.findOne({ user: userId }).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    // Obtener un carrito por su ID (cid)
    async getCartById(cartId) {
    const cart = await CartModel.findById(cartId).populate('products.product');
    return cart ? new CartDTO(cart) : null;
    }

    // Añadir un producto al carrito
    async addProductToCart(userId, productId, quantity) {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product.toString() === productId.toString());
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return new CartDTO(cart);
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(userId, productId) {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
        await cart.save();
        return new CartDTO(cart);
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(userId, productId, quantity) {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return null;

        const product = cart.products.find(p => p.product.toString() === productId.toString());
        if (product) {
            product.quantity = quantity;
            await cart.save();
            return new CartDTO(cart);
        }

        return null;
    }

    // Vaciar un carrito (eliminar todos los productos)
    async clearCart(userId) {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return new CartDTO(cart);
    }
}

export default new CartDAO();
