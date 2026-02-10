import { FastifyInstance } from "fastify";
import {
  createStudentController,
  getAllStudentsController,
  updateStudentController,
  deleteStudentController,
} from "../controllers/student.controller";
import { authMiddleware } from "../middelware/auth.middleware";
import { adminMiddleware } from "../middelware/admin.middleware";

export default async function studentRoutes(app: FastifyInstance) {
  app.post("/", createStudentController);
  app.get("/", getAllStudentsController);
  app.put("/:student_id", updateStudentController);
  app.delete("/:student_id", deleteStudentController);
}
