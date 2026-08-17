import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useSafeNavigate, useRouterState } from "@/hooks/useSafeNavigate";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Clock, Heart, X, ShoppingCart } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { servicesService, authService } from "@/backend/services";
import { waLinkFor, getSalonIdFromName, getSalon } from "@/lib/salon-data";
import type { ServiceItem } from "@/backend/models";
import { useEffect, useRef, useState, useCallback } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/context/CartContext";

const ESTABLISHMENTS = ["Parfait Design", "Desmo Hair"] as const;
type EstablishmentFilter = typeof ESTABLISHMENTS[number] | "all";

const ServiceSkeleton = () => (
  <div className="liquid-glass rounded-[24px] p-3">
    <div className="relative overflow-hidden rounded-2xl aspect-[4/5] w-full bg-stone-100">
      <div className="absolute inset-0 animate-pulse bg-stone-200/60" />
    </div>
    <div className="mt-2 space-y-2">
      <div className="h-4 w-3/4 rounded bg-stone-200/70" />
      <div className="h-3 w-1/2 rounded bg-stone-200/60" />
    </div>
  </div>
);

export const Route = createFileRoute("/services/$category")({
  validateSearch: (s: Record<string, unknown>) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
  }),
  head: ({ params }) => {
    const catName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
    return {
      meta: [
        { title: `${catName} — Services Parfait.Design/Desmohair` },
        {
          name: "description",
          content: `Découvrez nos services de ${catName.toLowerCase()}.`,
        },
        { property: "og:title", content: `${catName} — Parfait.Design/Desmohair` },
        {
          property: "og:description",
          content: `Services ${catName.toLowerCase()}.`,
        },
      ],
    };
  },
  component: ServiceCategoryPage,
});

function ServiceCategoryPage() {
  const { category } = Route.useParams();
  const { highlight } = useSearch({ from: "/services/$category" });
  const [mounted, setMounted] = useState(false);
  const navigate = useSafeNavigate();
  const routerState = useRouterState();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>("all");
  const { success, error: toastError } = useToast();
  const { addItem: addToCart } = useCart();
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesService.getByCategory(category);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setError("Le chargement prend trop de temps. Vérifiez votre connexion.");
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!routerState || !mounted) return;
    const timer = setTimeout(() => {
      if (!category || category.trim() === "") {
        navigate({ to: "/services" });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [category, navigate, mounted, routerState]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filteredServices = services.filter((s) => {
    if (establishmentFilter === "all") return true;
    return s.salon_name === establishmentFilter;
  });

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
      <div className="px-4 pb-32">
        <Link
          to="/services"
          className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium"
        >
          <ChevronLeft className="h-3 w-3" /> Services
        </Link>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const catName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
      <div className="px-4 pb-32">
      <Link
        to="/services"
        className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium"
      >
        <ChevronLeft className="h-3 w-3" /> Services
      </Link>

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        <button
          type="button"
          onClick={() => setEstablishmentFilter("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
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
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
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

      {/* Affichage des services */}
      {filteredServices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong mt-8 rounded-[28px] p-8 text-center md:p-12"
        >
          <p className="font-display text-2xl font-semibold text-gold">Aucun service</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun service disponible dans cette catégorie pour le moment.
          </p>
          <GlassButton as={Link} to="/services" variant="whatsapp" size="md" className="mt-5">
            Retour aux services
          </GlassButton>
        </motion.div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-[11px] text-muted-foreground"
          >
            {establishmentFilter === "all"
              ? "Tous les établissements"
              : `Commandes traitées par ${getSalon(getSalonIdFromName(establishmentFilter)).name} · ${getSalon(getSalonIdFromName(establishmentFilter)).area}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredServices.map((s, i) => {
              const durationDisplay = s.duration_min ? `${s.duration_min} min` : "Sur mesure";
              const isFavorite = favorites.some((f) => f.kind === "service" && f.id === s.id);
              return (
                <motion.div
                  key={s.id}
                  ref={(el) => {
                    refs.current[s.id] = el;
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.25), duration: 0.3 }}
                  className={`liquid-glass rounded-[24px] p-3 ${
                    highlight === s.id ? "ring-2 ring-[var(--gold)] scale-[1.02]" : ""
                  }`}
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
                    <div className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100" style={{ aspectRatio: "4/5" }}>
                      <Clock className="h-8 w-8 text-yellow-600" />
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
                        isFavorite ? "text-rose-600" : "text-muted-foreground hover:text-rose-400"
                      }`}
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
