/**
 * Efizientia Ranking Section
 * Design: Fondo negro, grid de tarjetas con ranking de compañías
 * "Top 10# Ranking Compañía Recomendadas"
 */

const ranking = [
  { pos: 1, name: "Audax", savings: 36, color: "#0066CC" },
  { pos: 2, name: "VM Energía", savings: 32, color: "#6600CC" },
  { pos: 3, name: "Aldro", savings: 24, color: "#00A3E0" },
  { pos: 4, name: "Holaluz", savings: 21, color: "#FF4500" },
  { pos: 5, name: "Feníe Energía", savings: 20, color: "#003399" },
  { pos: 6, name: "Fox Energía", savings: 18, color: "#FF6600" },
  { pos: 7, name: "Iberdrola", savings: 17, color: "#00A859" },
  { pos: 8, name: "Repsol", savings: 16, color: "#FF6B00" },
  { pos: 9, name: "Acciona", savings: 15, color: "#C8102E" },
  { pos: 10, name: "Energía Galega", savings: 14, color: "#009900" },
];

function RankingCard({ item }: { item: typeof ranking[0] }) {
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: "#111111", border: "1px solid #222" }}
    >
      {/* Position */}
      <div className="flex-shrink-0 w-8 text-center">
        <span
          className="text-2xl font-black"
          style={{
            color: item.pos <= 3 ? "#e91e8c" : "#555",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {item.pos}
        </span>
      </div>

      {/* Company name */}
      <div className="flex-1 min-w-0">
        <p
          className="text-white font-bold text-sm truncate"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          {item.name}
        </p>
        {/* Progress bar */}
        <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${item.savings}%`,
              backgroundColor: "#e91e8c",
            }}
          />
        </div>
      </div>

      {/* Savings % */}
      <div className="flex-shrink-0 text-right">
        <span
          className="text-lg font-black"
          style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
        >
          {item.savings}%
        </span>
      </div>
    </div>
  );
}

export default function RankingSection() {
  return (
    <section className="section-dark py-20" id="ranking">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-tag mb-3">Comparativa actualizada</p>
          <h2
            className="text-3xl lg:text-4xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Top 10{" "}
            <span style={{ color: "#e91e8c" }}>#</span>{" "}
            Ranking Compañías Recomendadas
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Basado en el ahorro real conseguido para nuestros clientes este mes
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {ranking.map((item) => (
            <RankingCard key={item.pos} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
