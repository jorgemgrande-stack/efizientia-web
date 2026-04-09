/**
 * Efizientia Footer
 * Design: Fondo negro, logo, menú, logos de compañías, redes sociales
 * Copyright 2025 All Rights Reserved
 */
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Luz", href: "#luz" },
  { label: "Gas", href: "#gas" },
  { label: "Efis", href: "#efis" },
  { label: "Humanos", href: "#humanos" },
];

const legalLinks = [
  { label: "Política de privacidad", href: "#" },
  { label: "Aviso legal", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Contacto", href: "#" },
];

const companies = [
  { name: "endesa", color: "#00A3E0" },
  { name: "naturgy", color: "#FF6B00" },
  { name: "repsol", color: "#FF6B00" },
  { name: "iberdrola", color: "#00A859" },
  { name: "acciona", color: "#C8102E" },
];

const socials = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "X-Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Logo & Description */}
          <div>
            <div className="mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efizientia-logo_cee443ca.png"
                alt="Efizientia"
                style={{
                  height: "40px",
                  width: "auto",
                  objectFit: "contain",
                  mixBlendMode: "screen",
                }}
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Hackeamos el mercado eléctrico para darte siempre el mejor precio. Sin rodeos, sin
              tecnicismos, solo ahorro real.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: "#1a1a1a", color: "white" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-white font-black text-sm uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Navegación
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-white font-black text-sm uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Companies logos */}
        <div
          className="py-6 mb-6 rounded-xl"
          style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}
        >
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest text-center mb-4">
            Comercializadoras asociadas
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap px-6">
            {companies.map((c) => (
              <span
                key={c.name}
                className="font-black text-base uppercase tracking-tight"
                style={{ color: c.color, fontFamily: "'Montserrat', sans-serif" }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            © 2025 Efizientia. All Rights Reserved.
          </p>
          <p className="text-white/20 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Hackeamos el precio de la luz desde España 🇪🇸
          </p>
        </div>
      </div>
    </footer>
  );
}
