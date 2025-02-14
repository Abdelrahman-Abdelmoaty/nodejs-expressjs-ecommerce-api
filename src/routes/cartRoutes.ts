import { Router } from "express";
import { getCart, addToCart, editCart, clearCart, removeFromCart } from "../controllers/cartController";
import { auth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/", auth, editCart);
router.delete("/", auth, clearCart);
router.delete("/:productId", auth, removeFromCart);

export default router;
