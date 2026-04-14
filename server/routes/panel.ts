/**
 * Efizientia SaaS · server/routes/panel.ts
 * Zona privada del comercial (role: comercial | admin).
 * GET /api/panel/me     — obtiene la propia ficha
 * PUT /api/panel/me     — edita los campos permitidos de su ficha
 */

import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { serializeProfile } from "./profiles.js";
import type { AdvisorProfileRow } from "../db/types.js";

const router = Router();
router.use(requireAuth);

// POST /api/panel/profile — el comercial crea su propia ficha si no tiene ninguna
router.post("/profile", (req: AuthenticatedRequest, res) => {
  const existing = db
    .prepare("SELECT id FROM advisor_profiles WHERE user_id = ? LIMIT 1")
    .get(req.user!.id);
  if (existing) return res.status(409).json({ error: "Ya tienes una ficha asociada." });

  const { slug, display_name } = req.body ?? {};
  if (!slug || !display_name) {
    return res.status(400).json({ error: "slug y display_name son obligatorios" });
  }

  // Validar slug: solo letras, números y guiones
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: "El slug solo puede contener letras minúsculas, números y guiones" });
  }

  const taken = db.prepare("SELECT id FROM advisor_profiles WHERE slug = ? LIMIT 1").get(slug);
  if (taken) return res.status(409).json({ error: "Esa URL ya está en uso, elige otra" });

  db.prepare(`
    INSERT INTO advisor_profiles (slug, display_name, user_id)
    VALUES (?, ?, ?)
  `).run(slug, display_name, req.user!.id);

  const profile = db
    .prepare("SELECT * FROM advisor_profiles WHERE user_id = ? LIMIT 1")
    .get(req.user!.id) as AdvisorProfileRow;

  return res.status(201).json(serializeProfile(profile));
});

// GET /api/panel/me
router.get("/me", (req: AuthenticatedRequest, res) => {
  const profile = db
    .prepare("SELECT * FROM advisor_profiles WHERE user_id = ? LIMIT 1")
    .get(req.user!.id) as AdvisorProfileRow | undefined;

  if (!profile) {
    return res.status(404).json({ error: "No tienes una ficha pública asociada todavía." });
  }
  return res.json(serializeProfile(profile));
});

// PUT /api/panel/me — el comercial solo puede editar sus propios campos permitidos
router.put("/me", (req: AuthenticatedRequest, res) => {
  const profile = db
    .prepare("SELECT * FROM advisor_profiles WHERE user_id = ? LIMIT 1")
    .get(req.user!.id) as AdvisorProfileRow | undefined;

  if (!profile) {
    return res.status(404).json({ error: "No tienes una ficha pública asociada." });
  }

  // Campos de columnas estructuradas editables por el comercial
  const { phone, whatsapp, public_email, about_text, photo_url, display_name } = req.body ?? {};

  // Campos que se almacenan en profile_json
  const { full_name, tagline, role_label, profile_status, schedule, tags, whatsapp_msg } = req.body ?? {};

  // Validaciones
  if (display_name !== undefined && String(display_name).trim() === "") {
    return res.status(400).json({ error: "El nombre corto no puede estar vacío" });
  }
  if (profile_status !== undefined && !["online", "busy", "offline"].includes(String(profile_status))) {
    return res.status(400).json({ error: "Estado de disponibilidad no válido (online/busy/offline)" });
  }

  // Merge profile_json con los nuevos valores
  const currentJson: Record<string, unknown> = profile.profile_json
    ? JSON.parse(profile.profile_json)
    : {};
  if (full_name !== undefined)      currentJson.fullName    = String(full_name).trim() || null;
  if (tagline !== undefined)        currentJson.tagline     = String(tagline).trim() || null;
  if (role_label !== undefined)     currentJson.role        = String(role_label).trim() || null;
  if (profile_status !== undefined) currentJson.status      = profile_status;
  if (schedule !== undefined)       currentJson.schedule    = String(schedule).trim() || null;
  if (tags !== undefined)           currentJson.tags        = Array.isArray(tags) ? tags.map(String).filter(Boolean) : [];
  if (whatsapp_msg !== undefined)   currentJson.whatsappMsg = String(whatsapp_msg).trim() || null;

  const newDisplayName = display_name !== undefined && String(display_name).trim()
    ? String(display_name).trim()
    : null;

  db.prepare(`
    UPDATE advisor_profiles SET
      phone             = COALESCE(?, phone),
      whatsapp          = COALESCE(?, whatsapp),
      public_email      = COALESCE(?, public_email),
      about_text        = COALESCE(?, about_text),
      photo_url         = COALESCE(?, photo_url),
      display_name      = COALESCE(?, display_name),
      profile_json      = ?,
      updated_at        = datetime('now'),
      updated_by_user_id = ?
    WHERE id = ?
  `).run(
    phone ?? null,
    whatsapp ?? null,
    public_email ?? null,
    about_text ?? null,
    photo_url ?? null,
    newDisplayName,
    JSON.stringify(currentJson),
    req.user!.id,
    profile.id
  );

  const updated = db
    .prepare("SELECT * FROM advisor_profiles WHERE id = ? LIMIT 1")
    .get(profile.id) as AdvisorProfileRow;

  return res.json(serializeProfile(updated));
});

export default router;
