import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { randomUUID } from "node:crypto";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { prisma } from "./db/prisma";
import { globalLimiter } from "./middleware/rateLimit";
import { errorHandler, notFound } from "./middleware/errors";

import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicles/vehicles.routes";
import contactRoutes from "./modules/contact/contact.routes";
import applicationRoutes from "./modules/applications/applications.routes";
import adminRoutes from "./modules/admin/admin.routes";

export const app = express();

app.disable("x-powered-by");

// Request correlation ID
app.use((req, _res, next) => {
  req.requestId = randomUUID();
  next();
});

// Structured request logging
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.requestId ?? randomUUID(),
  })
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by reverse proxy or Next.js
  })
);

// CORS configuration
app.use(
  cors({
    origin: [env.WEB_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsing & rate limiting
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use("/api", globalLimiter);

// Liveness probe
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "zakaria-auto-group-api",
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe
app.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json({ status: "ready", database: "connected" });
  } catch {
    res.status(503).json({ status: "unavailable", database: "disconnected" });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Catch-all & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);
