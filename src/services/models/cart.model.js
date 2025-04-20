//PF\src\services\models\cart.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const cartCollection = "carts";//seteo de la colleccion

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, required: true, min: 1 }
    }],
    total: {
        type: Number,
        default: 0,
      }
});

const CartModel = mongoose.model(cartCollection, cartSchema);
export default CartModel;