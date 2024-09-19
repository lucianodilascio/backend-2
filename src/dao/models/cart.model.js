import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});


cartSchema.pre("findOne", function(next) {
    this.populate("products.product");
    next();
});


cartSchema.pre("find", function(next) {
    this.populate("products.product");
    next();
});

cartSchema.plugin(mongoosePaginate);

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;

