import { FastifyInstance } from "fastify";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

export default async function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
}
