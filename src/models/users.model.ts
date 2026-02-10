import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connection";
import { IUser, IUserCreation } from "../interface/user.interface";

export class User
  extends Model<IUser, IUserCreation>
  implements IUser
{
  public id!: string;
  public name!: string;
  public phone!: string;
  public password!: string;
  public role_id!: string;
  public client_id!: string;
  public is_active!: boolean;
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
    name: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
