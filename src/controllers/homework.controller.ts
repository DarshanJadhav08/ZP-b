import { FastifyRequest, FastifyReply } from "fastify";
import {
  addHomeworkService,
  getTeacherHomeworkService,
  getStudentHomeworkService,
  getAllHomeworkService,
  updateHomeworkService,
  deleteHomeworkService,
} from "../services/homework.service";

// Teacher: Add Homework
export const addHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const userId = req.user?.user_id as string;
    const userRole = req.user?.role_name as string;

    const homeworkData = { ...body, client_id };
    const homework = await addHomeworkService(homeworkData, userId, userId, userRole);

    return reply.status(201).send({
      message: "Homework added successfully",
      homework,
    });
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to add homework",
      details: error.message,
    });
  }
};

// Teacher: Get My Homework
export const getMyHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = req.user?.user_id as string;
    const filters = req.query as any;

    const result = await getTeacherHomeworkService(userId, filters);
    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to fetch homework",
      details: error.message,
    });
  }
};

// Student: Get Today's Homework
export const getStudentHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { class_name, date } = req.query as any;

    if (!class_name || !date) {
      return reply.status(400).send({ error: "class_name and date are required" });
    }

    const homework = await getStudentHomeworkService(class_name, date);
    return reply.status(200).send({ homework });
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to fetch homework",
      details: error.message,
    });
  }
};

// Admin: Get All Homework
export const getAllHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const query = req.query as any;
    const filters = { ...query, client_id };

    const result = await getAllHomeworkService(filters);
    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to fetch homework",
      details: error.message,
    });
  }
};

// Update Homework
export const updateHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { homework_id } = req.params as any;
    const userId = req.user?.user_id as string;

    const homework = await updateHomeworkService(homework_id, req.body, userId);
    return reply.status(200).send({
      message: "Homework updated successfully",
      homework,
    });
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to update homework",
      details: error.message,
    });
  }
};

// Delete Homework
export const deleteHomeworkController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { homework_id } = req.params as any;

    const result = await deleteHomeworkService(homework_id);
    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Failed to delete homework",
      details: error.message,
    });
  }
};
