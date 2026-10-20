import "dotenv/config";
import "temporal-polyfill/full/global";
import bcryptjs from "bcryptjs";
import { db } from "./db.js";
import config from "../src/config/env.js";

const USERS_TO_SEED = [
  {
    name: "System Admin",
    email: "admin@demo.com",
    password: "password123",
    role: "ADMIN" as const,
  },
  {
    name: "Lead Mentor",
    email: "mentor@demo.com",
    password: "password123",
    role: "MENTOR" as const,
  },
  {
    name: "Sample Student",
    email: "student@demo.com",
    password: "password123",
    role: "STUDENT" as const,
  },
];

const seed = async () => {
  console.log("🌱 Seeding database...");

  for (const user of USERS_TO_SEED) {
    const existing = await db.orm.public.User.where({
      email: user.email,
    }).first();

    if (existing) {
      console.log(`ℹ️  User already exists: ${user.email} (${user.role}). Skipping.`);
      continue;
    }

    const hashedPassword = await bcryptjs.hash(user.password, config.bcrypt_salt_rounds);

    await db.orm.public.User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    });

    console.log(`✅ Seeded ${user.role}: ${user.email} / ${user.password}`);
  }

  console.log("✨ Seeding completed successfully!");
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
