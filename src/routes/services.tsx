import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ChevronRight, Scissors, Zap, Heart, X } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { servicesService, salonService } from "@/backend/services";
import { SALONS, waLinkFor, type SalonId } from "@/lib/salon-data";
import type { ServiceItem } from "@/backend/models";
import { useEffect, useState, useMemo } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";

// Mapper les catégories à des icônes
const getCategoryIcon = (category: string): typeof Zap => {
  const cat = category.toLowerCase().trim();
  if (cat.includes("pose")) return Scissors;
  if (cat.includes("tresse") || cat.includes("coiffure")) return Scissors;
  if (cat.includes("mariage")) return Heart;
  if (cat.includes("tissage")) return Zap;
  if (cat.includes("perruque")) return Scissors;
  if (cat.includes("produit") || cat.includes("équipement")) return Zap;
  return Zap;
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
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [salonId, setSalonId] = useState<SalonId>("parfait");
  const [favorites, setFavorites] = useState(getFavorites());
  const [open, setOpen] = useState<ServiceItem | null>(null);

  // Charger les services
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await servicesService.getActive();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.category)));
    return ["Tout", ...unique];
  }, [services]);

  // Filtrer les services selon le filtre actif
  const filteredServices = useMemo(() => {
    return services.filter((s) => !active || s.category === active);
  }, [services, active]);

  const handleToggleFavorite = (service: ServiceItem) => {
    const nextItems = toggleFavorite(asFavoriteItem(service, "service"));
    setFavorites(nextItems);
  };
  return (
    <AppShell title="Nos Services" subtitle="Une prestation pensée pour vous">
      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Sélecteur de salon */}
      <div className="mt-4 liquid-glass rounded-full p-1 flex gap-1">
        {SALONS.filter((s) => s.tags.includes("services")).map((s) => (
          <button
            key={s.id}
            onClick={() => setSalonId(s.id as SalonId)}
            className={`flex-1 rounded-full px-3 py-2 text-[11px] font-semibold transition ${salonId === s.id ? "bg-white shadow-sm text-[var(--gold-deep)]" : "text-muted-foreground"}`}
          >
            {s.name}
            <span className="ml-1 text-[9px] opacity-70">· {s.area}</span>
          </button>
        ))}
      </div>

      {/* Filtres par catégorie */}
      {!loading && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {categories.map((t) => (
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
      )}

      {/* Liste des services */}
      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current/20 border-t-current" />
          <p className="text-sm text-muted-foreground">Chargement des services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-sm text-muted-foreground">Aucun service disponible.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4">
          {filteredServices.map((s, i) => {
            const Icon = getCategoryIcon(s.category);
            const durationDisplay = s.duration_min ? `${s.duration_min} min` : "Sur mesure";
            const isFavorite = favorites.some((f) => f.id === s.id && f.kind === "service");
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpen(s)}
                className="liquid-glass animate-fade-up rounded-[28px] p-5 text-left transition hover:shadow-md"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-[var(--red-deep)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl font-semibold leading-tight">{s.title}</h3>
                    {s.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                    <Clock className="h-3 w-3" /> {durationDisplay}
                  </span>
                  {s.price > 0 && (
                    <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                      💰 {s.price.toLocaleString()} F CFA
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <GlassButton
                    as="a"
                    href={waLinkFor(salonId, `Bonjour, je souhaite réserver : ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    variant="whatsapp"
                    size="md"
                    full
                    className="flex-1"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" style={{ color: "#25D366" }} /> Réserver
                  </GlassButton>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(s);
                    }}
                    className={`rounded-full p-2 transition ${isFavorite ? "text-rose-600" : "text-muted-foreground hover:text-rose-400"}`}
                    title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de détail du service */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="animate-fade-up max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-stone-200 bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h2 className="flex-1 pr-2 font-display text-2xl font-semibold">{open.title}</h2>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="rounded-full p-2 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {open.description && (
              <p className="mt-3 text-sm text-muted-foreground">{open.description}</p>
            )}

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Catégorie
                </p>
                <p className="mt-1 font-semibold">{open.category}</p>
              </div>

              {open.duration_min > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Durée
                  </p>
                  <p className="mt-1 font-semibold">{open.duration_min} minutes</p>
                </div>
              )}

              {open.price > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Tarif
                  </p>
                  <p className="mt-1 font-semibold">{open.price.toLocaleString()} F CFA</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <GlassButton
                as="a"
                href={waLinkFor(salonId, `Bonjour, je souhaite réserver : ${open.title}.`)}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="md"
                full
              >
                <WhatsAppIcon className="h-4 w-4" style={{ color: "#25D366" }} /> Réserver
              </GlassButton>
              <button
                type="button"
                onClick={() => {
                  handleToggleFavorite(open);
                  setOpen(null);
                }}
                className="rounded-full border border-stone-200 p-3 transition hover:bg-stone-50"
                title="Ajouter aux favoris"
              >
                <Heart
                  className="h-5 w-5"
                  fill={favorites.some((f) => f.id === open.id && f.kind === "service") ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}