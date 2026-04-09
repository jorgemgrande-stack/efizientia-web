/**
 * Efizientia Process Section
 * Design: Fondo negro, 5 pasos animados con tabs, imagen 3D cartoon
 * "Antes de lo que tardas en encender la luz, te optimizamos tu factura"
 */
import { useState } from "react";
import { Upload, Search, Shield, MessageSquare, Zap } from "lucide-react";

const WIDGET_URL = "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

const steps = [
  {
    id: 1,
    icon: Upload,
    title: "Sube tus facturas",
    description:
      "Introduce una o varias facturas de la luz en nuestra plataforma. Arrastra el PDF o la foto directamente.",
    href: WIDGET_URL,
  },
  {
    id: 2,
    icon: Search,
    title: "Comparamos por ti",
    description:
      "Analizamos todas las compañías y te mostramos la que más ahorro te aporta. Sin letra pequeña.",
  },
  {
    id: 3,
    icon: Shield,
    title: "Contratación segura",
    description:
      "Adjunta los datos necesarios y validamos la documentación de forma segura. Firma digital.",
  },
  {
    id: 4,
    icon: MessageSquare,
    title: "SMS de confirmación",
    description:
      "La compañía elegida te enviará un SMS para confirmar el alta. Sin llamadas eternas.",
  },
  {
    id: 5,
    icon: Zap,
    title: "Cambio sin cortes",
    description:
      "En máximo 7 días estarás con tu nueva comercializadora. Sin interrupciones ni sobrecostes.",
  },
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);

  const currentStep = steps.find((s) => s.id === activeStep)!;
  const Icon = currentStep.icon;

  return (
    <section className="section-dark py-20" id="proceso">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-tag mb-3">Proceso sencillo</p>
          <h2
            className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Antes de lo que tardas en encender la luz,{" "}
            <span style={{ color: "#e91e8c" }}>te optimizamos tu factura</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <div>
            {/* Step tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <>
                  {step.href ? (
                    <a
                      key={step.id}
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                        activeStep === step.id
                          ? "text-white shadow-lg"
                          : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70"
                      }`}
                      style={activeStep === step.id ? { backgroundColor: "#e91e8c" } : {}}
                    >
                      <StepIcon size={14} />
                      {step.title}
                    </a>
                  ) : (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                        activeStep === step.id
                          ? "text-white shadow-lg"
                          : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70"
                      }`}
                      style={activeStep === step.id ? { backgroundColor: "#e91e8c" } : {}}
                    >
                      <StepIcon size={14} />
                      {step.title}
                    </button>
                  )}
                  </>
                );
              })}
            </div>

            {/* Active step detail */}
            <div
              className="rounded-xl p-6 mb-8"
              style={{ backgroundColor: "#111111", border: "1px solid #222" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#e91e8c" }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                    Paso {currentStep.id} de 5
                  </span>
                  <h3
                    className="text-white text-xl font-black"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {currentStep.description}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-3">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`transition-all duration-300 rounded-full ${
                    activeStep === step.id ? "w-8 h-3" : "w-3 h-3 bg-white/20 hover:bg-white/40"
                  }`}
                  style={activeStep === step.id ? { backgroundColor: "#e91e8c" } : {}}
                />
              ))}
            </div>
          </div>

          {/* Right: Image + Magic button */}
          <div className="flex flex-col items-center gap-6">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-hero-couple-bzyFpqprUZCRGccD2XzG2Z.webp"
              alt="Pareja optimizando factura de luz"
              className="rounded-2xl w-full max-w-md object-cover shadow-2xl"
              style={{ maxHeight: "320px" }}
            />

            {/* Magic button */}
            <div className="text-center">
              <p className="text-white/50 text-sm mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Pulsa para que ocurra la magia en tu factura de la luz
              </p>
              <a
                href="https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597"
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all duration-300 hover:scale-110 shadow-lg pulse-glow"
                style={{
                  backgroundColor: "#e91e8c",
                  boxShadow: "0 0 30px rgba(233,30,140,0.5)",
                }}
              >
                <Zap size={32} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
