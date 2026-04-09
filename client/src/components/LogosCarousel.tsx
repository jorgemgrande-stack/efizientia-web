/**
 * Efizientia Logos Carousel
 * Design: Carrusel infinito de logos de comercializadoras
 * Fondo blanco con texto: "Que gane el mejor... o, que el mejor gane menos...."
 */

const companies = [
  { name: "Endesa", color: "#00A3E0" },
  { name: "Iberdrola", color: "#00A859" },
  { name: "Naturgy", color: "#FF6B00" },
  { name: "Repsol", color: "#FF6B00" },
  { name: "Acciona", color: "#C8102E" },
  { name: "Audax", color: "#0066CC" },
  { name: "Holaluz", color: "#FF4500" },
  { name: "Aldro", color: "#00A3E0" },
  { name: "VM Energía", color: "#6600CC" },
  { name: "Fox Energía", color: "#FF6600" },
  { name: "Feníe Energía", color: "#003399" },
  { name: "Octopus Energy", color: "#FF1493" },
  { name: "TotalEnergies", color: "#CC0000" },
  { name: "Podo", color: "#00CC66" },
  { name: "Lucera", color: "#FF6600" },
  { name: "Pepe Energy", color: "#FF3300" },
  { name: "Vivaluz", color: "#0099CC" },
  { name: "Gana Energía", color: "#009900" },
  { name: "Nace Energía", color: "#6600FF" },
  { name: "Nabalia", color: "#CC6600" },
];

function CompanyLogo({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center px-6 py-3 mx-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex-shrink-0"
      style={{ minWidth: "140px", height: "60px" }}
    >
      <span
        className="font-black text-sm tracking-tight"
        style={{ color, fontFamily: "'Montserrat', sans-serif" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function LogosCarousel() {
  const doubled = [...companies, ...companies];

  return (
    <section className="section-light py-10 overflow-hidden" style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
      <div className="container mx-auto px-4 max-w-7xl mb-8 text-center">
        <p
          className="text-gray-500 text-sm font-semibold italic"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          Que gane el mejor... o, que el mejor gane menos....
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        <div className="marquee-track">
          {doubled.map((company, i) => (
            <CompanyLogo key={`${company.name}-${i}`} name={company.name} color={company.color} />
          ))}
        </div>
      </div>
    </section>
  );
}
