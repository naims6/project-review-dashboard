import { Router } from "express";
import isAuthenticated from "../../middlewares/isAuthaticate.js";
import authorize from "../../middlewares/authorize.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { MentorValidation } from "./mentor.validation.js";
import { MentorController } from "./mentor.controller.js";

const router: Router = Router();

// Protect all mentor routes with authentication and MENTOR role
router.use(isAuthenticated, authorize("MENTOR", "ADMIN"));

router.get("/projects", MentorController.getProjects);
router.get("/projects/:id", MentorController.getProjectById);
router.patch(
  "/projects/:id/review",
  validateRequest(MentorValidation.reviewProjectValidationSchema),
  MentorController.reviewProject,
);
router.get("/stats", MentorController.getMentorStats);

export const MentorRoutes = router;
