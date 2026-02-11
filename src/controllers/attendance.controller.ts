import { FastifyRequest, FastifyReply } from "fastify";
import {
  createAttendanceService,
  getAttendanceByIdService,
  getAttendancesByClientIdService,
  getAttendancesByStudentIdService,
  getAttendancesByDateService,
  getAttendancesByClassService,
  updateAttendanceService,
  deleteAttendanceService,
  bulkCreateAttendancesService
} from "../services/attendance.service";

interface CreateAttendanceBody {
  student_id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remark?: string;
}

interface UpdateAttendanceBody {
  status?: 'Present' | 'Absent' | 'Late';
  remark?: string;
}

interface BulkCreateAttendanceBody {
  attendances: Array<{
    student_id: string;
    date: string;
    status: 'Present' | 'Absent' | 'Late';
    remark?: string;
  }>;
}

export const createAttendanceController = async (req: any, reply: FastifyReply) => {
  try {
    const { student_id, date, status, remark } = req.body;
    const { user_id, client_id } = req.user!;
    
    const attendance = await createAttendanceService({
      client_id: client_id as string,
      student_id,
      teacher_id: user_id as string,
      date,
      status,
      remark
    });
    
    reply.status(201).send({
      message: "Attendance created successfully",
      data: attendance
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message || "Failed to create attendance",
      error: error.name || "Error"
    });
  }
};

export const getAttendanceByIdController = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const attendance = await getAttendanceByIdService(req.params.id);
    reply.send({
      message: "Attendance fetched successfully",
      data: attendance
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const getAttendancesByClientIdController = async (
  req: FastifyRequest<{ Params: { client_id: string } }>,
  reply: FastifyReply
) => {
  try {
    const attendances = await getAttendancesByClientIdService(req.params.client_id);
    reply.send({
      message: "Attendances fetched successfully",
      count: attendances.length,
      data: attendances
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const getAttendancesByStudentIdController = async (
  req: FastifyRequest<{ 
    Params: { student_id: string };
    Querystring: { startDate?: string; endDate?: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { student_id } = req.params;
    const { startDate, endDate } = req.query;
    const attendances = await getAttendancesByStudentIdService(student_id, startDate, endDate);
    reply.send({
      message: "Attendances fetched successfully",
      count: attendances.length,
      data: attendances
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const getAttendancesByDateController = async (
  req: FastifyRequest<{ 
    Params: { client_id: string };
    Querystring: { date: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { client_id } = req.params;
    const { date } = req.query;
    const attendances = await getAttendancesByDateService(client_id, date);
    reply.send({
      message: "Attendances fetched successfully",
      count: attendances.length,
      data: attendances
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const updateAttendanceController = async (req: any, reply: FastifyReply) => {
  try {
    const attendance = await updateAttendanceService(req.params.id, req.body);
    reply.send({
      message: "Attendance updated successfully",
      data: attendance
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const deleteAttendanceController = async (req: any, reply: FastifyReply) => {
  try {
    await deleteAttendanceService(req.params.id);
    reply.send({
      message: "Attendance deleted successfully"
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const getAttendancesByClassController = async (
  req: FastifyRequest<{ 
    Params: { client_id: string };
    Querystring: { standard: string; division?: string; date?: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { client_id } = req.params;
    const { standard, division, date } = req.query;
    
    if (!standard) {
      return reply.status(400).send({
        statusCode: 400,
        message: "Standard is required",
        error: "ValidationError"
      });
    }
    
    const attendances = await getAttendancesByClassService(client_id, standard, division, date);
    reply.send({
      message: "Attendances fetched successfully",
      count: attendances.length,
      data: attendances
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message,
      error: error.name || "Error"
    });
  }
};

export const bulkCreateAttendancesController = async (req: any, reply: FastifyReply) => {
  try {
    const { user_id, client_id } = req.user!;
    
    const attendancesWithAuth = req.body.attendances.map((att: any) => ({
      ...att,
      client_id: client_id as string,
      teacher_id: user_id as string
    }));
    
    const attendances = await bulkCreateAttendancesService(attendancesWithAuth);
    reply.status(201).send({
      message: "Attendances created successfully",
      count: attendances.length,
      data: attendances
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    reply.status(statusCode).send({
      statusCode,
      message: error.message || "Failed to create attendances",
      error: error.name || "Error"
    });
  }
};
