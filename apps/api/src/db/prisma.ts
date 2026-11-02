import { PrismaClient } from "@prisma/client";
import { logger } from "../lib/logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("error" as any, (e: any) => {
  logger.error({ err: e }, "Prisma Database Error");
});

prisma.$on("warn" as any, (e: any) => {
  logger.warn({ warning: e }, "Prisma Database Warning");
});

export async function connectDatabase(maxRetries = 10, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      await prisma.$executeRawUnsafe("SELECT 1");
      logger.info({ attempt }, "PostgreSQL connection established successfully");
      return;
    } catch (error) {
      logger.warn(
        { attempt, maxRetries, err: error instanceof Error ? error.message : String(error) },
        "PostgreSQL connection attempt failed; retrying..."
      );
      if (attempt === maxRetries) {
        logger.fatal({ err: error }, "Failed to connect to PostgreSQL after maximum retries");
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("PostgreSQL connection pool disconnected cleanly");
  } catch (error) {
    logger.error({ err: error }, "Error while disconnecting PostgreSQL");
  }
}
