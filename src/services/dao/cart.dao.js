// PF/src/services/daos/cart.dao.js
import CartModel from '../models/cart.model.js';
import { CartDTO } from '../dto/cart.dto.js';

class CartDAO {
    // Crear un carrito nuevo para un usuario
    async createCart(userId) {
        try {
            if (!userId) {
                throw new Error('Se requiere un userId válido para crear el carrito');
            }
            console.log('Intentando crear carrito con userId:', userId);
    
        
            let existingCart = await CartModel.findOne({ user: userId, products: [] });
            if (existingCart) {
                console.log('Carrito vacío existente encontrado:', existingCart);
                return new CartDTO(existingCart);
            }
    
            //nuevo carrito si no hay uno vacío
            const newCart = new CartModel({ user: userId, products: [], total: 0 });
            const savedCart = await newCart.save();
            console.log('Carrito guardado en la base de datos:', savedCart);
            return new CartDTO(savedCart);
        } catch (error) {
            console.error('Error en CartDAO.createCart:', error.message, error.stack);
            throw error;
        }
    }
    async getById(cartId) {
        return await CartModel.findById(cartId).populate("products.product");
    }
    
    //  carrito por ID de usuario
    async getCartByUserId(userId) {
        const cart = await CartModel.findOne({ user: userId }).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async update(cartId, updateData) {
        return CartModel.findByIdAndUpdate(cartId, updateData, { new: true }); 
    }
    
    // Obtener un carrito por su ID
    async getCartById(cartId) {
    const cart = await CartModel.findById(cartId).populate('products.product');
    return cart ? new CartDTO(cart) : null;
    }

    async addProductToCart(cartId, productId, quantity) {
        console.log('DAO addProductToCart:', { cartId, productId, quantity });
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) {
            console.log('Carrito no encontrado:', cartId);
            return null;
        }
    
        const existingProduct = cart.products.find(p => p.product._id.toString() === productId.toString());
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
    
        let total = 0;
        for (const item of cart.products) {
            const product = item.product;
            console.log('Producto en carrito:', product); 
            const productPrice = product && product.precio ? product.precio : 0;
            if (productPrice && !isNaN(productPrice)) {
                total += productPrice * item.quantity;
            } else {
                console.warn(`Precio no válido para el producto ${item.product._id}:`, productPrice);
            }
        }
    
        cart.total = total;
        console.log('Total calculado:', total); 
        await cart.save();
        
        console.log('Carrito actualizado:', cart);
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
