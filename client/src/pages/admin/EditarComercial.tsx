/**
 * Efizientia SaaS · Panel Admin — Editar Comercial
 * Edición completa de un perfil de asesor (admin: todos los campos).
 * También permite invitar / reenviar invitación desde aquí.
 */

import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  Save, AlertCircle, CheckCircle, ArrowLeft, Mail,
  Trash2, ToggleLeft, ToggleRight, ExternalLink
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api, ApiError } from "@/lib/api";

interface ComercialDetail {
  id: number;
  slug: string;
  display_name: string;
  phone: string | null;
  whatsapp: string | null;
  public_email: string | null;
  about_text: string | null;
  invoice_cta_url: string | null;
  photo_url: string | null;
  is_active: number;
  user_id: number | null;
  user_email: string | null;
  user_name: string | null;
  user_status: string | null;
  user_last_login: string | null;
}

const inputBase = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function EditarComercial() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const [data, setData] = useState<ComercialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fields
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [invoiceCtaUrl, setInvoiceCtaUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // UI
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [error, setError] = useState("");

  // Invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ msg: string; link?: string } | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.admin.comerciales.get(Number(id))
      .then((raw) => {
        const c = raw as ComercialDetail;
        setData(c);
        setSlug(c.slug ?? "");
        setDisplayName(c.display_name ?? "");
        setPhone(c.phone ?? "");
        setWhatsapp(c.whatsapp ?? "");
        setPublicEmail(c.public_email ?? "");
        setAboutText(c.about_text ?? "");
        setInvoiceCtaUrl(c.invoice_cta_url ?? "");
        setPhotoUrl(c.photo_url ?? "");
        setIsActive(!!c.is_active);
        setInviteEmail(c.user_email ?? "");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaveOk(false);
    setSaving(true);
    try {
      await api.admin.comerciales.update(Number(id), {
        slug, display_name: displayName,
        phone: phone || null, whatsapp: whatsapp || null,
        public_email: publicEmail || null, about_text: aboutText || null,
        invoice_cta_url: invoiceCtaUrl || null, photo_url: photoUrl || null,
        is_active: isActive ? 1 : 0,
      });
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteResult(null);
    try {
      const res = await api.admin.comerciales.invite(Number(id), inviteEmail);
      setInviteResult({ msg: res.message ?? "Invitación enviada", link: res.link });
    } catch (e) {
      setInviteResult({ msg: e instanceof ApiError ? e.message : "Error al invitar" });
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.admin.comerciales.delete(Number(id));
      navigate("/admin/comerciales");
    } catch {
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Editar Asesor">
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }} />
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout title="Editar Asesor">
        <div className="text-center py-16 text-white/40">
          <p className="mb-4">Perfil no encontrado.</p>
          <a href="/admin/comerciales" style={{ color: "#e91e8c" }}>Volver a la lista</a>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Editar Asesor">
      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 text-center"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Trash2 size={36} className="mx-auto mb-4" style={{ color: "#e91e8c" }} />
            <h3 className="text-lg font-black text-white mb-2">¿Desactivar este perfil?</h3>
            <p className="text-white/50 text-sm mb-6">
              El perfil quedará inactivo y se desvinculará su cuenta. No se borran datos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
              >
                {deleting ? "Desactivando…" : "Sí, desactivar"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white/50"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <a
            href="/admin/comerciales"
            className="p-2 rounded-lg text-white/40 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.display_name}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-white/40 text-sm">/humanos/{data?.slug}</span>
              <a
                href={`/humanos/${data?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: isActive ? "rgba(57,211,83,0.1)" : "rgba(255,255,255,0.06)",
              color: isActive ? "#39d353" : "rgba(255,255,255,0.4)",
              border: `1px solid ${isActive ? "rgba(57,211,83,0.2)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {isActive ? "Activo" : "Inactivo"}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            title="Desactivar perfil"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Identificación */}
          <div className="rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Identificación</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre público *">
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
                  className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
              <Field label="Slug URL *" hint="/humanos/{slug}">
                <input type="text" value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
            </div>
          </div>

          {/* Contacto */}
          <div className="rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Contacto</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Teléfono">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 6XX XXX XXX" className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
              <Field label="WhatsApp">
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+34 6XX XXX XXX" className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
            </div>

            <Field label="Email público">
              <input type="email" value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)}
                placeholder="nombre@efizientia.es" className={inputBase} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
            </Field>

            <Field label="Descripción">
              <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)}
                rows={3} className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="URL CTA factura" hint="Opcional">
                <input type="url" value={invoiceCtaUrl} onChange={(e) => setInvoiceCtaUrl(e.target.value)}
                  placeholder="https://…" className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
              <Field label="URL foto" hint="Opcional">
                <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://… o /images/…" className={inputBase} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </Field>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
              style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}>
              <AlertCircle size={14} className="flex-shrink-0" />{error}
            </div>
          )}
          {saveOk && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
              style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}>
              <CheckCircle size={14} className="flex-shrink-0" />Cambios guardados
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
          >
            <Save size={16} />
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>

        {/* Sidebar — cuenta + invitación */}
        <div className="space-y-4">
          {/* Cuenta vinculada */}
          <div className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Cuenta de acceso</h2>
            {data?.user_id ? (
              <div className="space-y-2">
                <div className="text-white text-sm font-semibold">{data.user_name}</div>
                <div className="text-white/50 text-xs">{data.user_email}</div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: data.user_status === "active" ? "rgba(57,211,83,0.1)" : "rgba(255,255,255,0.06)",
                      color: data.user_status === "active" ? "#39d353" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {data.user_status}
                  </span>
                </div>
                {data.user_last_login && (
                  <p className="text-white/30 text-xs">
                    Último acceso: {new Date(data.user_last_login).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/30 text-sm italic">Sin cuenta vinculada</p>
            )}
          </div>

          {/* Invitación */}
          <form onSubmit={handleInvite} className="rounded-2xl p-5 space-y-3"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">
              {data?.user_id ? "Reenviar invitación" : "Enviar invitación"}
            </h2>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              className={inputBase}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            {inviteResult && (
              <div className="text-xs rounded-xl px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)"
                }}>
                {inviteResult.msg}
                {inviteResult.link && (
                  <div className="mt-1.5 font-mono break-all text-xs" style={{ color: "#e91e8c" }}>
                    {inviteResult.link}
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={inviting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition-all"
              style={{ background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.2)", color: "#e91e8c" }}
            >
              <Mail size={14} />
              {inviting ? "Enviando…" : "Enviar invitación"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
