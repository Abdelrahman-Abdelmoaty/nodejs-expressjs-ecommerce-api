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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const seedUsers_1 = __importDefault(require("./seedUsers"));
const seedProducts_1 = __importDefault(require("./seedProducts"));
const db_1 = __importDefault(require("../config/db"));
dotenv_1.default.config();
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Seeding database...");
        yield (0, db_1.default)();
        yield (0, seedUsers_1.default)();
        yield (0, seedProducts_1.default)();
        console.log("Database seeded successfully!");
    }
    catch (error) {
        console.error("Error seeding database:\n", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
    }
});
seedDatabase();
