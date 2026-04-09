# Efizientia Web — Hackeamos tu precio de la luz

Sitio web de **Efizientia**, asesoría energética especializada en optimización de facturas de luz y gas. Construido con React 19 + Tailwind CSS 4 + shadcn/ui. Diseño dark-tech con acentos magenta y verde.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | React 19 (Vite) |
| Estilos | Tailwind CSS 4 + CSS variables |
| Componentes UI | shadcn/ui (Radix primitives) |
| Routing | Wouter |
| Iconos | Lucide React |
| Tipografías | Montserrat (títulos) + Nunito Sans (cuerpo) — Google Fonts |
| Deploy | Manus Web Hosting (efizientia-bnfkawee.manus.space) |

---

## Arrancar en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/efizientia-web.git
cd efizientia-web

# 2. Instalar dependencias
pnpm install

# 3. Arrancar el servidor de desarrollo
pnpm dev
# → http://localhost:3000
```

> **Requisito**: Node.js ≥ 22 y pnpm instalado (`npm install -g pnpm`)

---

## Estructura del proyecto

```
efizientia-web/
├── client/
│   ├── index.html              ← Entry HTML (Google Fonts aquí)
│   ├── public/                 ← Solo favicon, robots.txt
│   └── src/
│       ├── App.tsx             ← Rutas (Wouter Switch/Route)
│       ├── index.css           ← Tokens de diseño globales (CSS variables)
│       ├── main.tsx            ← Entry point React
│       ├── components/         ← Componentes reutilizables
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── HeroSection.tsx
│       │   ├── BenefitsSection.tsx
│       │   ├── ProcessSection.tsx
│       │   ├── StatsSection.tsx
│       │   ├── CtaBanner.tsx
│       │   ├── TestimonialsSection.tsx
│       │   ├── RankingSection.tsx
│       │   ├── LuzGasSection.tsx
│       │   ├── LogosCarousel.tsx
│       │   ├── OffersSection.tsx
│       │   ├── WhatWeDoSection.tsx
│       │   ├── ChatModal.tsx
│       │   └── ui/             ← shadcn/ui components
│       ├── pages/              ← Páginas por ruta
│       │   ├── Home.tsx                        → /
│       │   ├── Luz.tsx                         → /luz
│       │   ├── Gas.tsx                         → /gas
│       │   ├── Efis.tsx                        → /efis
│       │   ├── EfiProfile.tsx                  → /efis/:slug
│       │   ├── Humanos.tsx                     → /humanos
│       │   ├── HumanoProfile.tsx               → /humanos/:slug
│       │   ├── OptimizacionFactura.tsx         → /optimizacion_factura_energetica
│       │   ├── Contact.tsx                     → /contacto
│       │   ├── PrivacyPolicy.tsx               → /privacidad
│       │   ├── CookiesPolicy.tsx               → /cookies
│       │   ├── LegalNotice.tsx                 → /aviso-legal
│       │   └── NotFound.tsx                    → 404
│       ├── data/
│       │   ├── efis.ts         ← Datos de los Efis (IA asistentes)
│       │   └── humanos.ts      ← Datos del equipo humano de asesores
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       ├── hooks/
│       │   ├── useMobile.tsx
│       │   ├── useComposition.ts
│       │   └── usePersistFn.ts
│       └── lib/
│           └── utils.ts
├── server/                     ← Placeholder (proyecto estático, no usado)
├── shared/
│   └── const.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Rutas del sitio

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Landing principal con hero, proceso, stats, beneficios, CTA |
| `/luz` | Luz | Landing de servicio Luz con comparativa de tarifas |
| `/gas` | Gas | Landing de servicio Gas con comparativa de tarifas |
| `/efis` | Efis | Galería de los Efis (asistentes IA) |
| `/efis/:slug` | EfiProfile | Perfil individual de cada Efi |
| `/humanos` | Humanos | Galería del equipo humano de asesores |
| `/humanos/:slug` | HumanoProfile | Perfil individual de cada asesor |
| `/optimizacion_factura_energetica` | OptimizacionFactura | Landing minimalista con iframe widget Kiwatio (enviada por IA telefónica) |
| `/contacto` | Contact | Formulario de contacto |
| `/privacidad` | PrivacyPolicy | Política de privacidad |
| `/cookies` | CookiesPolicy | Política de cookies |
| `/aviso-legal` | LegalNotice | Aviso legal |

---

## Recursos externos (CDN)

Todos los assets estáticos están alojados en CloudFront. **No hay imágenes en el repositorio** — esto es intencionado para evitar timeouts en el deploy.

### Logo y mascota

```
Logo principal (dark):
https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efizientia-logo-dark_f1c2a2ee.png

Mascota Efi (3D cartoon):
https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-mascot_36782492.jpg
```

### Imágenes del hero (carrusel)

```
hero1: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero1_a3fbf53c.jpg
hero2: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero2_195ddc15.jpg
hero3: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero3_e3745729.jpg
hero4: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero4_fd46090f.jpg
hero5: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero5_e07fdd4c.jpg
```

### Widget de Kiwatio (iframe)

```
URL del widget:
https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597

Usado en:
- HeroSection.tsx (iframe embebido en el hero)
- BenefitsSection.tsx (enlace CTA)
- OptimizacionFactura.tsx (iframe pantalla completa)
```

---

## Paleta de colores y tokens de diseño

Definidos en `client/src/index.css`:

| Token | Valor | Uso |
|---|---|---|
| Magenta principal | `#e91e8c` | Acentos, CTAs, highlights |
| Verde acción | `#39d353` | Badges online, confirmaciones |
| Fondo dark | `#0a0a0a` / `#111111` | Secciones oscuras |
| Fondo light | `#ffffff` / `#f9f9f9` | Secciones claras |
| Texto dark | `#ffffff` | Sobre fondos oscuros |
| Texto light | `#111111` | Sobre fondos claros |

### Tipografías

```html
<!-- En client/index.html -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

- **Montserrat Black (900)**: títulos H1, H2, logos
- **Nunito Sans (400/600/700)**: cuerpo, subtítulos, labels

---

## Datos del equipo (editar contenido)

### Efis (asistentes IA) → `client/src/data/efis.ts`

Cada Efi tiene: `id`, `slug`, `name`, `role`, `specialty`, `description`, `longBio`, `stats`, `skills`, `testimonials`, `avatar`.

### Humanos (asesores) → `client/src/data/humanos.ts`

Cada asesor tiene: `id`, `slug`, `name`, `role`, `tagline`, `photo`, `status`, `schedule`, `stats`, `tags`, `skills`, `testimonials`, `topCompanies`, `bio`, `whatsapp`, `phone`, `email`.

> **Para añadir un asesor**: duplicar un objeto en el array y actualizar los campos. El slug se usa en la URL `/humanos/:slug`.

---

## Contacto y datos de la empresa

```
Teléfono:  +34 856 28 83 41
WhatsApp:  https://wa.me/34856288341
Email:     hola@efizientia.es
Facebook:  https://facebook.com/efizientia
Instagram: https://instagram.com/efizientia
```

---

## Trabajar con VS Code + Claude

### Extensiones recomendadas

```json
// .vscode/extensions.json (ya incluido)
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "antfu.iconify",
    "claude-ai.claude-vscode"
  ]
}
```

### Prompt de contexto para Claude

Cuando abras el proyecto en Claude, usa este prompt de contexto para que entienda el proyecto:

```
Estoy trabajando en el sitio web de Efizientia (asesoría energética española).
Stack: React 19 + Vite + Tailwind CSS 4 + shadcn/ui + Wouter (routing) + TypeScript.
Diseño: dark-tech, fondo negro (#0a0a0a), acentos magenta (#e91e8c) y verde (#39d353).
Tipografías: Montserrat (títulos, font-black) + Nunito Sans (cuerpo).
Los assets (imágenes, logo) están en CloudFront CDN — no hay imágenes locales.
El widget de Kiwatio (iframe) es el CTA principal para subir facturas.
Rutas: /, /luz, /gas, /efis, /efis/:slug, /humanos, /humanos/:slug, /optimizacion_factura_energetica, /contacto, /privacidad, /cookies, /aviso-legal.
```

### Comandos útiles

```bash
pnpm dev          # Servidor de desarrollo (localhost:3000)
pnpm build        # Build de producción
pnpm preview      # Preview del build
npx tsc --noEmit  # Verificar TypeScript sin compilar
```

---

## Deploy

El sitio está desplegado en **Manus Web Hosting**:
- URL: `https://efizientia-bnfkawee.manus.space`
- Para redesplegar: hacer push a este repositorio y sincronizar desde el panel de Manus.

---

## Convenciones de código

- Cada componente empieza con un comentario de cabecera explicando su propósito y diseño.
- Los estilos inline se usan cuando los valores son dinámicos o muy específicos de la marca.
- Tailwind se usa para layout, espaciado y utilidades genéricas.
- Los datos de contenido (equipo, efis) están separados en `src/data/` para facilitar su edición sin tocar los componentes.
