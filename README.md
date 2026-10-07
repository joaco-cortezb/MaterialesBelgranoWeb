# Materiales Belgrano — web institucional + panel

Monorepo con la web pública de [Materiales Belgrano](https://materialesbelgrano.com) (Godoy Cruz, Mendoza) y su panel de administración. Mismo stack que CSIR: Next 16 (App Router), React 19, Tailwind v4, Supabase (Postgres + Auth + Storage), Prisma en el panel, Vercel.

```
apps/
  web/        Sitio público. Lee de Supabase con la anon key + RLS, cachea con tags.
  panel/      Panel. Escribe con Prisma, sube imágenes a Storage, invalida la cache de la web.
packages/
  shared/     Config del negocio (datos, rubros, servicios, slots de imagen), tipos, schemas zod y helpers.
  tsconfig/   tsconfig base.
```

## Cómo funciona

- **La web** renderiza estático. Todo lo administrable pasa por `apps/web/src/lib/cms.ts` (`unstable_cache` con tags `brands`, `images`, `whatsapp`, `settings` y TTL de respaldo de 1 h).
- **El panel** escribe con Prisma y, después de cada cambio, hace `POST {web}/api/revalidate` con `Authorization: Bearer REVALIDATE_SECRET` y `{ "tag": "..." }`. La web invalida el tag y las rutas que lo usan. No hay redeploy.
- **WhatsApp**: todos los CTA apuntan a `/go/whatsapp/<origen>`. Esa ruta registra el clic en `WhatsappClick` (service role, sin IP: hash irreversible) y redirige a `wa.me` con el mensaje precargado del número + el origen. El panel muestra el contador por origen. Además, cada clic dispara `whatsapp_click` al `dataLayer` (GA4 vía GTM, pendiente de configurar).
- **Rubros y servicios** viven en código (`packages/shared/src/config/`): son las páginas SEO/GEO/AEO. El panel administra sus imágenes y las marcas asociadas.
- **Seguridad**: RLS en todas las tablas (`anon` sólo `SELECT` sobre lo activo), CSP por directiva, rate limit (Upstash si está configurado, memoria si no), login con límite por IP y por email, acceso al panel sólo con fila en `Profile`, uploads validados por MIME + contenido y convertidos a WebP.

## Levantar en local

Requisitos: Node 24, pnpm 11 (`corepack enable`).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/panel/.env.example apps/panel/.env.local
# completar ambos .env.local (ver "Variables de entorno")
pnpm dev            # web en :3000 y panel en :3001
```

O por separado: `pnpm dev:web` / `pnpm dev:panel`.

### Base de datos

Las migraciones viven en `apps/panel/prisma/migrations` y las aplica Prisma:

```bash
pnpm --filter @mb/panel db:deploy     # aplica migraciones pendientes (usa DIRECT_URL)
pnpm --filter @mb/panel db:migrate    # crea una migración nueva en desarrollo
```

Carga inicial (marcas del brief, número de WhatsApp de respaldo y primer usuario del panel):

```bash
PANEL_ADMIN_EMAIL=... PANEL_ADMIN_PASSWORD=... pnpm --filter @mb/panel db:seed
```

### Chequeos

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Variables de entorno

### `apps/web/.env.local`

| Variable | Qué es | Dónde sale |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (lectura con RLS) | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | sólo server: registra clics a WhatsApp | Supabase → Settings → API (secret) |
| `NEXT_PUBLIC_SITE_URL` | URL canónica (metadata, sitemap, JSON-LD) | el dominio final |
| `REVALIDATE_SECRET` | Bearer del webhook `/api/revalidate` | `openssl rand -hex 32`; el mismo en el panel |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | rate limit distribuido (opcional) | Upstash |
| `NEXT_PUBLIC_GTM_ID` | contenedor GTM (opcional; vacío = sin tags) | Google Tag Manager |

### `apps/panel/.env.local`

| Variable | Qué es | Dónde sale |
|---|---|---|
| `DATABASE_URL` | Postgres por pooler (puerto 6543) | Supabase → Connect → Transaction pooler |
| `DIRECT_URL` | Postgres directa (5432), para migraciones | Supabase → Connect → Session pooler / Direct |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth con `@supabase/ssr` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage y administración de usuarios | Supabase → Settings → API (secret) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | bucket público (`media`) | lo crea la migración |
| `PUBLIC_WEB_URL` | URL de la web (webhook y links) | — |
| `PANEL_URL` | URL propia (redirects de auth) | — |
| `REVALIDATE_WEBHOOK_URL` | opcional; default `PUBLIC_WEB_URL/api/revalidate` | — |
| `REVALIDATE_SECRET` | el mismo que en la web | — |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | rate limit distribuido (opcional) | Upstash |

En Supabase → Authentication → URL Configuration hay que agregar `PANEL_URL/auth/callback` a las *Redirect URLs* para que funcionen las invitaciones y la recuperación de contraseña.

## Deploy

Dos proyectos en Vercel conectados al mismo repo (`main` → producción):

| Proyecto | Root Directory | Build |
|---|---|---|
| `materiales-belgrano-web` | `apps/web` | `next build` |
| `materiales-belgrano-panel` | `apps/panel` | `prisma migrate deploy` (sólo en Vercel/CI) → `prisma generate` → `next build` |

Las variables de entorno se cargan en cada proyecto. Región `gru1` (`vercel.json`).

Para pasar a producción con el dominio final: apuntar `materialesbelgrano.com` al proyecto web y `panel.materialesbelgrano.com` al panel, actualizar `NEXT_PUBLIC_SITE_URL`, `PUBLIC_WEB_URL`, `PANEL_URL` y las *Redirect URLs* de Supabase.

## Contenido

- Datos del negocio y `TODO` pendientes del cliente: `packages/shared/src/config/site.ts`.
- Rubros (texto, subcategorías, FAQ, mensaje de WhatsApp): `packages/shared/src/config/rubros.ts`.
- Servicios: `packages/shared/src/config/servicios.ts`.
- Slots de imagen y fallbacks: `packages/shared/src/config/image-slots.ts` y [IMAGENES.md](IMAGENES.md).
