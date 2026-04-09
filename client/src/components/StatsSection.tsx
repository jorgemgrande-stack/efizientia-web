/**
 * Efizientia Stats Section
 * Design: Fondo negro, contadores animados + imagen 3D cartoon
 * Estadísticas: clientes, ahorro, compañías, euros
 */
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number = 2000, suffix: string = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const stats = [
  { value: 12500, suffix: "+", label: "clientes cambiaron su luz", decimals: false },
  { value: 2.4, suffix: " M+", label: "Clientes están ahorrando en energía", decimals: true },
  { value: 175, suffix: "+", label: "Compañías analizadas", decimals: false },
  { value: 850, suffix: " K", label: "€ ahorrados a clientes", decimals: false },
];

function StatItem({ value, suffix, label, decimals }: typeof stats[0]) {
  const intValue = decimals ? Math.round(value * 10) : value;
  const { count, ref } = useCountUp(intValue, 2500);
  const display = decimals ? (count / 10).toFixed(1) : count.toLocaleString("es-ES");

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl lg:text-5xl font-black mb-2"
        style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
      >
        {display}
        <span className="text-2xl lg:text-3xl">{suffix}</span>
      </div>
      <p className="text-white/60 text-sm font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="section-dark py-20 border-t border-white/5" id="estadisticas">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stats grid */}
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <StatItem key={i} {...stat} />
            ))}
          </div>

          {/* Right: Image */}
          <div className="flex justify-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-man-bill-L8qtPHyZQtKvtfB6jiF8Ns.webp"
              alt="Hombre preocupado por factura de luz"
              className="rounded-2xl max-w-sm w-full object-cover shadow-2xl"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
