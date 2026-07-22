import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ChevronLeft, Heart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { catalogService, salonService } from "@/backend/services";
import { waLinkFor, SALONS, pickSalonFor } from "@/lib/salon-data";
import type { CatalogItem, SalonInfo } from "@/backend/models";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";

const formatFCFA = (price: number) => {
  return new Intl.NumberFormat("fr-BF", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
};

export const Route = createFileRoute("/catalog/$category")({
  validateSearch: (s: Record<string, unknown>) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
  }),
  head: ({ params }) => {
    const catName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
    return {
      meta: [
        { title: `${catName} — Catalogue Parfait.Design/Desmohair` },
        { name: "description", content: `Découvrez nos ${catName.toLowerCase()}.` },
        { property: "og:title", content: `${catName} — Parfait.Design/Desmohair` },
        { property: "og:description", content: `Collection ${catName.toLowerCase()}.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { highlight } = useSearch({ from: "/catalog/$category" });
  
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const [open, setOpen] = useState<CatalogItem | null>(null);
  
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const salon = SALONS.find((s) => s.tags.some((tag) => tag === category)) || pickSalonFor(category);

  // Charger les items de la catégorie
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await catalogService.getByCategory(category);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la catégorie");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [category]);

  // Charger les infos du salon
  useEffect(() => {
    const loadSalonInfo = async () => {
      try {
        const info = await salonService.getInfo();
        setSalonInfo(info);
      } catch {
        // Silent fail
      }
    };

    loadSalonInfo();
  }, []);

  const handleToggleFavorite = (item: CatalogItem) => {
    const nextItems = toggleFavorite(asFavoriteItem(item, "catalog"));
    setFavorites(nextItems);
  };

  // Scroll vers l'élément highlighté
  useEffect(() => {
    if (!highlight) return;
    const el = refs.current[highlight];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  if (loading) {
    return (
      <AppShell title={catName} subtitle="Chargement...">
        <Link to="/catalog" className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium">
          <ChevronLeft className="h-3 w-3" /> Catalogue
        </Link>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current/20 border-t-current" />
          <p className="text-sm text-muted-foreground">Chargement des articles...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={catName} subtitle={`${items.length} article${items.length > 1 ? "s" : ""}`}>
      <Link to="/catalog" className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium">
        <ChevronLeft className="h-3 w-3" /> Catalogue
      </Link>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Affichage des articles */}
      {items.length === 0 ? (
        <div className="glass-strong mt-8 rounded-[28px] p-8 text-center">
          <p className="font-display text-2xl font-semibold text-gold">Aucun article</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun article disponible dans cette catégorie pour le moment.
          </p>
          <GlassButton as={Link} to="/catalog" variant="whatsapp" size="md" className="mt-5">
            Retour au catalogue
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
                ref={(el) => {
                  refs.current[p.id] = el;
                }}
                className={`liquid-glass animate-fade-up rounded-[24px] p-3 transition-all duration-300 ${highlight === p.id ? "ring-2 ring-[var(--gold)] scale-[1.02]" : ""}`}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <button type="button" onClick={() => setOpen(p)} className="w-full text-left">
                {p.image_url && (
                  <Frame variant="plain" rounded="rounded-2xl" className="aspect-[4/5] w-full" image={p.image_url} alt={p.title} />
                )}
                <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.title}</p>
                {p.description && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{p.description}</p>
                )}
                {p.price > 0 && (
                  <p className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-gold">{formatFCFA(p.price)}</span>
                  </p>
                )}
                  <GlassButton
                    as="a"
                    href={waLinkFor(salon.id as any, `Bonjour ${salon.name}, je souhaite commander : ${p.title}${p.price ? ` — ${formatFCFA(p.price)}` : ""}.`)}
                    target="_blank"
                    rel="noreferrer"
                    variant="whatsapp"
                    size="sm"
                    full
                    className="mt-2"
                  >
                    <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> Commander
                  </GlassButton>
                </button>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Cliquez sur l’image pour voir les détails</p>
                  <button type="button" className={`rounded-full border px-2.5 py-1.5 text-sm ${favorites.some((favorite) => favorite.kind === "catalog" && favorite.id === p.id) ? "border-rose-400 bg-rose-500/10 text-rose-600" : "border-stone-300 text-stone-600"}`} onClick={() => handleToggleFavorite(p)}>
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}