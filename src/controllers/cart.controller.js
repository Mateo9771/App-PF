//PF\src\controllers\cart.controller.js
import CartDAO from "../services/dao/cart.dao.js";  // Asegúrate de importar el DAO
import ProductDAO from "../services/dao/product.dao.js"; // Si necesitas interactuar con productos también
import TicketDAO from '../services/dao/ticket.dao.js'

// Controlador para obtener todos los carritos
export const getCarts = async (req, res) => {
    try {
        const carts = await CartDAO.getAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los carritos", error });
    }
};

// Controlador para obtener un carrito por ID
export const getCartById = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await CartDAO.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error });
    }
};

// Controlador para crear un carrito
export const createCart = async (req, res) => {
    try {
        const userId = req.user?._id || null;
        const createdCart = await CartDAO.createCart(userId);

        if (!createdCart) {
            return res.status(500).json({ message: 'Error al crear el carrito' });
        }

        // Asegurate de devolver el _id explícitamente
        res.status(201).json({ _id: createdCart._id });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ message: "Error al crear el carrito", error });
    }
};

// Controlador para agregar productos a un carrito
export const addProductToCart = async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body; // Suponiendo que la cantidad viene en el cuerpo de la solicitud

    try {
        const cart = await CartDAO.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const product = await ProductDAO.getById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Lógica para agregar el producto al carrito
        const updatedCart = await CartDAO.addProductToCart(cartId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ message: "Error al agregar el producto al carrito", error });
    }
};

// Controlador para eliminar un producto de un carrito
export const removeProductFromCart = async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        const cart = await CartDAO.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const updatedCart = await CartDAO.removeProduct(cartId, productId);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto del carrito", error });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const result = await CartDAO.deleteCart(cartId);
        
        if (!result) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        
        return res.status(200).json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el carrito', error });
    }
};

export const purchaseCart = async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await CartDAO.getById(cartId); // este debe hacer populate de products.product

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productosComprados = [];
        const productosSinStock = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await ProductDAO.update(product._id, { stock: product.stock });

                totalAmount += product.precio * item.quantity;
                productosComprados.push(item);
            } else {
                productosSinStock.push(product._id.toString());
            }
        }

        if (productosComprados.length === 0) {
            return res.status(400).json({ 
                message: "No hay stock suficiente para procesar ningún producto", 
                productosSinStock 
            });
        }

        const purchaserEmail = req.user?.email || "usuario@test.com";

        const ticket = await TicketDAO.create({
            amount: totalAmount,
            purchaser: purchaserEmail,
        });

        // Filtrar productos que no pudieron comprarse
        cart.products = cart.products.filter(item =>
            productosSinStock.includes(item.product._id.toString())
        );

        // Actualizar carrito
        await CartDAO.update(cartId, cart);

        return res.status(200).json({
            message: productosSinStock.length > 0 
                ? "Compra realizada parcialmente" 
                : "Compra realizada exitosamente",
            ticket,
            productosNoProcesados: productosSinStock
        });

    } catch (error) {
        console.error("Error en compra:", error);
        return res.status(500).json({ message: "Error al procesar la compra", error });
    }
};
