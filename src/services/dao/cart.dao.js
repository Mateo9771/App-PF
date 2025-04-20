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

    async getById(cartId) {
        return await CartModel.findById(cartId).populate("products.product");
    }
    
    // Obtener un carrito por ID de usuario
    async getCartByUserId(userId) {
        const cart = await CartModel.findOne({ user: userId }).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async update(cartId, updateData) {
        return CartModel.findByIdAndUpdate(cartId, updateData, { new: true }); 
    }
    
    // Obtener un carrito por su ID (cid)
    async getCartById(cartId) {
    const cart = await CartModel.findById(cartId).populate('products.product');
    return cart ? new CartDTO(cart) : null;
    }

    async addProductToCart(cartId, productId, quantity) {
        // Buscar el carrito por su ID (cartId)
        const cart = await CartModel.findById(cartId).populate('products.product');;
        if (!cart) return null;
    
        // Buscar si el producto ya existe en el carrito
        const existingProduct = cart.products.find(p => p.product._id.toString() === productId.toString());
        
        if (existingProduct) {
            // Si el producto ya existe, aumentamos la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está, lo agregamos al carrito
            cart.products.push({ product: productId, quantity });
        }
    
        // Recalcular el total
        let total = 0;
        for (const item of cart.products) {
            const product = item.product;
            const productPrice = product.precio || 0;  // Asegurarse de que el precio sea un número
            if (productPrice && !isNaN(productPrice)) {
                total += productPrice * item.quantity;
            }
        }
    
        // Asignar el total calculado al carrito
        cart.total = total;
    
        // Guardar los cambios en el carrito
        await cart.save();
        
        // Devolver el carrito actualizado
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

    async deleteCart(cartId) {
        const cart = await CartModel.findByIdAndDelete(cartId);
        return cart;
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
