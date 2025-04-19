import ProductDAO from "../services/dao/product.dao.js";
import ProductDTO from "../services/dto/product.dto.js";

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const newProduct = await ProductDAO.create(req.body);
        const productDTO = new ProductDTO(newProduct);
        res.render('product', { product: productDTO });
    } catch (error) {
        res.render('error', { error: "Error al insertar el producto" });
    }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;
        const result = await ProductDAO.getAll({ limit, page, sort, query });

        const productsDTO = result.docs.map(p => new ProductDTO(p));

        res.render("products", {
            products: productsDTO,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
        });
    } catch (error) {
        res.render("error", { error: "Error al obtener los productos" });
    }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await ProductDAO.getById(req.params.id);
        if (!product) {
            return res.render('error', { error: "Producto no encontrado" });
        }
        const productDTO = new ProductDTO(product);
        res.render('product', { product: productDTO });
    } catch (error) {
        res.render('error', { error: "Error al obtener el producto solicitado" });
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await ProductDAO.delete(req.params.id);
        if (!deleted) {
            return res.render('error', { error: "No se encontró producto a eliminar" });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.render('error', { error: "Error al eliminar producto" });
    }
};
