/**
 * Efizientia SaaS · server/routes/profiles.ts
 * Rutas PÚBLICAS (sin auth) para leer perfiles de asesores.
 * GET /api/profiles        — lista todos los activos
 * GET /api/profiles/:slug  — perfil individual por slug
 */

import { Router } from "express";
import { db } from "../db/index.js";
import type { AdvisorProfileRow } from "../db/types.js";

const router = Router();

function serializeProfile(row: AdvisorProfileRow) {
  // Mezcla: datos editables de columnas + datos estáticos del profile_json
  const base = row.profile_json ? JSON.parse(row.profile_json) : {};
  return {
    ...base,
    // Los campos editables siempre sobreescriben el JSON estático
    slug: row.slug,
    display_name: row.display_name,
    name: row.display_name,
    fullName: row.display_name,
    photo_url: row.photo_url ?? base.image ?? null,
    image: row.photo_url ?? base.image ?? null,
    phone: row.phone ?? base.phone ?? null,
    whatsapp: row.whatsapp ?? base.whatsapp ?? null,
    public_email: row.public_email ?? base.public_email ?? null,
    about_text: row.about_text ?? base.description ?? null,
    description: row.about_text ?? base.description ?? null,
    invoice_cta_url: row.invoice_cta_url ?? base.invoice_cta_url ?? null,
    is_active: Boolean(row.is_active),
    updated_at: row.updated_at,
  };
}

// GET /api/profiles
router.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM advisor_profiles WHERE is_active = 1 ORDER BY id ASC")
    .all() as AdvisorProfileRow[];
  return res.json(rows.map(serializeProfile));
});

// GET /api/profiles/:slug
router.get("/:slug", (req, res) => {
  const row = db
    .prepare("SELECT * FROM advisor_profiles WHERE slug = ? LIMIT 1")
    .get(req.params.slug) as AdvisorProfileRow | undefined;

  if (!row) return res.status(404).json({ error: "Perfil no encontrado" });
  return res.json(serializeProfile(row));
});

export { serializeProfile };
export default router;
