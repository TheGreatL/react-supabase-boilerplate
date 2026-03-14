import { Router } from "express";
import AuthController from "./auth.controller";
import { validateSchema } from "../../shared/middleware/schema-validate.middleware";
import { loginSchema } from "./auth.schema";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import authAttemptLimiter from "./auth.middleware";

const route = Router();

route.post(
  "/login",
  authAttemptLimiter(),
  validateSchema(loginSchema),
  AuthController.login
);
route.post("/register", AuthController.register);
route.post("/refresh", AuthController.refresh);
route.post("/logout", AuthController.logout);
route.get("/me", authMiddleware, AuthController.getMe);

export default route;
