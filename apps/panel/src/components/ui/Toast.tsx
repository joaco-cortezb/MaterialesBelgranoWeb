"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientMounted } from "@/components/ui/useClientMounted";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: React.ReactNode; leaving?: boolean };
type ToastCtx = { push: (type: ToastType, message: React.ReactNode) => void };

const Ctx = React.createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = React.useContext(Ctx);
  return {
    success: (message: React.ReactNode) => ctx?.push("success", message),
    error: (message: React.ReactNode) => ctx?.push("error", message),
    info: (message: React.ReactNode) => ctx?.push("info", message),
  };
}

let seq = 0;
const TOAST_DURATION_MS = 4200;
const TOAST_EXIT_MS = 160;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const mounted = useClientMounted();
  const timers = React.useRef<number[]>([]);

  const remove = React.useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);

  const dismiss = React.useCallback(
    (id: number) => {
      setToasts((items) => items.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
      timers.current.push(window.setTimeout(() => remove(id), TOAST_EXIT_MS));
    },
    [remove],
  );

  const push = React.useCallback(
    (type: ToastType, message: React.ReactNode) => {
      const id = ++seq;
      setToasts((items) => [...items, { id, type, message }]);
      timers.current.push(window.setTimeout(() => dismiss(id), TOAST_DURATION_MS));
    },
    [dismiss],
  );

  React.useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-4 top-4 z-[200] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:w-[360px]">
            {toasts.map((toast) => (
              <ToastCard key={toast.id} toast={toast} onClose={() => dismiss(toast.id)} />
            ))}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}

const ICON = { success: CheckCircle2, error: AlertCircle, info: Info };
const ACCENT = { success: "text-[var(--color-success)]", error: "text-[var(--color-danger)]", info: "text-brand-700" };

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = ICON[toast.type];
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lg",
        toast.leaving ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ACCENT[toast.type])} />
      <div className="flex-1 text-sm font-semibold leading-snug text-ink">{toast.message}</div>
      <button onClick={onClose} aria-label="Cerrar" className="shrink-0 rounded-md p-1 text-ink-soft hover:bg-surface-2 hover:text-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
