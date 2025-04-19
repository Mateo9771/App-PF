//PF\src\services\models\product.model.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const {Schema} = mongoose

const productCollection = 'products' // setamos la coleccion

const productSchema = new Schema({//Definimos el esquema para el producto
    nombre: { type: String, required: true, minlength: 3 },
    precio: { type: Number, required: true, min: 0 },
    descripcion: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
})

productSchema.plugin(mongoosePaginate); // Agregar el plugin de paginación

const ProductModel = mongoose.model(productCollection, productSchema)

export default ProductModel