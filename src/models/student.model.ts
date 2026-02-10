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
    roll_no: DataTypes.STRING,
    class: DataTypes.STRING,
    section: DataTypes.STRING,
    parent_name: DataTypes.STRING,
    parent_phone: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);
