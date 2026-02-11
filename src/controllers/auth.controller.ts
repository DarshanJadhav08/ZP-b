import { FastifyRequest, FastifyReply } from "fastify";
import { signupService, loginService } from "../services/auth.service";
import { refreshTokenService } from "../services/token.service";

interface SignupBody {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  password: string;
  role_name: string;
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

interface LoginBody {
  phone: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
}

export const signupController = async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
  try {
    const result = await signupService(req.body);
    reply.send({
      message: "User created successfully",
      user_id: result.user.id,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};

export const loginController = async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  try {
    const { phone, password } = req.body;

    const result = await loginService(phone, password);

    reply.send({
      message: "Login successful",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user_id: result.user_id,
      role_id: result.role_id,
    });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};

export const refreshTokenController = async (req: FastifyRequest<{ Body: RefreshTokenBody }>, reply: FastifyReply) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService(refreshToken);
    reply.send(result);
  } catch (error: any) {
    reply.status(401).send({ error: error.message });
  }
};
