import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserWithRole, findUserByPhone } from "../repositories/auth.repository";
import { Role } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "school_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "school_refresh_secret";

interface SignupData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  password: string;
  role_name: string;
  role_id?: number | string;
  client_id: number;
  profile_image?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  class?: string;
  section?: string;
  parent_name?: string;
  parent_phone?: string;
  subject?: string;
  qualification?: string;
  designation?: string;
}

const generateTokens = (userId: number | string, roleId: number | string) => {
  const accessToken = jwt.sign(
    { user_id: userId, role_id: roleId },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { user_id: userId, role_id: roleId },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const signupService = async (data: SignupData) => {
  // Check role
  const role = await Role.findOne({ where: { name: data.role_name } });
  if (!role) {
    throw new Error("Invalid role");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUserWithRole({
    ...data,
    password: hashedPassword,
    role_id: role.id,
  });

  const tokens = generateTokens(user.id, user.role_id);

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

  const tokens = generateTokens(user.id, user.role_id);

  return {
    ...tokens,
    user_id: user.id,
    role_id: user.role_id,
  };
};
