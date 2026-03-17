import Product from "../models/Product.js"

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
    const products = await Product.find().select("-description -seller -category -__v")
    res.json(products)
}

export { createProduct, getProducts }