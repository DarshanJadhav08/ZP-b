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
      },
      { transaction: t }
    );

    // Role wise entry
    if (data.role_name === "student") {
      await Student.create(
        {
          user_id: user.id,
          client_id: data.client_id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          parent_name: data.parent_name,
          mobile_number: data.mobile_number,
          gender: data.gender,
          profile_image_url: data.profile_image_url,
          aadhar_number: data.aadhar_number,
          standard: data.standard,
          division: data.division,
          admission_date: data.admission_date,
          address: data.address,
          category: data.category,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "teacher") {
      await Teacher.create(
        {
          user_id: user.id,
          client_id: data.client_id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          profile_image_url: data.profile_image_url,
          mobile_number: data.mobile_number,
          designation: data.designation,
          qualification: data.qualification,
          joining_date: data.joining_date,
          experience_years: data.experience_years,
          is_class_teacher: data.is_class_teacher,
          assigned_standard: data.assigned_standard,
          assigned_division: data.assigned_division,
        },
        { transaction: t }
      );
    }

    if (data.role_name === "admin") {
      await Admin.create(
        {
          user_id: user.id,
          client_id: data.client_id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          designation: data.admin_designation,
          mobile_number: data.mobile_number,
          profile_image_url: data.profile_image_url,
          qualification: data.admin_qualification,
          date_of_birth: data.admin_date_of_birth,
          experience: data.admin_experience,
          gender: data.admin_gender,
        },
        { transaction: t }
      );
    }

    await t.commit();
    return user;
  } catch (error: any) {
    await t.rollback();
    
    // Handle duplicate aadhar number
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields?.aadhar_number) {
        const customError: any = new Error("Aadhar number already exists");
        customError.statusCode = 409;
        throw customError;
      }
    }
    
    throw error;
  }
};

export const findUserByPhone = async (phone: string) => {
  return User.findOne({ where: { phone } });
};
