import { FastifyInstance } from "fastify";
import { signupController, loginController, refreshTokenController } from "../controllers/auth.controller";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/signup", signupController);
  app.post("/login", loginController);
  app.post("/refresh", refreshTokenController);
}
