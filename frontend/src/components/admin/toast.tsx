"use client";

import { create } from "zustand";
import { CheckCircle2, X, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Tone = "success" | "error";
interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastState {
  toasts: ToastItem[];
  push: (message: string, tone: Tone) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, "success"),
  error: (message: string) => useToastStore.getState().push(message, "error"),
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-2 rounded-lg border bg-white p-3 text-sm shadow-lg",
            t.tone === "success" ? "border-emerald-200" : "border-red-200",
          )}
        >
          {t.tone === "success" ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
          ) : (
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-red-600" />
          )}
          <span className="flex-1 text-zinc-700">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-zinc-400 transition hover:text-zinc-700"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
