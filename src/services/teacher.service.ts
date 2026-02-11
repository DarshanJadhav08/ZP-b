import bcrypt from "bcrypt";
import { User } from "../models/users.model";
import {
  createTeacherRepo,
  findAllTeachersRepo,
  findTeacherByIdRepo,
  updateTeacherRepo,
  deleteTeacherRepo,
  findTeacherRoleRepo,
} from "../repositories/teacher.repository";

export const addTeacherService = async (teacherData: any) => {
  const { first_name, last_name, phone, role_name, password, subject, qualification, client_id } = teacherData;

  if (!first_name || !phone || !password || !client_id) {
    throw new Error("Name, phone, password and client_id are required");
  }

  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    throw new Error("Phone number already exists");
  }

  const teacherRole = await findTeacherRoleRepo();
  if (!teacherRole) {
    throw new Error("Teacher role not found. Please create 'teacher' role first.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    phone,
    role_name,
    password: hashedPassword,
    role_id: teacherRole.id,
    client_id: client_id,
  });

  await createTeacherRepo({
    user_id: user.id,
    subject,
    qualification,
  });

  return {
    user_id: user.id,
    name: user.first_name,
    phone: user.phone,
    subject: subject || null,
    qualification: qualification || null,
  };
};

export const getAllTeachersService = async (filters: any) => {
  const { count, rows: teachers } = await findAllTeachersRepo(filters);

  return {
    pagination: {
      total: count,
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 10),
      totalPages: Math.ceil(count / Number(filters.limit || 10)),
    },
    teachers,
  };
};

export const updateTeacherService = async (teacherId: string, updateData: any) => {
  const { first_name, phone, subject, qualification } = updateData;

  const teacher = await findTeacherByIdRepo(teacherId);
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  const user = await User.findByPk(teacher.get("user_id") as string);
  if (user) {
    await user.update({ first_name, phone });
  }

  await updateTeacherRepo(teacherId, { subject, qualification });

  return { message: "Teacher updated successfully" };
};

export const deleteTeacherService = async (teacherId: string) => {
  const result = await deleteTeacherRepo(teacherId);
  if (!result) {
    throw new Error("Teacher not found");
  }

  return { message: "Teacher deactivated successfully" };
};
