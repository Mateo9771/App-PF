// PF/src/routes/cart.router.js
import { Router } from "express";
import { 
    getCarts,
    getCartById,
    createCart,
    addProductToCart,
    removeProductFromCart, 
    purchaseCart, 
    deleteCart
} from "../controllers/cart.controller.js"; // Importar las funciones del controlador

const router = Router();

// Rutas para el carrito
router.get('/', getCarts);  // Obtener todos los carritos
router.get('/:cartId', getCartById);  // Obtener un carrito por ID
router.post('/', createCart);  // Crear un nuevo carrito
router.post('/:cartId/products/:productId', addProductToCart);  // Agregar producto al carrito
router.delete('/:cartId/products/:productId', removeProductFromCart);  // Eliminar producto del carrito
router.delete('/:cartId', deleteCart);  // Nueva ruta para eliminar el carrito
router.post('/:cartId/purchase', purchaseCart);

export default router;

