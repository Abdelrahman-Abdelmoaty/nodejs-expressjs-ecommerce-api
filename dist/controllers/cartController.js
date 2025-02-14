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
exports.clearCart = exports.editCart = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const zod_1 = require("zod");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart_1.default.findOne({ user: req.body.user.id }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        res.json({
            cart: {
                id: cart.id,
                items: cart.items.map((item) => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                })),
                total: cart.total,
            },
            message: "Cart loaded successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching cart" });
    }
});
exports.getCart = getCart;
const addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string({ message: "Product ID is required" }),
    quantity: zod_1.z.number({ message: "Quantity is required" }).min(1, { message: "Quantity must be at least 1" }),
});
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = addToCartSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { productId, quantity } = result.data;
        const cart = yield Cart_1.default.findOne({ user: req.body.user.id }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const existingItem = cart.items.find((item) => item.product.id.toString() === productId);
        if (existingItem) {
            res.status(400).json({ message: "Product already in cart" });
            return;
        }
        cart.items.push({
            product: productId,
            quantity,
            id: productId,
        });
        yield cart.save();
        yield cart.populate("items.product");
        res.json({
            cart: {
                id: cart.id,
                items: cart.items.map((item) => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                })),
                total: cart.total,
            },
            message: "Product added to cart successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding to cart" });
    }
});
exports.addToCart = addToCart;
const removeFromCartSchema = zod_1.z.object({
    productId: zod_1.z.string({ message: "Product ID is required" }),
});
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = removeFromCartSchema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { productId } = result.data;
        const cart = yield Cart_1.default.findOne({ user: req.body.user.id }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        cart.items = cart.items.filter((item) => item.id.toString() !== productId);
        yield cart.save();
        yield cart.populate("items.product");
        res.json({
            cart: {
                id: cart.id,
                items: cart.items.map((item) => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                })),
                total: cart.total,
            },
            message: "Product removed from cart successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error removing from cart" });
    }
});
exports.removeFromCart = removeFromCart;
const editCartSchema = zod_1.z.object({
    productId: zod_1.z.string({ message: "Product ID is required" }),
    quantity: zod_1.z
        .number({ required_error: "Quantity is required", invalid_type_error: "Quantity must be a number" })
        .positive({ message: "Quantity must be positive" })
        .int({ message: "Quantity must be an integer" }),
});
const editCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log({ productId: req.body.productId, quantity: req.body.quantity });
        const result = editCartSchema.safeParse({
            productId: req.body.productId,
            quantity: req.body.quantity,
        });
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { productId, quantity } = result.data;
        const cart = yield Cart_1.default.findOne({ user: req.body.user.id }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const existingItem = cart.items.find((item) => item.id.toString() === productId);
        if (!existingItem) {
            res.status(404).json({ message: "Product not found in cart" });
            return;
        }
        existingItem.quantity = quantity;
        yield cart.save();
        yield cart.populate("items.product");
        res.json({
            cart: {
                id: cart.id,
                items: cart.items.map((item) => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                })),
                total: cart.total,
            },
            message: "Cart updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error editing cart" });
    }
});
exports.editCart = editCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart_1.default.findOne({ user: req.body.user.id });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        cart.items = [];
        yield cart.save();
        yield cart.populate("items.product");
        res.json({
            cart: {
                id: cart.id,
                items: cart.items.map((item) => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                })),
                total: cart.total,
            },
            message: "Cart cleared successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error clearing cart" });
    }
});
exports.clearCart = clearCart;
