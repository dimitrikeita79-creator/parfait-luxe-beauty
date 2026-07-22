import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type Variant = "primary" | "light" | "whatsapp" | "gold";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, { bg: string; color: string; border: string; shadow: string }> = {
  primary: {
    bg: "linear-gradient(180deg, oklch(0.6 0.22 25 / 0.95), oklch(0.48 0.2 20 / 0.95))",
    color: "#fff",
    border: "oklch(0.74 0.22 25 / 0.4)",
    shadow: "0 16px 32px -16px oklch(0.48 0.22 25 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.25)",
  },
  light: {
    bg: "linear-gradient(180deg, oklch(1 0 0 / 0.9), oklch(1 0 0 / 0.65))",
    color: "oklch(0.22 0.01 60)",
    border: "oklch(0.92 0.04 60 / 0.95)",
    shadow: "0 12px 28px -14px oklch(0.2 0 0 / 0.18), inset 0 1px 0 oklch(1 0 0 / 0.85)",
  },
  whatsapp: {
    bg: "linear-gradient(180deg, oklch(1 0 0 / 0.95), oklch(1 0 0 / 0.7))",
    color: "#0f8a3f",
    border: "oklch(0.96 0.04 120 / 0.95)",
    shadow: "0 14px 30px -14px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.9)",
  },
  gold: {
    bg: "linear-gradient(180deg, oklch(1 0 0 / 0.95), oklch(0.97 0.04 25 / 0.8))",
    color: "oklch(0.55 0.2 25)",
    border: "oklch(0.92 0.1 25 / 0.95)",
    shadow: "0 14px 32px -14px oklch(0.55 0.2 25 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.88)",
  },
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-2 text-[11px]",
  md: "px-4 py-2.5 text-xs",
  lg: "px-5 py-3.5 text-sm",
};

type Props<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">;

/** Universal liquid-glass button — works as <button>, <a>, <Link>, etc. */
export function GlassButton<T extends ElementType = "button">({
  as,
  variant = "light",
  size = "md",
  full,
  className = "",
  children,
  ...rest
}: Props<T>) {
  const Comp = (as ?? "button") as ElementType;
  const v = VARIANTS[variant];
  return (
    <Comp
      {...(rest as any)}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-full font-semibold backdrop-blur-xl transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.96] ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
      style={{
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        backdropFilter: "blur(20px) saturate(190%)",
        boxShadow: v.shadow,
        ...((rest as any).style ?? {}),
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-0.5 h-1/2 rounded-full opacity-60"
        style={{ background: "linear-gradient(180deg, oklch(1 0 0 / 0.55), transparent)", filter: "blur(1px)" }}
      />
      <span className="relative inline-flex items-center gap-1.5">{children}</span>
    </Comp>
  );
}

export default GlassButton;