import { type ReactNode } from "react";

/**
 * Liquid-glass photo frame — white glass + subtle black ring + glossy highlight.
 * `tone` provides a soft tinted gradient base (kept restrained, no gold).
 * `image` overlays a real photo when available.
 */
export function Frame({
  tone = "from-white via-white/90 to-neutral-50",
  image,
  alt,
  className = "",
  rounded = "rounded-[28px]",
  variant = "tinted",
  imageFit = "cover",
  children,
  noGlass = false,
  loading,
  aspectRatio,
}: {
  tone?: string;
  image?: string;
  alt?: string;
  className?: string;
  rounded?: string;
  variant?: "tinted" | "plain";
  imageFit?: "cover" | "contain";
  children?: ReactNode;
  noGlass?: boolean;
  loading?: "lazy" | "eager";
  aspectRatio?: string;
}) {
  const plain = variant === "plain";
  return (
    <div
      className={`relative overflow-hidden bg-white ${rounded} ${plain ? "ring-0" : "ring-1 ring-black/5"} ${className}`}
      style={{ 
        boxShadow: plain
          ? "0 2px 8px -4px oklch(0.2 0 0 / 0.08)"
          : "0 10px 30px -16px oklch(0.2 0 0 / 0.18), 0 2px 6px -2px oklch(0.2 0 0 / 0.06)",
        aspectRatio: aspectRatio || undefined,
      }}
    >
      {!plain && <div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-80`} />}
      {!noGlass && (
        <div
          className="frame-glass absolute inset-0"
          style={{
            background:
              plain
                ? "linear-gradient(180deg, oklch(1 0 0 / 0.7), oklch(1 0 0 / 0.2) 60%, transparent), radial-gradient(120% 60% at 15% 10%, oklch(1 0 0 / 0.9), transparent 65%)"
                : "linear-gradient(180deg, oklch(1 0 0 / 0.55), oklch(1 0 0 / 0.08) 55%, transparent), radial-gradient(120% 70% at 12% 8%, oklch(1 0 0 / 0.85), transparent 60%)",
          }}
        />
      )}
      {!plain && !noGlass && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(70% 50% at 92% 100%, oklch(0.2 0 0 / 0.12), transparent 65%)",
          }}
        />
      )}
      {image && (
        <img
          src={image}
          alt={alt ?? ""}
          className={`absolute inset-0 h-full w-full ${imageFit === "contain" ? "object-contain" : "object-cover"}`}
          loading={loading ?? "lazy"}
          decoding="async"
        />
      )}
      {!noGlass && (
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/70" />
      )}
      {!noGlass && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-[inherit] opacity-50"
          style={{
            background:
              "linear-gradient(180deg, oklch(1 0 0 / 0.55), transparent 80%)",
            filter: "blur(2px)",
          }}
        />
      )}
      {children}
    </div>
  );
}