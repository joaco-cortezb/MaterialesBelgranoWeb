import { LuArrowUpRight } from "react-icons/lu";
import type { Banner } from "@mb/shared";
import { cn } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Banner editable del inicio. No lleva botones: si el panel le cargó un link,
 * el banner entero es el link (con una flecha que lo indica).
 */
export function HomeBanner({ banner, className }: { banner: Banner; className?: string }) {
  const external = /^https?:\/\//.test(banner.url);
  const content = (
    <>
      {banner.image && (
        <Media
          src={banner.image}
          alt=""
          sizes="(min-width: 1280px) 1200px, 100vw"
          quality={65}
          className="absolute inset-0 -z-10 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]"
        />
      )}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          banner.image ? "bg-gradient-to-r from-ink-dark/90 via-ink-dark/70 to-ink-dark/30" : "bg-ink-dark",
        )}
      />
      <div className="flex items-end justify-between gap-6 p-7 sm:p-12">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">{banner.title}</h2>
          {banner.text && <p className="mt-3 text-pretty text-base text-white/80 sm:text-lg">{banner.text}</p>}
        </div>
        {banner.url && (
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500 text-ink-dark transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-white sm:h-14 sm:w-14"
          >
            <LuArrowUpRight className="h-6 w-6" />
          </span>
        )}
      </div>
    </>
  );

  const boxClass = "group relative isolate flex min-h-[220px] items-end overflow-hidden rounded-3xl bg-ink-dark text-white sm:min-h-[300px]";

  return (
    <section className={cn("py-10 sm:py-14", className)}>
      <Container>
        {banner.url ? (
          <TrackedLink
            href={banner.url}
            event="banner_click"
            params={{ banner: banner.key }}
            external={external}
            className={boxClass}
          >
            {content}
          </TrackedLink>
        ) : (
          <div className={boxClass}>{content}</div>
        )}
      </Container>
    </section>
  );
}
