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
  public is_active!: boolean;
  public profile_image!: string;
  public date_of_birth!: Date;
  public gender!: 'male' | 'female' | 'other';
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
      allowNull: true,  // Temporarily allow null
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,  // Temporarily allow null
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,  // Temporarily allow null
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
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
