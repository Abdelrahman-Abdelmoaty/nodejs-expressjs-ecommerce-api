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
exports.auth = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
            return;
        }
        // Verify token and decode user ID
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            // Find user
            const user = yield User_1.default.findById(decoded.userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            req.body.user = user;
            next();
            return;
        }
        catch (err) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.auth = auth;
