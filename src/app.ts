import Fastify from "fastify";
import { sequelize, connectDB } from "./db/connection";
import "./models";
import routes from "./routes";

const app = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname"
      }
    }
  }
});

// DB connect
app.addHook("onReady", async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    app.log.info("Database connected and models synced");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
});

// Register all routes
app.register(routes);

// Test routes
app.get("/", async () => {
  return { message: "ZP SCHOOL server is running" };
});

app.get("/health", async () => {
  try {
    await sequelize.authenticate();
    return { status: "OK", database: "connected" };
  } catch {
    return { status: "ERROR", database: "disconnected" };
  }
});

export default app;
