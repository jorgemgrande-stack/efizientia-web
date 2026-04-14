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
  const base: Record<string, unknown> = row.profile_json ? JSON.parse(row.profile_json) : {};
  return {
    ...base,
    // Columnas estructuradas (siempre sobreescriben el JSON base)
    slug: row.slug,
    display_name: row.display_name,
    name: row.display_name,
    fullName: (base.fullName as string | null) || row.display_name,
    // Campos de profile_json con fallbacks explícitos
    role:       (base.role as string | null) ?? null,
    tagline:    (base.tagline as string | null) ?? null,
    status:     (["online", "busy", "offline"].includes(String(base.status ?? "")))
                  ? (base.status as string)
                  : "online",
    schedule:   (base.schedule as string | null) ?? null,
    tags:       Array.isArray(base.tags) ? base.tags : [],
    whatsappMsg: (base.whatsappMsg as string | null) ?? "Hola, me gustaría que me ayudaras con mi factura de energía.",
    // Campos de columnas estructuradas
    photo_url:       row.photo_url ?? (base.image as string | null) ?? null,
    image:           row.photo_url ?? (base.image as string | null) ?? null,
    phone:           row.phone ?? (base.phone as string | null) ?? null,
    whatsapp:        row.whatsapp ?? (base.whatsapp as string | null) ?? null,
    public_email:    row.public_email ?? (base.public_email as string | null) ?? null,
    about_text:      row.about_text ?? (base.description as string | null) ?? null,
    description:     row.about_text ?? (base.description as string | null) ?? null,
    invoice_cta_url: row.invoice_cta_url ?? (base.invoiceCtaUrl as string | null) ?? (base.invoice_cta_url as string | null) ?? null,
    invoiceCtaUrl:   row.invoice_cta_url ?? (base.invoiceCtaUrl as string | null) ?? (base.invoice_cta_url as string | null) ?? null,
    is_active:    Boolean(row.is_active),
    updated_at:   row.updated_at,
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
