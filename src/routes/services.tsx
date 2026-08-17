import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Scissors, Zap, Heart, X, Sparkles, ShoppingCart, Palette, Wind, Droplets, Crown, Paintbrush } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { servicesService, authService } from "@/backend/services";
import { waLinkFor, getSalonIdFromName, getSalon } from "@/lib/salon-data";
import type { ServiceItem } from "@/backend/models";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/context/CartContext";

const ESTABLISHMENTS = ["Parfait Design", "Desmo Hair"] as const;
type EstablishmentFilter = typeof ESTABLISHMENTS[number] | "all";

type CategoryStyle = { icon: typeof Scissors; color: string; iconColor: string };

const getCategoryIcon = (category?: string): CategoryStyle => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("coiffure") || cat.includes("coupe") || cat.includes("brushing")) return { icon: Scissors, color: "from-amber-100 to-orange-100", iconColor: "text-orange-600" };
  if (cat.includes("mèche") || cat.includes("meche") || cat.includes("highlight")) return { icon: Sparkles, color: "from-pink-100 to-rose-100", iconColor: "text-pink-600" };
  if (cat.includes("perruque") || cat.includes("tresse") || cat.includes("lock") || cat.includes("braid")) return { icon: Crown, color: "from-purple-100 to-violet-100", iconColor: "text-purple-600" };
  if (cat.includes("coloration") || cat.includes("color") || cat.includes("teinture")) return { icon: Palette, color: "from-blue-100 to-indigo-100", iconColor: "text-blue-600" };
  if (cat.includes("lissage") || cat.includes("defris") || cat.includes("straight")) return { icon: Wind, color: "from-cyan-100 to-teal-100", iconColor: "text-cyan-600" };
  if (cat.includes("soin") || cat.includes("traitement") || cat.includes("treatment")) return { icon: Droplets, color: "from-emerald-100 to-green-100", iconColor: "text-emerald-600" };
  if (cat.includes("extension") || cat.includes("pose") || cat.includes("nail") || cat.includes("ongle")) return { icon: Paintbrush, color: "from-fuchsia-100 to-pink-100", iconColor: "text-fuchsia-600" };
  if (cat.includes("mariage") || cat.includes("wedding")) return { icon: Heart, color: "from-red-100 to-rose-100", iconColor: "text-red-500" };
  return { icon: Zap, color: "from-yellow-100 to-amber-100", iconColor: "text-yellow-600" };
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Parfait.Design/Desmohair" },
      {
        name: "description",
        content: "Tresses, mariage, perruques, coloration, lissage, extensions et conseils beauté.",
      },
      {
        property: "og:title",
        content: "Services — Parfait.Design/Desmohair",
      },
      {
        property: "og:description",
        content: "Découvrez tous nos services de beauté et coiffure.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const favoriteSet = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((f) => set.add(`${f.kind}:${f.id}`));
    return set;
  }, [favorites]);
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>("all");
  const { success, error: toastError } = useToast();
  const { addItem: addToCart } = useCart();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesService.getActive();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setError("Le chargement prend trop de temps. Vérifiez votre connexion.");
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Charger les services
  useEffect(() => {
    void reload();
  }, [reload]);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.category)));
    return ["Tout", ...unique];
  }, [services]);

  // Filtrer les services selon le filtre actif et l'établissement
  const filteredServices = useMemo(() => {
    let result = services;
    if (active) {
      result = result.filter((s) => s.category === active);
    }
    if (establishmentFilter !== "all") {
      result = result.filter((s) => s.salon_name === establishmentFilter);
    }
    return result;
  }, [services, active, establishmentFilter]);

  const handleToggleFavorite = useCallback(
    async (service: ServiceItem) => {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      const nextItems = toggleFavorite(asFavoriteItem(service, "service"));
      setFavorites(nextItems);
    },
    [navigate],
  );

  const handleWhatsAppClick = useCallback(
    (service: ServiceItem) => {
      const salonId = getSalonIdFromName(service.salon_name);
      const salon = getSalon(salonId);
      const msg = `Bonjour ${salon.name}, je souhaite réserver : ${service.title}${service.price ? ` — ${service.price.toLocaleString()} FCFA` : ""}${service.duration_min ? ` (${service.duration_min} min)` : ""}.`;
      const link = waLinkFor(salonId, msg);
      window.open(link, "_blank", "noopener,noreferrer");
    },
    [],
  );

  const handleAddToCart = useCallback(
    async (service: ServiceItem) => {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      try {
        await addToCart({
          item_type: "service",
          item_id: service.id,
          title: service.title,
          image_url: service.image_url,
          price: service.price,
          quantity: 1,
          salon_name: service.salon_name,
          code: service.code,
        });
        success("Panier", "Article ajouté au panier");
      } catch {
        toastError("Panier", "Impossible d'ajouter l'article");
      }
    },
    [navigate, addToCart, success, toastError],
  );

  return (
    <div>
      {/* Message d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtre par établissement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}
      >
        <button
          type="button"
          onClick={() => setEstablishmentFilter("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
            establishmentFilter === "all"
              ? "bg-[var(--gold)] text-white shadow-lg shadow-[var(--gold)]/30"
              : "glass-button glass-button--light text-foreground"
          }`}
        >
          {establishmentFilter === "all" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          Tout
        </button>
        {ESTABLISHMENTS.map((est) => {
          const isActive = establishmentFilter === est;
          return (
            <button
              key={est}
              type="button"
              onClick={() => setEstablishmentFilter(isActive ? "all" : est)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-[var(--gold)] text-white shadow-lg shadow-[var(--gold)]/30"
                  : "glass-button glass-button--light text-foreground"
              }`}
            >
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              {est}
            </button>
          );
        })}
      </motion.div>

      {/* Filtres par catégorie */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}
        >
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
        </motion.div>
      )}

      {/* Skeleton / loading */}
      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[24px] border border-stone-200 bg-white p-2.5">
              <div className="aspect-[4/5] w-full rounded-2xl bg-stone-200" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 py-12"
        >
          <p className="text-sm text-muted-foreground">Aucun service disponible.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredServices.map((s, i) => {
            const durationDisplay = s.duration_min ? `${s.duration_min} min` : "Sur mesure";
            const categoryStyle = getCategoryIcon(s.category);
            const { icon: CategoryIcon, color, iconColor } = categoryStyle;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.25), duration: 0.3 }}
              className="liquid-glass rounded-[24px] p-3"
            >
              {s.image_url ? (
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] w-full bg-white">
                  <img
                    src={s.image_url}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-br ${color}`} style={{ aspectRatio: "4/5" }}>
                  <CategoryIcon className={`h-8 w-8 ${iconColor}`} />
                </div>
              )}
              <div className="mt-2">
                <p className="font-display text-sm font-semibold leading-tight">{s.title}</p>
                {s.description && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">{s.description}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="glass inline-flex items-center gap-1 rounded-full px-1.5 py-0.5">
                    <Clock className="h-2.5 w-2.5" /> {durationDisplay}
                  </span>
                  {s.price > 0 && (
                    <span className="glass inline-flex items-center gap-1 rounded-full px-1.5 py-0.5">
                      💰 {s.price.toLocaleString()} F CFA
                    </span>
                  )}
                  {s.salon_name && (
                    <span className="glass inline-flex items-center gap-1 rounded-full px-1.5 py-0.5">
                      📍 {s.salon_name}
                    </span>
                  )}
                  {s.code && (
                    <span className="glass inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono font-semibold text-[var(--gold-deep)]">
                      Code: {s.code}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.category}</span>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                  <GlassButton
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleWhatsAppClick(s);
                    }}
                    variant="whatsapp"
                    size="sm"
                    full
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20"
                  >
                    <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> Réserver
                  </GlassButton>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleAddToCart(s);
                    }}
                    className="rounded-full border border-stone-200 p-1.5 text-stone-600 transition hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
                    title="Ajouter au panier"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(s);
                    }}
                    className={`rounded-full p-1.5 transition ${
                      favoriteSet.has(`service:${s.id}`) ? "text-rose-600" : "text-muted-foreground hover:text-rose-400"
                    }`}
                    title={favoriteSet.has(`service:${s.id}`) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className="h-4 w-4" fill={favoriteSet.has(`service:${s.id}`) ? "currentColor" : "none"} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
