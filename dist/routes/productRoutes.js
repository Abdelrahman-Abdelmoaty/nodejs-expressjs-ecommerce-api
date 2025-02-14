"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const router = (0, express_1.Router)();
router.get("/", productController_1.getProducts);
router.get("/search", productController_1.searchProducts);
router.get("/:id", productController_1.getProductById);
router.post("/", adminMiddleware_1.admin, productController_1.createProduct);
router.patch("/:id", adminMiddleware_1.admin, productController_1.updateProduct);
router.delete("/:id", adminMiddleware_1.admin, productController_1.deleteProduct);
exports.default = router;
