import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Sin credenciales el módulo igual tiene que poder importarse (el layout
// muestra el aviso de configuración antes de consultar nada): `pg` recién
// conecta en la primera query, así que un placeholder no rompe el arranque.
const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

// Con `PrismaPg` el `connection_limit` de la URL no aplica: el tamaño lo fija
// el pool de `pg` (10 por defecto, por instancia). Se deja chico porque cada
// función de Vercel abre el suyo contra el pooler de Supabase.
const adapter = new PrismaPg({ connectionString, max: 3 });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
