import { User, Student, Teacher, Admin } from "../models";
import { sequelize } from "../db/connection";

export const createUserWithRole = async (data: any) => {
  const t = await sequelize.transaction();

  try {
    // Create user
    const user = await User.create(
      {
        name: data.name,
        phone: data.phone,
        password: data.password,
        role_id: data.role_id,
        client_id: data.client_id,
      },
      { transaction: t }
    );

    // Role wise entry
    if (data.role_name === "student") {
      await Student.create(
        {
          user_id: user.id,
          class: data.class,
          section: data.section,
          parent_name: data.parent_name,
          parent_phone: data.parent_phone,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "teacher") {
      await Teacher.create(
        {
          user_id: user.id,
          subject: data.subject,
          qualification: data.qualification,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "admin") {
      await Admin.create(
        {
          user_id: user.id,
          designation: data.designation,
        },
        { transaction: t }
      );
    }

    await t.commit();
    return user;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const findUserByPhone = async (phone: string) => {
  return User.findOne({ where: { phone } });
};
