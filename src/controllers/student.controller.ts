import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/users.model";
import { Student } from "../models/student.model";
import { Role } from "../models/role.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const createStudentController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, phone, password, roll_no, class: className, section, parent_name, parent_phone } = req.body as any;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return reply.status(400).send({ error: "Phone number already exists" });
    }

    const studentRole = await Role.findOne({ where: { name: "student" } });
    if (!studentRole) {
      return reply.status(500).send({ error: "Student role not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role_id: studentRole.id,
      client_id: null,
      is_active: true,
    });

    await Student.create({
      user_id: user.id,
      roll_no,
      class: className,
      section,
      parent_name,
      parent_phone,
    });

    return reply.status(201).send({ 
      message: "Student created successfully", 
      student: {
        user_id: user.id,
        name: user.name,
        phone: user.phone,
        roll_no,
        class: className,
        section,
        parent_name,
        parent_phone
      }
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to create student" });
  }
};

export const getAllStudentsController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { page = 1, limit = 10, search, class: className, section, is_active } = req.query as any;

    const offset = (Number(page) - 1) * Number(limit);

    const whereUser: any = {};
    const whereStudent: any = {};

    // By default, only show active users
    whereUser.is_active = true;

    if (search) {
      whereUser.name = { [Op.like]: `%${search}%` };
    }

    if (className) {
      whereStudent.class = className;
    }

    if (section) {
      whereStudent.section = section;
    }

    if (is_active !== undefined) {
      whereUser.is_active = is_active === 'true';
    }

    const { count, rows: students } = await Student.findAndCountAll({
      where: whereStudent,
      include: [
        {
          model: User,
          as: "user",
          where: whereUser,
          attributes: ["id", "name", "phone", "is_active"],
        },
      ],
      limit: Number(limit),
      offset: offset,
      order: [["class", "ASC"], ["section", "ASC"], ["roll_no", "ASC"]],
    });

    return reply.status(200).send({ 
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      },
      students
    });
  } catch (error: any) {
    console.error("Error in getAllStudentsController:", error);
    return reply.status(500).send({ 
      error: "Failed to fetch students",
      details: error.message 
    });
  }
};

export const updateStudentController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { student_id } = req.params as any;
    const { name, phone, roll_no, class: className, section, parent_name, parent_phone, is_active } = req.body as any;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return reply.status(404).send({ error: "Student not found" });
    }

    const user = await User.findByPk(student.get("user_id") as string);
    if (user) {
      await user.update({ name, phone, is_active });
    }

    await student.update({ roll_no, class: className, section, parent_name, parent_phone });

    return reply.status(200).send({ message: "Student updated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to update student" });
  }
};

export const deleteStudentController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { student_id } = req.params as any;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return reply.status(404).send({ error: "Student not found" });
    }

    const user = await User.findByPk(student.get("user_id") as string);
    if (user) {
      await user.update({ is_active: false });
    }

    return reply.status(200).send({ message: "Student deactivated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to delete student" });
  }
};
