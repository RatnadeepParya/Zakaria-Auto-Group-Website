import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  COOKIE_SECRET: z.string().default("zakaria_cookie_secret_at_least_32_chars_long!"),
  COOKIE_NAME: z.string().default("zakaria_session"),
  COOKIE_SECURE: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(false),
  FIELD_ENCRYPTION_KEY: z.string().length(64, "FIELD_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)").default(
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  ),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@zakariaautogroup.com"),
  SEED_ADMIN_PASSWORD: z.string().default("AdminZakaria2026!"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(" Invalid environment configuration:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
