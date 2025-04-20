import ProductModel from "../models/product.model.js";

class ProductDAO {
    async create(productData) {
        return await ProductModel.create(productData);
    }

    async getAll({ limit, page, sort, query }) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { precio: sort === "asc" ? 1 : -1 } : {},
        };
        const filter = query ? { category: { $regex: new RegExp(query, "i") } } : {};
        return await ProductModel.paginate(filter, options);
    }

    async getById(id) {
        return await ProductModel.findById(id);
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
    async update(productId, updateData) {
        return ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
      }
}

export default new ProductDAO();
