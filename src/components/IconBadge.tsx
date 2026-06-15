import type { ComponentType, SVGProps } from "react";

type IconBadgeProps = {
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  size?: "sm" | "md" | "lg";
  tone?: "neutral" | "gold" | "green" | "blue" | "pink" | "rose" | "dark";
  className?: string;
};

const TONES: Record<NonNullable<IconBadgeProps["tone"]>, { color: string; glow: string }> = {
  neutral: { color: "oklch(0.32 0.01 60)", glow: "oklch(0.85 0.05 85 / 0.45)" },
  gold:    { color: "oklch(0.55 0.12 80)", glow: "oklch(0.85 0.12 85 / 0.55)" },
  green:   { color: "#25D366",             glow: "rgba(37, 211, 102, 0.45)" },
  blue:    { color: "#1877F2",             glow: "rgba(24, 119, 242, 0.45)" },
  pink:    { color: "#E1306C",             glow: "rgba(225, 48, 108, 0.5)" },
  rose:    { color: "#FE2C55",             glow: "rgba(254, 44, 85, 0.45)" },
  dark:    { color: "oklch(0.22 0.01 60)", glow: "oklch(0.2 0 0 / 0.25)" },
};

const SIZES = {
  sm: { box: "h-8 w-8", icon: "h-3.5 w-3.5" },
  md: { box: "h-10 w-10", icon: "h-4 w-4" },
  lg: { box: "h-12 w-12", icon: "h-5 w-5" },
} as const;

/**
 * Liquid-glass round badge for icons.
 * Use instead of `bg-black text-white` pastilles across the app.
 */
export function IconBadge({ icon: Icon, size = "md", tone = "neutral", className = "" }: IconBadgeProps) {
  const t = TONES[tone];
  const s = SIZES[size];
  return (
    <span
      className={`relative inline-grid ${s.box} place-items-center rounded-full transition-transform duration-200 ease-out hover:scale-110 active:scale-95 ${className}`}
      style={{
        background:
          "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
        backdropFilter: "blur(18px) saturate(180%)",
        border: "1px solid oklch(1 0 0 / 0.85)",
        boxShadow: `0 8px 20px -10px ${t.glow}, inset 0 1px 0 oklch(1 0 0 / 0.8), inset 0 0 0 1px oklch(1 0 0 / 0.25)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-70"
        style={{
          background: `radial-gradient(60% 40% at 30% 20%, oklch(1 0 0 / 0.9), transparent 70%)`,
        }}
      />
      <Icon className={`relative ${s.icon}`} style={{ color: t.color }} strokeWidth={1.9} />
    </span>
  );
}

export default IconBadge;