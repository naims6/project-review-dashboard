import "dotenv/config";
import "temporal-polyfill/full/global";
import bcryptjs from "bcryptjs";
import { db } from "./db.js";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "password123";
const ADMIN_NAME = "Admin";

const seed = async () => {
  console.log("🌱 Seeding database...");

  // Idempotent: skip if admin already exists
  const existingAdmin = await db.orm.public.User.where({
    email: ADMIN_EMAIL,
  }).first();

  if (existingAdmin) {
    console.log("✅ Admin already exists. Skipping seed.");
    return;
  }

  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 12);

  await db.orm.public.User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("✅ Admin seeded successfully!");
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
