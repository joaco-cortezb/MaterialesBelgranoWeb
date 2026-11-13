"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

/** Botón chico para copiar un dato de contacto; confirma con un tilde por un momento. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles no pasa nada: el dato sigue visible para copiarlo a mano.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
      className="pressable relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-bg hover:text-ink-dark before:absolute before:-inset-1"
    >
      {copied ? <LuCheck className="h-4 w-4 text-brand-700" aria-hidden /> : <LuCopy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copiado" : ""}
      </span>
    </button>
  );
}
