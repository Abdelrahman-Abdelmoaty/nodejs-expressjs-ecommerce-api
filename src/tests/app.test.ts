import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import Product from "../models/Product";
import seedUsers from "../seeders/seedUsers";
import seedProducts from "../seeders/seedProducts";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    await seedUsers();
    await seedProducts();
});

afterEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("API Tests", () => {
    describe("User Authentication", () => {
        it("should login with valid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "admin",
                password: "admin123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
        });

        it("should fail login with invalid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "admin",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
        });
    });

    describe("Products API", () => {
        it("should get all products", async () => {
            const response = await request(app).get("/api/products");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(3);
        });

        it("should get a specific product", async () => {
            const products = await Product.find();
            const testProduct = products[0];

            const response = await request(app).get(
                `/api/products/${testProduct._id}`
            );

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(testProduct.name);
        });
    });
});
