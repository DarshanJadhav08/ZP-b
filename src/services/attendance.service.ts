import {
  createAttendance,
  findAttendanceById,
  findAttendancesByClientId,
  findAttendancesByStudentId,
  findAttendancesByDate,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendances
} from "../repositories/attendance.repository";
import { Student, Teacher, Client, Attendance } from "../models";

export const createAttendanceService = async (data: {
  client_id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remark?: string;
}) => {
  const client = await Client.findByPk(data.client_id);
  if (!client) {
    const error: any = new Error("Client does not exist");
    error.statusCode = 404;
    throw error;
  }

  const student = await Student.findByPk(data.student_id);
  if (!student) {
    const error: any = new Error("Student does not exist");
    error.statusCode = 404;
    throw error;
  }

  const teacher = await Teacher.findByPk(data.teacher_id);
  if (!teacher) {
    const error: any = new Error("Teacher does not exist");
    error.statusCode = 404;
    throw error;
  }

  return await createAttendance(data);
};

export const getAttendanceByIdService = async (id: string) => {
  const attendance = await findAttendanceById(id);
  if (!attendance) {
    const error: any = new Error("Attendance record not found");
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

export const getAttendancesByClientIdService = async (client_id: string) => {
  return await findAttendancesByClientId(client_id);
};

export const getAttendancesByStudentIdService = async (
  student_id: string,
  startDate?: string,
  endDate?: string
) => {
  return await findAttendancesByStudentId(student_id, startDate, endDate);
};

export const getAttendancesByDateService = async (client_id: string, date: string) => {
  return await findAttendancesByDate(client_id, date);
};

export const updateAttendanceService = async (
  id: string,
  data: {
    status?: 'Present' | 'Absent' | 'Late';
    remark?: string;
  }
) => {
  const attendance = await updateAttendance(id, data);
  if (!attendance) {
    const error: any = new Error("Attendance record not found");
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

export const deleteAttendanceService = async (id: string) => {
  const attendance = await deleteAttendance(id);
  if (!attendance) {
    const error: any = new Error("Attendance record not found");
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

export const bulkCreateAttendancesService = async (
  attendances: Array<{
    client_id: string;
    student_id: string;
    teacher_id: string;
    date: string;
    status: 'Present' | 'Absent' | 'Late';
    remark?: string;
  }>
) => {
  return await bulkCreateAttendances(attendances);
};

export const getAttendancesByClassService = async (
  client_id: string,
  standard: string,
  division?: string,
  date?: string
) => {
  const where: any = { client_id, standard };
  
  if (division) {
    where.division = division;
  }
  
  const students = await Student.findAll({ where });
  const studentIds = students.map((s: any) => s.id);
  
  const attendanceWhere: any = {
    client_id,
    student_id: studentIds
  };
  
  if (date) {
    attendanceWhere.date = date;
  }
  
  return await Attendance.findAll({
    where: attendanceWhere,
    include: [
      { model: Student, as: 'student' },
      { model: Teacher, as: 'teacher' }
    ],
    order: [['date', 'DESC']]
  });
};
