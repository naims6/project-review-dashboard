import { Router } from "express";
import isAuthenticated from "../../middlewares/isAuthaticate.js";
import authorize from "../../middlewares/authorize.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ProjectValidation } from "./projects.validation.js";
import { ProjectController } from "./projects.controller.js";
import { submissionLimiter } from "../../middlewares/rateLimit.js";

const router: Router = Router();

router.post(
  "/",
  submissionLimiter,
  isAuthenticated,
  authorize("STUDENT"),
  validateRequest(ProjectValidation.createProjectValidationSchema),
  ProjectController.createProject,
);

router.get(
  "/me",
  isAuthenticated,
  authorize("STUDENT"),
  ProjectController.getMyProjects,
);

export const ProjectRoutes = router;
