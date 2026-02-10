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
    subject: DataTypes.STRING,
    qualification: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "teachers",
    timestamps: false,
  }
);
