import "dotenv/config";
import http from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { connectDatabase, disconnectDatabase } from "./db/prisma";

let isShuttingDown = false;

// Survived unhandled promise rejection without crashing the API process
process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection captured (process kept alive)");
});

// Uncaught exception handler: gracefully drain and let process supervisor (PM2 / Docker) restart
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception encountered; initiating graceful shutdown");
  initiateShutdown("uncaughtException", 1);
});

let server: http.Server;

function initiateShutdown(reason: string, exitCode = 0): void {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.warn({ reason }, "Graceful shutdown sequence commenced");

  const hardKillTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out (15s); forcing immediate exit");
    process.exit(1);
  }, 15000);
  hardKillTimer.unref();

  if (server) {
    server.close(async (err) => {
      clearTimeout(hardKillTimer);
      if (err) {
        logger.error({ err }, "Error while closing HTTP server");
      }
      await disconnectDatabase();
      logger.info("Graceful shutdown complete");
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

async function startServer(): Promise<void> {
  // Wait for PostgreSQL
  await connectDatabase();

  server = http.createServer(app);

  // Timeouts for resilience & slowloris defense
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;
  server.requestTimeout = 30_000;

  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => initiateShutdown(signal, 0));
  }

  server.listen(env.PORT, "0.0.0.0", () => {
    logger.info(
      { port: env.PORT, host: "0.0.0.0", environment: env.NODE_ENV },
      "Zakaria Auto Group API server is online and operational"
    );
  });
}

startServer().catch((err) => {
  logger.fatal({ err }, "Failed to start API server");
  process.exit(1);
});
