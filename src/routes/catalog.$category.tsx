import { createFileRoute, Link, notFound, useSearch } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { CATALOG, CATALOG_ITEMS, formatFCFA, pickSalonFor, waLinkFor, getFirstImageForCategory } from "@/lib/salon-data";

export const Route = createFileRoute("/catalog/$category")({
  validateSearch: (s: Record<string, unknown>) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
  }),
  head: ({ params }) => {
    const cat = CATALOG.find((c) => c.slug === params.category);
    const name = cat?.name ?? "Catégorie";
    return {
      meta: [
        { title: `${name} — Catalogue Parfait.Design/Desmohair` },
        { name: "description", content: `Découvrez nos ${name.toLowerCase()} — ${cat?.countLabel ?? ""}.` },
        { property: "og:title", content: `${name} — Parfait.Design/Desmohair` },
        { property: "og:description", content: `${cat?.countLabel ?? ""} dans la collection ${name}.` },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = CATALOG.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  notFoundComponent: () => (
    <AppShell title="Introuvable">
      <p className="mt-6 text-sm text-muted-foreground">Cette catégorie n'existe pas.</p>
      <Link to="/catalog" className="liquid-glass mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold">
        Retour au catalogue
      </Link>
    </AppShell>
  ),
  errorComponent: ({ reset }) => (
    <AppShell title="Erreur">
      <p className="mt-6 text-sm text-muted-foreground">Une erreur est survenue.</p>
      <button onClick={reset} className="liquid-glass mt-4 rounded-full px-4 py-2 text-xs font-semibold">Réessayer</button>
    </AppShell>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const { highlight } = useSearch({ from: "/catalog/$category" });
  const items = CATALOG_ITEMS[cat.slug] ?? [];
  const salon = pickSalonFor(cat.slug);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (!highlight) return;
    const el = refs.current[highlight];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  return (
    <AppShell title={cat.name} subtitle={cat.countLabel}>
      <Link to="/catalog" className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium">
        <ChevronLeft className="h-3 w-3" /> Catalogue
      </Link>

      {/* Cover image */}
      {!cat.comingSoon && (
        <div className="mt-3 rounded-[24px] overflow-hidden">
          <Frame variant="plain" rounded="rounded-[24px]" className="aspect-video w-full" image={getFirstImageForCategory(cat.slug)} alt={cat.name} />
        </div>
      )}

      {cat.comingSoon ? (
        <div className="glass-strong mt-8 rounded-[28px] p-8 text-center">
          <p className="font-display text-2xl font-semibold text-gold">Bientôt disponible</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nos {cat.name.toLowerCase()} arrivent très prochainement. Contactez-nous pour être averti(e).
          </p>
          <GlassButton
            as="a"
            href={waLinkFor(salon.id, `Bonjour ${salon.name}, je souhaite être informé(e) dès l'arrivée des ${cat.name.toLowerCase()}.`)}
            target="_blank"
            rel="noreferrer"
            variant="whatsapp"
            size="md"
            className="mt-5"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" style={{ color: "#25D366" }} /> M'avertir via WhatsApp
          </GlassButton>
        </div>
      ) : (
        <>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Commandes traitées par <span className="font-semibold text-[var(--gold-deep)]">{salon.name}</span> · {salon.area}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {items.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { refs.current[p.id] = el; }}
              className={`liquid-glass animate-fade-up rounded-[24px] p-3 transition-all duration-300 ${highlight === p.id ? "ring-2 ring-[var(--gold)] scale-[1.02]" : ""}`}
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <Frame variant="plain" rounded="rounded-2xl" className="aspect-[4/5] w-full" image={p.image} alt={p.name}>
                {p.badge && (
                  <span
                    className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
                    style={{ background: "oklch(1 0 0 / 0.9)", color: "oklch(0.5 0.11 80)", border: "1px solid oklch(1 0 0 / 0.95)" }}
                  >
                    {p.badge}
                  </span>
                )}
                {p.code && (
                  <span
                    className="absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-md"
                    style={{ background: "oklch(1 0 0 / 0.85)", color: "oklch(0.3 0.01 60)", border: "1px solid oklch(1 0 0 / 0.9)" }}
                  >
                    {p.code}
                  </span>
                )}
              </Frame>
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              {(p.subCategory || p.texture) && (
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-[var(--gold-deep)]">
                  {[p.subCategory, p.texture].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{p.desc}</p>
              {p.price !== undefined && p.price > 0 && (
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  {p.fromPrice && <span className="text-[9px] text-muted-foreground">Dès</span>}
                  <span className="text-sm font-bold text-gold">{formatFCFA(p.price)}</span>
                  {p.oldPrice && (
                    <span className="text-[10px] text-muted-foreground line-through">{formatFCFA(p.oldPrice)}</span>
                  )}
                </p>
              )}
              <GlassButton
                as="a"
                href={waLinkFor(salon.id, `Bonjour ${salon.name}, je souhaite commander : ${p.name}${p.code ? ` [${p.code}]` : ""}${p.price ? ` — ${formatFCFA(p.price)}` : ""}.`)}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="sm"
                full
                className="mt-2"
              >
                <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> {cat.slug === "promotion" ? "J'en profite" : "Commander"}
              </GlassButton>
            </div>
          ))}
        </div>
        </>
      )}
    </AppShell>
  );
}