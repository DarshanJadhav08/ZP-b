import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/users.model";
import { Teacher } from "../models/teacher.modle";
import { Role } from "../models/role.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const addTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const { first_name,middle_name,last_name, phone, password, subject, qualification } = req.body as any;

    if (!first_name || !phone || !password) {
      return reply.status(400).send({ error: "Name, phone and password are required" });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return reply.status(400).send({ error: "Phone number already exists" });
    }

    const teacherRole = await Role.findOne({ where: { name: "teacher" } });
    if (!teacherRole) {
      console.error("Teacher role not found in database");
      return reply.status(500).send({ error: "Teacher role not found. Please create 'teacher' role first." });
    }

    console.log("Teacher role found:", teacherRole.id);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      middle_name,
      last_name,
      phone,
      password: hashedPassword,
      role_id: teacherRole.id,
      client_id: null,
      is_active: true,
    });

    console.log("User created:", user.id);

    await Teacher.create({
      user_id: user.id,
      subject,
      qualification,
    });

    console.log("Teacher created successfully");

    return reply.status(201).send({ 
      message: "Teacher added successfully", 
      teacher: {
        user_id: user.id,
        name: user.first_name,
        phone: user.phone,
        subject: subject || null,
        qualification: qualification || null
      }
    });
  } catch (error: any) {
    console.error("Error in addTeacherController:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return reply.status(500).send({ 
      error: "Failed to add teacher",
      details: error.message 
    });
  }
};

export const getAllTeachersController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { page = 1, limit = 10, search, subject, is_active } = req.query as any;

    const offset = (Number(page) - 1) * Number(limit);

    const whereUser: any = {};
    const whereTeacher: any = {};

    // By default, only show active users
    whereUser.is_active = true;

    if (search) {
      whereUser.name = { [Op.like]: `%${search}%` };
    }

    if (subject) {
      whereTeacher.subject = { [Op.like]: `%${subject}%` };
    }

    if (is_active !== undefined) {
      whereUser.is_active = is_active === 'true';
    }

    const { count, rows: teachers } = await Teacher.findAndCountAll({
      where: whereTeacher,
      include: [
        {
          model: User,
          as: "user",
          where: whereUser,
          attributes: ["id", "first_name","middle_name","last_name", "phone", "is_active", "created_at"],
        },
      ],
      limit: Number(limit),
      offset: offset,
      order: [[{ model: User, as: "user" }, "created_at", "DESC"]],
    });

    return reply.status(200).send({ 
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      },
      teachers
    });
  } catch (error: any) {
    console.error("Error in getAllTeachersController:", error);
    return reply.status(500).send({ 
      error: "Failed to fetch teachers",
      details: error.message 
    });
  }
};

export const updateTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { teacher_id } = req.params as any;
    const { first_name, phone, subject, qualification, is_active } = req.body as any;

    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) {
      return reply.status(404).send({ error: "Teacher not found" });
    }

    const user = await User.findByPk(teacher.get("user_id") as string);
    if (user) {
      await user.update({ first_name, phone, is_active });
    }

    await teacher.update({ subject, qualification });

    return reply.status(200).send({ message: "Teacher updated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to update teacher" });
  }
};

export const deleteTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { teacher_id } = req.params as any;

    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) {
      return reply.status(404).send({ error: "Teacher not found" });
    }

    const user = await User.findByPk(teacher.get("user_id") as string);
    if (user) {
      await user.update({ is_active: false });
    }

    return reply.status(200).send({ message: "Teacher deactivated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to delete teacher" });
  }
};
