import app from "./app";

const start = async () => {
  try {
    await app.listen({
      port: 8803,
      host: "0.0.0.0"
    });

    app.log.info("Server is running on http://localhost:8803");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
