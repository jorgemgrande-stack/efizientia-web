/**
 * Efizientia Navbar
 * Design: Dark Tech con acentos magenta
 * - Logo: "EFI" blanco + "ZIENTIA" magenta + icono hoja verde
 * - Menú: Luz, Gas, Efis, Humanos
 * - Botones flotantes: Llamar, WhatsApp
 * - Mobile: hamburger menu
 */
import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageCircle, Facebook, Instagram } from "lucide-react";

const navLinks = [
  { label: "Luz", href: "/luz" },
  { label: "Gas", href: "/gas" },
  { label: "Los Efis", href: "/efis" },
  { label: "Humanos", href: "/#humanos" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-black"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo — versión horizontal con fondo negro, ratio 2.69:1 (500x186px) */}
            <a href="/" className="flex items-center flex-shrink-0">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efizientia-logo-dark_f1c2a2ee.png"
                alt="Efizientia"
                style={{
                  height: '60px',
                  width: '120px',
                  objectFit: "contain",
                  objectPosition: "left center",
                }}
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-white font-semibold text-sm tracking-wide transition-colors duration-200 relative group"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e91e8c] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="tel:+34856288341"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
              >
                <Phone size={16} />
                Llamar
              </a>
              <a
                href="https://wa.me/34856288341"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-md transition-all duration-200"
                style={{ backgroundColor: "#e91e8c", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f72585")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
              >
                <MessageCircle size={16} />
                Wasapeamos
              </a>
              <a href="https://www.facebook.com/Efficientia.Energia/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/efizientia" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white font-semibold text-base py-2 border-b border-white/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-4 pt-2">
                <a href="tel:+34856288341" className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                  <Phone size={16} /> Llamar
                </a>
                <a
                  href="https://wa.me/34856288341"
                  className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-md"
                  style={{ backgroundColor: "#e91e8c", color: "white" }}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Chat Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="tel:+34856288341"
          className="flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
        >
          <Phone size={16} style={{ color: "#e91e8c" }} />
          <span className="hidden sm:inline">Hablamos?</span>
        </a>
        <a
          href="https://wa.me/34856288341"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">Wasapeamos</span>
        </a>
      </div>
    </>
  );
}
