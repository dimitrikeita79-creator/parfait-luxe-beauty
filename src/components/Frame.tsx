import { type ReactNode } from "react";

/**
 * Premium photo frame — luxe gradient + gold ring + glossy sheen.
 * Use instead of emoji-on-gradient blocks. Optional `image` for real photos.
 */
export function Frame({
  tone = "from-amber-300/70 via-yellow-200/50 to-rose-200/40",
  image,
  alt,
  className = "",
  rounded = "rounded-[28px]",
  children,
}: {
  tone?: string;
  image?: string;
  alt?: string;
  className?: string;
  rounded?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} ring-1 ring-[var(--gold)]/30 shadow-luxe ${className}`}>
      {/* Base luxe gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tone}`} />
      {/* Soft radial highlight (top-left) */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 10%, oklch(1 0 0 / 0.55), transparent 55%), radial-gradient(80% 60% at 90% 100%, oklch(0.6 0.13 75 / 0.35), transparent 60%)",
        }}
      />
      {/* Gold mesh sheen */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-50"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.95 0.08 85 / 0.6) 0%, transparent 35%, transparent 65%, oklch(0.6 0.12 75 / 0.5) 100%)",
        }}
      />
      {/* Optional real photo on top */}
      {image && (
        <img
          src={image}
          alt={alt ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}
      {/* Inner gold border */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30" />
      {/* Slot for badges / overlays */}
      {children}
    </div>
  );
}