//PF\src\routes\product.router.js
import { Router } from "express";
import { createProduct, getProducts, getProductById, deleteProduct} from "../controllers/product.controller.js";
import { passportCall, authorization } from "../utils.js";

const router = Router();


router.post('/createProduct', passportCall('jwt'), authorization('admin'), 
    async (req, res, next) => {
      try {
        await createProduct(req, res);
        res.redirect('/products');
      } catch (error) {
        next(error); 
      }
    }
  );// Solo admin puede crear productos

router.get('/newProduct', passportCall('jwt'), authorization('admin'), (req, res) => {
    res.render('newProduct');
});
router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:pid', passportCall('jwt'), authorization('admin'), deleteProduct);// Solo admin puede eliminar productos

export default router;
