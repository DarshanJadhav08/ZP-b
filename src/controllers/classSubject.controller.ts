import { FastifyRequest, FastifyReply } from "fastify";
import {
  createClassService,
  getAllClassesService,
  createSubjectService,
  getAllSubjectsService,
  assignTeacherService,
  getTeacherAssignmentsService,
} from "../services/classSubject.service";

export const createClassController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const userId = req.user?.user_id as string;

    const classData = { ...body, client_id };
    const newClass = await createClassService(classData, userId);

    return reply.status(201).send({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to create class", details: error.message });
  }
};

export const getAllClassesController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const classes = await getAllClassesService(client_id);
    return reply.status(200).send({ classes });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to fetch classes", details: error.message });
  }
};

export const createSubjectController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const userId = req.user?.user_id as string;

    const subjectData = { ...body, client_id };
    const subject = await createSubjectService(subjectData, userId);

    return reply.status(201).send({
      message: "Subject created successfully",
      subject,
    });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to create subject", details: error.message });
  }
};

export const getAllSubjectsController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const subjects = await getAllSubjectsService(client_id);
    return reply.status(200).send({ subjects });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to fetch subjects", details: error.message });
  }
};

export const assignTeacherController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const userId = req.user?.user_id as string;

    const assignmentData = { ...body, client_id };
    const assignment = await assignTeacherService(assignmentData, userId);

    return reply.status(201).send({
      message: "Teacher assigned successfully",
      assignment,
    });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to assign teacher", details: error.message });
  }
};

export const getMyAssignmentsController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const teacherId = req.user?.user_id as string;
    const assignments = await getTeacherAssignmentsService(teacherId);
    return reply.status(200).send({ assignments });
  } catch (error: any) {
    return reply.status(500).send({ error: "Failed to fetch assignments", details: error.message });
  }
};
