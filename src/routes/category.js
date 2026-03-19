import { Router } from "express";
import { getCategory, createCategory } from "../controllers/category.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/checkRole.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/category")
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

router.post('/', authMiddleware, checkAdmin, upload.single("icon"), createCategory);
router.get('/', getCategory);


export default router;