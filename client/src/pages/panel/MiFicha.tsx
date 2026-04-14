/**
 * Efizientia SaaS · Panel Asesor — Mi Ficha
 * El comercial edita sus datos públicos y de identidad.
 * También permite cambiar la contraseña.
 */

import { useEffect, useRef, useState } from "react";
import {
  Camera, Save, Eye, EyeOff, CheckCircle, AlertCircle,
  ExternalLink, Key, Copy, Tag,
} from "lucide-react";
import { useLocation } from "wouter";
import PanelLayout from "./PanelLayout";
import { api, ApiError } from "@/lib/api";

interface ProfileData {
  id?: number;
  slug?: string;
  display_name?: string;
  fullName?: string;
  role?: string | null;
  tagline?: string | null;
  status?: string;
  schedule?: string | null;
  tags?: string[];
  whatsappMsg?: string | null;
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
const readOnlyStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  readOnly = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  hint?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={inputBase}
        style={readOnly ? { ...readOnlyStyle, color: "rgba(255,255,255,0.45)", cursor: "default" } : inputStyle}
        onFocus={(e) => { if (!readOnly) e.currentTarget.style.borderColor = "#e91e8c"; }}
        onBlur={(e) => { if (!readOnly) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
      />
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function CopyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly
          className={inputBase}
          style={{ ...readOnlyStyle, color: "rgba(255,255,255,0.45)", cursor: "default", paddingRight: "48px" }}
        />
        <button
          type="button"
          onClick={handleCopy}
          title="Copiar"
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: copied ? "#39d353" : "rgba(255,255,255,0.35)" }}
        >
          {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function MiFicha() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  // ── Identidad ──
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleCargo, setRoleCargo] = useState("");
  const [taglineVal, setTaglineVal] = useState("");

  // ── Disponibilidad ──
  const [profileStatus, setProfileStatus] = useState("online");
  const [scheduleVal, setScheduleVal] = useState("");

  // ── Personalización ──
  const [tagsInput, setTagsInput] = useState("");
  const [whatsappMsgVal, setWhatsappMsgVal] = useState("");

  // ── Contacto ──
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [aboutText, setAboutText] = useState("");

  // ── Foto ──
  const [photoUrl, setPhotoUrl] = useState("");

  // ── UI ──
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Cambiar contraseña ──
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
        setDisplayName(p.display_name ?? "");
        setFullName(p.fullName ?? p.display_name ?? "");
        setRoleCargo(p.role ?? "");
        setTaglineVal(p.tagline ?? "");
        setProfileStatus(p.status ?? "online");
        setScheduleVal(p.schedule ?? "");
        setTagsInput((p.tags ?? []).join(", "));
        setWhatsappMsgVal(p.whatsappMsg ?? "");
        setPhone(p.phone ?? "");
        setWhatsapp(p.whatsapp ?? "");
        setPublicEmail(p.public_email ?? "");
        setAboutText(p.about_text ?? "");
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
    if (!displayName.trim()) {
      setSaveError("El nombre corto no puede estar vacío");
      return;
    }
    setSaving(true);
    try {
      const tagsArr = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const updated = await api.panel.update({
        // Columnas estructuradas
        display_name: displayName.trim(),
        phone: phone || null,
        whatsapp: whatsapp || null,
        public_email: publicEmail || null,
        about_text: aboutText || null,
        photo_url: photoUrl || null,
        // Campos de profile_json
        full_name: fullName || null,
        tagline: taglineVal || null,
        role_label: roleCargo || null,
        profile_status: profileStatus,
        schedule: scheduleVal || null,
        tags: tagsArr,
        whatsapp_msg: whatsappMsgVal || null,
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

  const statusOptions = [
    { value: "online",  label: "Online — Disponible ahora",       color: "#39d353" },
    { value: "busy",    label: "Respondiendo en breve",            color: "#f59e0b" },
    { value: "offline", label: "Fuera de horario",                 color: "#6b7280" },
  ];

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
        {/* ── Columna principal ── */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave}>

            {/* ── Identidad ── */}
            <div
              className="rounded-2xl p-6 space-y-5 mb-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                Identidad
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Nombre corto (display) *"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Ej: María García"
                  hint="Aparece en la cabecera y listados"
                />
                <InputField
                  label="Nombre completo"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Ej: María García Pérez"
                  hint="Nombre completo en tu ficha pública"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Rol / Cargo"
                  value={roleCargo}
                  onChange={setRoleCargo}
                  placeholder="Ej: Asesor Energético Senior"
                  hint="Se muestra debajo de tu nombre"
                />
                <InputField
                  label="Tagline"
                  value={taglineVal}
                  onChange={setTaglineVal}
                  placeholder="Ej: Especialista en comunidades y pymes"
                  hint="Frase corta debajo del cargo"
                />
              </div>
            </div>

            {/* ── Disponibilidad ── */}
            <div
              className="rounded-2xl p-6 space-y-5 mb-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                Disponibilidad
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      value={profileStatus}
                      onChange={(e) => setProfileStatus(e.target.value)}
                      className={`${inputBase} appearance-none pr-10`}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                    >
                      {statusOptions.map((o) => (
                        <option key={o.value} value={o.value} style={{ background: "#1a1a1a" }}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
                      style={{ background: statusOptions.find(o => o.value === profileStatus)?.color ?? "#39d353", boxShadow: `0 0 6px ${statusOptions.find(o => o.value === profileStatus)?.color ?? "#39d353"}` }}
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1">Visible en tu ficha pública</p>
                </div>

                <InputField
                  label="Horario"
                  value={scheduleVal}
                  onChange={setScheduleVal}
                  placeholder="Ej: Lun–Vie 9:00–19:00"
                  hint="Horario de atención visible en tu ficha"
                />
              </div>
            </div>

            {/* ── Personalización ── */}
            <div
              className="rounded-2xl p-6 space-y-5 mb-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Tag size={15} style={{ color: "#e91e8c" }} />
                <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                  Personalización
                </h2>
              </div>

              <InputField
                label="Etiquetas (tags)"
                value={tagsInput}
                onChange={setTagsInput}
                placeholder="Ej: Luz, Gas, Comunidades, Pymes"
                hint="Separa con comas. Aparecen como badges en tu ficha"
              />

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                  Mensaje WhatsApp
                </label>
                <textarea
                  value={whatsappMsgVal}
                  onChange={(e) => setWhatsappMsgVal(e.target.value)}
                  placeholder="Ej: Hola, me gustaría que me ayudaras con mi factura de energía."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <p className="text-white/30 text-xs mt-1">Mensaje que aparece prellenado al contactar por WhatsApp</p>
              </div>
            </div>

            {/* ── Datos de contacto ── */}
            <div
              className="rounded-2xl p-6 space-y-5 mb-6"
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
            </div>

            {/* ── Configuración (solo lectura) ── */}
            <div
              className="rounded-2xl p-6 space-y-5 mb-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                Configuración
              </h2>
              <p className="text-white/30 text-xs -mt-3">
                Solo el administrador puede modificar estos valores.
              </p>

              <CopyField
                label="Slug URL *"
                value={profile?.slug ? `/humanos/${profile.slug}` : ""}
                hint="Tu URL pública permanente"
              />

              <CopyField
                label="URL subir factura (CTA personal)"
                value={profile?.invoice_cta_url ?? ""}
                hint="Enlace personalizado para subir factura. Vacío = global de Efizientia."
              />
            </div>

            {/* ── Feedback + botón guardar ── */}
            {saveError && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mb-4"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {saveError}
              </div>
            )}
            {saveOk && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mb-4"
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
          </form>

          {/* ── Cambiar contraseña ── */}
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

        {/* ── Columna lateral — foto ── */}
        <div className="space-y-4">
          <div
            className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
              Foto de perfil
            </h2>

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
