import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Scissors, Zap, Heart, X, Eye, Sparkles } from "lucide-react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { WhatsAppSalonModal } from "@/components/WhatsAppSalonModal";
import { servicesService, salonService, authService } from "@/backend/services";
import { SALONS, waLinkFor, type SalonId } from "@/lib/salon-data";
import type { ServiceItem } from "@/backend/models";
import { useEffect, useState, useMemo } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";

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
  const [open, setOpen] = useState<ServiceItem | null>(null);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [salonId, setSalonId] = useState<SalonId>("parfait");

  // Charger les services
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await servicesService.getActive();
        setServices(data);
        
        // Load user info
        const user = await authService.getCurrentUser();
        if (user) {
          setUserName(user.full_name || user.email);
        }
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

  const handleToggleFavorite = async (service: ServiceItem) => {
    // Vérifier si l'utilisateur est connecté
    const user = await authService.getCurrentUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    const nextItems = toggleFavorite(asFavoriteItem(service, "service"));
    setFavorites(nextItems);
  };

  const handleWhatsAppClick = (service: ServiceItem) => {
    setSelectedItem(service);
    setWhatsappModalOpen(true);
  };

  return (
    <AppShell title="Nos Services" subtitle="Une prestation pensée pour vous">
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

      {/* Sélecteur de salon */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 liquid-glass rounded-full p-1 flex gap-1"
      >
        {SALONS.filter((s) => s.tags.includes("services")).map((s) => (
          <GlassButton
            key={s.id}
            type="button"
            onClick={() => setSalonId(s.id as SalonId)}
            variant={salonId === s.id ? "primary" : "light"}
            size="sm"
            className="flex-1 whitespace-nowrap"
          >
            <span className="flex items-center justify-center gap-1">
              {s.name}
              <span className="text-[9px] opacity-70">· {s.area}</span>
            </span>
          </GlassButton>
        ))}
      </motion.div>

      {/* Filtres par catégorie */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5"
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

      {/* Liste des services */}
      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">Chargement des services...</p>
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
        <div className="mt-5 grid grid-cols-1 gap-4">
          {filteredServices.map((s, i) => {
            const durationDisplay = s.duration_min ? `${s.duration_min} min` : "Sur mesure";
            const isFavorite = favorites.some((f) => f.id === s.id && f.kind === "service");
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(s)}
                  className="liquid-glass w-full rounded-[28px] p-5 text-left transition hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3">
                    {s.image_url ? (
                      <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-[24px] bg-stone-100 ring-1 ring-black/5">
                        <img
                          className="h-full w-full object-cover"
                          src={s.image_url}
                          alt={s.title}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold-deep)]/20 text-xs font-semibold uppercase text-muted-foreground">
                        <Sparkles className="h-6 w-6 text-[var(--gold-deep)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-semibold leading-tight">
                        {s.title}
                      </h3>
                      {s.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {s.description}
                        </p>
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
                    <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                      <Eye className="h-3 w-3" /> Voir détails
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <GlassButton
                      type="button"
                      onClick={() => handleWhatsAppClick(s)}
                      variant="whatsapp"
                      size="md"
                      full
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" style={{ color: "#25D366" }} /> Réserver
                    </GlassButton>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(s);
                      }}
                      className={`rounded-full p-2 transition ${
                        isFavorite ? "text-rose-600" : "text-muted-foreground hover:text-rose-400"
                      }`}
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de détail du service */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-[var(--gold-soft)]/30 bg-gradient-to-br from-white to-[var(--gold-light)] p-6 shadow-xl shadow-[var(--gold)]/10"
            >
              <div className="flex items-start justify-between">
                <h2 className="flex-1 pr-2 font-display text-2xl font-semibold">{open.title}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="rounded-full p-2 hover:bg-stone-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {open.image_url && (
                <div className="mt-4 overflow-hidden rounded-[32px] border border-stone-200 bg-stone-100">
                  <img
                    className="aspect-[4/3] w-full object-cover"
                    src={open.image_url}
                    alt={open.title}
                    loading="lazy"
                  />
                </div>
              )}

              {open.description && (
                <p className="mt-4 text-sm text-muted-foreground">{open.description}</p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Catégorie
                  </p>
                  <p className="mt-1 text-sm font-semibold">{open.category}</p>
                </div>

                {open.duration_min > 0 && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Durée
                    </p>
                    <p className="mt-1 text-sm font-semibold">{open.duration_min} minutes</p>
                  </div>
                )}

                {open.price > 0 && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Tarif
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {open.price.toLocaleString()} F CFA
                    </p>
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
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
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
                    fill={
                      favorites.some((f) => f.id === open.id && f.kind === "service")
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Salon Selection Modal */}
      <WhatsAppSalonModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        itemName={selectedItem?.title || ""}
        itemImage={selectedItem?.image_url}
        message={`Bonjour, je souhaite réserver : ${selectedItem?.title || ""}.`}
        itemLink={selectedItem ? `${window.location.origin}/services` : undefined}
        itemCategory={selectedItem?.category}
        userName={userName || undefined}
      />
    </AppShell>
  );
}
