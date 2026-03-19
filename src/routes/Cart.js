import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCart, getCarts } from "../controllers/cart.js";

const router = Router()

router.post('/:productId', authMiddleware, createCart);
router.get('/', authMiddleware, getCarts)

export default router;