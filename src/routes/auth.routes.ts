import { FastifyInstance } from "fastify";
import { signupController, loginController, refreshTokenController, resetPasswordController } from "../controllers/auth.controller";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/signup", signupController);
  app.post("/login", loginController);
  app.post("/refresh", refreshTokenController);
  app.post("/reset-password", resetPasswordController);
}
