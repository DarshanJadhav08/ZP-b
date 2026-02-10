import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connection";

export class Student extends Model {}

Student.init(
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
    roll_no: DataTypes.STRING,
    class: DataTypes.STRING,
    section: DataTypes.STRING,
    parent_name: DataTypes.STRING,
    parent_phone: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.ENUM('male', 'female', 'other'),
    address: DataTypes.TEXT,
    admission_date: DataTypes.DATE,
    blood_group: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);
