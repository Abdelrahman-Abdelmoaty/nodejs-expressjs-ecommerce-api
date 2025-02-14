import mongoose from "mongoose";
import connectDB from "./db";

export const dropAllCollections = async () => {
  try {
    await connectDB();

    console.log("Dropping all collections...");
    const collections = ["users", "carts", "products"];
    for (const collection of collections) {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropCollection(collection);
      }
    }

    console.log("All collections dropped successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error dropping collections:", error);
  }
};

dropAllCollections();
