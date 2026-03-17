import User from "../models/User.js"

const checkSeller = async (req, res, next) => {
    const id = req.user._id
    const user = await User.findOne({ _id: id })

    if (!user || user.role !== "seller") {
        return res.status(403).json({ message: "Access denied only Sellers" })
    }

    next()
}

const checkAdmin = async (req, res, next) => {
    const id = req.user._id
    const user = await User.findOne({ _id: id })

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied only Admin" })
    }

    next()
}

export {checkSeller,checkAdmin};