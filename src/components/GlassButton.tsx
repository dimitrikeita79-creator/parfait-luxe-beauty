import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type Variant = "primary" | "light" | "whatsapp" | "gold";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "glass-button glass-button--primary",
  light: "glass-button glass-button--light",
  whatsapp: "glass-button",
  gold: "glass-button glass-button--gold",
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
  const variantClasses = VARIANT_CLASSES[variant];

  return (
    <Comp
      {...(rest as any)}
      className={`${variantClasses} inline-flex items-center justify-center gap-1.5 rounded-full font-semibold backdrop-blur-xl transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
    >
      <span className="relative inline-flex items-center gap-1.5">{children}</span>
    </Comp>
  );
}

export default GlassButton;