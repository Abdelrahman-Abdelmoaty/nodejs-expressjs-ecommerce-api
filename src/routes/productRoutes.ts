import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/productController";
import { admin } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.post("/", admin, createProduct);
router.patch("/:id", admin, updateProduct);
router.delete("/:id", admin, deleteProduct);

export default router;
