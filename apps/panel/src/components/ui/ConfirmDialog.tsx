"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { useClientMounted } from "@/components/ui/useClientMounted";

/**
 * Modal de confirmación centrado (reemplaza al confirm() nativo). Al abrirse
 * lleva el foco adentro (a "Cancelar" si la acción es destructiva, así un Enter
 * apurado no borra nada), mantiene el Tab dentro del modal, cierra con Escape
 * y devuelve el foco al botón que lo abrió.
 */
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
  const titleId = React.useId();
  const messageId = React.useId();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  // Mientras se procesa no se puede cerrar (ni con Escape ni tocando afuera).
  const cancelIfIdle = React.useCallback(() => {
    if (!loading) onCancel();
  }, [loading, onCancel]);

  React.useEffect(() => {
    if (!open || !mounted) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    (danger ? cancelRef.current : confirmRef.current)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
    // Sólo al abrir/cerrar: `danger` no cambia con el modal abierto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mounted]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelIfIdle();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, cancelIfIdle]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[900] flex items-end justify-center p-4 sm:items-center">
      <div aria-hidden="true" className="animate-fade-up absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={cancelIfIdle} />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
        className="animate-pop relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl"
      >
        {danger && (
          <div aria-hidden="true" className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <h2 id={titleId} className="text-lg font-bold text-ink">
          {title}
        </h2>
        {message && (
          <p id={messageId} className="mt-2 text-sm leading-relaxed text-ink-soft">
            {message}
          </p>
        )}
        {/* En celular los botones ocupan todo el ancho y el principal queda abajo, cerca del pulgar. */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={cancelIfIdle} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button ref={confirmRef} variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading} loadingText="Procesando…">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
