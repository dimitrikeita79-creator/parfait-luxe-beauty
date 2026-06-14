import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ChevronRight } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { SERVICES, formatFCFA, waLink } from "@/lib/salon-data";
import { useState } from "react";

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
          <button
            key={t}
            onClick={() => setActive(t === "Tout" ? null : t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
              (t === "Tout" && !active) || active === t
                ? "bg-black text-white shadow-soft"
                : "glass text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        {SERVICES.filter((s) => !active || s.title === active).map((s, i) => (
          <div key={s.id} className="liquid-glass animate-fade-up rounded-[28px] p-4" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex gap-4">
              <Frame tone={s.tone} rounded="rounded-2xl" className="h-24 w-24 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold leading-tight">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.desc}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="glass inline-flex items-center gap-1 rounded-full px-2 py-1">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </span>
                  <span className="font-semibold text-gold">Dès {formatFCFA(s.price)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={waLink(`Bonjour, je souhaite réserver: ${s.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2.5 text-xs font-semibold text-white shadow-soft active:scale-[0.98] transition"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> Réserver via WhatsApp
              </a>
              <Link to="/contact" className="glass inline-flex items-center justify-center gap-1 rounded-full px-4 py-2.5 text-xs font-semibold active:scale-[0.98] transition">
                Détails <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}