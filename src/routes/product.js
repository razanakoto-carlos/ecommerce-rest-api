import { Router } from "express";
import { createProduct, getProducts } from "../controllers/product.js";
import {checkSeller} from "../middleware/checkRole.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/products")
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const originalName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "")
        cb(null, `${timestamp}-${originalName}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else (
        cb(new Error("Invalide file. only JPG, PNG , GIG are allowed"), false)
    )
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
})

router.post('/',authMiddleware, checkSeller, upload.array("images", 8) ,createProduct)
router.get('/',getProducts)

export default router;