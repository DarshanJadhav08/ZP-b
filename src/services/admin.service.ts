import bcrypt from "bcrypt";
import { User } from "../models/users.model";
import {
  createAdminRepo,
  findAllAdminsRepo,
  findAdminByIdRepo,
  updateAdminRepo,
  deleteAdminRepo,
  findAdminRoleRepo,
} from "../repositories/admin.repository";

export const addAdminService = async (adminData: any) => {
  const { first_name, last_name, phone, password, designation, qualification, date_of_birth, experience, gender, mobile_number, profile_image_url, client_id } = adminData;

  if (!first_name || !phone || !password || !client_id) {
    throw new Error("First name, phone, password and client_id are required");
  }

  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    throw new Error("Phone number already exists");
  }

  const adminRole = await findAdminRoleRepo();
  if (!adminRole) {
    throw new Error("Admin role not found. Please create 'admin' role first.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    phone,
    password: hashedPassword,
    role_id: adminRole.id,
    role_name: "admin",
    client_id: client_id,
    is_active: true,
  });

  await createAdminRepo({
    user_id: user.id,
    client_id,
    first_name,
    middle_name: adminData.middle_name,
    last_name,
    designation,
    qualification,
    date_of_birth,
    experience,
    gender,
    mobile_number,
    profile_image_url,
    created_by: adminData.created_by || user.id,
  });

  return {
    user_id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    phone: user.phone,
    designation: designation || null,
    qualification: qualification || null,
  };
};

export const getAllAdminsService = async (filters: any) => {
  const { count, rows: admins } = await findAllAdminsRepo(filters);

  return {
    pagination: {
      total: count,
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 10),
      totalPages: Math.ceil(count / Number(filters.limit || 10)),
    },
    admins,
  };
};

export const updateAdminService = async (adminId: string, updateData: any) => {
  const { first_name, last_name, phone, designation, qualification, date_of_birth, experience, gender, mobile_number, profile_image_url, is_active, updated_by } = updateData;

  const admin = await findAdminByIdRepo(adminId);
  if (!admin) {
    throw new Error("Admin not found");
  }

  const user = await User.findByPk(admin.get("user_id") as string);
  if (user) {
    await user.update({ first_name, last_name, phone, is_active });
  }

  await updateAdminRepo(adminId, { 
    first_name, 
    last_name, 
    designation, 
    qualification, 
    date_of_birth, 
    experience, 
    gender, 
    mobile_number, 
    profile_image_url,
    updated_by: updated_by || user?.id,
  });

  return { message: "Admin updated successfully" };
};

export const deleteAdminService = async (adminId: string) => {
  const result = await deleteAdminRepo(adminId);
  if (!result) {
    throw new Error("Admin not found");
  }

  return { message: "Admin deactivated successfully" };
};
