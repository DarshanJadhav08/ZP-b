import { FastifyRequest, FastifyReply } from "fastify";
import {
  addTeacherService,
  getAllTeachersService,
  updateTeacherService,
  deleteTeacherService,
} from "../services/teacher.service";

export const addTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const teacherData = { ...body, client_id };
    const teacher = await addTeacherService(teacherData);
    return reply.status(201).send({
      message: "Teacher added successfully",
      teacher,
    });
  } catch (error: any) {
    console.error("Error in addTeacherController:", error);
    return reply.status(500).send({
      error: "Failed to add teacher",
      details: error.message,
    });
  }
};

export const getAllTeachersController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const query = req.query as any;
    const filters = { ...query, client_id };
    const result = await getAllTeachersService(filters);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in getAllTeachersController:", error);
    return reply.status(500).send({
      error: "Failed to fetch teachers",
      details: error.message,
    });
  }
};

export const updateTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { teacher_id } = req.params as any;
    const result = await updateTeacherService(teacher_id, req.body);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in updateTeacherController:", error);
    return reply.status(500).send({
      error: "Failed to update teacher",
      details: error.message,
    });
  }
};

export const deleteTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { teacher_id } = req.params as any;
    const result = await deleteTeacherService(teacher_id);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in deleteTeacherController:", error);
    return reply.status(500).send({
      error: "Failed to delete teacher",
      details: error.message,
    });
  }
};
