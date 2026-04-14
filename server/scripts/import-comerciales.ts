/**
 * Efizientia SaaS · server/scripts/import-comerciales.ts
 * Importación masiva de comerciales desde CSV.
 *
 * Uso:
 *   pnpm import                          (usa server/scripts/comerciales.csv por defecto)
 *   pnpm import -- --csv path/otro.csv   (CSV alternativo)
 *   pnpm import -- --dry-run             (simula sin escribir en DB ni enviar emails)
 *
 * El proceso es idempotente: re-ejecutar el script actualiza sin duplicar.
 *
 * Columnas del CSV (separador ;):
 *   [0]  name          — primer nombre / nombre corto
 *   [1]  slug          — URL slug (se normaliza automáticamente)
 *   [6]  fullname      — nombre público completo
 *   [8]  telefono_movil1 — teléfono y whatsapp
 *   [10] email1        — email principal
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import wasmSqlite from "node-sqlite3-wasm";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Database = (wasmSqlite as any).Database as new (path: string) => any;
import { initSchema } from "../db/schema.js";
import { config } from "../config.js";
import type { AdvisorProfileRow, UserRow, InvitationRow } from "../db/types.js";

// ─── Configuración ───────────────────────────────────────────────────────────

const CSV_PATH = (() => {
  const idx = process.argv.indexOf("--csv");
  return idx !== -1 && process.argv[idx + 1]
    ? path.resolve(process.cwd(), process.argv[idx + 1])
    : path.resolve(process.cwd(), "server/scripts/comerciales.csv");
})();

const DRY_RUN = process.argv.includes("--dry-run");
const DB_PATH_RAW = process.env.DB_PATH ?? "server/data/efizientia.db";
const DB_PATH = path.isAbsolute(DB_PATH_RAW)
  ? DB_PATH_RAW
  : path.resolve(process.cwd(), DB_PATH_RAW);

// ─── DB setup (igual que seed-admin.ts) ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchDb(rawDb: any): any {
  const origPrepare = rawDb.prepare.bind(rawDb);
  rawDb.prepare = (sql: string) => {
    const stmt = origPrepare(sql);
    const oRun = stmt.run.bind(stmt);
    const oGet = stmt.get.bind(stmt);
    const oAll = stmt.all.bind(stmt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.run = (...args: any[]) => oRun(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.get = (...args: any[]) => oGet(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.all = (...args: any[]) => oAll(args);
    return stmt;
  };
  return rawDb;
}

// Stale lock cleanup (copiado de db/index.ts)
const lockPath = `${DB_PATH}.lock`;
if (fs.existsSync(lockPath)) {
  try { fs.rmSync(lockPath, { recursive: true, force: true }); } catch { /* ignore */ }
}

const _raw = new Database(DB_PATH);
const db = patchDb(_raw);
db.exec("PRAGMA busy_timeout = 10000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
initSchema(db);

// ─── Email (igual que admin.ts) ──────────────────────────────────────────────

async function sendInvitationEmail(email: string, token: string, profileName: string): Promise<void> {
  const link = `${config.APP_URL}/invitation/accept/${token}`;

  if (!config.SMTP_HOST) {
    console.log(`  📧 [EMAIL-SKIP] No SMTP configurado. Enlace manual para ${email}:\n     ${link}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
  });

  const firstName = profileName.split(" ")[0];

  await transporter.sendMail({
    from: config.SMTP_FROM,
    to: email,
    subject: `${firstName}, activa tu acceso al panel de Efizientia`,
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <img src="${config.APP_URL}/images/efizientia-logo-dark_f1c2a2ee.png"
               alt="Efizientia" height="36" style="display:block;height:36px;object-fit:contain;" />
        </td></tr>
        <tr><td style="background:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);
                        box-shadow:0 0 60px rgba(233,30,140,0.10);padding:40px 36px;">
          <p style="margin:0 0 20px;text-align:center;">
            <span style="display:inline-block;background:rgba(233,30,140,0.12);
                         border:1px solid rgba(233,30,140,0.3);border-radius:20px;
                         color:#e91e8c;font-size:11px;font-weight:700;
                         letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;">
              Panel de Asesores · Efizientia
            </span>
          </p>
          <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
            Hola, ${firstName} 👋
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.60);text-align:center;line-height:1.6;">
            El equipo de <strong style="color:#fff;">Efizientia</strong> te invita a gestionar
            tu ficha pública como asesor energético.<br>
            Activa tu cuenta en menos de un minuto.
          </p>
          <div style="height:1px;background:rgba(255,255,255,0.07);margin:0 0 28px;"></div>
          <p style="text-align:center;margin:0 0 24px;">
            <a href="${link}"
               style="display:inline-block;background:linear-gradient(135deg,#e91e8c,#c2166e);
                      color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;
                      padding:16px 40px;border-radius:12px;letter-spacing:0.02em;">
              Activar mi cuenta →
            </a>
          </p>
          <p style="margin:0 0 24px;font-size:12px;color:rgba(255,255,255,0.30);text-align:center;">
            O copia este enlace: <span style="color:#e91e8c;word-break:break-all;">${link}</span>
          </p>
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;">
            Este enlace expira en <strong style="color:rgba(255,255,255,0.40);">48 horas</strong>.
          </p>
        </td></tr>
        <tr><td align="center" style="padding-top:28px;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.20);">
            © ${new Date().getFullYear()} Efizientia · Asesoría Energética ·
            <a href="${config.APP_URL}" style="color:rgba(255,255,255,0.30);text-decoration:none;">efizientia.es</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normaliza slug: minúsculas, sin acentos, solo letras/números/guiones */
function normalizeSlug(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quitar diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")     // solo alfanumérico + espacios + guión
    .trim()
    .replace(/\s+/g, "-")             // espacios → guión
    .replace(/-+/g, "-")              // colapsar guiones múltiples
    .replace(/^-|-$/g, "");           // quitar guiones extremos
}

/** Valida un email de forma básica */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Genera bio genérica para asesores sin descripción */
function genericBio(displayName: string): string {
  const first = displayName.split(" ")[0];
  return `${first} es asesor energético especializado en la optimización de facturas de luz y gas. Ayuda a hogares y empresas a reducir su consumo energético y a encontrar las mejores tarifas del mercado. Contacta directamente para recibir un análisis gratuito de tu factura.`;
}

// ─── Parseo del CSV ───────────────────────────────────────────────────────────

interface CsvRow {
  rawSlug: string;
  slug: string;
  displayName: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}

function parseCsv(filePath: string): CsvRow[] {
  const raw = fs.readFileSync(filePath, "utf-8")
    .replace(/^\uFEFF/, "")           // strip BOM
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const lines = raw.split("\n").filter((l) => l.trim());
  const [_header, ...dataLines] = lines;

  const rows: CsvRow[] = [];

  for (const line of dataLines) {
    const cols = line.split(";");
    if (cols.length < 11) continue;

    const rawDisplayName = (cols[6] ?? cols[0] ?? "").trim();
    const rawSlug        = (cols[1] ?? "").trim();
    const rawPhone       = (cols[8] ?? "").trim();
    const rawEmail       = (cols[10] ?? "").trim();

    if (!rawDisplayName || !rawSlug) continue;

    const slug = normalizeSlug(rawSlug);
    if (!slug) continue;

    rows.push({
      rawSlug,
      slug,
      displayName: rawDisplayName,
      phone:    rawPhone || null,
      whatsapp: rawPhone || null,     // usamos el mismo número como whatsapp
      email:    rawEmail && isValidEmail(rawEmail) ? rawEmail.toLowerCase() : null,
    });
  }

  return rows;
}

// ─── Contadores de log ────────────────────────────────────────────────────────

const log = {
  rowsProcessed:    0,
  profilesCreated:  0,
  profilesUpdated:  0,
  usersCreated:     0,
  usersReused:      0,
  usersSetInactive: 0,
  invitesSent:      0,
  invitesSkipped:   0,
  noEmail:          0,
  errors:           [] as string[],
  slugConflicts:    [] as string[],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Efizientia · Import Comerciales");
  console.log(`  CSV:     ${CSV_PATH}`);
  console.log(`  DB:      ${DB_PATH}`);
  console.log(`  DRY-RUN: ${DRY_RUN}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV no encontrado: ${CSV_PATH}`);
    process.exit(1);
  }

  const rows = parseCsv(CSV_PATH);
  console.log(`📄 Filas válidas en CSV: ${rows.length}\n`);

  // Detectar slugs duplicados en el propio CSV
  const csvSlugs = new Map<string, number>();
  for (const row of rows) {
    csvSlugs.set(row.slug, (csvSlugs.get(row.slug) ?? 0) + 1);
  }

  for (const row of rows) {
    log.rowsProcessed++;
    const prefix = `[${String(log.rowsProcessed).padStart(3, "0")}] ${row.displayName}`;

    try {
      // ── Comprobar slug duplicado en CSV ──────────────────────────────
      if ((csvSlugs.get(row.slug) ?? 0) > 1) {
        // Si el mismo slug aparece más de una vez, saltar los duplicados tras el primero
        csvSlugs.set(row.slug, -1); // marcar como "ya procesado el primero"
        // (Esta lógica permite procesar el primero y avisar en los siguientes)
      }

      // ── 1. Upsert advisor_profile ────────────────────────────────────
      const existingProfile = db
        .prepare("SELECT * FROM advisor_profiles WHERE slug = ? LIMIT 1")
        .get(row.slug) as AdvisorProfileRow | undefined;

      const aboutText = genericBio(row.displayName);

      if (!existingProfile) {
        if (!DRY_RUN) {
          db.prepare(`
            INSERT INTO advisor_profiles
              (slug, display_name, phone, whatsapp, public_email, about_text, is_active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
          `).run(
            row.slug, row.displayName,
            row.phone, row.whatsapp, row.email,
            aboutText,
          );
        }
        log.profilesCreated++;
        console.log(`${prefix} — ✅ Ficha CREADA (/humanos/${row.slug})`);
      } else {
        if (!DRY_RUN) {
          db.prepare(`
            UPDATE advisor_profiles SET
              display_name  = ?,
              phone         = COALESCE(?, phone),
              whatsapp      = COALESCE(?, whatsapp),
              public_email  = COALESCE(?, public_email),
              about_text    = COALESCE(about_text, ?),
              updated_at    = datetime('now')
            WHERE slug = ?
          `).run(
            row.displayName,
            row.phone, row.whatsapp, row.email,
            aboutText,
            row.slug,
          );
        }
        log.profilesUpdated++;
        console.log(`${prefix} — 🔄 Ficha ACTUALIZADA (/humanos/${row.slug})`);
      }

      // Obtener profile.id actualizado
      const profile = db
        .prepare("SELECT id FROM advisor_profiles WHERE slug = ? LIMIT 1")
        .get(row.slug) as { id: number } | undefined;

      // ── 2. Usuario ───────────────────────────────────────────────────
      if (!row.email) {
        log.noEmail++;
        console.log(`${prefix} — ⚠️  Sin email válido — no se crea usuario`);
        continue;
      }

      const existingUser = db
        .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
        .get(row.email) as UserRow | undefined;

      let userId: number;

      if (!existingUser) {
        if (!DRY_RUN) {
          db.prepare(`
            INSERT INTO users (email, name, role, status)
            VALUES (?, ?, 'comercial', 'inactive')
          `).run(row.email, row.displayName);
          const newUser = db
            .prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
            .get(row.email) as { id: number };
          userId = newUser.id;

          // Vincular perfil al usuario
          if (profile) {
            db.prepare(
              "UPDATE advisor_profiles SET user_id = ?, updated_at = datetime('now') WHERE id = ?"
            ).run(userId, profile.id);
          }
        } else {
          userId = -1;
        }
        log.usersCreated++;
        console.log(`${prefix} — 👤 Usuario CREADO (inactive)`);
      } else {
        userId = existingUser.id;

        // Forzar inactive
        if (!DRY_RUN) {
          db.prepare(
            "UPDATE users SET status = 'inactive', name = ?, updated_at = datetime('now') WHERE id = ?"
          ).run(row.displayName, userId);

          // Vincular perfil si aún no está vinculado
          if (profile) {
            const linked = db
              .prepare("SELECT id FROM advisor_profiles WHERE id = ? AND user_id IS NULL LIMIT 1")
              .get(profile.id) as { id: number } | undefined;
            if (linked) {
              db.prepare(
                "UPDATE advisor_profiles SET user_id = ?, updated_at = datetime('now') WHERE id = ?"
              ).run(userId, profile.id);
            }
          }
        }
        log.usersReused++;
        console.log(`${prefix} — 🔁 Usuario REUTILIZADO (→ inactive)`);
      }
      log.usersSetInactive++;

      // ── 3. Invitación ────────────────────────────────────────────────
      if (DRY_RUN) {
        log.invitesSent++;
        console.log(`${prefix} — 📧 [DRY] Invitación se enviaría a ${row.email}`);
        continue;
      }

      // ¿Ya tiene invitación pendiente (sin usar y no expirada)?
      const pendingInvite = db
        .prepare(`
          SELECT id FROM invitations
          WHERE email = ? AND used_at IS NULL AND expires_at > datetime('now')
          LIMIT 1
        `)
        .get(row.email) as { id: number } | undefined;

      // ¿El usuario ya activó su cuenta (password_hash real)?
      const userFull = db
        .prepare("SELECT password_hash, status FROM users WHERE email = ? LIMIT 1")
        .get(row.email) as { password_hash: string; status: string } | undefined;

      const alreadyActivated = userFull?.password_hash && userFull.password_hash !== "";

      if (pendingInvite) {
        log.invitesSkipped++;
        console.log(`${prefix} — ⏭️  Invitación ya pendiente — omitida`);
        continue;
      }

      if (alreadyActivated) {
        log.invitesSkipped++;
        console.log(`${prefix} — ⏭️  Usuario ya activó cuenta — invitación omitida`);
        continue;
      }

      // Invalidar invitaciones antiguas de este email
      db.prepare(
        "UPDATE invitations SET used_at = datetime('now') WHERE email = ? AND used_at IS NULL"
      ).run(row.email);

      const token = nanoid(32);
      const expires = new Date(Date.now() + 48 * 3_600_000).toISOString();
      db.prepare(`
        INSERT INTO invitations (token, email, profile_id, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(token, row.email, profile?.id ?? null, expires);

      try {
        await sendInvitationEmail(row.email, token, row.displayName);
        log.invitesSent++;
        console.log(`${prefix} — 📧 Invitación enviada a ${row.email}`);
      } catch (emailErr) {
        const link = `${config.APP_URL}/invitation/accept/${token}`;
        log.invitesSent++;
        console.log(`${prefix} — 📧 Email falló. Enlace: ${link}`);
        console.error(`   └─ Error SMTP:`, (emailErr as Error).message);
      }

    } catch (err) {
      const msg = `Fila ${log.rowsProcessed} (${row.displayName}): ${(err as Error).message}`;
      log.errors.push(msg);
      console.error(`${prefix} — ❌ ERROR: ${(err as Error).message}`);
    }
  }

  // ─── Resumen final ────────────────────────────────────────────────────────

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  RESUMEN FINAL DE IMPORTACIÓN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Filas procesadas:           ${log.rowsProcessed}`);
  console.log(`  Fichas creadas:             ${log.profilesCreated}`);
  console.log(`  Fichas actualizadas:        ${log.profilesUpdated}`);
  console.log(`  Usuarios creados:           ${log.usersCreated}`);
  console.log(`  Usuarios reutilizados:      ${log.usersReused}`);
  console.log(`  Usuarios → inactive:        ${log.usersSetInactive}`);
  console.log(`  Sin email (sin usuario):    ${log.noEmail}`);
  console.log(`  Invitaciones enviadas:      ${log.invitesSent}`);
  console.log(`  Invitaciones omitidas:      ${log.invitesSkipped}`);
  if (log.errors.length > 0) {
    console.log(`\n  ❌ ERRORES (${log.errors.length}):`);
    log.errors.forEach((e) => console.log(`     • ${e}`));
  } else {
    console.log(`\n  ✅ Sin errores`);
  }
  if (DRY_RUN) {
    console.log("\n  ⚠️  DRY-RUN activo — ningún cambio fue guardado");
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  db.close();
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
