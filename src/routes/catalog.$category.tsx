import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Heart, X, Eye, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { WhatsAppSalonModal } from "@/components/WhatsAppSalonModal";
import { catalogService, salonService, authService } from "@/backend/services";
import { waLinkFor, SALONS, pickSalonFor, type SalonId } from "@/lib/salon-data";
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
        {
          name: "description",
          content: `Découvrez nos ${catName.toLowerCase()}.`,
        },
        { property: "og:title", content: `${catName} — Parfait.Design/Desmohair` },
        {
          property: "og:description",
          content: `Collection ${catName.toLowerCase()}.`,
        },
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
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const salon =
    SALONS.find((s) => s.tags.some((tag) => tag === category)) || pickSalonFor(category);

  // Charger les items de la catégorie
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await catalogService.getByCategory(category);
        setItems(data);
        
        // Load user info
        const user = await authService.getCurrentUser();
        if (user) {
          setUserName(user.full_name || user.email);
        }
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

  const handleToggleFavorite = async (item: CatalogItem) => {
    // Vérifier si l'utilisateur est connecté
    const user = await authService.getCurrentUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    const nextItems = toggleFavorite(asFavoriteItem(item, "catalog"));
    setFavorites(nextItems);
  };

  const handleWhatsAppClick = (item: CatalogItem) => {
    setSelectedItem(item);
    setWhatsappModalOpen(true);
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
      <div className="px-4 pb-32">
        <Link
          to="/catalog"
          className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium"
        >
          <ChevronLeft className="h-3 w-3" /> Catalogue
        </Link>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-32">
      <Link
        to="/catalog"
        className="glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium"
      >
        <ChevronLeft className="h-3 w-3" /> Catalogue
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

      {/* Affichage des articles */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong mt-8 rounded-[28px] p-8 text-center"
        >
          <p className="font-display text-2xl font-semibold text-gold">Aucun article</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun article disponible dans cette catégorie pour le moment.
          </p>
          <GlassButton as={Link} to="/catalog" variant="whatsapp" size="md" className="mt-5">
            Retour au catalogue
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
            Commandes traitées par{" "}
            <span className="font-semibold text-[var(--gold-deep)]">{salon.name}</span> ·{" "}
            {salon.area}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 grid grid-cols-2 gap-3"
          >
            {items.map((p, i) => {
              const isFavorite = favorites.some((f) => f.kind === "catalog" && f.id === p.id);
              return (
                <motion.div
                  key={p.id}
                  ref={(el) => {
                    refs.current[p.id] = el;
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={`liquid-glass rounded-[24px] p-3 transition-all duration-300 ${
                    highlight === p.id ? "ring-2 ring-[var(--gold)] scale-[1.02]" : ""
                  }`}
                >
                  <button type="button" onClick={() => setOpen(p)} className="w-full text-left">
                    {p.image_url && (
                      <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="aspect-[4/5] w-full object-cover transition hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">
                      {p.title}
                    </p>
                    {p.description && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                        {p.description}
                      </p>
                    )}
                    {p.price > 0 && (
                      <p className="mt-1.5 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-gold">{formatFCFA(p.price)}</span>
                      </p>
                    )}
                  </button>
                  <GlassButton
                    type="button"
                    onClick={() => handleWhatsAppClick(p)}
                    variant="whatsapp"
                    size="sm"
                    full
                    className="mt-2"
                  >
                    <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> Commander
                  </GlassButton>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOpen(p)}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[var(--gold-deep)] transition"
                    >
                      <Eye className="h-3 w-3" /> Voir détails
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-2.5 py-1.5 text-sm transition ${
                        isFavorite
                          ? "border-rose-400 bg-rose-500/10 text-rose-600"
                          : "border-stone-300 text-stone-600 hover:border-rose-300 hover:text-rose-500"
                      }`}
                      onClick={() => handleToggleFavorite(p)}
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* Modal de détail du produit */}
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
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-stone-200 bg-white p-6 shadow-lg"
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

                {open.price > 0 && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Prix
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gold">{formatFCFA(open.price)}</p>
                  </div>
                )}

                {(open as any).code && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Code
                    </p>
                    <p className="mt-1 text-sm font-semibold">{(open as any).code}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <GlassButton
                  as="a"
                  href={waLinkFor(
                    salon.id as any,
                    `Bonjour ${salon.name}, je souhaite commander : ${open.title}${open.price ? ` — ${formatFCFA(open.price)}` : ""}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="md"
                  full
                >
                  <ShoppingCart className="h-4 w-4" style={{ color: "#25D366" }} /> Commander
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
                      favorites.some((f) => f.id === open.id && f.kind === "catalog")
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
        itemPrice={selectedItem?.price ? formatFCFA(selectedItem.price) : undefined}
        itemLink={selectedItem ? `${window.location.origin}/catalog/${category}?highlight=${selectedItem.id}` : undefined}
        itemCategory={category}
        userName={userName || undefined}
      />
    </div>
  );
}
