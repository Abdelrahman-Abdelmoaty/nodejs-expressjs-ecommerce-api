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
exports.default = seedUsers;
const User_1 = __importDefault(require("../models/User"));
const faker_1 = require("@faker-js/faker");
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Seeding users...");
            yield User_1.default.deleteMany({});
            const users = Array.from({ length: 10 }, () => ({
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.internet.password(),
            }));
            users.push({
                name: "admin",
                email: "admin@example.com",
                password: "admin123",
            });
            yield User_1.default.insertMany(users);
            console.log("Users seeded successfully!");
        }
        catch (error) {
            console.error("Error seeding users:\n", error);
        }
    });
}
