# Imágenes de la web

Qué foto va en cada lugar, de qué archivo original del Drive sale, y qué huecos
quedan. Los huecos se completan desde el panel (sección **Imágenes**) con fotos
nuevas o generadas con IA; mientras tanto la web muestra un bloque de color.

Drive de origen: `Materiales Belgrano / Fotos` (carpeta `1hZF_jeQJnhw_uFniLZohF10bab3fI4B5`).
Al 7/10/2026 la carpeta tenía **5 fotos** (`_51`, `_134`, `_135`, `_136`, `_137`).
Las `_136` y `_137` son casi idénticas (retrato de dos personas); se usó `_136`.

Las versiones optimizadas viven en `apps/web/public/images/` (WebP, ≤2400 px de
lado, `-strip`). Los originales NO se versionan (`_assets-src/` está en
`.gitignore`).

## Slots y fallbacks

| Slot (panel) | Dónde se ve | Archivo en el repo | Original del Drive |
|---|---|---|---|
| `home.hero` | Portada del inicio | `salon-materiales-belgrano-mendoza.webp` | `Materiales Belgrano_135.jpg` |
| `home.rubros` | Foto al lado de los rubros (inicio) | `exhibicion-iluminacion-materiales-belgrano.webp` | `Materiales Belgrano_51.jpg` |
| `home.distribuidora` | Fondo del banner Distribuidora 370 | `salon-exhibicion-materiales-belgrano.webp` | `Materiales Belgrano_134.jpg` |
| `nosotros.hero` | Portada de Nosotros | `salon-materiales-belgrano-mendoza.webp` | `_135` |
| `nosotros.salon` | Galería Nosotros: salón | `salon-exhibicion-materiales-belgrano.webp` | `_134` |
| `nosotros.deposito` | Galería Nosotros: depósito | **HUECO** | — |
| `nosotros.equipo` | Galería Nosotros: equipo | `equipo-materiales-belgrano.webp` | `_136` |
| `servicios.hero` | Portada de Servicios | `salon-materiales-belgrano-mendoza.webp` | `_135` |
| `servicios.entrega` | Banner transporte propio | **HUECO** | — |
| `servicios.envios` | Banner Andreani | **HUECO** | — |
| `servicios.financiacion` | Banner financiación | **HUECO** | — |
| `servicios.cuenta-corriente` | Banner cuenta corriente | **HUECO** | — |
| `servicios.stock` | Banner stock | **HUECO** | — |
| `servicios.atencion` | Banner atención | `equipo-materiales-belgrano.webp` | `_136` |
| `rubros.materiales-electricos.hero` | Página del rubro | **HUECO** | — |
| `rubros.iluminacion.hero` | Página del rubro | `exhibicion-iluminacion-materiales-belgrano.webp` | `_51` |
| `rubros.maquinas-y-herramientas.hero` | Página del rubro | **HUECO** | — |
| `rubros.dispositivos-smart.hero` | Página del rubro | **HUECO** | — |
| `rubros.camaras-y-videovigilancia.hero` | Página del rubro | **HUECO** | — |

## Marca

| Archivo | Uso | Origen |
|---|---|---|
| `apps/web/public/brand/logo-materiales-belgrano.png` | Header y footer | Logo completo (fondo blanco), recortado |
| `apps/web/src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Favicons | Logo en círculo verde |
| `apps/web/public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | `manifest.webmanifest` | Logo en círculo verde |
| `apps/web/public/og-materiales-belgrano.jpg` | Open Graph (1200×630) | Logo sobre blanco |
| `apps/panel/public/brand/isotipo.png` | Panel (sidebar y login) | Logo en círculo verde |

## Lo que falta pedir

- Fotos del **depósito** ordenado (varias; es lo que más transmite tamaño).
- **Transporte propio** (camioneta/camión con logo, carga en obra).
- **Caja / medios de pago** y **atención a empresas** (opcionales, los banners funcionan sin foto).
- Ambientes con **materiales eléctricos** instalados (tableros, cañerías), **herramientas**, **dispositivos smart** y **cámaras** en funcionamiento, genéricos, sin producto puntual.
- Logos de las 13 marcas en PNG/WEBP con fondo transparente (se cargan desde el panel).
