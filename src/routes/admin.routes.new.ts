import { FastifyInstance } from "fastify";
import {
  addAdminController,
  getAllAdminsController,
  updateAdminController,
  deleteAdminController,
} from "../controllers/admin.controller.new";
import { authMiddleware } from "../middelware/auth.middleware";

export default async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  // Client-specific routes
  app.post("/:client_id/admins", addAdminController);
  app.get("/:client_id/admins", getAllAdminsController);
  app.put("/:client_id/admins/:admin_id", updateAdminController);
  app.delete("/:client_id/admins/:admin_id", deleteAdminController);
}
