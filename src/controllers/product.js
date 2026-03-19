import Product from "../models/Product.js"
import Category from "../models/Category.js";
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import User from "../models/User.js"


const createProduct = async (req, res) => {

    try {
        const { title, description, category, price, stock, rating } = req.body

        const images = req.files.map((image) => image.filename)

        if (images.length == 0) {
            return res.status(400).json({ message: "At least one image is required " })
        }

        const newProduct = new Product({
            title,
            description,
            category,
            price,
            stock,
            images,
            seller: req.user._id,
            rating
        })

        await newProduct.save();

        res.status(201).json(newProduct);

    } catch (error) {
        res.status(500).json({ error: "Internal Server error" })
    }

}

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const perPage = parseInt(req.params.perPage) || 8

        const querycategory = req.params.category || null
        const querySearch = req.params.search || null

        let query = {}

        if (querycategory) {
            const category = await Category.findOne({ name: querycategory })

            if (!category) {
                return res.status(404).json({ message: "Category not found" })
            }

            query.category = category._id
        }

        if (querySearch) {
            query.title = { $regex: querySearch, $options: "i" }
        }

        const products = await Product
            .find(query)
            .select("-description -seller -category -__v")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .lean()

        const updatedProduct = products.map((product) => {
            return {
                ...product,
                images: product.images[0]
            }
        })

        const totalProduct = await Product.countDocuments(query)

        res.json({ products: updatedProduct, totalProduct })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}

const getProduct = async (req, res) => {
    try {
        const productId = req.params.productId

        const product = await Product.findById(productId)
            .populate("seller", "name email")
            .select("-category -__v")

        if (!product) {
            return res.status(404).json({ message: "Page not Found" })
        }

        res.json(product)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!" })
    }

}

const deleteProduct = async (req, res) => {
    const productId = req.params.productId

    const product = await Product.findById(productId)
        .select("seller images")

    if (!product) {
        return res.status(404).json({ message: "Product not Found" })
    }

    //req.user
    const user = await User.findById(req.user)

    if (user.role === "admin" || user._id.toString() === product.seller.toString()) {
        await product.deleteOne()

        if (product.images && product.images.length > 0) {
            product.images.forEach(async (imageName) => {

                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                const fullPath = path.join(__dirname, "../../upload/products", imageName)

                try {
                    await fs.unlink(fullPath)
                } catch (error) {
                    console.error(`Error deleting file images : ${error}`)
                }
            })
        }

        return res.json({ message: "Product deleted successfully" })
    }

    return res.status(403).json({ message: "Access denied only Admin and Seller can delete this product" })
}

export { createProduct, getProducts, getProduct, deleteProduct }