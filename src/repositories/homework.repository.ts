import { Homework } from "../models/homework.model";
import { Teacher } from "../models/teacher.model";

export const createHomeworkRepo = async (homeworkData: any) => {
  return await Homework.create(homeworkData);
};

export const findHomeworkByClassAndDateRepo = async (className: string, date: string, subjectName: string) => {
  return await Homework.findOne({
    where: {
      class_name: className,
      subject_name: subjectName,
      homework_date: date,
    },
  });
};

export const findTeacherByIdRepo = async (teacherId: string) => {
  return await Teacher.findByPk(teacherId);
};

export const findTeacherByUserIdRepo = async (userId: string) => {
  return await Teacher.findOne({ where: { user_id: userId } });
};

export const findHomeworkByTeacherRepo = async (teacherId: string, filters: any) => {
  const { page = 1, limit = 10, date, className } = filters;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = { teacher_id: teacherId };
  if (date) where.homework_date = date;
  if (className) where.class_name = className;

  return await Homework.findAndCountAll({
    where,
    include: [
      { model: Teacher, as: "teacher", attributes: ["id", "first_name", "last_name"] },
    ],
    limit: Number(limit),
    offset,
    order: [["homework_date", "DESC"]],
  });
};

export const findHomeworkByClassRepo = async (className: string, date: string) => {
  return await Homework.findAll({
    where: {
      class_name: className,
      homework_date: date,
    },
    include: [
      { model: Teacher, as: "teacher", attributes: ["id", "first_name", "last_name"] },
    ],
  });
};

export const findAllHomeworkRepo = async (filters: any) => {
  const { page = 1, limit = 10, date, className, teacherId, clientId } = filters;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (date) where.homework_date = date;
  if (className) where.class_name = className;
  if (teacherId) where.teacher_id = teacherId;
  if (clientId) where.client_id = clientId;

  return await Homework.findAndCountAll({
    where,
    include: [
      { model: Teacher, as: "teacher", attributes: ["id", "first_name", "last_name"] },
    ],
    limit: Number(limit),
    offset,
    order: [["homework_date", "DESC"]],
  });
};

export const updateHomeworkRepo = async (homeworkId: string, updateData: any) => {
  const homework = await Homework.findByPk(homeworkId);
  if (!homework) return null;
  await homework.update(updateData);
  return homework;
};

export const deleteHomeworkRepo = async (homeworkId: string) => {
  const homework = await Homework.findByPk(homeworkId);
  if (!homework) return null;
  await homework.destroy();
  return homework;
};
