import User from "../models/User";
import { faker } from "@faker-js/faker";

export default async function seedUsers() {
  try {
    console.log("Seeding users...");

    await User.deleteMany({});

    const users = Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }));

    users.push({
      name: "admin",
      email: "admin@example.com",
      password: "admin123",
    });

    await User.insertMany(users);
    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:\n", error);
  }
}
