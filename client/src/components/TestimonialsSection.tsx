/**
 * Efizientia Testimonials Section
 * Design: Fondo claro, slider de testimonios con foto de cliente
 * "Muchas empresas juegan este juego pero con diferentes reglas..."
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    text: "Subí mi factura, me atendió Efi por el chat y en 10 minutos tenía la tarifa óptima. Me ajustaron la potencia y quitaron extras que no necesitaba. He pasado de 108 € a 78 € al mes. Cero permanencia y firma en el móvil.",
    name: "Jessica Lopez",
    location: "Madrid",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    stars: 5,
  },
  {
    text: "Revisaron mis horarios y la potencia. Cambié a una tarifa más ajustada y bajé P1/P2. El primer mes ya noté el recorte: más claro que mi antigua factura y todo firmado online.",
    name: "Marcos G.",
    location: "Málaga",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    stars: 5,
  },
  {
    text: "Detectaron que no se estaba aplicando la compensación de excedentes. Ajustaron mi tarifa y ahora mis horas solares cuentan. El cambio fue rapidísimo y todo desde el móvil.",
    name: "Tom Marques",
    location: "Barcelona",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    stars: 5,
  },
  {
    text: "Nos hicieron un estudio para pasarnos a discriminación horaria y ajustó P1/P2 a nuestros turnos. La factura bajó desde el primer mes sin tocar operaciones.",
    name: "Rafael Tenaguillo",
    location: "Segovia",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    stars: 5,
  },
  {
    text: "Neo analizó nuestros picos y nos pasó a discriminación horaria. Programamos equipos en valle y ajustamos potencia. El proceso fue claro y todo firmado online.",
    name: "Pablo S.",
    location: "A Coruña",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="section-light py-20" id="testimonios">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-tag mb-3" style={{ color: "#e91e8c" }}>Testimonios</p>
          <h2
            className="text-3xl lg:text-4xl font-black text-gray-900"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Muchas empresas juegan este juego pero{" "}
            <span style={{ color: "#e91e8c" }}>con diferentes reglas...</span>
          </h2>
        </div>

        {/* Testimonial slider */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-64 h-80 object-cover rounded-2xl shadow-2xl"
                  style={{ border: "3px solid #e91e8c" }}
                />
                {/* Name badge */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-center whitespace-nowrap"
                  style={{ backgroundColor: "#e91e8c", minWidth: "160px" }}
                >
                  <p className="text-white font-black text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {t.name}
                  </p>
                  <p className="text-white/80 text-xs">{t.location}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={18} fill="#e91e8c" style={{ color: "#e91e8c" }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="text-gray-700 text-lg leading-relaxed mb-8 italic"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                "{t.text}"
              </blockquote>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: "#f0f0f0", color: "#333" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e91e8c";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current ? "w-6 h-2.5" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                      style={i === current ? { backgroundColor: "#e91e8c" } : {}}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: "#f0f0f0", color: "#333" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e91e8c";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
