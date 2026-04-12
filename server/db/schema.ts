/**
 * Efizientia SaaS · server/db/schema.ts
 * Define y ejecuta las sentencias CREATE TABLE IF NOT EXISTS.
 * Idempotente: seguro de llamar en cada arranque del servidor.
 */

import type { Database } from "node-sqlite3-wasm";

export function initSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      email           TEXT    UNIQUE NOT NULL,
      password_hash   TEXT    NOT NULL DEFAULT '',
      name            TEXT    NOT NULL,
      role            TEXT    NOT NULL CHECK(role IN ('admin','comercial')),
      status          TEXT    NOT NULL DEFAULT 'pending'
                              CHECK(status IN ('active','inactive','pending')),
      invited_at      TEXT,
      last_login_at   TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS advisor_profiles (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,
      slug                TEXT    UNIQUE NOT NULL,
      display_name        TEXT    NOT NULL,
      photo_url           TEXT,
      phone               TEXT,
      whatsapp            TEXT,
      public_email        TEXT,
      about_text          TEXT,
      invoice_cta_url     TEXT,
      is_active           INTEGER NOT NULL DEFAULT 1,
      profile_json        TEXT,
      created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_by_user_id  INTEGER REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      token       TEXT    UNIQUE NOT NULL,
      email       TEXT    NOT NULL,
      profile_id  INTEGER REFERENCES advisor_profiles(id) ON DELETE SET NULL,
      expires_at  TEXT    NOT NULL,
      used_at     TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_advisor_profiles_slug    ON advisor_profiles(slug);
    CREATE INDEX IF NOT EXISTS idx_advisor_profiles_user_id ON advisor_profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_token        ON invitations(token);
    CREATE INDEX IF NOT EXISTS idx_users_email              ON users(email);
  `);
}
