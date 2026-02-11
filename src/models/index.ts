import { sequelize } from "../db/connection";
import { User } from "./users.model";
import { Role } from "./role.model";
import { Client } from "./client.model";
import { Student } from "./student.model";
import { Teacher } from "./teacher.modle";
import { Admin } from "./admin.model";

User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Client, { foreignKey: "client_id" });

Student.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });
Teacher.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });
Admin.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });

export {
  sequelize,
  User,
  Role,
  Client,
  Student,
  Teacher,
  Admin,
};
