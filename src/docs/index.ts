import fs from "fs";
import path from "path";
import { Request, Response, Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

const router: Router = Router();

// Helper to load and parse YAML files from src/docs
const loadYaml = (fileName: string) => {
  const filePath = path.join(process.cwd(), "src/docs", fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return YAML.parse(fileContent);
};

// Loaded once when the server starts up
const baseDoc = loadYaml("swagger.yml");
const commonDoc = loadYaml("common.yml");
const authDoc = loadYaml("auth.yml");

export const swaggerDocument = {
  ...baseDoc,
  components: {
    ...baseDoc.components,
    ...commonDoc.components,
  },
  paths: {
    ...authDoc.paths,
  },
};

// Raw JSON spec endpoint (for Postman / Insomnia)
router.get("/spec.json", (_req: Request, res: Response) => {
  res.json(swaggerDocument);
});

// Swagger UI endpoint
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
