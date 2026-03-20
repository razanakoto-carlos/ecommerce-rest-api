import Product from "../models/Product.js"
import Cart from "../models/Cart.js"

const createCart = async (req, res) => {
    try {
        const productId = req.params.productId
        const { quantity } = req.body
        const userId = req.user._id



        if (!productId || !quantity) {
            return res.status(400).json({ message: "Missing required field" })
        }

        const product = await Product.findById(productId)


        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: "Stock is not enough! " })
        }

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [],
                totalProducts: 0,
                totalCartPrice: 0
            })
        }

        const existingProductIndex = cart.products.findIndex((product) => product.productId.toString() === productId.toString())

        if (existingProductIndex !== -1) {
            if (cart.products[existingProductIndex].quantity + quantity >= product.stock) {
                return res.status(400).json({ message: "Stock is not enough" })
            }
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({
                productId: productId,
                quantity: quantity,
                title: product.title,
                price: product.price,
                image: product.images[0]
            })
        }
        cart.totalProducts = cart.products.reduce((total, product) => {
            return total + product.quantity
        }, 0)

        cart.totalCartPrice = cart.products.reduce((total, product) => {
            return total + product.price * product.quantity
        }, 0)

        await cart.save()

        res.status(200).json({ message: "Product added to cart successfully", cart: cart })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }

}

const getCarts = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(400).json({ message: "User Cart is empty" })
        }

        res.json(cart)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const removeCart = async (req, res) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }

        const cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(400).json({ message: "Cart not found" })
        }

        const index = cart.product.findIndex((product) => product.productId.toString() === productId)

        if (index === -1) {
            return res.status(404).json({ message: "Product not found in cart" })
        }

        if (cart.products.lengh === 1 && cart.products[index].productId.toString() === productId) {
            await Cart.findByIdAndDelete(cart._id)
            res.json({ message: "Product remove successfully", cart: cart })
        }

        cart.totalProducts -= cart.products[index].quantity
        cart.totalCartPrice -= cart.products[index].quantity * cart.products[index].price

        cart.products.splice(index, 1)

        await cart.save()

        res.json({ message: "Product remove successfully", cart: cart })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export { createCart, getCarts, removeCart }