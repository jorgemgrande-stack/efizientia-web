/**
 * Efizientia SaaS · server/db/types.ts
 * Tipos TypeScript que reflejan exactamente las columnas de la base de datos SQLite.
 */

export type UserRole = "admin" | "comercial";
export type UserStatus = "active" | "inactive" | "pending";

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  invited_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdvisorProfileRow {
  id: number;
  user_id: number | null;
  slug: string;
  display_name: string;
  photo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  public_email: string | null;
  about_text: string | null;
  invoice_cta_url: string | null;
  is_active: number; // 0 | 1 (SQLite boolean)
  profile_json: string | null; // JSON serializado del HumanoData completo
  created_at: string;
  updated_at: string;
  updated_by_user_id: number | null;
}

export interface InvitationRow {
  id: number;
  token: string;
  email: string;
  profile_id: number | null;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

// Tipo seguro para exponer al frontend (sin password_hash)
export type PublicUser = Omit<UserRow, "password_hash">;
