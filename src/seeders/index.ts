import mongoose from "mongoose";
import dotenv from "dotenv";
import seedUsers from "./seedUsers";
import seedProducts from "./seedProducts";
import connectDB from "../config/db";

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log("Seeding database...");

        await connectDB();

        await seedUsers();
        await seedProducts();

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:\n", error);
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
