import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true }
})

const Category = mongoose.model("Category", categorySchema)

export default Category;