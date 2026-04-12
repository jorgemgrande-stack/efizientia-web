/**
 * Efizientia SaaS · server/config.ts
 * Centraliza todas las variables de entorno del servidor.
 * Leer desde .env en desarrollo (cargado por tsx) y variables de Railway en producción.
 */

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "4000", 10),
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret-change-in-production-please",
  DB_PATH: process.env.DB_PATH ?? "server/data/efizientia.db",
  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT ?? "587", 10),
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  SMTP_FROM: process.env.SMTP_FROM ?? "Efizientia <noreply@efizientia.es>",
  APP_URL: process.env.APP_URL ?? "http://localhost:3000",
} as const;
