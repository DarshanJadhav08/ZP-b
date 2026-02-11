import { FastifyInstance } from "fastify";
import {
  addHomeworkController,
  getMyHomeworkController,
  getStudentHomeworkController,
  getAllHomeworkController,
  updateHomeworkController,
  deleteHomeworkController,
} from "../controllers/homework.controller";
import { authMiddleware } from "../middelware/auth.middleware";
import { adminMiddleware } from "../middelware/admin.middleware";

export default async function homeworkRoutes(app: FastifyInstance) {
  // Teacher Routes (Auth required)
  app.post("/:client_id/homework", { preHandler: [authMiddleware] }, addHomeworkController);
  app.get("/my-homework", { preHandler: [authMiddleware] }, getMyHomeworkController);
  app.put("/:client_id/homework/:homework_id", { preHandler: [authMiddleware] }, updateHomeworkController);
  app.delete("/:client_id/homework/:homework_id", { preHandler: [authMiddleware] }, deleteHomeworkController);

  // Student Routes (No auth for now - can add later)
  app.get("/student-homework", getStudentHomeworkController);

  // Admin Routes (Auth + Admin required)
  app.get("/:client_id/all-homework", { preHandler: [authMiddleware, adminMiddleware] }, getAllHomeworkController);
}
