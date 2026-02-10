import { FastifyInstance } from "fastify";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { authMiddleware } from "../middelware/auth.middleware";

export default async function userRoutes(app: FastifyInstance) {
  // All routes are protected with authMiddleware
  app.get("/", { preHandler: [authMiddleware] }, getAllUsers);
  app.get("/:id", { preHandler: [authMiddleware] }, getUserById);
  app.put("/:id", { preHandler: [authMiddleware] }, updateUser);
  app.delete("/:id", { preHandler: [authMiddleware] }, deleteUser);
}
