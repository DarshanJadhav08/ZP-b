import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connection";

export class Admin extends Model {}

Admin.init(
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
    designation: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "admins",
    timestamps: false,
  }
);
