import { User, Student, Teacher, Admin } from "../models";
import { sequelize } from "../db/connection";

export const createUserWithRole = async (data: any) => {
  const t = await sequelize.transaction();

  try {
    // Create user
    const user = await User.create(
      {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        phone: data.phone,
        password: data.password,
        role_id: data.role_id,
        role_name: data.role_name,
        client_id: data.client_id,
        profile_image: data.profile_image,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
      },
      { transaction: t }
    );

    // Role wise entry
    if (data.role_name === "student") {
      await Student.create(
        {
          user_id: user.id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          class: data.class,
          section: data.section,
          parent_name: data.parent_name,
          parent_phone: data.parent_phone,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          address: data.address,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "teacher") {
      await Teacher.create(
        {
          user_id: user.id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          subject: data.subject,
          qualification: data.qualification,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          address: data.address,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "admin") {
      await Admin.create(
        {
          user_id: user.id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          designation: data.designation,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          address: data.address,
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
