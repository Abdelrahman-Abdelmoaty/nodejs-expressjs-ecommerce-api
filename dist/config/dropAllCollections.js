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
exports.dropAllCollections = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./db"));
const dropAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        console.log("Dropping all collections...");
        const collections = ["users", "carts", "products"];
        for (const collection of collections) {
            if (mongoose_1.default.connection.db) {
                yield mongoose_1.default.connection.db.dropCollection(collection);
            }
        }
        console.log("All collections dropped successfully");
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
    catch (error) {
        console.error("Error dropping collections:", error);
    }
});
exports.dropAllCollections = dropAllCollections;
(0, exports.dropAllCollections)();
