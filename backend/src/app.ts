import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import globalError from "./middlewares/globalError.js";
import router from "./routes/routes.js";
import docsRouter from "./docs/index.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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