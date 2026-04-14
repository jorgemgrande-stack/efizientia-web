/**
 * Efizientia SaaS · server/routes/auth.ts
 * POST /api/auth/login   — login con email + password, emite JWT en cookie httpOnly
 * POST /api/auth/logout  — borra la cookie
 * GET  /api/auth/me      — devuelve usuario autenticado actual
 * POST /api/auth/change-password — cambio de contraseña (requiere auth)
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { config } from "../config.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import type { UserRow, InvitationRow } from "../db/types.js";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 86_400_000, // 24h en ms
  path: "/",
};

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
    .get(email) as UserRow | undefined;

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  if (user.status === "inactive") {
    return res.status(403).json({ error: "Cuenta desactivada. Contacta con el administrador." });
  }
  if (user.status === "pending") {
    return res.status(403).json({ error: "Cuenta pendiente de activación. Revisa tu email de invitación." });
  }
  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "24h" });

  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);

  res.cookie("auth_token", token, COOKIE_OPTS);
  return res.json(payload);
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.clearCookie("auth_token", { path: "/" });
  return res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json(req.user);
});

// POST /api/auth/change-password
router.post("/change-password", requireAuth, (req: AuthenticatedRequest, res) => {
  const { current_password, new_password } = req.body ?? {};
  if (!current_password || !new_password) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE id = ? LIMIT 1")
    .get(req.user!.id) as UserRow | undefined;

  if (!user || !bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(401).json({ error: "Contraseña actual incorrecta" });
  }

  const hash = bcrypt.hashSync(new_password, 12);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(
    hash,
    user.id
  );

  return res.json({ ok: true });
});

// GET /api/auth/invitation/:token — pre-valida el token antes de mostrar el formulario
router.get("/invitation/:token", (req, res) => {
  const invitation = db.prepare(`
    SELECT i.*, ap.display_name AS profile_name
    FROM invitations i
    LEFT JOIN advisor_profiles ap ON ap.id = i.profile_id
    WHERE i.token = ? AND i.used_at IS NULL
    LIMIT 1
  `).get(req.params.token) as (InvitationRow & { profile_name: string | null }) | undefined;

  if (!invitation) return res.status(400).json({ error: "Enlace inválido o ya utilizado" });
  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: "Este enlace ha expirado. Solicita una nueva invitación." });
  }

  return res.json({ ok: true, email: invitation.email, profile_name: invitation.profile_name });
});

// POST /api/auth/invitation/accept — activa cuenta desde token (público, sin auth)
router.post("/invitation/accept", async (req, res) => {
  const { token, password } = req.body ?? {};
  if (!token || !password) return res.status(400).json({ error: "Token y contraseña requeridos" });
  if (password.length < 8) return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });

  const invitation = db.prepare(`
    SELECT * FROM invitations WHERE token = ? AND used_at IS NULL LIMIT 1
  `).get(token) as InvitationRow | undefined;

  if (!invitation) return res.status(400).json({ error: "Enlace inválido o ya utilizado" });
  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: "Este enlace ha expirado. Solicita una nueva invitación." });
  }

  const existingUser = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(invitation.email) as UserRow | undefined;
  const hash = bcrypt.hashSync(password, 12);

  let userId: number;
  if (existingUser) {
    db.prepare("UPDATE users SET password_hash = ?, status = 'active', updated_at = datetime('now') WHERE id = ?")
      .run(hash, existingUser.id);
    userId = existingUser.id;
  } else {
    const profile = invitation.profile_id
      ? db.prepare("SELECT display_name FROM advisor_profiles WHERE id = ?").get(invitation.profile_id) as { display_name: string } | undefined
      : undefined;
    db.prepare("INSERT INTO users (email, password_hash, name, role, status) VALUES (?, ?, ?, 'comercial', 'active')")
      .run(invitation.email, hash, profile?.display_name ?? invitation.email);
    const newUser = db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").get(invitation.email) as { id: number };
    userId = newUser.id;
  }

  if (invitation.profile_id) {
    db.prepare("UPDATE advisor_profiles SET user_id = ?, updated_at = datetime('now') WHERE id = ?")
      .run(userId, invitation.profile_id);
  }

  db.prepare("UPDATE invitations SET used_at = datetime('now') WHERE id = ?").run(invitation.id);

  return res.json({ ok: true, message: "Cuenta activada correctamente. Ya puedes iniciar sesión." });
});

export default router;
