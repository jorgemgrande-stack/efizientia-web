# Prompt de contexto completo — Efizientia Web para VS Code + Claude

> Copia y pega este prompt al inicio de cualquier conversación con Claude cuando trabajes en este proyecto.

---

## PROMPT PARA CLAUDE

```
Estoy trabajando en el sitio web de Efizientia, una asesoría energética española.
El repositorio está en: https://github.com/jorgemgrande-stack/efizientia-web

## Stack técnico
- React 19 + Vite (proyecto estático, sin backend)
- Tailwind CSS 4 + CSS variables (tokens en client/src/index.css)
- shadcn/ui (Radix primitives) → importar desde @/components/ui/*
- Wouter para routing (NO React Router)
- TypeScript estricto
- Lucide React para iconos
- pnpm como gestor de paquetes

## Arrancar en local
git clone https://github.com/jorgemgrande-stack/efizientia-web.git
cd efizientia-web
pnpm install
pnpm dev   # → http://localhost:3000

## Diseño (NO cambiar sin motivo)
- Fondo dark: #0a0a0a / #111111 (secciones oscuras)
- Fondo light: #ffffff / #f9f9f9 (secciones claras)
- Magenta: #e91e8c → color de marca, CTAs, highlights
- Verde: #39d353 → badges online, confirmaciones
- Tipografía títulos: Montserrat Black 900 → fontFamily: "'Montserrat', sans-serif"
- Tipografía cuerpo: Nunito Sans → fontFamily: "'Nunito Sans', sans-serif"
- NO usar: Inter, purple gradients, layouts centrados genéricos

## Rutas (Wouter en client/src/App.tsx)
/                           → pages/Home.tsx
/luz                        → pages/Luz.tsx
/gas                        → pages/Gas.tsx
/efis                       → pages/Efis.tsx
/efis/:slug                 → pages/EfiProfile.tsx
/humanos                    → pages/Humanos.tsx
/humanos/:slug              → pages/HumanoProfile.tsx
/optimizacion_factura_energetica → pages/OptimizacionFactura.tsx
/contacto                   → pages/Contact.tsx
/privacidad                 → pages/PrivacyPolicy.tsx
/cookies                    → pages/CookiesPolicy.tsx
/aviso-legal                → pages/LegalNotice.tsx

## Datos de contenido
- Efis (asistentes IA): client/src/data/efis.ts
- Humanos (asesores reales): client/src/data/humanos.ts

## Widget de Kiwatio (CTA principal — iframe)
URL: https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597
Usado en: HeroSection.tsx (hero), OptimizacionFactura.tsx (pantalla completa), y múltiples CTAs

## Imágenes y assets
Todas las imágenes están en la carpeta /public/images/ del proyecto (ver sección de assets más abajo).
En el código se referencian como rutas absolutas: src="/images/nombre-del-archivo.ext"

## Contacto de la empresa
Tel: +34 856 28 83 41
WhatsApp: https://wa.me/34856288341
Email: hola@efizientia.es
Facebook: https://facebook.com/efizientia
Instagram: https://instagram.com/efizientia

## Mensajes de valor diferencial (usar en copy)
1. "Estudio inmediato: en menos de 2 minutos sabemos si pagas de más"
2. "Contratación en menos de 5 minutos · Firma digital desde el móvil"
3. "Centralita 24 horas · Siempre hay alguien al otro lado"
4. "Somos de las pocas asesorías con estudio inmediato y contratación en 5 min"

## Convenciones de código
- Cada archivo .tsx empieza con comentario /** ... */ explicando propósito y diseño
- Estilos inline para valores de marca específicos; Tailwind para layout y utilidades
- Datos de contenido en src/data/ — no hardcodear en componentes
- Toasts con sonner (no react-toastify)
- Links internos con <a href> o wouter <Link> (nunca anidados)
```

---

## Instrucciones para alojar las imágenes en tu propio servidor

### Paso 1 — Descargar el ZIP de imágenes

Descarga el archivo `efizientia-images.zip` adjunto a este documento. Contiene las **25 imágenes** del proyecto organizadas en una carpeta.

### Paso 2 — Copiar al proyecto

Descomprime el ZIP y copia la carpeta `efizientia-images/` dentro de `client/public/images/`:

```
efizientia-web/
└── client/
    └── public/
        └── images/           ← pegar aquí el contenido del ZIP
            ├── efizientia-logo-dark_f1c2a2ee.png
            ├── efi-mascot_36782492.jpg
            ├── hero1_a3fbf53c.jpg
            ├── hero2_195ddc15.jpg
            ├── hero3_e3745729.jpg
            ├── hero4_fd46090f.jpg
            ├── hero5_e07fdd4c.jpg
            ├── efi-gas-man-noa24tA76rogXJBbG7Mi4t.webp
            ├── efi-hero-couple-bzyFpqprUZCRGccD2XzG2Z.webp
            ├── efi-man-bill-L8qtPHyZQtKvtfB6jiF8Ns.webp
            ├── audax.png
            ├── vm_energia.png
            ├── aldro_energia.png
            ├── repsol_png.png
            ├── acciona_transp-1.png
            ├── energia_galega.jpg
            ├── hola.png
            ├── fenie_energia.png
            ├── fox_energia.png
            ├── iberdrola_transp.png
            ├── avatar-faustino.jpg
            ├── avatar-manuel.jpg
            ├── avatar-laura.jpg
            ├── avatar-ana.jpg
            └── avatar-diego.jpg
```

### Paso 3 — Actualizar las rutas en el código

Una vez copiadas las imágenes, pide a Claude que reemplace todas las URLs del CDN por rutas locales. Usa este prompt:

```
Reemplaza todas las URLs de imágenes del CDN de CloudFront y de efizientia.es/wp-content
por rutas locales que apunten a /images/nombre-del-archivo.ext

Las imágenes están en client/public/images/ y se sirven como /images/*.

Archivos a actualizar:
- client/src/components/HeroSection.tsx (hero1-5, logo, mascota)
- client/src/components/Navbar.tsx (logo)
- client/src/components/RankingSection.tsx (logos compañías)
- client/src/pages/Luz.tsx (logo audax)
- client/src/pages/OptimizacionFactura.tsx (logo)
- client/src/data/humanos.ts (avatares del equipo)

Tabla de sustitución:
CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efizientia-logo-dark_f1c2a2ee.png
LOCAL: /images/efizientia-logo-dark_f1c2a2ee.png

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-mascot_36782492.jpg
LOCAL: /images/efi-mascot_36782492.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero1_a3fbf53c.jpg
LOCAL: /images/hero1_a3fbf53c.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero2_195ddc15.jpg
LOCAL: /images/hero2_195ddc15.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero3_e3745729.jpg
LOCAL: /images/hero3_e3745729.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero4_fd46090f.jpg
LOCAL: /images/hero4_fd46090f.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero5_e07fdd4c.jpg
LOCAL: /images/hero5_e07fdd4c.jpg

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-gas-man-noa24tA76rogXJBbG7Mi4t.webp
LOCAL: /images/efi-gas-man-noa24tA76rogXJBbG7Mi4t.webp

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-hero-couple-bzyFpqprUZCRGccD2XzG2Z.webp
LOCAL: /images/efi-hero-couple-bzyFpqprUZCRGccD2XzG2Z.webp

CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-man-bill-L8qtPHyZQtKvtfB6jiF8Ns.webp
LOCAL: /images/efi-man-bill-L8qtPHyZQtKvtfB6jiF8Ns.webp

WP: https://efizientia.es/wp-content/uploads/2025/10/audax.png
LOCAL: /images/audax.png

WP: https://efizientia.es/wp-content/uploads/2025/10/vm_energia.png
LOCAL: /images/vm_energia.png

WP: https://efizientia.es/wp-content/uploads/2025/10/aldro_energia.png
LOCAL: /images/aldro_energia.png

WP: https://efizientia.es/wp-content/uploads/2025/10/repsol_png.png
LOCAL: /images/repsol_png.png

WP: https://efizientia.es/wp-content/uploads/2025/10/acciona_transp-1.png
LOCAL: /images/acciona_transp-1.png

WP: https://efizientia.es/wp-content/uploads/2025/10/energia_galega.jpg
LOCAL: /images/energia_galega.jpg

WP: https://efizientia.es/wp-content/uploads/2025/10/hola.png
LOCAL: /images/hola.png

WP: https://efizientia.es/wp-content/uploads/2025/10/fenie_energia.png
LOCAL: /images/fenie_energia.png

WP: https://efizientia.es/wp-content/uploads/2025/10/fox_energia.png
LOCAL: /images/fox_energia.png

WP: https://efizientia.es/wp-content/uploads/2025/10/iberdrola_transp.png
LOCAL: /images/iberdrola_transp.png

Unsplash (avatar-faustino): https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face
LOCAL: /images/avatar-faustino.jpg

Unsplash (avatar-manuel): https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face
LOCAL: /images/avatar-manuel.jpg

Unsplash (avatar-laura): https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face
LOCAL: /images/avatar-laura.jpg

Unsplash (avatar-ana): https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face
LOCAL: /images/avatar-ana.jpg

Unsplash (avatar-diego): https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face
LOCAL: /images/avatar-diego.jpg
```

---

## Inventario completo de imágenes

| Archivo | Uso en el código | Fuente original |
|---|---|---|
| `efizientia-logo-dark_f1c2a2ee.png` | Logo en Navbar, OptimizacionFactura | CDN Manus |
| `efi-mascot_36782492.jpg` | Mascota Efi en CtaBanner | CDN Manus |
| `hero1_a3fbf53c.jpg` | Carrusel hero (slide 1) | CDN Manus |
| `hero2_195ddc15.jpg` | Carrusel hero (slide 2) | CDN Manus |
| `hero3_e3745729.jpg` | Carrusel hero (slide 3) | CDN Manus |
| `hero4_fd46090f.jpg` | Carrusel hero (slide 4) | CDN Manus |
| `hero5_e07fdd4c.jpg` | Carrusel hero (slide 5) | CDN Manus |
| `efi-gas-man-noa24tA76rogXJBbG7Mi4t.webp` | Hero página /gas | CDN Manus |
| `efi-hero-couple-bzyFpqprUZCRGccD2XzG2Z.webp` | Hero página /luz | CDN Manus |
| `efi-man-bill-L8qtPHyZQtKvtfB6jiF8Ns.webp` | Sección proceso | CDN Manus |
| `audax.png` | Ranking compañías (Top 1) | WordPress Efizientia |
| `vm_energia.png` | Ranking compañías (Top 2) | WordPress Efizientia |
| `aldro_energia.png` | Ranking compañías (Top 3) | WordPress Efizientia |
| `repsol_png.png` | Ranking compañías | WordPress Efizientia |
| `acciona_transp-1.png` | Ranking compañías | WordPress Efizientia |
| `energia_galega.jpg` | Ranking compañías | WordPress Efizientia |
| `hola.png` | Ranking compañías (Holaluz) | WordPress Efizientia |
| `fenie_energia.png` | Ranking compañías | WordPress Efizientia |
| `fox_energia.png` | Ranking compañías | WordPress Efizientia |
| `iberdrola_transp.png` | Ranking compañías | WordPress Efizientia |
| `avatar-faustino.jpg` | Perfil Faustino Lobato | Unsplash |
| `avatar-manuel.jpg` | Perfil Manuel Reyes | Unsplash |
| `avatar-laura.jpg` | Perfil Laura Sánchez | Unsplash |
| `avatar-ana.jpg` | Perfil Ana López | Unsplash |
| `avatar-diego.jpg` | Perfil Diego Pérez | Unsplash |

---

## Comandos útiles

```bash
pnpm dev          # Servidor de desarrollo → localhost:3000
pnpm build        # Build de producción → dist/
pnpm preview      # Preview del build de producción
npx tsc --noEmit  # Verificar TypeScript sin compilar
```
