/**
 * Efizientia SaaS · Panel Admin — Nuevo Comercial
 * Formulario para crear un nuevo perfil de asesor.
 * Opcionalmente envía una invitación al email indicado.
 */

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Save, AlertCircle, ArrowLeft, Upload, User } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api, ApiError } from "@/lib/api";

const inputBase = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function NuevoComercial() {
  const [, navigate] = useLocation();

  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [invoiceCtaUrl, setInvoiceCtaUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const res = await api.upload.avatar(file);
      setPhotoUrl(res.url);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al subir la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Auto-generate slug from display name
  const handleNameChange = (value: string) => {
    setDisplayName(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.admin.comerciales.create({
        slug,
        display_name: displayName,
        phone: phone || null,
        whatsapp: whatsapp || null,
        public_email: publicEmail || null,
        about_text: aboutText || null,
        invoice_cta_url: invoiceCtaUrl || null,
        photo_url: photoUrl || null,
        invite_email: inviteEmail || undefined,
      });
      navigate("/admin/comerciales");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al crear el perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Nuevo Comercial">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/admin/comerciales"
          className="p-2 rounded-lg text-white/40 hover:text-white transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft size={16} />
        </a>
        <div>
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Nuevo Asesor
          </h1>
          <p className="text-white/50 text-sm mt-0.5">Crea un perfil público para un comercial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identificación */}
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Identificación</h2>

              <Field
                label="Nombre público *"
                hint="Nombre que aparecerá en la web (ej: Faustino Lobato)"
              >
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nombre Apellido"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </Field>

              <Field
                label="Slug URL *"
                hint="URL de su ficha: /humanos/{slug} — solo letras, números y guiones"
              >
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  placeholder="nombre-apellido"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                {slug && (
                  <p className="text-white/30 text-xs mt-1 font-mono">
                    /humanos/{slug}
                  </p>
                )}
              </Field>
            </div>

            {/* Contacto */}
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Contacto</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Teléfono">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 6XX XXX XXX"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </Field>
                <Field label="WhatsApp">
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+34 6XX XXX XXX"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </Field>
              </div>

              <Field label="Email público" hint="Email visible en su ficha">
                <input
                  type="email"
                  value={publicEmail}
                  onChange={(e) => setPublicEmail(e.target.value)}
                  placeholder="nombre@efizientia.es"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </Field>

              <Field label="Descripción / Sobre él">
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Breve descripción del asesor…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </Field>

              <Field
                label="URL CTA factura (personal)"
                hint="Si está vacío se usará el enlace global de Efizientia"
              >
                <input
                  type="url"
                  value={invoiceCtaUrl}
                  onChange={(e) => setInvoiceCtaUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </Field>

              <Field label="Foto de perfil">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt="foto" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                      style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.2)", color: "#e91e8c" }}
                    >
                      <Upload size={12} />
                      {uploadingPhoto ? "Subiendo…" : "Subir foto"}
                    </button>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl("")}
                        className="w-full text-xs text-white/25 hover:text-white/50 transition-colors"
                      >
                        Eliminar foto
                      </button>
                    )}
                  </div>
                </div>
                {photoUrl && (
                  <p className="text-white/25 text-xs mt-1 truncate">{photoUrl}</p>
                )}
              </Field>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
              >
                <Save size={16} />
                {saving ? "Creando…" : "Crear asesor"}
              </button>
              <a
                href="/admin/comerciales"
                className="px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancelar
              </a>
            </div>
          </div>

          {/* Sidebar — invitación */}
          <div>
            <div
              className="rounded-2xl p-6 sticky top-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
                Invitación de acceso
              </h2>
              <p className="text-white/50 text-sm mb-4">
                Si indicas un email, se enviará automáticamente la invitación al crear el perfil.
              </p>
              <Field
                label="Email para invitar"
                hint="Opcional. También puedes invitar después desde la lista."
              >
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="comercial@email.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </Field>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
