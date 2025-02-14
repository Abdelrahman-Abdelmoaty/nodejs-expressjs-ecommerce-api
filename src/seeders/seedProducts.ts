import Product from "../models/Product";
import { faker } from "@faker-js/faker";

export default async function seedProducts() {
    try {
        console.log("Seeding products...");

        await Product.deleteMany({});

        const products = Array.from({ length: 100 }, () => ({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            stockQuantity: faker.number.int({ min: 0, max: 100 }),
        }));

        await Product.insertMany(products);
        console.log("Products seeded successfully!");
    } catch (error) {
        console.error("Error seeding products:\n", error);
    }
}
