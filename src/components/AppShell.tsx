import { Link, useRouterState } from "@tanstack/react-router";
import { type CSSProperties, type ReactNode } from "react";
import { waLink } from "@/lib/salon-data";
import logoAsset from "@/assets/DESMOHAIR.jpg";
import homeIcon from "@/assets/icone/page-daccueil.svg";
import servicesIcon from "@/assets/icone/soutien-technique.svg";
import galleryIcon from "@/assets/icone/galerie-dimages.svg";
import catalogIcon from "@/assets/icone/catalogue.svg";
import contactIcon from "@/assets/icone/contact.svg";
import profileIcon from "@/assets/icone/profil.svg";

const NAV = [
  { to: "/", label: "Accueil", icon: homeIcon, color: "oklch(0.62 0.11 80)" },
  { to: "/services", label: "Services", icon: servicesIcon, color: "#E1306C" },
  { to: "/gallery", label: "Galerie", icon: galleryIcon, color: "#1877F2" },
  { to: "/catalog", label: "Catalogue", icon: catalogIcon, color: "oklch(0.45 0.02 60)" },
  { to: "/contact", label: "Contact", icon: contactIcon, color: "#25D366" },
  { to: "/profile", label: "Profil", icon: profileIcon, color: "oklch(0.62 0.11 80)" },
] as const;

export function WhatsAppIcon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.4-1.318.07-.245.27-1.318.27-1.477 0-.36-.158-.474-.443-.616-.317-.157-2.063-.946-2.213-.946zM16.272 25.6c-1.692 0-3.354-.46-4.81-1.318l-.345-.205-3.555.934.95-3.473-.223-.36a9.41 9.41 0 0 1-1.435-5.04c0-5.225 4.245-9.47 9.47-9.47s9.47 4.245 9.47 9.47-4.244 9.47-9.47 9.47zm0-20.804C9.984 4.796 4.88 9.9 4.88 16.188c0 2.022.53 4.022 1.535 5.78L4.8 27.764l5.96-1.55a11.353 11.353 0 0 0 5.512 1.394h.005c6.288 0 11.4-5.105 11.4-11.393 0-3.046-1.185-5.91-3.337-8.063a11.42 11.42 0 0 0-8.067-3.346z"/>
    </svg>
  );
}

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-hidden">
      {/* Subtle blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mx-auto max-w-md">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[var(--gold-soft)] opacity-25 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-[var(--gold-soft)] opacity-20 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 px-5 pt-5 pb-3">
        <div className="glass-strong flex items-center justify-between rounded-full px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-black/5">
              <img src={logoAsset} alt="Desmohair" className="h-full w-full object-contain p-0.5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.08em]">Desmohair</p>
              <p className="text-[10px] text-muted-foreground">Parfait Design</p>
            </div>
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="relative grid h-10 w-10 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
              backdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid oklch(1 0 0 / 0.85)",
              boxShadow: "0 8px 20px -10px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)",
            }}
          >
            <WhatsAppIcon className="h-5 w-5" style={{ color: "#25D366" }} />
          </a>
        </div>
        {title && (
          <div className="mt-5 px-1 animate-fade-up">
            <h1 className="font-display text-3xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="px-4 pb-32">{children}</main>

      {/* Bottom nav — 5 onglets équilibrés */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 pb-4 pt-2">
        <div className="glass-nav flex items-center justify-between rounded-full px-2 py-2">
          {NAV.map(({ to, label, icon, color }) => (
            <NavItem key={to} to={to} label={label} icon={icon} color={color} pathname={pathname} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon,
  color,
  pathname,
}: {
  to: (typeof NAV)[number]["to"];
  label: string;
  icon: string;
  color: string;
  pathname: string;
}) {
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      preload="intent"
      className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-1 py-1.5 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
    >
      {active && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(180deg, oklch(1 0 0 / 0.9), oklch(1 0 0 / 0.6))",
            backdropFilter: "blur(18px) saturate(200%)",
            border: "1px solid oklch(1 0 0 / 0.95)",
            boxShadow: `0 10px 22px -10px ${color === "oklch(0.45 0.02 60)" ? "oklch(0.78 0.1 85 / 0.5)" : color + "70"}, inset 0 1px 0 oklch(1 0 0 / 0.85)`,
          }}
        />
      )}
      <span
        className={`relative grid h-7 w-7 place-items-center rounded-full transition-transform duration-300 ${active ? "animate-nav-pop" : "group-hover:scale-110"}`}
      >
        <img
          src={icon}
          alt=""
          className="h-[18px] w-[18px] object-contain"
          style={{
            opacity: active ? 1 : 0.78,
            filter: active ? "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))" : "grayscale(0.15) brightness(0.9)",
          }}
        />
      </span>
      <span
        className="relative text-[9.5px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: active ? color : "oklch(0.5 0.015 60)" }}
      >
        {label}
      </span>
    </Link>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-[28px] ${className}`}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mt-5 mb-2 flex items-end justify-between px-1">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}