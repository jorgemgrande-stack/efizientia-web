/**
 * Efizientia SaaS · server/scripts/seed-admin.ts
 * Script one-time para:
 *  1. Crear el usuario administrador inicial
 *  2. Poblar advisor_profiles con los datos de humanos.ts
 *
 * Uso: pnpm tsx server/scripts/seed-admin.ts
 *
 * Variables de entorno (o .env):
 *  ADMIN_EMAIL    — email del admin (default: admin@efizientia.es)
 *  ADMIN_PASSWORD — contraseña del admin (CAMBIAR tras primer login)
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import wasmSqlite from "node-sqlite3-wasm";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Database = (wasmSqlite as any).Database as new (path: string) => any;
import path from "path";
import { initSchema } from "../db/schema.js";

// ─── Datos estáticos de humanos.ts (copiados aquí para el seed) ─────────────
// Esto evita importar el módulo del cliente desde el servidor.

const SEED_PROFILES = [
  {
    slug: "manuel-reyes",
    display_name: "Manuel Reyes",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Manuel lleva más de 8 años en el sector energético. Empezó en una comercializadora grande, vio cómo funcionaba el sistema por dentro, y decidió pasarse al lado correcto. Ahora usa ese conocimiento para que sus clientes no paguen ni un céntimo de más. Especialista en hogares, pymes y comunidades de vecinos.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: "/images/avatar-manuel.jpg",
  },
  {
    slug: "faustino-lobato",
    display_name: "Faustino Lobato",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Faustino es el especialista en gas del equipo. Domina la conversión m³→kWh, los peajes RL y las regularizaciones como nadie. También lleva la cartera de pymes: sabe que una empresa pequeña puede ahorrar más que un hogar grande si se optimiza bien la potencia y la discriminación horaria.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: "/images/avatar-faustino.jpg",
  },
  {
    slug: "laura-sanchez",
    display_name: "Laura Sánchez",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Laura es la especialista en energía solar del equipo. Si tienes paneles o estás pensando en instalarlos, Laura es tu persona. Calcula la autoconsumo real, gestiona los excedentes y te asegura que la compensación se aplique correctamente en tu factura.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: "/images/avatar-laura.jpg",
  },
  {
    slug: "ana-lopez",
    display_name: "Ana López",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Ana es la asesora de empresas del equipo. Su especialidad son los grandes consumidores: industrias, hoteles, hospitales y cadenas de tiendas. Si tienes varias instalaciones o un consumo elevado, Ana te montará una estrategia de optimización energética completa.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: "/images/avatar-ana.jpg",
  },
  {
    slug: "diego-perez",
    display_name: "Diego Pérez",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Diego es el asesor de comunidades del equipo. Gestiona contratos colectivos, zonas comunes, garajes e instalaciones compartidas. Conoce los trucos del mercado mayorista y sabe cuándo conviene fijar precio y cuándo es mejor ir a indexado.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: "/images/avatar-diego.jpg",
  },
  {
    slug: "nuria-torres",
    display_name: "Nuria Torres",
    phone: "+34 856 28 83 41",
    whatsapp: "34856288341",
    public_email: "hola@efizientia.es",
    about_text: "Nuria es la asesora de nuevos mercados del equipo. Está especializada en las nuevas tarifas y en la transición energética. Si quieres entender la factura del futuro o adelantarte a los cambios regulatorios, Nuria te explica todo sin tecnicismos.",
    invoice_cta_url: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
    photo_url: null,
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@efizientia.es";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Efizientia2025!";
const DB_PATH = process.env.DB_PATH ?? "server/data/efizientia.db";

// Compat shim: node-sqlite3-wasm requires params as array
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

const _raw = new Database(path.resolve(process.cwd(), DB_PATH));
const db = patchDb(_raw);
db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
initSchema(db);

// 1. Crear admin si no existe
const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get(ADMIN_EMAIL);
if (existingAdmin) {
  console.log(`[SEED] Admin ya existe: ${ADMIN_EMAIL}`);
} else {
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  db.prepare(`
    INSERT INTO users (email, password_hash, name, role, status)
    VALUES (?, ?, 'Administrador', 'admin', 'active')
  `).run(ADMIN_EMAIL, hash);
  console.log(`[SEED] ✅ Admin creado: ${ADMIN_EMAIL}`);
}

// 2. Poblar advisor_profiles con los humanos de la web
for (const profile of SEED_PROFILES) {
  const exists = db.prepare("SELECT id FROM advisor_profiles WHERE slug = ?").get(profile.slug);
  if (exists) {
    console.log(`[SEED] Perfil ya existe: ${profile.slug}`);
    continue;
  }
  db.prepare(`
    INSERT INTO advisor_profiles
      (slug, display_name, phone, whatsapp, public_email, about_text, invoice_cta_url, photo_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    profile.slug, profile.display_name, profile.phone, profile.whatsapp,
    profile.public_email, profile.about_text, profile.invoice_cta_url, profile.photo_url
  );
  console.log(`[SEED] ✅ Perfil creado: ${profile.slug}`);
}

console.log(`\n[SEED] Completado. Login en: /login`);
console.log(`  Email:    ${ADMIN_EMAIL}`);
console.log(`  Password: ${ADMIN_PASSWORD}`);
console.log(`\n  ⚠️  Cambia la contraseña tras el primer login.\n`);

db.close();
