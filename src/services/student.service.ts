import bcrypt from "bcrypt";
import { User } from "../models/users.model";
import {
  createStudentRepo,
  findAllStudentsRepo,
  findStudentByIdRepo,
  updateStudentRepo,
  deleteStudentRepo,
  findStudentRoleRepo,
} from "../repositories/student.repository";

export const createStudentService = async (studentData: any) => {
  const { name, phone, password, roll_no, class: className, section, parent_name, parent_phone, client_id } = studentData;

  if (!name || !phone || !password || !client_id) {
    throw new Error("Name, phone, password and client_id are required");
  }

  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    throw new Error("Phone number already exists");
  }

  const studentRole = await findStudentRoleRepo();
  if (!studentRole) {
    throw new Error("Student role not found. Please create 'student' role first.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name: name,
    last_name: name,
    phone,
    password: hashedPassword,
    role_id: studentRole.id,
    role_name: "student",
    client_id: client_id,
    is_active: true,
  });

  await createStudentRepo({
    user_id: user.id,
    roll_no,
    class: className,
    section,
    parent_name,
    parent_phone,
  });

  return {
    user_id: user.id,
    name: user.first_name,
    phone: user.phone,
    roll_no,
    class: className,
    section,
    parent_name,
    parent_phone,
  };
};

export const getAllStudentsService = async (filters: any) => {
  const { count, rows: students } = await findAllStudentsRepo(filters);

  return {
    pagination: {
      total: count,
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 10),
      totalPages: Math.ceil(count / Number(filters.limit || 10)),
    },
    students,
  };
};

export const updateStudentService = async (studentId: string, updateData: any) => {
  const { name, phone, roll_no, class: className, section, parent_name, parent_phone, is_active } = updateData;

  const student = await findStudentByIdRepo(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const user = await User.findByPk(student.get("user_id") as string);
  if (user && name) {
    await user.update({ first_name: name, last_name: name, phone, is_active });
  } else if (user) {
    await user.update({ phone, is_active });
  }

  await updateStudentRepo(studentId, { roll_no, class: className, section, parent_name, parent_phone });

  return { message: "Student updated successfully" };
};

export const deleteStudentService = async (studentId: string) => {
  const result = await deleteStudentRepo(studentId);
  if (!result) {
    throw new Error("Student not found");
  }

  return { message: "Student deactivated successfully" };
};
