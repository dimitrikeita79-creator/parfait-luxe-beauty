import { useState, useCallback, useEffect } from "react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
};

let counter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

const notify = (toast: Omit<Toast, "id">) => {
  const next = [...toasts, { ...toast, id: ++counter }];
  toasts = next;
  listeners.forEach((fn) => fn(next));
  setTimeout(() => {
    const updated = toasts.filter((t) => t.id !== next[next.length - 1]?.id);
    toasts = updated;
    listeners.forEach((fn) => fn(updated));
  }, 4000);
};

export function useToast() {
  const [state, setState] = useState<Toast[]>(toasts);

  useEffect(() => {
    const handler = (next: Toast[]) => setState([...next]);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const success = useCallback((title: string, description?: string) => {
    notify({ title, description, type: "success" });
  }, []);
  const error = useCallback((title: string, description?: string) => {
    notify({ title, description, type: "error" });
  }, []);
  const info = useCallback((title: string, description?: string) => {
    notify({ title, description, type: "info" });
  }, []);

  return { toasts: state, success, error, info };
}
