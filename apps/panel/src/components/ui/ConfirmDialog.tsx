"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { useClientMounted } from "@/components/ui/useClientMounted";

/** Modal de confirmación centrado (reemplaza al confirm() nativo). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const mounted = useClientMounted();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      <div className="animate-fade-up absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onCancel} />
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="animate-pop relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        {danger && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <h2 id="confirm-title" className="text-lg font-bold text-ink">
          {title}
        </h2>
        {message && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
