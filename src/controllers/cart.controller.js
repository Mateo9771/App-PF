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
    const newCart = req.body;
    try {
        const createdCart = await CartDAO.create(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
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
        const updatedCart = await CartDAO.addProduct(cartId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
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

export const purchaseCart = async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await CartDAO.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productosComprados = [];
        const productosSinStock = [];

        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await ProductDAO.getById(item.product._id || item.product);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await ProductDAO.update(product._id, product);

                totalAmount += product.precio * item.quantity;
                productosComprados.push(item);
            } else {
                productosSinStock.push(item.product._id?.toString() || item.product.toString());
            }
        }

        if (productosComprados.length === 0) {
            return res.status(400).json({ message: "No hay stock suficiente para procesar ningún producto", productosSinStock });
        }

        const ticketData = {
            code: `TICKET-${Date.now()}`,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: req.user?.email || "usuario@test.com",
        };

        const ticket = await TicketDAO.create(ticketData);

        cart.products = cart.products.filter(item =>
            productosSinStock.includes(item.product._id?.toString() || item.product.toString())
        );

        await CartDAO.update(cartId, cart);

        res.status(200).json({
            message: "Compra realizada parcialmente",
            ticket,
            productosNoProcesados: productosSinStock
        });
    } catch (error) {
        console.error("Error en compra:", error);
        res.status(500).json({ message: "Error al procesar la compra", error });
    }
};

