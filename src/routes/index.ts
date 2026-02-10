import { FastifyInstance } from "fastify";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import teacherRoutes from "./teacher.routes";
import studentRoutes from "./student.routes";

export default async function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
  app.register(teacherRoutes, { prefix: "/teachers" });
  app.register(studentRoutes, { prefix: "/students" });
}
