import {
  createHomeworkRepo,
  findHomeworkByClassAndDateRepo,
  findTeacherByUserIdRepo,
  findHomeworkByTeacherRepo,
  findHomeworkByClassRepo,
  findAllHomeworkRepo,
  updateHomeworkRepo,
  deleteHomeworkRepo,
} from "../repositories/homework.repository";

export const addHomeworkService = async (homeworkData: any, userId: string, userIdForCreatedBy: string, userRole?: string) => {
  const { class_name, subject_name, homework_text, homework_date, attachment_url, client_id } = homeworkData;

  // Find teacher by user_id
  const teacher = await findTeacherByUserIdRepo(userId);
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  // Check for duplicate homework
  const existing = await findHomeworkByClassAndDateRepo(class_name, homework_date, subject_name);
  if (existing) {
    throw new Error("Homework already exists for this class, subject and date");
  }

  const homework = await createHomeworkRepo({
    teacher_id: teacher.get('id'),
    class_name,
    subject_name,
    client_id,
    homework_text,
    homework_date,
    attachment_url,
    created_by: userIdForCreatedBy,
  });

  return homework;
};

export const getTeacherHomeworkService = async (userId: string, filters: any) => {
  // Find teacher by user_id
  const teacher = await findTeacherByUserIdRepo(userId);
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  const { count, rows: homework } = await findHomeworkByTeacherRepo(teacher.get('id') as string, filters);

  return {
    pagination: {
      total: count,
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 10),
      totalPages: Math.ceil(count / Number(filters.limit || 10)),
    },
    homework,
  };
};

export const getStudentHomeworkService = async (className: string, date: string) => {
  const homework = await findHomeworkByClassRepo(className, date);
  return homework;
};

export const getAllHomeworkService = async (filters: any) => {
  const { count, rows: homework } = await findAllHomeworkRepo(filters);

  return {
    pagination: {
      total: count,
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 10),
      totalPages: Math.ceil(count / Number(filters.limit || 10)),
    },
    homework,
  };
};

export const updateHomeworkService = async (homeworkId: string, updateData: any, userId: string) => {
  const homework = await updateHomeworkRepo(homeworkId, { ...updateData, updated_by: userId });
  if (!homework) {
    throw new Error("Homework not found");
  }
  return homework;
};

export const deleteHomeworkService = async (homeworkId: string) => {
  const homework = await deleteHomeworkRepo(homeworkId);
  if (!homework) {
    throw new Error("Homework not found");
  }
  return { message: "Homework deleted successfully" };
};
