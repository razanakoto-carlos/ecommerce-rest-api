import Category from "../models/Category.js"

const createCategory = async (req, res) => {
    try {
        if (!req.body.name || !req.file) {
            return res.status(400).json({ message: "Name and Icon are required" })
        }

        const category = new Category({
            name: req.body.name,
            image: req.file.filename
        })

        const created = await category.save()
        res.status(201).json(created)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", error: error.message })
    }
}

const getCategory = async (req, res) =>{
    const category = await Category.find().sort("name")
    res.json(category)
}


export { getCategory,createCategory }