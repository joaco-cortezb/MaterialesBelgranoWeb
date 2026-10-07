import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE, cn } from "@mb/shared";

/** Logo horizontal (isotipo + wordmark) recortado del original en `public/brand/`. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href={ROUTES.home} aria-label={`${SITE.name}: ir al inicio`} className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/brand/logo-materiales-belgrano.png"
        alt={`${SITE.name} · ${SITE.tagline}`}
        width={1640}
        height={873}
        sizes="96px"
        preload={priority}
        className="h-11 w-auto sm:h-12"
      />
    </Link>
  );
}
