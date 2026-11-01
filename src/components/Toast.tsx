"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";

export type ToastData = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

const TOAST_STYLES = {
  success: {
    Icon: CheckCircle2,
    className:
      "border-green-500/40 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-950/40 dark:text-green-300",
  },
  error: {
    Icon: AlertCircle,
    className:
      "border-red-500/40 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300",
  },
  info: {
    Icon: Info,
    className:
      "border-sky-500/40 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-300",
  },
} as const;

type ToastProps = {
  toast: ToastData;
  onDismiss: () => void;
};

const TOAST_DURATION_MS = 4000;

export default function Toast({ toast, onDismiss }: ToastProps) {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  // Mounted once per toast (the parent keys the toast by its id), so the
  // timer restarts automatically every time a new toast is shown.
  useEffect(() => {
    const timer = setTimeout(() => onDismissRef.current(), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const { Icon, className } = TOAST_STYLES[toast.type];

  return (
    <output
      aria-live="polite"
      className={`fixed top-24 right-6 z-50 flex max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${className}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-auto rounded p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </output>
  );
}
