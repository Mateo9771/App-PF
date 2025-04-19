//PF\src\routes\product.router.js
import { Router } from "express";
import { createProduct, getProducts, getProductById, deleteProduct} from "../controllers/product.controller.js";

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;
