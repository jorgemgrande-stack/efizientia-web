/**
 * Contact — Página de contacto de Efizientia
 * Design: Dark Tech, fondo negro, acentos magenta, formulario con animaciones
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
    label: "Teléfono 24h",
    value: "+34 856 28 83 41",
    href: "tel:+34856288341",
    color: "#e91e8c",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.524 5.849L.057 23.5l5.79-1.518A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.37l-.358-.213-3.716.975.99-3.617-.234-.371A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+34 856 28 83 41",
    href: "https://wa.me/34856288341",
    color: "#25D366",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "hola@efizientia.es",
    href: "mailto:hola@efizientia.es",
    color: "#e91e8c",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Dirección",
    value: "Calle Joyería 8, 11408 Jerez de la Frontera (Cádiz)",
    href: "https://maps.google.com/?q=Calle+Joyería+8+Jerez+de+la+Frontera",
    color: "#e91e8c",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/Efficientia.Energia/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/efizientia",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacy: boolean;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "Quiero optimizar mi factura",
    message: "",
    privacy: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacy) return;
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #e91e8c 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <span
              className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "#1a1a1a", color: "#e91e8c", border: "1px solid #e91e8c33" }}
            >
              Estamos aquí para ayudarte
            </span>
            <h1
              className="text-4xl md:text-6xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Hablemos de tu{" "}
              <span style={{ color: "#e91e8c" }}>factura</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Nuestros Efis están listos para analizar tu consumo y encontrar la mejor tarifa para ti. Sin compromiso, sin letra pequeña.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2
                  className="text-2xl font-black text-white mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Contacta con nosotros
                </h2>
                <p className="text-white/40 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Disponibles de lunes a domingo, 24 horas al día.
                </p>
              </div>

              {/* Contact items */}
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl transition-all group"
                    style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = item.color + "55";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color + "22", color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.label}
                      </p>
                      <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social */}
              <div>
                <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Síguenos
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: "#1a1a1a", color: "white" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#e91e8c";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#1a1a1a";
                      }}
                      title={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Fiscal data */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}
              >
                <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Datos Fiscales
                </p>
                <div className="space-y-1">
                  <p className="text-white/70 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    <strong className="text-white">EFIZIENTIA ENERGÍAS RENOVABLES SL</strong>
                  </p>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>CIF: B05310511</p>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Calle Joyería 8, 11408</p>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Jerez de la Frontera (Cádiz)</p>
                </div>
              </div>

              {/* CTA widget */}
              <a
                href={WIDGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
                style={{
                  background: "linear-gradient(135deg, #e91e8c, #c2185b)",
                  color: "white",
                  fontFamily: "'Montserrat', sans-serif",
                  boxShadow: "0 0 20px #e91e8c44",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #e91e8c88";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #e91e8c44";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Subir mi factura ahora
              </a>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}
              >
                {submitted ? (
                  <div className="text-center py-16">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: "#e91e8c22", border: "2px solid #e91e8c" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth={2.5} className="w-10 h-10">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3
                      className="text-2xl font-black text-white mb-3"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-white/50 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Un Efi se pondrá en contacto contigo en menos de 24 horas. También puedes llamarnos directamente al{" "}
                      <a href="tel:+34856288341" style={{ color: "#e91e8c" }}>+34 856 28 83 41</a>.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "Quiero optimizar mi factura", message: "", privacy: false }); }}
                      className="mt-6 px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
                      style={{ backgroundColor: "#1a1a1a", color: "white", border: "1px solid #333", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <h2
                      className="text-2xl font-black text-white mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Envíanos un mensaje
                    </h2>
                    <p className="text-white/40 text-sm mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Rellena el formulario y te respondemos en menos de 24 horas.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Nombre *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 outline-none transition-all"
                            style={{ backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", fontFamily: "'Nunito Sans', sans-serif" }}
                            onFocus={(e) => { e.target.style.borderColor = "#e91e8c55"; }}
                            onBlur={(e) => { e.target.style.borderColor = "#2a2a2a"; }}
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+34 600 000 000"
                            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 outline-none transition-all"
                            style={{ backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", fontFamily: "'Nunito Sans', sans-serif" }}
                            onFocus={(e) => { e.target.style.borderColor = "#e91e8c55"; }}
                            onBlur={(e) => { e.target.style.borderColor = "#2a2a2a"; }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 outline-none transition-all"
                          style={{ backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", fontFamily: "'Nunito Sans', sans-serif" }}
                          onFocus={(e) => { e.target.style.borderColor = "#e91e8c55"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#2a2a2a"; }}
                        />
                      </div>

                      <div>
                        <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Asunto *
                        </label>
                        <select
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all appearance-none"
                          style={{ backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", fontFamily: "'Nunito Sans', sans-serif" }}
                          onFocus={(e) => { e.target.style.borderColor = "#e91e8c55"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#2a2a2a"; }}
                        >
                          <option value="Quiero optimizar mi factura">Quiero optimizar mi factura</option>
                          <option value="Consulta sobre tarifa de luz">Consulta sobre tarifa de luz</option>
                          <option value="Consulta sobre tarifa de gas">Consulta sobre tarifa de gas</option>
                          <option value="Información sobre energía solar">Información sobre energía solar</option>
                          <option value="Colaboración o partnership">Colaboración o partnership</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Mensaje *
                        </label>
                        <textarea
                          name="message"
                          required
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Cuéntanos qué necesitas... ¿Tienes una factura muy alta? ¿Quieres cambiar de compañía? ¿Buscas la mejor tarifa para tu negocio?"
                          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
                          style={{ backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", fontFamily: "'Nunito Sans', sans-serif" }}
                          onFocus={(e) => { e.target.style.borderColor = "#e91e8c55"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#2a2a2a"; }}
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="privacy"
                          name="privacy"
                          checked={form.privacy}
                          onChange={handleChange}
                          className="mt-1 flex-shrink-0"
                          style={{ accentColor: "#e91e8c" }}
                        />
                        <label htmlFor="privacy" className="text-white/40 text-xs leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                          He leído y acepto la{" "}
                          <a href="/privacidad" style={{ color: "#e91e8c" }}>Política de Privacidad</a>{" "}
                          de EFIZIENTIA ENERGÍAS RENOVABLES SL y consiento el tratamiento de mis datos personales para atender mi consulta.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={!form.privacy || loading}
                        className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        style={{
                          background: form.privacy ? "linear-gradient(135deg, #e91e8c, #c2185b)" : "#1a1a1a",
                          color: form.privacy ? "white" : "#444",
                          fontFamily: "'Montserrat', sans-serif",
                          boxShadow: form.privacy ? "0 0 20px #e91e8c44" : "none",
                          cursor: form.privacy ? "pointer" : "not-allowed",
                        }}
                        onMouseEnter={(e) => {
                          if (form.privacy) {
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #e91e8c88";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (form.privacy) {
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #e91e8c44";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                          }
                        }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3} />
                              <path d="M21 12a9 9 0 00-9-9" />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Enviar mensaje
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
