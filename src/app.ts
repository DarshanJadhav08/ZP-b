import Fastify from "fastify";
import { sequelize, connectDB } from "./db/connection";

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

app.addHook("onReady", async () => {
  try {
    await connectDB();
    await sequelize.sync();
    app.log.info("Database connected and models synced");
  } catch (error) {
    app.log.error("Database initialization failed");
    app.log.error(error);
    process.exit(1);
  }
});

app.addHook("onRequest", async (request) => {
  request.log.info(
    {
      req: {
        method: request.method,
        url: request.url,
        hostname: request.hostname,
        remoteAddress: request.ip
      }
    },
    "Incoming request"
  );
});

app.addHook("onResponse", async (request, reply) => {
  request.log.info(
    {
      res: {
        statusCode: reply.statusCode
      },
      responseTime: reply.elapsedTime
    },
    "Request completed"
  );
});

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
