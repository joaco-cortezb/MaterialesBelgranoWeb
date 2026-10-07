import type { Faq } from "@mb/shared";

/**
 * Preguntas frecuentes con `<details>` nativo: accesible, sin JS, y el texto
 * queda en el HTML para que los motores de IA lo citen.
 */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-5 py-1 sm:px-6">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-semibold text-ink-dark [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold">{faq.question}</h3>
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-soft transition-transform duration-200 ease-[var(--ease-out-strong)] group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-5 text-pretty text-[15px] leading-relaxed text-ink-soft">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
