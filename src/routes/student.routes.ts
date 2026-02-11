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
  // Client-specific routes
  app.post("/:client_id/students", createStudentController);
  app.get("/:client_id/students", getAllStudentsController);
  app.put("/:client_id/students/:student_id", updateStudentController);
  app.delete("/:client_id/students/:student_id", deleteStudentController);
}
