/**
 * Efizientia SaaS · Panel Admin — Editar Comercial
 * Edición completa de un perfil de asesor.
 * Campos básicos + todos los campos HumanoData para la sección pública /humanos.
 * Los arrays (services, stats, testimonials, process, topCompanies) se editan
 * como JSON en textarea, con botón de formato y validación en tiempo real.
 */

import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  Save, AlertCircle, CheckCircle, ArrowLeft, Mail,
  Trash2, ToggleLeft, ToggleRight, ExternalLink, Code2,
  Upload, User, KeyRound, Eye, EyeOff
} from "lucide-react";
import { useRef } from "react";
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
  profile_json: string | null;
  user_id: number | null;
  user_email: string | null;
  user_name: string | null;
  user_status: string | null;
  user_last_login: string | null;
}

// Default JSON structures for each array field
const DEFAULT_STATS = JSON.stringify([
  { value: "+1.000", label: "Facturas optimizadas" },
  { value: "15 min", label: "Respuesta media" },
  { value: "22–38%", label: "Ahorro medio" },
], null, 2);

const DEFAULT_SERVICES = JSON.stringify([
  "Optimización de potencia (P1–P6)",
  "Tarifa óptima Hogar & PyME",
  "Compensación de excedentes solar",
  "Altas, cambios de titular y SEPA",
  "Gas: RL, lecturas y regularizaciones",
  "Auditoría de facturas y penalizaciones",
], null, 2);

const DEFAULT_TESTIMONIALS = JSON.stringify([
  { text: "Bajó mi factura un 34% sin cambiar hábitos.", author: "Patricia G.", detail: "Vivienda · Sevilla" },
  { text: "En 24h tenía oferta firmada.", author: "Óscar M.", detail: "Tienda · Cádiz" },
], null, 2);

const DEFAULT_PROCESS = JSON.stringify([
  "Sube tu factura o déjame tus datos.",
  "Analizo patrón de consumo y potencias.",
  "Te envío la mejor tarifa y el ahorro estimado.",
  "Cerramos el cambio con firma SEPA en minutos.",
], null, 2);

const DEFAULT_TOP_COMPANIES = JSON.stringify([
  { pos: 1, name: "Audax", color: "#e91e8c" },
  { pos: 2, name: "Repsol Energía", color: "#ff6b35" },
  { pos: 3, name: "Naturgy", color: "#39d353" },
  { pos: 4, name: "Iberdrola", color: "#3b82f6" },
  { pos: 5, name: "Holaluz", color: "#a855f7" },
], null, 2);

const inputBase = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };
const focusMagenta = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e91e8c";
};
const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function JsonField({
  label, hint, value, onChange, defaultVal,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  defaultVal: string;
}) {
  const [valid, setValid] = useState(true);

  const handleChange = (v: string) => {
    onChange(v);
    try { JSON.parse(v); setValid(true); } catch { setValid(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
          {!valid && <span className="text-xs text-red-400">JSON inválido</span>}
          <button
            type="button"
            onClick={() => { try { handleChange(JSON.stringify(JSON.parse(value), null, 2)); } catch { handleChange(defaultVal); } }}
            className="text-white/30 hover:text-white/60 transition-colors p-1"
            title="Formatear / restaurar valor por defecto"
          >
            <Code2 size={12} />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 rounded-xl text-white text-xs outline-none transition-all resize-y font-mono"
        style={{
          ...inputStyle,
          borderColor: !valid ? "#e91e8c" : "rgba(255,255,255,0.12)",
        }}
        onFocus={focusMagenta}
        onBlur={blurGray}
      />
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

  // Basic fields
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [invoiceCtaUrl, setInvoiceCtaUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // HumanoData extended fields
  const [fullName, setFullName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [tagline, setTagline] = useState("");
  const [status, setStatus] = useState<"online" | "busy" | "offline">("online");
  const [schedule, setSchedule] = useState("");
  const [whatsappMsg, setWhatsappMsg] = useState("");
  const [tags, setTags] = useState(""); // comma-separated string

  // JSON array fields
  const [statsJson, setStatsJson] = useState(DEFAULT_STATS);
  const [servicesJson, setServicesJson] = useState(DEFAULT_SERVICES);
  const [testimonialsJson, setTestimonialsJson] = useState(DEFAULT_TESTIMONIALS);
  const [processJson, setProcessJson] = useState(DEFAULT_PROCESS);
  const [topCompaniesJson, setTopCompaniesJson] = useState(DEFAULT_TOP_COMPANIES);

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Acceso (crear cuenta / invitar)
  const [accesoTab, setAccesoTab] = useState<"cuenta" | "invitacion">("cuenta");
  const [accEmail, setAccEmail] = useState("");
  const [accPass, setAccPass] = useState("");
  const [showAccPass, setShowAccPass] = useState(false);
  const [accLoading, setAccLoading] = useState(false);
  const [accResult, setAccResult] = useState<{ ok?: boolean; error?: string } | null>(null);

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
        setAccEmail(c.user_email ?? "");
        setInviteEmail(c.user_email ?? "");

        // Load profile_json fields
        if (c.profile_json) {
          try {
            const pj = JSON.parse(c.profile_json);
            setFullName(pj.fullName ?? c.display_name ?? "");
            setRoleLabel(pj.role ?? "");
            setTagline(pj.tagline ?? "");
            setStatus(pj.status ?? "online");
            setSchedule(pj.schedule ?? "");
            setWhatsappMsg(pj.whatsappMsg ?? "");
            setTags(Array.isArray(pj.tags) ? pj.tags.join(", ") : "");
            if (pj.stats) setStatsJson(JSON.stringify(pj.stats, null, 2));
            if (pj.services) setServicesJson(JSON.stringify(pj.services, null, 2));
            if (pj.testimonials) setTestimonialsJson(JSON.stringify(pj.testimonials, null, 2));
            if (pj.process) setProcessJson(JSON.stringify(pj.process, null, 2));
            if (pj.topCompanies) setTopCompaniesJson(JSON.stringify(pj.topCompanies, null, 2));
          } catch { /* ignore parse errors */ }
        } else {
          setFullName(c.display_name ?? "");
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

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

  const buildProfileJson = (): string | null => {
    try {
      const obj: Record<string, unknown> = {
        slug,
        name: displayName,
        fullName: fullName || displayName,
        role: roleLabel,
        tagline,
        description: aboutText,
        image: photoUrl,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
        schedule,
        whatsappMsg,
        stats: JSON.parse(statsJson),
        services: JSON.parse(servicesJson),
        testimonials: JSON.parse(testimonialsJson),
        process: JSON.parse(processJson),
        topCompanies: JSON.parse(topCompaniesJson),
      };
      return JSON.stringify(obj);
    } catch {
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaveOk(false);

    const profile_json = buildProfileJson();
    if (profile_json === null) {
      setError("Hay errores de formato JSON en los campos de arrays. Corrígelos antes de guardar.");
      return;
    }

    setSaving(true);
    try {
      await api.admin.comerciales.update(Number(id), {
        slug, display_name: displayName,
        phone: phone || null, whatsapp: whatsapp || null,
        public_email: publicEmail || null, about_text: aboutText || null,
        invoice_cta_url: invoiceCtaUrl || null, photo_url: photoUrl || null,
        is_active: isActive ? 1 : 0,
        profile_json,
      });
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCrearCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccResult(null);
    setAccLoading(true);
    try {
      await api.admin.comerciales.createAccount(Number(id), accEmail, accPass);
      setAccResult({ ok: true });
      setAccPass("");
      // Recargar datos del perfil para reflejar el usuario vinculado
      api.admin.comerciales.get(Number(id)).then((raw) => {
        const c = raw as ComercialDetail;
        setData(c);
      });
    } catch (err) {
      setAccResult({ error: err instanceof ApiError ? err.message : "Error al crear cuenta" });
    } finally {
      setAccLoading(false);
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

          {/* ── Identificación ───────────────────────────────── */}
          <section className="rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Identificación</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre corto (display) *">
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
                  className={inputBase} style={inputStyle} onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
              <Field label="Slug URL *" hint="/humanos/{slug}">
                <input type="text" value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required className={inputBase} style={inputStyle} onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre completo" hint="Para la ficha pública">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder={displayName} className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
              <Field label="Rol / Cargo" hint="Ej: Asesor Senior · Luz & Gas">
                <input type="text" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value)}
                  placeholder="Asesor Senior · Luz & Gas" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
            </div>
            <Field label="Tagline" hint="Frase corta que aparece bajo el nombre">
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
                placeholder="El que encuentra el ahorro donde nadie mira." className={inputBase} style={inputStyle}
                onFocus={focusMagenta} onBlur={blurGray} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Estado">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "online" | "busy" | "offline")}
                  className={inputBase}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={focusMagenta}
                  onBlur={blurGray}
                >
                  <option value="online">🟢 online</option>
                  <option value="busy">🟡 busy</option>
                  <option value="offline">⚫ offline</option>
                </select>
              </Field>
              <Field label="Horario" hint="Ej: 08:00–20:00 (L–V)">
                <input type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)}
                  placeholder="08:00–20:00 (L–V)" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
              <Field label="Tags" hint="Separados por coma">
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="Luz, Gas, Hogar" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
            </div>
          </section>

          {/* ── Contacto ─────────────────────────────────────── */}
          <section className="rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Contacto</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Teléfono">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 6XX XXX XXX" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
              <Field label="WhatsApp">
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+34 6XX XXX XXX" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
            </div>
            <Field label="Email público">
              <input type="email" value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)}
                placeholder="nombre@efizientia.es" className={inputBase} style={inputStyle}
                onFocus={focusMagenta} onBlur={blurGray} />
            </Field>
            <Field label="Mensaje WhatsApp" hint="Texto pre-rellenado al hacer click en el botón WhatsApp">
              <input type="text" value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)}
                placeholder="Hola, me gustaría que me ayudaras a optimizar mi factura." className={inputBase} style={inputStyle}
                onFocus={focusMagenta} onBlur={blurGray} />
            </Field>
            <Field label="Descripción">
              <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)}
                rows={4} className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                style={inputStyle} onFocus={focusMagenta} onBlur={blurGray} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
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
                  {/* Preview */}
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
              <Field label="URL CTA factura" hint="Enlace personalizado para analizar factura">
                <input type="url" value={invoiceCtaUrl} onChange={(e) => setInvoiceCtaUrl(e.target.value)}
                  placeholder="https://…" className={inputBase} style={inputStyle}
                  onFocus={focusMagenta} onBlur={blurGray} />
              </Field>
            </div>
          </section>

          {/* ── Estadísticas ─────────────────────────────────── */}
          <section className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5">Estadísticas</h2>
            <JsonField
              label="Stats array"
              hint='Array de objetos: [{ "value": "+1.000", "label": "Facturas optimizadas" }, …]'
              value={statsJson}
              onChange={setStatsJson}
              defaultVal={DEFAULT_STATS}
            />
          </section>

          {/* ── Servicios ────────────────────────────────────── */}
          <section className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5">Servicios</h2>
            <JsonField
              label="Services array"
              hint='Array de strings: ["Optimización de potencia", "Tarifa óptima", …]'
              value={servicesJson}
              onChange={setServicesJson}
              defaultVal={DEFAULT_SERVICES}
            />
          </section>

          {/* ── Proceso ──────────────────────────────────────── */}
          <section className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5">Proceso</h2>
            <JsonField
              label="Process array"
              hint='Array de strings con los pasos del proceso: ["Sube tu factura.", "Analizo…", …]'
              value={processJson}
              onChange={setProcessJson}
              defaultVal={DEFAULT_PROCESS}
            />
          </section>

          {/* ── Testimonios ──────────────────────────────────── */}
          <section className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5">Testimonios</h2>
            <JsonField
              label="Testimonials array"
              hint='Array de objetos: [{ "text": "…", "author": "…", "detail": "…" }, …]'
              value={testimonialsJson}
              onChange={setTestimonialsJson}
              defaultVal={DEFAULT_TESTIMONIALS}
            />
          </section>

          {/* ── Top Compañías ────────────────────────────────── */}
          <section className="rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5">Top Compañías</h2>
            <JsonField
              label="TopCompanies array"
              hint='Array de objetos: [{ "pos": 1, "name": "Audax", "color": "#e91e8c" }, …]'
              value={topCompaniesJson}
              onChange={setTopCompaniesJson}
              defaultVal={DEFAULT_TOP_COMPANIES}
            />
          </section>

          {/* ── Save ─────────────────────────────────────────── */}
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

        {/* Sidebar — cuenta vinculada + gestión de acceso */}
        <div className="space-y-4">
          {/* Cuenta vinculada (info) */}
          <div className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Cuenta vinculada</h2>
            {data?.user_id ? (
              <div className="space-y-1.5">
                <div className="text-white text-sm font-semibold">{data.user_name}</div>
                <div className="text-white/50 text-xs">{data.user_email}</div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: data.user_status === "active" ? "rgba(57,211,83,0.1)" : "rgba(255,255,255,0.06)",
                    color: data.user_status === "active" ? "#39d353" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {data.user_status}
                </span>
                {data.user_last_login && (
                  <p className="text-white/30 text-xs pt-0.5">
                    Último acceso: {new Date(data.user_last_login).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/30 text-sm italic">Sin cuenta vinculada</p>
            )}
          </div>

          {/* Gestión de acceso (tabs: crear cuenta / invitar) */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">Gestionar acceso</h2>

            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["cuenta", "invitacion"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setAccesoTab(t); setAccResult(null); setInviteResult(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all"
                  style={{
                    background: accesoTab === t ? "rgba(233,30,140,0.15)" : "transparent",
                    color: accesoTab === t ? "#e91e8c" : "rgba(255,255,255,0.4)",
                    borderRadius: 9,
                  }}
                >
                  {t === "cuenta" ? <KeyRound size={11} /> : <Mail size={11} />}
                  {t === "cuenta" ? "Crear cuenta" : "Invitar"}
                </button>
              ))}
            </div>

            {accesoTab === "cuenta" ? (
              <form onSubmit={handleCrearCuenta} className="space-y-3">
                <p className="text-white/35 text-xs">Email y contraseña directos. Acceso inmediato al panel.</p>
                <input
                  type="email"
                  value={accEmail}
                  onChange={(e) => setAccEmail(e.target.value)}
                  placeholder="email@comercial.com"
                  required
                  className={inputBase}
                  style={{ ...inputStyle, fontSize: "13px" }}
                  onFocus={focusMagenta}
                  onBlur={blurGray}
                />
                <div className="relative">
                  <input
                    type={showAccPass ? "text" : "password"}
                    value={accPass}
                    onChange={(e) => setAccPass(e.target.value)}
                    placeholder="Contraseña (mín. 8 caracteres)"
                    required
                    minLength={8}
                    className={inputBase}
                    style={{ ...inputStyle, fontSize: "13px", paddingRight: "2.75rem" }}
                    onFocus={focusMagenta}
                    onBlur={blurGray}
                  />
                  <button type="button" onClick={() => setShowAccPass(!showAccPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showAccPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {accResult && (
                  <div className="text-xs rounded-xl px-3 py-2"
                    style={{
                      background: accResult.ok ? "rgba(57,211,83,0.08)" : "rgba(233,30,140,0.08)",
                      border: `1px solid ${accResult.ok ? "rgba(57,211,83,0.25)" : "rgba(233,30,140,0.25)"}`,
                      color: accResult.ok ? "#39d353" : "#e91e8c",
                    }}>
                    {accResult.ok ? "✓ Cuenta creada correctamente" : accResult.error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={accLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  <KeyRound size={13} />
                  {accLoading ? "Creando…" : "Crear cuenta"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleInvite} className="space-y-3">
                <p className="text-white/35 text-xs">El comercial recibirá un enlace para poner su propia contraseña. Válido 48h.</p>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className={inputBase}
                  style={{ ...inputStyle, fontSize: "13px" }}
                  onFocus={focusMagenta}
                  onBlur={blurGray}
                />
                {inviteResult && (
                  <div className="text-xs rounded-xl px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                    {inviteResult.msg}
                    {inviteResult.link && (
                      <div className="mt-1.5 font-mono break-all" style={{ color: "#e91e8c" }}>
                        {inviteResult.link}
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                  style={{ background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.2)", color: "#e91e8c" }}
                >
                  <Mail size={13} />
                  {inviting ? "Enviando…" : "Enviar invitación"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
