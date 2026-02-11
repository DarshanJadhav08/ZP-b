import { FastifyRequest, FastifyReply } from "fastify";
import {
  addAdminService,
  getAllAdminsService,
  updateAdminService,
  deleteAdminService,
} from "../services/admin.service";

export const addAdminController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const body = req.body as any;
    const adminData = { ...body, client_id };
    const admin = await addAdminService(adminData);
    return reply.status(201).send({
      message: "Admin added successfully",
      admin,
    });
  } catch (error: any) {
    console.error("Error in addAdminController:", error);
    return reply.status(500).send({
      error: "Failed to add admin",
      details: error.message,
    });
  }
};

export const getAllAdminsController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { client_id } = req.params as any;
    const query = req.query as any;
    const filters = { ...query, client_id };
    const result = await getAllAdminsService(filters);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in getAllAdminsController:", error);
    return reply.status(500).send({
      error: "Failed to fetch admins",
      details: error.message,
    });
  }
};

export const updateAdminController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { admin_id } = req.params as any;
    const result = await updateAdminService(admin_id, req.body);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in updateAdminController:", error);
    return reply.status(500).send({
      error: "Failed to update admin",
      details: error.message,
    });
  }
};

export const deleteAdminController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { admin_id } = req.params as any;
    const result = await deleteAdminService(admin_id);
    return reply.status(200).send(result);
  } catch (error: any) {
    console.error("Error in deleteAdminController:", error);
    return reply.status(500).send({
      error: "Failed to delete admin",
      details: error.message,
    });
  }
};
