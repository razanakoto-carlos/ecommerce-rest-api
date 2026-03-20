import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCart, getCarts, removeCart } from "../controllers/cart.js";

const router = Router()

router.post('/:productId', authMiddleware, createCart);
router.get('/', authMiddleware, getCarts)
router.patch('/remove/:productId', authMiddleware, removeCart)

export default router;