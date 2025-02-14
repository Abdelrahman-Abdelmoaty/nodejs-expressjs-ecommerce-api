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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const seedUsers_1 = __importDefault(require("../seeders/seedUsers"));
const seedProducts_1 = __importDefault(require("../seeders/seedProducts"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seedUsers_1.default)();
    yield (0, seedProducts_1.default)();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.deleteMany({});
    yield Product_1.default.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe("API Tests", () => {
    describe("User Authentication", () => {
        it("should login with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
                username: "admin",
                password: "admin123",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
        }));
        it("should fail login with invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
                username: "admin",
                password: "wrongpassword",
            });
            expect(response.status).toBe(401);
        }));
    });
    describe("Products API", () => {
        it("should get all products", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get("/api/products");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(3);
        }));
        it("should get a specific product", () => __awaiter(void 0, void 0, void 0, function* () {
            const products = yield Product_1.default.find();
            const testProduct = products[0];
            const response = yield (0, supertest_1.default)(app_1.default).get(`/api/products/${testProduct._id}`);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(testProduct.name);
        }));
    });
});
