import { Router } from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import authorize from "../../middlewares/authorize.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AdminValidation } from "./admin.validation.js";
import { AdminController } from "./admin.controller.js";

const router: Router = Router();

// Protect all admin routes with authentication and ADMIN role
router.use(isAuthenticated, authorize("ADMIN"));

router.get("/users", AdminController.getAllUsers);

router.post(
  "/users",
  validateRequest(AdminValidation.createUserValidationSchema),
  AdminController.createUser,
);

export const AdminRoutes = router;
