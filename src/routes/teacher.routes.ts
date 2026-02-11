import { FastifyInstance } from "fastify";
import {
  addTeacherController,
  getAllTeachersController,
  updateTeacherController,
  deleteTeacherController,
} from "../controllers/teacher.controller";
import { authMiddleware } from "../middelware/auth.middleware";
import { adminMiddleware } from "../middelware/admin.middleware";

export default async function teacherRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);
  app.addHook("preHandler", adminMiddleware);

  // Client-specific routes
  app.post("/:client_id/teachers", addTeacherController);
  app.get("/:client_id/teachers", getAllTeachersController);
  app.put("/:client_id/teachers/:teacher_id", updateTeacherController);
  app.delete("/:client_id/teachers/:teacher_id", deleteTeacherController);
}
