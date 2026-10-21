import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import globalError from "./middlewares/globalError.js";
import router from "./routes/routes.js";
import docsRouter from "./docs/index.js";
import { globalLimiter } from "./middlewares/rateLimit.js";
import config from "./config/env.js";

const app: Application = express();

const allowedOrigins = [
  config.frontend_url,
  "http://localhost:3000",
  "http://localhost:5000",
  "https://project-review-dashboard.onrender.com",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.includes(origin);

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter); // global: 100 req / 15 min

// API documentation route
app.use("/api-docs", docsRouter);

// base route
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Server is Healthy",
    docs: "/api-docs",
    uptime: `${process.uptime()} seconds`,
    time: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(globalError);

export default app;
