import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connection";
import { IUser, IUserCreation } from "../interface/user.interface";

export class User
  extends Model<IUser, IUserCreation>
  implements IUser
{
  public id!: string;
  public first_name!: string;
  public middle_name!: string;
  public last_name!: string;
  public phone!: string;
  public password!: string;
  public role_id!: string;
  public role_name!: string;
  public client_id!: string;
  public created_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: true,
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
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
