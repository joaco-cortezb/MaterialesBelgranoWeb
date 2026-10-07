import { spawnSync } from "node:child_process";

/**
 * Aplica las migraciones pendientes como primer paso de `pnpm build`.
 *
 * Sólo corre donde el deploy es la intención declarada (Vercel o CI): un
 * `.env.local` de trabajo apunta a la base de PRODUCCIÓN y un build local no
 * tiene que tocarla. Para aplicarlas a mano: `RUN_MIGRATIONS=1 pnpm build`
 * o `pnpm db:deploy`.
 */
const hasDatabaseUrl = Boolean(process.env.DIRECT_URL || process.env.DATABASE_URL);

if (process.env.SKIP_MIGRATIONS === "1") {
  console.log("CI build: skipping migrations (SKIP_MIGRATIONS=1).");
  process.exit(0);
}

if (!hasDatabaseUrl) {
  console.log("Database URL not configured; skipping migration deploy.");
  process.exit(0);
}

const isDeployEnvironment = Boolean(process.env.VERCEL || process.env.CI);
const isForced = process.env.RUN_MIGRATIONS === "1";

if (!isDeployEnvironment && !isForced) {
  console.log("Build local: no se aplican migraciones. Si querés aplicarlas: RUN_MIGRATIONS=1 pnpm build");
  process.exit(0);
}

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(command, ["exec", "prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
