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

  const { phone, whatsapp, public_email, about_text, invoice_cta_url, photo_url } =
    req.body ?? {};

  // Validar URL si se proporciona
  if (invoice_cta_url && invoice_cta_url !== "") {
    try {
      new URL(invoice_cta_url);
    } catch {
      return res.status(400).json({ error: "La URL de 'Subir factura' no es válida" });
    }
  }

  db.prepare(`
    UPDATE advisor_profiles SET
      phone             = COALESCE(?, phone),
      whatsapp          = COALESCE(?, whatsapp),
      public_email      = COALESCE(?, public_email),
      about_text        = COALESCE(?, about_text),
      invoice_cta_url   = COALESCE(?, invoice_cta_url),
      photo_url         = COALESCE(?, photo_url),
      updated_at        = datetime('now'),
      updated_by_user_id = ?
    WHERE id = ?
  `).run(
    phone ?? null,
    whatsapp ?? null,
    public_email ?? null,
    about_text ?? null,
    invoice_cta_url ?? null,
    photo_url ?? null,
    req.user!.id,
    profile.id
  );

  const updated = db
    .prepare("SELECT * FROM advisor_profiles WHERE id = ? LIMIT 1")
    .get(profile.id) as AdvisorProfileRow;

  return res.json(serializeProfile(updated));
});

export default router;
