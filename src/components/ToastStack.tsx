"use client";

import { useDemo } from "@/context/DemoContext";

export function ToastStack() {
  const { toasts, dismissToast } = useDemo();
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className="toast"
          onClick={() => dismissToast(t.id)}
        >
          {t.text}
        </button>
      ))}
    </div>
  );
}
