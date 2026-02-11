import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connection";

export class Teacher extends Model {}

Teacher.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: DataTypes.STRING,
    qualification: DataTypes.STRING,
    experience_years: DataTypes.INTEGER,
    joining_date: DataTypes.DATE,
    specialization: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.ENUM('male', 'female', 'other'),
    address: DataTypes.TEXT,
    blood_group: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "teachers",
    timestamps: false,
  }
);
