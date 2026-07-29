import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[70] flex w-full max-w-xs flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type || "info"];
          const color =
            toast.type === "success"
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : toast.type === "error"
                ? "text-red-600 border-red-200 bg-red-50"
                : "text-blue-600 border-blue-200 bg-blue-50";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${color}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-[11px] opacity-80">{toast.description}</p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
