"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const zod_1 = require("zod");
const Product_1 = __importDefault(require("../models/Product"));
const CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }),
    price: zod_1.z.number({ message: "Price is required" }).positive("Price must be positive"),
    description: zod_1.z.string({ message: "Description is required" }),
    stockQuantity: zod_1.z
        .number({ message: "Stock quantity is required" })
        .int({ message: "Stock quantity must be an integer" })
        .nonnegative("Stock quantity must be non-negative"),
});
const UpdateProductSchema = CreateProductSchema.partial();
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = CreateProductSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const product = yield Product_1.default.create(result.data);
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.json(products);
    }
    catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSchema = zod_1.z.string().min(1, "Product ID is required");
        const result = idSchema.safeParse(req.params.id);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid product ID",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const product = yield Product_1.default.findById(result.data);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        console.error("Get product by ID error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSchema = zod_1.z.string().min(1, "Product ID is required");
        const idResult = idSchema.safeParse(req.params.id);
        if (!idResult.success) {
            res.status(400).json({
                message: "Invalid product ID",
                errors: idResult.error.flatten().fieldErrors,
            });
            return;
        }
        const dataResult = UpdateProductSchema.safeParse(req.body);
        if (!dataResult.success) {
            res.status(400).json({
                message: "Validation error",
                errors: dataResult.error.flatten().fieldErrors,
            });
            return;
        }
        const product = yield Product_1.default.findByIdAndUpdate(idResult.data, dataResult.data, { new: true });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSchema = zod_1.z.string().min(1, "Product ID is required");
        const result = idSchema.safeParse(req.params.id);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid product ID",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const product = yield Product_1.default.findByIdAndDelete(result.data);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
const searchSchema = zod_1.z.object({
    query: zod_1.z.string({ message: "Search query is required" }),
});
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = searchSchema.safeParse(req.query);
        if (!result.success) {
            res.status(400).json({ message: "Validation error", errors: result.error.flatten().fieldErrors });
            return;
        }
        const { query } = result.data;
        const products = yield Product_1.default.find({ name: { $regex: query, $options: "i" } });
        res.json({ message: "Search products successfully", products });
    }
    catch (error) {
        console.error("Search products error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.searchProducts = searchProducts;
