import { sequelize } from "../db/connection";
import { User } from "./users.model";
import { Role } from "./role.model";
import { Client } from "./client.model";
import { Student } from "./student.model";
import { Teacher } from "./teacher.modle";
import { Admin } from "./admin.model";

// User relationships
User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Client, { foreignKey: "client_id" });

// Student relationships
Student.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });
Student.belongsTo(Client, { foreignKey: "client_id", as: "client" });

// Teacher relationships
Teacher.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });
Teacher.belongsTo(Client, { foreignKey: "client_id", as: "client" });

// Admin relationships
Admin.belongsTo(User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE" });
Admin.belongsTo(Client, { foreignKey: "client_id", as: "client" });

export {
  sequelize,
  User,
  Role,
  Client,
  Student,
  Teacher,
  Admin,
};
