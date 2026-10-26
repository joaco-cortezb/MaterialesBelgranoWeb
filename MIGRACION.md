# Migración a la cuenta del cliente

Hoy la web y el panel corren en la cuenta personal de Vercel (`joaco-cortezbs-projects`) y en el proyecto de Supabase `MaterialesBelgranoWeb` (ref `qlihldyjtdudfoixvnvy`). Esta es la lista para pasarlos a la cuenta de Materiales Belgrano sin perder nada.

## 1. Vercel: dos proyectos desde el mismo repo

| Proyecto | Root Directory | Región |
| --- | --- | --- |
| Web | `apps/web` | `gru1` (ya está en `vercel.json`) |
| Panel | `apps/panel` | `gru1` (ya está en `vercel.json`) |

Ambos conectados a `main` (producción). El build del panel aplica las migraciones de Prisma solo.

### Variables de la **web**

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `NEXT_PUBLIC_SITE_URL` | dominio final de la web, sin `/` al final |
| `REVALIDATE_SECRET` | el **mismo** valor que en el panel (32+ caracteres al azar) |
| `CLICK_HASH_SALT` | texto largo y secreto (anonimiza los clics a WhatsApp) |
| `CRON_SECRET` | texto largo y secreto (protege el cron diario que evita que Supabase se pause) |
| `NEXT_PUBLIC_GTM_ID` | opcional, cuando se configure Google Tag Manager |

**No** cargar `SUPABASE_SERVICE_ROLE_KEY` en la web: ya no la usa.

### Variables del **panel**

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | Postgres por el pooler (puerto 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Postgres directo (puerto 5432), para las migraciones |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | igual que en la web |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (sólo el panel la usa) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | `media` |
| `PUBLIC_WEB_URL` | dominio final de la web (para avisarle que se actualice y mostrar sus imágenes) |
| `PANEL_URL` | dominio final del panel (los mails de invitación llevan acá) |
| `REVALIDATE_SECRET` | el mismo que en la web |

Después de cambiar variables hay que volver a desplegar (Redeploy) cada proyecto.

## 2. Supabase

Si se mueve el proyecto a la organización del cliente (Project Settings → Transfer project) no cambia la URL ni las claves. Si se crea uno nuevo, hay que aplicar las migraciones (`pnpm --filter @mb/panel db:deploy`) y copiar los archivos del bucket `media`.

Configuración que tiene que quedar igual:

- **Authentication → Sign In / Providers**
  - "Allow new users to sign up": **apagado** (el acceso al panel es sólo por invitación).
  - "Confirm email": encendido.
  - Email → "Minimum password length": **10**, sin requisitos extra (el panel valida además contra filtraciones conocidas).
- **Authentication → URL Configuration**
  - Site URL: `https://<panel>/auth/callback`.
  - Redirect URLs: `https://<panel>/auth/callback` (y `http://localhost:3001/auth/callback` para desarrollo).
- **Storage**: bucket `media` público, tope de 5 MB por archivo (lo deja la migración).

## 3. Dominio

1. Apuntar el dominio de la web y el subdominio del panel a Vercel.
2. Actualizar `NEXT_PUBLIC_SITE_URL`, `PUBLIC_WEB_URL` y `PANEL_URL`.
3. Actualizar las URLs de Supabase (punto 2).
4. Redeploy de los dos proyectos.

## 4. Después de migrar

- Cambiar la contraseña de la base (Supabase → Database → Settings) y actualizar `DATABASE_URL` / `DIRECT_URL` en el panel.
- Cargar el número real de **Mayoristas** en Panel → WhatsApp (hoy tiene el mismo que Ventas).
- Probar: guardar algo en el panel y ver que la web lo muestre en la siguiente visita.
