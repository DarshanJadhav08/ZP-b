import { FastifyInstance } from "fastify";
import {
  createAttendanceController,
  getAttendanceByIdController,
  getAttendancesByClientIdController,
  getAttendancesByStudentIdController,
  getAttendancesByDateController,
  getAttendancesByClassController,
  updateAttendanceController,
  deleteAttendanceController,
  bulkCreateAttendancesController
} from "../controllers/attendance.controller";

export default async function attendanceRoutes(fastify: FastifyInstance) {
  // Create single attendance
  fastify.post("/", createAttendanceController);

  // Bulk create attendances
  fastify.post("/bulk", bulkCreateAttendancesController);

  // Get attendance by ID
  fastify.get("/:id", getAttendanceByIdController);

  // Get all attendances by client ID
  fastify.get("/client/:client_id", getAttendancesByClientIdController);

  // Get attendances by class (standard and optional division)
  fastify.get("/client/:client_id/class", getAttendancesByClassController);

  // Get attendances by student ID (with optional date range)
  fastify.get("/student/:student_id", getAttendancesByStudentIdController);

  // Get attendances by date
  fastify.get("/client/:client_id/date", getAttendancesByDateController);

  // Update attendance
  fastify.put("/:id", updateAttendanceController);

  // Delete attendance
  fastify.delete("/:id", deleteAttendanceController);
}
