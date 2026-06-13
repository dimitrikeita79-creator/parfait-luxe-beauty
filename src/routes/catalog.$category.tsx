import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { CATALOG, CATALOG_ITEMS, formatFCFA, waLink } from "@/lib/salon-data";

export const Route = createFileRoute("/catalog/$category")({
  head: ({ params }) => {
    const cat = CATALOG.find((c) => c.slug === params.category);
    const name = cat?.name ?? "Catégorie";
    return {
      meta: [
        { title: `${name} — Catalogue Parfait Design` },
        { name: "description", content: `Découvrez nos ${name.toLowerCase()} — ${cat?.countLabel ?? ""}.` },
        { property: "og:title", content: `${name} — Parfait Design Des Mohair` },
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
      <Link to="/catalog" className="bg-gold mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold text-[oklch(0.15_0.01_60)]">
        Retour au catalogue
      </Link>
    </AppShell>
  ),
  errorComponent: ({ reset }) => (
    <AppShell title="Erreur">
      <p className="mt-6 text-sm text-muted-foreground">Une erreur est survenue.</p>
      <button onClick={reset} className="bg-gold mt-4 rounded-full px-4 py-2 text-xs font-semibold">Réessayer</button>
    </AppShell>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const items = CATALOG_ITEMS[cat.slug] ?? [];

  return (
    <AppShell title={cat.name} subtitle={cat.countLabel}>
      <Link to="/catalog" className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium">
        <ChevronLeft className="h-3 w-3" /> Catalogue
      </Link>

      {cat.comingSoon ? (
        <div className="glass-strong mt-8 rounded-[28px] p-8 text-center">
          <p className="font-display text-2xl font-semibold text-gold">Bientôt disponible</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nos {cat.name.toLowerCase()} arrivent très prochainement. Contactez-nous pour être averti(e).
          </p>
          <a
            href={waLink(`Bonjour, je souhaite être informé(e) dès l'arrivée des ${cat.name.toLowerCase()}.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-semibold text-white shadow-soft"
          >
            <MessageCircle className="h-3.5 w-3.5" /> M'avertir via WhatsApp
          </a>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((p, i) => (
            <div key={p.id} className="glass animate-fade-up rounded-[24px] p-3" style={{ animationDelay: `${i * 25}ms` }}>
              <Frame
                tone={cat.tone}
                rounded="rounded-2xl"
                className="aspect-[4/5] w-full"
              >
                {p.badge && (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.15_0.01_60)]">
                    {p.badge}
                  </span>
                )}
              </Frame>
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{p.desc}</p>
              {p.price !== undefined && p.price > 0 && (
                <p className="mt-1.5 text-sm font-bold text-gold">{formatFCFA(p.price)}</p>
              )}
              <a
                href={waLink(`Bonjour, je souhaite plus d'infos sur: ${p.name}${p.price ? ` (${formatFCFA(p.price)})` : ""}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full bg-[#25D366] py-2 text-[11px] font-semibold text-white shadow-soft active:scale-[0.98] transition"
              >
                <MessageCircle className="h-3 w-3" /> {cat.slug === "promotion" ? "J'en profite" : "Commander"}
              </a>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}