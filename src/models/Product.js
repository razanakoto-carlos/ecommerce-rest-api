import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, minlength: 50 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            rating: { type: Number, min: 0, required: true },
            comment: { type: String }
        }
    ]
})

const Product = mongoose.model('Product', productSchema);

export default Product;