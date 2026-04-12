/**
 * Efizientia · server/index.ts
 * Servidor Express: sirve la app React en producción + API REST del SaaS.
 * Las rutas API se montan ANTES del wildcard catch-all del SPA.
 */

import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Importar DB primero (abre conexión y ejecuta schema)
import { db } from "./db/index.js";

// Routers
import authRouter from "./routes/auth.js";
import profilesRouter from "./routes/profiles.js";
import adminRouter from "./routes/admin.js";
import panelRouter from "./routes/panel.js";
import uploadRouter from "./routes/upload.js";

import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto-seed admin en producción si la tabla users está vacía
function autoSeedIfEmpty() {
  try {
    const count = (db.prepare("SELECT COUNT(*) as n FROM users").get() as { n: number })?.n ?? 0;
    if (count === 0 && config.ADMIN_EMAIL && config.ADMIN_PASSWORD) {
      // Importación dinámica para no cargar bcrypt en cada arranque
      import("bcryptjs").then(({ default: bcrypt }) => {
        const hash = bcrypt.hashSync(config.ADMIN_PASSWORD!, 12);
        db.prepare(
          "INSERT INTO users (email, password_hash, name, role, status) VALUES (?, ?, 'Administrador', 'admin', 'active')"
        ).run(config.ADMIN_EMAIL, hash);
        console.log(`[Seed] Admin creado: ${config.ADMIN_EMAIL}`);
      }).catch(console.error);
    }
  } catch {
    // Tabla aún no existe — initSchema la creará en el siguiente arranque
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ── Middlewares globales ──────────────────────────────────────────────────
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ── Archivos estáticos de uploads (avatares subidos por comerciales) ──────
  app.use("/uploads", express.static("server/uploads"));

  // ── API Routes (DEBEN ir antes del catch-all del SPA) ────────────────────
  app.use("/api/auth", authRouter);
  app.use("/api/profiles", profilesRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/panel", panelRouter);
  app.use("/api/upload", uploadRouter);

  // ── App estática React (producción) ──────────────────────────────────────
  const staticPath =
    config.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing — SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // ── Arrancar ──────────────────────────────────────────────────────────────
  server.listen(config.PORT, () => {
    console.log(`[Server] Running on http://localhost:${config.PORT}/ (${config.NODE_ENV})`);
    autoSeedIfEmpty();
  });
}

startServer().catch(console.error);
