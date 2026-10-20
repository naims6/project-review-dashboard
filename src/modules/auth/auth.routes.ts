import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";

const router: Router = Router();

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

export const AuthRoutes = router;
