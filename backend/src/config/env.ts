import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  node_env: (process.env.NODE_ENV || "development") as string,
  port: (process.env.PORT || "5000") as string,
  database_url: process.env.DATABASE_URL as string,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  jwt_access_secret: (process.env.JWT_ACCESS_SECRET || "super-secret-jwt-access-key-2026") as string,
  jwt_access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || "7d") as string,
  frontend_url: (process.env.FRONTEND_URL || "http://localhost:3000") as string,
};

export default config;
