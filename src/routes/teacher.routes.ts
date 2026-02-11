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

  app.post("/", addTeacherController);
  app.get("/", getAllTeachersController);
  app.put("/:teacher_id", updateTeacherController);
  app.delete("/:teacher_id", deleteTeacherController);
}
