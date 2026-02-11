import { FastifyInstance } from "fastify";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import teacherRoutes from "./teacher.routes";
import studentRoutes from "./student.routes";
import adminRoutes from "./admin.routes.new";
import attendanceRoutes from "./attendance.routes";
import homeworkRoutes from "./homework.routes";

export default async function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
  app.register(teacherRoutes, { prefix: "/teachers" });
  app.register(studentRoutes, { prefix: "/students" });
  app.register(adminRoutes, { prefix: "/admins" });
  app.register(attendanceRoutes, { prefix: "/attendance" });
  app.register(homeworkRoutes, { prefix: "/homework" });
}
