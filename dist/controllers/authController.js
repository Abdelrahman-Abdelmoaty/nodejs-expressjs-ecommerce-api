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
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }),
    email: zod_1.z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
    password: zod_1.z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, email, password } = result.data;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user with cart
        const user = yield User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
            expiresIn: "1d",
        });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.register = register;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
    password: zod_1.z.string({ message: "Password is required" }),
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { email, password } = result.data;
        // Check if user exists
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Verify password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
            expiresIn: "1d",
        });
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
