import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import isAuthenticated from "../../middlewares/isAuthaticate.js";

const router: Router = Router();

// Public routes
router.post(
  "/signup",
  validateRequest(AuthValidation.signupValidationSchema),
  AuthController.signupStudent,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

// Authenticated routes
router.get("/me", isAuthenticated, AuthController.getMe);
router.post("/logout", isAuthenticated, AuthController.logoutUser);

export const AuthRoutes = router;
