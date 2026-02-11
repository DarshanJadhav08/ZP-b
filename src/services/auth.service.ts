import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserWithRole, findUserByPhone } from "../repositories/auth.repository";
import { Role, Client } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "school_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "school_refresh_secret";

interface SignupData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  password: string;
  role_name: string;
  role_id?: string;  // Changed to string (UUID)
  client_id: string;  // Changed to string (UUID)
  // Student fields
  parent_name?: string;
  mobile_number?: string;
  gender?: 'male' | 'female' | 'other';
  profile_image_url?: string;
  aadhar_number?: string;
  standard?: string;
  division?: string;
  admission_date?: Date;
  address?: string;
  category?: string;
  // Teacher fields
  date_of_birth?: Date;
  designation?: string;
  qualification?: string;
  joining_date?: Date;
  experience_years?: number;
  is_class_teacher?: boolean;
  assigned_standard?: string;
  assigned_division?: string;
  // Admin fields
  admin_designation?: string;
}

const generateTokens = (userId: number | string, roleId: number | string, roleName: string, clientId?: string | null) => {
  const accessToken = jwt.sign(
    { 
      user_id: userId, 
      role_id: roleId,
      role_name: roleName,
      client_id: clientId 
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { 
      user_id: userId, 
      role_id: roleId,
      role_name: roleName,
      client_id: clientId 
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

export const signupService = async (data: SignupData) => {
  // Check role
  const role = await Role.findOne({ where: { name: data.role_name } });
  if (!role) {
    throw new Error("Invalid role");
  }

  // Check client
  if (data.client_id) {
    const client = await Client.findByPk(data.client_id);
    if (!client) {
      throw new Error("Invalid client");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUserWithRole({
    ...data,
    password: hashedPassword,
    role_id: role.id,
  });

  const tokens = generateTokens(user.id, user.role_id, user.role_name, user.client_id);

  return {
    user,
    ...tokens,
  };
};

export const loginService = async (phone: string, password: string) => {
  const user = await findUserByPhone(phone);

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid password");
  }

  const tokens = generateTokens(user.id, user.role_id, user.role_name, user.client_id);

  return {
    ...tokens,
    user_id: user.id,
    role_id: user.role_id,
  };
};
