# Contexto del proyecto para Claude

Este archivo es leído automáticamente por Claude cuando trabajas en este proyecto.

## ¿Qué es este proyecto?

Sitio web de **Efizientia**, asesoría energética española especializada en optimización de facturas de luz y gas. El lema es "Hackeamos tu precio de la luz".

## Stack

- **React 19** + **Vite** (frontend estático, sin backend)
- **Tailwind CSS 4** + CSS variables para tokens de diseño
- **shadcn/ui** (componentes Radix) — importar desde `@/components/ui/*`
- **Wouter** para routing (no React Router)
- **TypeScript** estricto
- **Lucide React** para iconos

## Diseño (NO cambiar sin motivo)

- **Fondo dark**: `#0a0a0a` / `#111111` (secciones oscuras), `#ffffff` (secciones claras)
- **Magenta**: `#e91e8c` — color de marca principal, CTAs, highlights
- **Verde**: `#39d353` — badges online, confirmaciones, éxito
- **Tipografía títulos**: Montserrat Black (900) — `fontFamily: "'Montserrat', sans-serif"`
- **Tipografía cuerpo**: Nunito Sans — `fontFamily: "'Nunito Sans', sans-serif"`
- **NO usar**: Inter, purple gradients, layouts centrados genéricos

## Rutas (Wouter en App.tsx)

```
/                           → Home.tsx
/luz                        → Luz.tsx
/gas                        → Gas.tsx
/efis                       → Efis.tsx
/efis/:slug                 → EfiProfile.tsx
/humanos                    → Humanos.tsx
/humanos/:slug              → HumanoProfile.tsx
/optimizacion_factura_energetica → OptimizacionFactura.tsx
/contacto                   → Contact.tsx
/privacidad                 → PrivacyPolicy.tsx
/cookies                    → CookiesPolicy.tsx
/aviso-legal                → LegalNotice.tsx
```

## Assets (CDN — NO hay imágenes locales)

```
Logo: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efizientia-logo-dark_f1c2a2ee.png
Mascota: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-mascot_36782492.jpg
Hero 1-5: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero[1-5]_*.jpg
```

## Widget de Kiwatio (CTA principal)

```
URL: https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597
```

Este widget es el iframe donde los clientes suben sus facturas. Aparece en:
- `HeroSection.tsx` — embebido en el hero (columna derecha)
- `OptimizacionFactura.tsx` — pantalla completa (landing para IA telefónica)
- Múltiples CTAs como enlace `target="_blank"`

## Datos de contenido

- **Efis** (asistentes IA): `client/src/data/efis.ts`
- **Humanos** (asesores reales): `client/src/data/humanos.ts`

## Contacto de la empresa

```
Tel: +34 856 28 83 41
WhatsApp: https://wa.me/34856288341
Email: hola@efizientia.es
```

## Mensajes de valor diferencial (usar en copy)

1. "Estudio inmediato: en menos de 2 minutos sabemos si pagas de más"
2. "Contratación en menos de 5 minutos · Firma digital desde el móvil"
3. "Centralita 24 horas · Siempre hay alguien al otro lado"
4. "Somos de las pocas asesorías con estudio inmediato y contratación en 5 min"

## Convenciones

- Cada archivo `.tsx` empieza con un comentario de cabecera `/** ... */` explicando propósito y diseño
- Estilos inline para valores de marca específicos; Tailwind para layout y utilidades
- Datos de contenido separados en `src/data/` — no hardcodear en componentes
- Toasts con `sonner` (no react-toastify)
- Links internos con `<a href="...">` o wouter `<Link>` (no `<a><Link>` anidados)
