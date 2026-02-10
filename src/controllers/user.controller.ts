import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models";

interface UserParams {
  id: string;
}

interface UpdateUserBody {
  name?: string;
  phone?: string;
}

// Get all users
export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    reply.send({ data: users });
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as UserParams;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.send({ data: user });
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
};

// Update user
export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as UserParams;
    const body = req.body as UpdateUserBody;
    
    const user = await User.findByPk(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    await user.update(body);

    reply.send({ message: "User updated successfully", data: user });
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as UserParams;
    const user = await User.findByPk(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    await user.destroy();

    reply.send({ message: "User deleted successfully" });
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
};
