import { type ReactNode } from "react";

/**
 * Liquid-glass photo frame — white glass + subtle black ring + glossy highlight.
 * `tone` provides a soft tinted gradient base (kept restrained, no gold).
 * `image` overlays a real photo when available.
 */
export function Frame({
  tone = "from-white via-white/80 to-neutral-100",
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
    <div className={`relative overflow-hidden ${rounded} ring-1 ring-black/10 shadow-soft ${className}`}>
      {/* Tinted base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tone}`} />
      {/* Liquid-glass white veil + soft highlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(1 0 0 / 0.45), oklch(1 0 0 / 0.15)), radial-gradient(120% 80% at 15% 10%, oklch(1 0 0 / 0.7), transparent 60%)",
          backdropFilter: "blur(8px) saturate(160%)",
        }}
      />
      {/* Subtle dark vignette bottom-right for depth */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(80% 60% at 90% 100%, oklch(0.2 0 0 / 0.18), transparent 60%)",
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
      {/* Inner highlight border */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/60" />
      {/* Slot for badges / overlays */}
      {children}
    </div>
  );
}