# Ideas de Diseño - Efizientia Web

## Enfoque: Fidelidad al diseño original con refactorización limpia

---

<response>
<text>
### Idea 1: Neo-Punk Energético (probabilidad baja)

**Design Movement**: Cyberpunk industrial con toques de energía neón

**Core Principles**:
- Contraste extremo negro/blanco con destellos magenta neón
- Tipografía condensada y agresiva para impacto visual
- Texturas de ruido sutil sobre fondos oscuros
- Asimetría controlada con grids rotos

**Color Philosophy**:
- Negro profundo (#0a0a0a) como base dominante
- Magenta eléctrico (#e91e8c) como color de acción y energía
- Blanco puro para legibilidad máxima
- Verde lima (#39ff14) para acentos secundarios (energía renovable)

**Layout Paradigm**:
- Secciones que alternan entre fondos negros y blancos
- Hero con texto masivo que ocupa el 70% del viewport
- Cards con bordes neón y efectos glow

**Signature Elements**:
- Bordes con efecto glow magenta en hover
- Gradientes de fondo tipo "aurora" en secciones clave
- Iconografía de rayos eléctricos y llamas

**Interaction Philosophy**:
- Hover effects con transiciones de color rápidas
- Botones con efecto "pulse" en magenta
- Scroll reveal con fade-in desde abajo

**Animation**:
- Contadores numéricos con efecto flip
- Carrusel de logos con velocidad constante
- Partículas de energía en el hero

**Typography System**:
- Display: Space Grotesk Bold (700-900)
- Body: DM Sans (400-500)
- Accent: Barlow Condensed para etiquetas
</text>
<probability>0.07</probability>
</response>

<response>
<text>
### Idea 2: Minimalismo Técnico Profesional (probabilidad baja)

**Design Movement**: Swiss International Style adaptado al sector energético

**Core Principles**:
- Grid estricto de 12 columnas con márgenes generosos
- Tipografía como elemento estructural principal
- Datos y números como protagonistas visuales
- Paleta reducida con un solo color de acción

**Color Philosophy**:
- Blanco (#ffffff) y gris muy claro (#f8f9fa) para fondos
- Negro (#111111) para texto y fondos de contraste
- Magenta (#e91e8c) exclusivamente para CTAs y highlights
- Sin gradientes, solo colores sólidos

**Layout Paradigm**:
- Columnas asimétricas 60/40 en secciones de contenido
- Tablas y listas estructuradas para datos
- Espaciado generoso entre secciones (120px+)

**Signature Elements**:
- Líneas horizontales finas como separadores
- Números grandes como elementos decorativos
- Iconos de línea fina (stroke 1px)

**Interaction Philosophy**:
- Transiciones suaves y lentas (300-500ms)
- Underline animado en links
- Fondo de botón que se rellena desde la izquierda

**Animation**:
- Fade in suave al hacer scroll
- Contadores con ease-out
- Sin animaciones llamativas

**Typography System**:
- Display: Syne (700-800) para títulos
- Body: Plus Jakarta Sans (400-500)
- Mono: JetBrains Mono para datos numéricos
</text>
<probability>0.06</probability>
</response>

<response>
<text>
### Idea 3: Fidelidad Original Refactorizada (ELEGIDA) ✓

**Design Movement**: Dark Tech con acentos magenta - fiel al original Efizientia

**Core Principles**:
- Alternancia de secciones negras y blancas para ritmo visual
- Magenta (#e91e8c) como color de marca dominante en CTAs y acentos
- Componentes modulares y reutilizables con React
- Diseño mobile-first con breakpoints claros

**Color Philosophy**:
- Fondo oscuro principal: #0a0a0a / #111111 (secciones dark)
- Fondo claro: #ffffff / #f9f9f9 (secciones light)
- Magenta principal: #e91e8c (botones, acentos, highlights)
- Magenta suave: #f72585 (variante hover)
- Verde logo: #4caf50 (icono hoja del logo)
- Texto blanco: #ffffff en fondos oscuros
- Texto oscuro: #1a1a1a en fondos claros
- Texto secundario: #888888

**Layout Paradigm**:
- Full-width sections con container centrado (max-w-7xl)
- Hero con formulario wizard prominente
- Grid 3 columnas para cards de servicios
- Layout 2 columnas para secciones de features (texto + imagen)

**Signature Elements**:
- Borde magenta en cards y elementos destacados
- Efecto glow/neon en botones principales
- Mascota "Efi" (personaje amarillo) como elemento de marca
- Carrusel infinito de logos de comercializadoras

**Interaction Philosophy**:
- Hover con escala sutil (scale-105) en cards
- Botones con efecto shimmer en hover
- Scroll suave entre secciones
- Tabs interactivos para el proceso de 5 pasos

**Animation**:
- CountUp animado para estadísticas
- Carrusel de logos con velocidad constante (marquee)
- Fade-in con translate-y al entrar en viewport
- Pulse en el botón mágico circular

**Typography System**:
- Display: Montserrat (700-900) para títulos impactantes
- Body: Nunito Sans (400-600) para legibilidad
- Mono: para precios y datos técnicos
</text>
<probability>0.09</probability>
</response>

---

## Decisión Final: Idea 3 - Fidelidad Original Refactorizada

Se elige esta filosofía porque el objetivo es replicar fielmente el diseño de efizientia.es con código limpio y modular. El diseño original tiene una identidad visual fuerte (negro + magenta) que debe preservarse íntegramente.
