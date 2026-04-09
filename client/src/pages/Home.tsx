/**
 * Efizientia Home Page
 * Design: Dark Tech con acentos magenta - fiel al diseño original
 * Tipografía: Montserrat (títulos) + Nunito Sans (cuerpo)
 * Colores: #0a0a0a (dark bg) + #e91e8c (magenta) + #ffffff (blanco)
 *
 * Secciones:
 * 1. Navbar
 * 2. Hero + formulario wizard
 * 3. Carrusel logos comercializadoras
 * 4. Proceso 5 pasos
 * 5. Beneficios + gráfico ahorro
 * 6. Ranking Top 10
 * 7. Estadísticas animadas
 * 8. Sección Luz
 * 9. Sección Gas
 * 10. Newsletter
 * 11. Ofertas de última hora
 * 12. CTA Banner mascota Efi
 * 13. ¿Qué hacemos por tí?
 * 14. Testimonios
 * 15. Footer
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LogosCarousel from "@/components/LogosCarousel";
import ProcessSection from "@/components/ProcessSection";
import BenefitsSection from "@/components/BenefitsSection";
import RankingSection from "@/components/RankingSection";
import StatsSection from "@/components/StatsSection";
import { LuzSection, GasSection } from "@/components/LuzGasSection";
import { NewsletterSection, OffersSection } from "@/components/OffersSection";
import CtaBanner from "@/components/CtaBanner";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* 1. Hero with upload form */}
        <HeroSection />

        {/* 2. Logos carousel */}
        <LogosCarousel />

        {/* 3. Process steps */}
        <ProcessSection />

        {/* 4. Benefits + savings chart */}
        <BenefitsSection />

        {/* 5. Ranking Top 10 */}
        <RankingSection />

        {/* 6. Animated stats */}
        <StatsSection />

        {/* 7. Luz section */}
        <LuzSection />

        {/* 8. Gas section */}
        <GasSection />

        {/* 9. Newsletter */}
        <NewsletterSection />

        {/* 10. Offers */}
        <OffersSection />

        {/* 11. CTA Banner with mascot */}
        <CtaBanner />

        {/* 12. What we do */}
        <WhatWeDoSection />

        {/* 13. Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
