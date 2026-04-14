/**
 * Efizientia SaaS · server/routes/admin.ts
 * Solo accesible para role === 'admin'.
 *
 * GET    /api/admin/comerciales             — lista de todos los perfiles + usuario vinculado
 * POST   /api/admin/comerciales             — crear nuevo perfil de comercial
 * GET    /api/admin/comerciales/:id         — detalle de un comercial
 * PUT    /api/admin/comerciales/:id         — editar cualquier campo de un comercial
 * DELETE /api/admin/comerciales/:id         — desactivar o borrar comercial
 * POST   /api/admin/comerciales/:id/invite  — enviar/reenviar invitación por email
 * GET    /api/admin/users                   — lista de usuarios del sistema
 * PUT    /api/admin/users/:id/status        — activar/desactivar usuario
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
import { db } from "../db/index.js";
import { requireAdmin } from "../middleware/auth.js";
import { serializeProfile } from "./profiles.js";
import { config } from "../config.js";
import type { AdvisorProfileRow, UserRow } from "../db/types.js";

const router = Router();
router.use(requireAdmin);

// ─── Helpers ────────────────────────────────────────────────────────────────

function getProfileWithUser(id: number) {
  return db.prepare(`
    SELECT ap.*, u.email AS user_email, u.name AS user_name,
           u.status AS user_status, u.role AS user_role,
           u.last_login_at AS user_last_login
    FROM advisor_profiles ap
    LEFT JOIN users u ON u.id = ap.user_id
    WHERE ap.id = ?
    LIMIT 1
  `).get(id) as (AdvisorProfileRow & {
    user_email: string | null;
    user_name: string | null;
    user_status: string | null;
    user_role: string | null;
    user_last_login: string | null;
  }) | undefined;
}

async function sendInvitationEmail(email: string, token: string, profileName: string) {
  const link = `${config.APP_URL}/invitation/accept/${token}`;

  if (!config.SMTP_HOST) {
    console.log(`\n[INVITACIÓN] Enlace para ${email}:\n${link}\n`);
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

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:32px;">
          <img src="${config.APP_URL}/images/efizientia-logo-dark_f1c2a2ee.png"
               alt="Efizientia" height="36"
               style="display:block;height:36px;object-fit:contain;" />
        </td></tr>

        <!-- Card principal -->
        <tr><td style="background:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);
                        box-shadow:0 0 60px rgba(233,30,140,0.10);padding:40px 36px;">

          <!-- Badge -->
          <p style="margin:0 0 20px;text-align:center;">
            <span style="display:inline-block;background:rgba(233,30,140,0.12);
                         border:1px solid rgba(233,30,140,0.3);border-radius:20px;
                         color:#e91e8c;font-size:11px;font-weight:700;
                         letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;">
              Panel de Asesores · Efizientia
            </span>
          </p>

          <!-- Título -->
          <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
            Hola, ${firstName} 👋
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.60);text-align:center;line-height:1.6;">
            El equipo de <strong style="color:#fff;">Efizientia</strong> te invita a gestionar
            tu ficha pública como asesor energético.<br>
            Activa tu cuenta en menos de un minuto.
          </p>

          <!-- Separador -->
          <div style="height:1px;background:rgba(255,255,255,0.07);margin:0 0 28px;"></div>

          <!-- Qué vas a poder hacer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="padding:8px 0;color:rgba(255,255,255,0.55);font-size:13px;">
                <span style="color:#e91e8c;font-weight:700;margin-right:8px;">✦</span>
                Editar tu ficha pública y foto de perfil
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(255,255,255,0.55);font-size:13px;">
                <span style="color:#e91e8c;font-weight:700;margin-right:8px;">✦</span>
                Configurar tu widget de análisis de facturas
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(255,255,255,0.55);font-size:13px;">
                <span style="color:#e91e8c;font-weight:700;margin-right:8px;">✦</span>
                Gestionar tus clientes y usuarios asignados
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <p style="text-align:center;margin:0 0 24px;">
            <a href="${link}"
               style="display:inline-block;background:linear-gradient(135deg,#e91e8c,#c2166e);
                      color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;
                      padding:16px 40px;border-radius:12px;letter-spacing:0.02em;">
              Activar mi cuenta →
            </a>
          </p>

          <!-- Link alternativo -->
          <p style="margin:0 0 24px;font-size:12px;color:rgba(255,255,255,0.30);text-align:center;">
            O copia este enlace en tu navegador:<br>
            <span style="color:#e91e8c;word-break:break-all;">${link}</span>
          </p>

          <!-- Separador -->
          <div style="height:1px;background:rgba(255,255,255,0.07);margin:0 0 20px;"></div>

          <!-- Aviso expiración -->
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;line-height:1.6;">
            Este enlace expira en <strong style="color:rgba(255,255,255,0.40);">48 horas</strong>.
            Si no esperabas este email, puedes ignorarlo.
          </p>
        </td></tr>

        <!-- Footer -->
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

// ─── Rutas de Comerciales ────────────────────────────────────────────────────

// GET /api/admin/comerciales
router.get("/comerciales", (_req, res) => {
  const rows = db.prepare(`
    SELECT ap.*, u.email AS user_email, u.name AS user_name,
           u.status AS user_status, u.last_login_at AS user_last_login
    FROM advisor_profiles ap
    LEFT JOIN users u ON u.id = ap.user_id
    ORDER BY ap.created_at DESC
  `).all();
  return res.json(rows);
});

// POST /api/admin/comerciales — crear perfil
router.post("/comerciales", async (req, res) => {
  const { slug, display_name, phone, whatsapp, public_email, about_text,
          invoice_cta_url, photo_url, invite_email, profile_json } = req.body ?? {};

  if (!slug || !display_name) {
    return res.status(400).json({ error: "slug y display_name son obligatorios" });
  }

  const existing = db.prepare("SELECT id FROM advisor_profiles WHERE slug = ?").get(slug);
  if (existing) return res.status(409).json({ error: "Ya existe un perfil con ese slug" });

  if (invoice_cta_url) {
    try { new URL(invoice_cta_url); } catch {
      return res.status(400).json({ error: "invoice_cta_url no es una URL válida" });
    }
  }

  if (profile_json !== undefined && profile_json !== null) {
    try { JSON.parse(profile_json); } catch {
      return res.status(400).json({ error: "profile_json no es JSON válido" });
    }
  }

  db.prepare(`
    INSERT INTO advisor_profiles
      (slug, display_name, phone, whatsapp, public_email, about_text, invoice_cta_url, photo_url, profile_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(slug, display_name, phone ?? null, whatsapp ?? null,
         public_email ?? null, about_text ?? null,
         invoice_cta_url ?? null, photo_url ?? null,
         profile_json ?? null);

  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE slug = ?").get(slug) as AdvisorProfileRow;

  // Si se proporcionó email de invitación, crear y enviar invitación
  if (invite_email) {
    const token = nanoid(32);
    const expires = new Date(Date.now() + 48 * 3_600_000).toISOString();
    db.prepare(`
      INSERT INTO invitations (token, email, profile_id, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(token, invite_email, profile.id, expires);

    try {
      await sendInvitationEmail(invite_email, token, display_name);
    } catch (e) {
      console.error("[EMAIL]", e);
    }
  }

  return res.status(201).json(serializeProfile(profile));
});

// GET /api/admin/comerciales/:id
router.get("/comerciales/:id", (req, res) => {
  const profile = getProfileWithUser(Number(req.params.id));
  if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });
  return res.json(profile);
});

// PUT /api/admin/comerciales/:id — el admin puede editar todo
router.put("/comerciales/:id", (req, res) => {
  const id = Number(req.params.id);
  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(id) as AdvisorProfileRow | undefined;
  if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });

  const { slug, display_name, phone, whatsapp, public_email, about_text,
          invoice_cta_url, photo_url, is_active, profile_json } = req.body ?? {};

  if (invoice_cta_url) {
    try { new URL(invoice_cta_url); } catch {
      return res.status(400).json({ error: "invoice_cta_url no es una URL válida" });
    }
  }

  if (profile_json !== undefined && profile_json !== null) {
    try { JSON.parse(profile_json); } catch {
      return res.status(400).json({ error: "profile_json no es JSON válido" });
    }
  }

  db.prepare(`
    UPDATE advisor_profiles SET
      slug              = COALESCE(?, slug),
      display_name      = COALESCE(?, display_name),
      phone             = COALESCE(?, phone),
      whatsapp          = COALESCE(?, whatsapp),
      public_email      = COALESCE(?, public_email),
      about_text        = COALESCE(?, about_text),
      invoice_cta_url   = COALESCE(?, invoice_cta_url),
      photo_url         = COALESCE(?, photo_url),
      is_active         = COALESCE(?, is_active),
      profile_json      = COALESCE(?, profile_json),
      updated_at        = datetime('now')
    WHERE id = ?
  `).run(
    slug ?? null, display_name ?? null, phone ?? null, whatsapp ?? null,
    public_email ?? null, about_text ?? null, invoice_cta_url ?? null,
    photo_url ?? null, is_active !== undefined ? Number(is_active) : null,
    profile_json ?? null,
    id
  );

  const updated = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(id) as AdvisorProfileRow;
  return res.json(serializeProfile(updated));
});

// DELETE /api/admin/comerciales/:id — borrar perfil definitivamente
// El usuario vinculado NO se borra (seguridad), solo se desvincula.
router.delete("/comerciales/:id", (req, res) => {
  const id = Number(req.params.id);
  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(id) as AdvisorProfileRow | undefined;
  if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });

  // Borrar invitaciones asociadas
  db.prepare("DELETE FROM invitations WHERE profile_id = ?").run(id);
  // Borrar el perfil
  db.prepare("DELETE FROM advisor_profiles WHERE id = ?").run(id);

  return res.json({ ok: true, message: "Perfil eliminado" });
});

// POST /api/admin/comerciales/:id/crear-cuenta — crear cuenta con email + contraseña directamente
router.post("/comerciales/:id/crear-cuenta", async (req, res) => {
  const id = Number(req.params.id);
  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(id) as AdvisorProfileRow | undefined;
  if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });

  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });
  if (password.length < 8) return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });

  const hash = bcrypt.hashSync(password, 12);

  // Verificar si ya existe usuario con ese email
  const existing = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(email) as UserRow | undefined;

  let userId: number;
  if (existing) {
    // Actualizar contraseña y activar
    db.prepare("UPDATE users SET password_hash = ?, status = 'active', updated_at = datetime('now') WHERE id = ?")
      .run(hash, existing.id);
    userId = existing.id;
  } else {
    // Crear nuevo usuario
    db.prepare(`
      INSERT INTO users (email, password_hash, name, role, status)
      VALUES (?, ?, ?, 'comercial', 'active')
    `).run(email, hash, profile.display_name);
    const newUser = db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").get(email) as { id: number };
    userId = newUser.id;
  }

  // Vincular al perfil
  db.prepare("UPDATE advisor_profiles SET user_id = ?, updated_at = datetime('now') WHERE id = ?").run(userId, id);

  const user = db.prepare("SELECT id, email, name, role, status FROM users WHERE id = ?").get(userId) as UserRow;
  return res.json({ ok: true, user });
});

// POST /api/admin/comerciales/:id/invite — enviar/reenviar invitación
router.post("/comerciales/:id/invite", async (req, res) => {
  const id = Number(req.params.id);
  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(id) as AdvisorProfileRow | undefined;
  if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });

  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "Email requerido" });

  // Invalidar invitaciones anteriores para este perfil
  db.prepare("UPDATE invitations SET used_at = datetime('now') WHERE profile_id = ? AND used_at IS NULL").run(id);

  const token = nanoid(32);
  const expires = new Date(Date.now() + 48 * 3_600_000).toISOString();
  db.prepare(`
    INSERT INTO invitations (token, email, profile_id, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, email, id, expires);

  try {
    await sendInvitationEmail(email, token, profile.display_name);
    return res.json({ ok: true, message: "Invitación enviada" });
  } catch (e) {
    console.error("[EMAIL]", e);
    const link = `${config.APP_URL}/invitation/accept/${token}`;
    return res.json({ ok: true, message: "No se pudo enviar el email. Enlace manual:", link });
  }
});

// ─── Rutas de Usuarios ───────────────────────────────────────────────────────

// GET /api/admin/users
router.get("/users", (_req, res) => {
  const users = db.prepare(`
    SELECT id, email, name, role, status, invited_at, last_login_at, created_at, updated_at
    FROM users ORDER BY created_at DESC
  `).all();
  return res.json(users);
});

// PUT /api/admin/users/:id/status
router.put("/users/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  if (!["active", "inactive", "pending"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }
  db.prepare("UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  return res.json({ ok: true });
});

// DELETE /api/admin/users/:id — borrar usuario (no se puede borrar a uno mismo)
router.delete("/users/:id", (req: any, res) => {
  const id = Number(req.params.id);
  if (req.user?.id === id) {
    return res.status(400).json({ error: "No puedes borrar tu propia cuenta" });
  }
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  // Desvincular perfiles asociados
  db.prepare("UPDATE advisor_profiles SET user_id = NULL, updated_at = datetime('now') WHERE user_id = ?").run(id);
  // Invalidar invitaciones
  db.prepare("UPDATE invitations SET used_at = datetime('now') WHERE email = (SELECT email FROM users WHERE id = ?)").run(id);
  // Borrar usuario
  db.prepare("DELETE FROM users WHERE id = ?").run(id);

  return res.json({ ok: true });
});

// PUT /api/admin/users/:id/password — cambiar contraseña de cualquier usuario
router.put("/users/:id/password", async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body ?? {};
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const hash = bcrypt.hashSync(password, 12);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(hash, id);
  return res.json({ ok: true });
});

// POST /api/admin/users/:id/reinvite — reenviar invitación / reset de contraseña
router.post("/users/:id/reinvite", async (req, res) => {
  const id = Number(req.params.id);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  // Invalidar invitaciones anteriores del usuario
  db.prepare("UPDATE invitations SET used_at = datetime('now') WHERE email = ? AND used_at IS NULL").run(user.email);

  // Buscar perfil vinculado
  const profile = db.prepare("SELECT * FROM advisor_profiles WHERE user_id = ? LIMIT 1").get(id) as AdvisorProfileRow | undefined;

  const token = nanoid(32);
  const expires = new Date(Date.now() + 48 * 3_600_000).toISOString();
  db.prepare(`
    INSERT INTO invitations (token, email, profile_id, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, user.email, profile?.id ?? null, expires);

  try {
    await sendInvitationEmail(user.email, token, profile?.display_name ?? user.name);
    return res.json({ ok: true, message: "Invitación reenviada por email" });
  } catch (e) {
    console.error("[EMAIL]", e);
    const link = `${config.APP_URL}/invitation/accept/${token}`;
    return res.json({ ok: true, message: "No se pudo enviar el email. Enlace manual:", link });
  }
});

// POST /api/admin/users/crear — crear usuario (admin o comercial) con invitación opcional
router.post("/users/crear", async (req, res) => {
  const { email, name, role, invite_profile_id } = req.body ?? {};

  if (!email || !name) {
    return res.status(400).json({ error: "email y name son obligatorios" });
  }
  if (!["admin", "comercial"].includes(role)) {
    return res.status(400).json({ error: "role debe ser 'admin' o 'comercial'" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
  if (existing) return res.status(409).json({ error: "Ya existe un usuario con ese email" });

  db.prepare(`
    INSERT INTO users (email, name, role, status)
    VALUES (?, ?, ?, 'pending')
  `).run(email, name, role);

  const newUser = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(email) as UserRow;

  // Si se pasa un profile_id, vincular el perfil al usuario
  if (invite_profile_id) {
    const profileId = Number(invite_profile_id);
    const profile = db.prepare("SELECT * FROM advisor_profiles WHERE id = ?").get(profileId) as AdvisorProfileRow | undefined;
    if (profile) {
      db.prepare("UPDATE advisor_profiles SET user_id = ?, updated_at = datetime('now') WHERE id = ?").run(newUser.id, profileId);
    }
  }

  // Crear invitación y enviar email
  const token = nanoid(32);
  const expires = new Date(Date.now() + 48 * 3_600_000).toISOString();

  // Obtener profile_id para la invitación (puede venir del body o del profile vinculado)
  const profileForInvite = invite_profile_id
    ? db.prepare("SELECT id, display_name FROM advisor_profiles WHERE id = ?").get(Number(invite_profile_id)) as AdvisorProfileRow | undefined
    : db.prepare("SELECT id, display_name FROM advisor_profiles WHERE user_id = ? LIMIT 1").get(newUser.id) as AdvisorProfileRow | undefined;

  db.prepare(`
    INSERT INTO invitations (token, email, profile_id, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, email, profileForInvite?.id ?? null, expires);

  try {
    await sendInvitationEmail(email, token, profileForInvite?.display_name ?? name);
  } catch (e) {
    console.error("[EMAIL]", e);
  }

  const link = `${config.APP_URL}/invitation/accept/${token}`;
  return res.status(201).json({ ok: true, user: newUser, link });
});

export default router;
