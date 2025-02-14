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
exports.default = seedProducts;
const Product_1 = __importDefault(require("../models/Product"));
const faker_1 = require("@faker-js/faker");
function seedProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Seeding products...");
            yield Product_1.default.deleteMany({});
            const products = Array.from({ length: 100 }, () => ({
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                price: parseFloat(faker_1.faker.commerce.price()),
                stockQuantity: faker_1.faker.number.int({ min: 0, max: 100 }),
            }));
            yield Product_1.default.insertMany(products);
            console.log("Products seeded successfully!");
        }
        catch (error) {
            console.error("Error seeding products:\n", error);
        }
    });
}
