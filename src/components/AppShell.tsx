import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, Image as ImageIcon, ShoppingBag, Phone, Moon, Sun, MessageCircle } from "lucide-react";
import { type ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { waLink } from "@/lib/salon-data";

const NAV = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/gallery", label: "Galerie", icon: ImageIcon },
  { to: "/products", label: "Produits", icon: ShoppingBag },
  { to: "/contact", label: "Contact", icon: Phone },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const { resolved, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mx-auto max-w-md">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[var(--gold-soft)] opacity-30 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[var(--rose)] opacity-40 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-[var(--gold)] opacity-20 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 px-5 pt-5 pb-3">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gold grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-[oklch(0.15_0.01_60)] shadow-luxe">PD</span>
            <div className="leading-tight">
              <p className="font-display text-[13px] font-semibold">Parfait Design</p>
              <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Des Mohair</p>
            </div>
          </Link>
          <button
            onClick={toggle}
            aria-label="Changer de thème"
            className="glass grid h-10 w-10 place-items-center rounded-full transition active:scale-95"
          >
            {resolved === "dark" ? <Sun className="h-4 w-4 text-[var(--gold-soft)]" /> : <Moon className="h-4 w-4 text-foreground" />}
          </button>
        </div>
        {title && (
          <div className="mt-5 px-1 animate-fade-up">
            <h1 className="font-display text-3xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="px-5 pb-36">{children}</main>

      {/* Floating WhatsApp */}
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-28 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-luxe transition active:scale-95 animate-float"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-75" />
        </span>
      </a>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 pb-4 pt-2">
        <div className="glass-strong flex items-center justify-between rounded-full px-2 py-2">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-2 transition"
              >
                {active && (
                  <span className="bg-gold absolute inset-0 rounded-full opacity-100 shadow-luxe" />
                )}
                <Icon className={`relative h-5 w-5 ${active ? "text-[oklch(0.15_0.01_60)]" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 1.8} />
                <span className={`relative text-[10px] font-medium ${active ? "text-[oklch(0.15_0.01_60)]" : "text-muted-foreground"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-[28px] ${className}`}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mt-7 mb-3 flex items-end justify-between px-1">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {action}
    </div>
  );
}