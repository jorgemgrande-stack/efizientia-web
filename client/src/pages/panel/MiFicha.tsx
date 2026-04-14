/**
 * Efizientia SaaS · Panel Asesor — Mi Ficha
 * El comercial edita sus datos públicos: foto, teléfono, WhatsApp,
 * email público, descripción y URL para subir factura.
 * También permite cambiar la contraseña.
 */

import { useEffect, useRef, useState } from "react";
import {
  Camera, Save, Eye, EyeOff, CheckCircle, AlertCircle,
  ExternalLink, Key
} from "lucide-react";
import { useLocation } from "wouter";
import PanelLayout from "./PanelLayout";
import { api, ApiError } from "@/lib/api";

interface ProfileData {
  id?: number;
  slug?: string;
  display_name?: string;
  phone?: string | null;
  whatsapp?: string | null;
  public_email?: string | null;
  about_text?: string | null;
  invoice_cta_url?: string | null;
  photo_url?: string | null;
}

const inputBase =
  "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      />
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function MiFicha() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  // Editable fields
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [invoiceCtaUrl, setInvoiceCtaUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwOk, setPwOk] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    api.panel.me()
      .then((data) => {
        const p = data as ProfileData;
        setProfile(p);
        setPhone(p.phone ?? "");
        setWhatsapp(p.whatsapp ?? "");
        setPublicEmail(p.public_email ?? "");
        setAboutText(p.about_text ?? "");
        setInvoiceCtaUrl(p.invoice_cta_url ?? "");
        setPhotoUrl(p.photo_url ?? "");
      })
      .catch(() => setNoProfile(true))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload.avatar(file);
      setPhotoUrl(url);
    } catch {
      setSaveError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveOk(false);
    setSaving(true);
    try {
      const updated = await api.panel.update({
        phone: phone || null,
        whatsapp: whatsapp || null,
        public_email: publicEmail || null,
        about_text: aboutText || null,
        invoice_cta_url: invoiceCtaUrl || null,
        photo_url: photoUrl || null,
      });
      setProfile(updated as ProfileData);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwOk(false);
    if (newPw.length < 8) return setPwError("La nueva contraseña debe tener al menos 8 caracteres");
    if (newPw !== confirmPw) return setPwError("Las contraseñas no coinciden");
    setPwSaving(true);
    try {
      await api.auth.changePassword(currentPw, newPw);
      setPwOk(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setPwOk(false), 4000);
    } catch (e) {
      setPwError(e instanceof ApiError ? e.message : "Error al cambiar la contraseña");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <PanelLayout title="Mi Ficha">
        <div className="flex items-center justify-center py-24">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }}
          />
        </div>
      </PanelLayout>
    );
  }

  if (noProfile) {
    navigate("/panel");
    return null;
  }

  return (
    <PanelLayout title="Mi Ficha">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Mi Ficha Pública
          </h1>
          <p className="text-white/50 text-sm mt-1">{profile?.display_name}</p>
        </div>
        {profile?.slug && (
          <a
            href={`/humanos/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ExternalLink size={14} />
            Ver ficha pública
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                Datos de contacto
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Teléfono"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="+34 6XX XXX XXX"
                  hint="Visible en tu ficha pública"
                />
                <InputField
                  label="WhatsApp"
                  type="tel"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+34 6XX XXX XXX"
                  hint="Número de WhatsApp (sin espacios)"
                />
              </div>

              <InputField
                label="Email público"
                type="email"
                value={publicEmail}
                onChange={setPublicEmail}
                placeholder="tu@email.com"
                hint="Email que aparecerá en tu ficha"
              />

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                  Sobre ti
                </label>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Cuéntale a tus clientes quién eres y en qué les puedes ayudar…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              <InputField
                label="URL subir factura (CTA personal)"
                type="url"
                value={invoiceCtaUrl}
                onChange={setInvoiceCtaUrl}
                placeholder="https://…"
                hint="Opcional. Si está vacío se usará el enlace global de Efizientia."
              />

              {/* Feedback */}
              {saveError && (
                <div
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {saveError}
                </div>
              )}
              {saveOk && (
                <div
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}
                >
                  <CheckCircle size={14} className="flex-shrink-0" />
                  Cambios guardados correctamente
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
            </div>
          </form>

          {/* Cambiar contraseña */}
          <form onSubmit={handleChangePassword}>
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Key size={16} style={{ color: "#e91e8c" }} />
                <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                  Cambiar contraseña
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputBase}
                    style={{ ...inputStyle, paddingRight: "48px" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                    Nueva contraseña
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                    Confirmar
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Repite la nueva"
                    required
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>
              </div>

              {pwError && (
                <div
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {pwError}
                </div>
              )}
              {pwOk && (
                <div
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}
                >
                  <CheckCircle size={14} className="flex-shrink-0" />
                  Contraseña actualizada correctamente
                </div>
              )}

              <button
                type="submit"
                disabled={pwSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <Key size={14} />
                {pwSaving ? "Guardando…" : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        </div>

        {/* Columna lateral — foto */}
        <div className="space-y-4">
          <div
            className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
              Foto de perfil
            </h2>

            {/* Preview */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div
                className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)" }}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-white/20" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <p className="text-center text-white/30 text-xs">
              {uploading ? "Subiendo…" : "JPG, PNG o WebP · Máx 2 MB"}
            </p>

            {photoUrl && (
              <div className="mt-4">
                <InputField
                  label="URL de la foto"
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  placeholder="https://…"
                  hint="O pega una URL directamente"
                />
              </div>
            )}
          </div>

          {/* Mini preview info */}
          {profile?.slug && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(233,30,140,0.06)", border: "1px solid rgba(233,30,140,0.15)" }}
            >
              <p className="text-xs text-white/50 mb-2">Tu ficha pública:</p>
              <a
                href={`/humanos/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold break-all"
                style={{ color: "#e91e8c" }}
              >
                <ExternalLink size={13} className="flex-shrink-0" />
                /humanos/{profile.slug}
              </a>
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
