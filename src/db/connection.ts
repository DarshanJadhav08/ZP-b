import { Sequelize } from "sequelize";
import { config } from "../config/env";

export const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false
  }
);

export const connectDB = async () => {
  await sequelize.authenticate();
};
