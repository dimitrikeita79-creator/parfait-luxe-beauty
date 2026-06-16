import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ChevronRight, Scissors, Sparkles, Heart, Crown, Gem, Package } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { IconBadge } from "@/components/IconBadge";
import { SERVICES, formatFCFA, waLink } from "@/lib/salon-data";
import { useState } from "react";

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  pose: Crown,
  tresses: Scissors,
  mariage: Heart,
  tissage: Sparkles,
  perruques: Gem,
  equipement: Package,
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Parfait.Design/Desmohair" },
      { name: "description", content: "Tresses, mariage, perruques, coloration, lissage, extensions et conseils beauté." },
      { property: "og:title", content: "Services — Parfait.Design/Desmohair" },
      { property: "og:description", content: "Découvrez tous nos services de beauté et coiffure." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <AppShell title="Nos Services" subtitle="Une prestation pensée pour vous">
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
        {["Tout", ...SERVICES.map((s) => s.title)].map((t) => (
          <GlassButton
            key={t}
            onClick={() => setActive(t === "Tout" ? null : t)}
            variant={(t === "Tout" && !active) || active === t ? "primary" : "light"}
            size="sm"
            className="whitespace-nowrap"
          >
            {t}
          </GlassButton>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        {SERVICES.filter((s) => !active || s.title === active).map((s, i) => {
          const Icon = SERVICE_ICONS[s.id] ?? Sparkles;
          return (
            <div key={s.id} className="liquid-glass animate-fade-up rounded-[28px] p-5" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-3">
                <IconBadge icon={Icon} tone="gold" size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                  <Clock className="h-3 w-3" /> {s.duration}
                </span>
                <span className="glass inline-flex items-center rounded-full px-2.5 py-1 font-semibold" style={{ color: "var(--gold-deep)" }}>
                  Dès {formatFCFA(s.price)}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <GlassButton
                  as="a"
                  href={waLink(`Bonjour, je souhaite réserver: ${s.title}.`)}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="md"
                  full
                  className="flex-1"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" style={{ color: "#25D366" }} /> Réserver
                </GlassButton>
                <GlassButton as={Link} to="/contact" variant="gold" size="md">
                  Détails <ChevronRight className="h-3 w-3" />
                </GlassButton>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}