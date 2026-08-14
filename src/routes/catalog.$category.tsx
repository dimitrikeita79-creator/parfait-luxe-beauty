import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Heart, X, Eye, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell, WhatsAppIcon } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { catalogService, salonService, authService } from "@/backend/services";
import { waLinkFor, SALONS, pickSalonFor, getSalonIdFromName, getSalon, type SalonId } from "@/lib/salon-data";
import type { CatalogItem, SalonInfo } from "@/backend/models";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/context/CartContext";

const ESTABLISHMENTS = ["Parfait Design", "Desmo Hair", "Beauté Essentielle", "KORO-RASTA MULTI-SERVICE"] as const;
type EstablishmentFilter = typeof ESTABLISHMENTS[number] | "all";

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
  const [userName, setUserName] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>("all");
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { addItem: addToCart } = useCart();

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const defaultSalon = SALONS.find((s) => s.tags.some((tag) => tag === category)) || pickSalonFor(category);
  const activeSalon = establishmentFilter !== "all" ? getSalon(getSalonIdFromName(establishmentFilter)) : null;
  const displaySalon = activeSalon ?? defaultSalon;

  useEffect(() => {
    if (!category || category.trim() === "") {
      navigate({ to: "/catalog" });
    }
  }, [category, navigate]);

  const filteredItems = items.filter((item) => {
    if (establishmentFilter === "all") return true;
    return item.salon_name === establishmentFilter;
  });

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
    const salonId = getSalonIdFromName(item.salon_name);
    const salon = getSalon(salonId);
    const link = waLinkFor(salonId, `Bonjour ${salon.name}, je souhaite commander : ${item.title}${item.price ? ` — ${formatFCFA(item.price)}` : ""}.`);
    window.open(link, "_blank", "noopener,noreferrer");
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
          const salon = getSalon(getSalonIdFromName(est));
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

      {/* Affichage des articles */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong mt-8 rounded-[28px] p-8 text-center md:p-12"
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
            {establishmentFilter === "all"
              ? "Tous les établissements"
              : `Commandes traitées par ${activeSalon?.name ?? displaySalon.name} · ${displaySalon.area}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredItems.map((p, i) => {
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
                       <div className="relative overflow-hidden rounded-2xl aspect-[4/5] w-full bg-white">
                         <img
                           src={p.image_url}
                           alt={p.title}
                           className="absolute inset-0 h-full w-full object-cover"
                           style={{ objectFit: "cover" }}
                           loading="lazy"
                           decoding="async"
                         />
                       </div>
                     )}
                    <div className="mt-2">
                      <p className="font-display text-sm font-semibold leading-tight line-clamp-2 md:text-base">{p.title}</p>
                      {(p as any).code && (
                        <p className="mt-0.5 text-[10px] font-mono font-semibold text-[var(--gold-deep)]">
                          Code: {(p as any).code}
                        </p>
                      )}
                      {(() => {
                        const isPromo = /promo|promotion|offres/i.test(p.category);
                        const original = Number((p as any).original_price);
                        if (isPromo && original && original > p.price) {
                          return (
                            <div className="mt-0.5 flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold text-red-500 line-through">
                                {formatFCFA(original)}
                              </span>
                              <span className="text-xs font-bold text-gold">{formatFCFA(p.price)}</span>
                            </div>
                          );
                        }
                        if (p.price > 0) {
                          return (
                            <p className="mt-0.5 text-xs font-bold text-gold">{formatFCFA(p.price)}</p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </button>
                  <GlassButton
                    type="button"
                    onClick={() => handleWhatsAppClick(p)}
                    variant="whatsapp"
                    size="sm"
                    full
                    className="mt-2 md:text-sm"
                  >
                    <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> Commander
                  </GlassButton>
                  <button
                    type="button"
                    onClick={async () => {
                      const user = await authService.getCurrentUser();
                      if (!user) {
                        navigate({ to: '/login' });
                        return;
                      }
                      try {
                         await addToCart({
                           item_type: "catalog",
                           item_id: p.id,
                           title: p.title,
                            image_url: p.image_url,
                            price: p.price,
                            quantity: 1,
                            salon_name: p.salon_name,
                            code: p.code ?? null,
                          });
                        success("Panier", "Article ajouté au panier");
                      } catch {
                        toastError("Panier", "Impossible d'ajouter l'article");
                      }
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-full border border-stone-200 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-[var(--gold)] hover:text-[var(--gold-deep)] active:scale-[0.97] md:text-sm"
                  >
                    <ShoppingCart className="h-3 w-3" /> Ajouter au panier
                  </button>
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
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
             onClick={() => setOpen(null)}
           >
             <motion.div
               initial={{ opacity: 0, scale: 0.97, y: 8 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.97, y: 8 }}
               transition={{ duration: 0.15, ease: "easeOut" }}
               onClick={(e) => e.stopPropagation()}
               className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-[28px] border border-stone-200 bg-white p-5 shadow-lg"
               style={{ transform: "translateZ(0)", contain: "layout style paint" }}
             >
               <div className="flex items-start justify-between">
                 <h2 className="flex-1 pr-2 font-display text-xl font-semibold leading-tight">{open.title}</h2>
                 <button
                   type="button"
                   onClick={() => setOpen(null)}
                   className="rounded-full p-1.5 hover:bg-stone-100 transition"
                 >
                   <X className="h-4 w-4" />
                 </button>
               </div>

                {open.image_url && (
                  <div className="mt-3 overflow-hidden rounded-[24px] border border-stone-200 bg-stone-100">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
                      {[open.image_url, ...(open.gallery_images ?? [])].map((src, idx) => (
                        <img
                          key={src + idx}
                          className="aspect-[4/3] w-full shrink-0 snap-center object-cover"
                          src={src}
                          alt={`${open.title} ${idx + 1}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                    {(open.gallery_images?.length ?? 0) > 0 && (
                      <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                        Balayez pour voir les autres vues
                      </p>
                    )}
                  </div>
                )}

               {open.description && (
                 <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{open.description}</p>
               )}

               <div className="mt-4 grid grid-cols-2 gap-2.5">
                 <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                   <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                     Catégorie
                   </p>
                   <p className="mt-1 text-sm font-semibold">{open.category}</p>
                 </div>

                 {(() => {
                   const isPromo = /promo|promotion|offres/i.test(open.category);
                   const original = Number((open as any).original_price);
                   if (isPromo && original && original > open.price) {
                     return (
                       <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                         <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                           Tarif
                         </p>
                         <div className="mt-1 flex flex-col gap-0.5">
                           <span className="text-sm font-semibold text-red-600 line-through">{formatFCFA(original)}</span>
                           <span className="text-sm font-bold text-[var(--gold-deep)]">{formatFCFA(open.price)}</span>
                         </div>
                       </div>
                     );
                   }
                   if (open.price > 0) {
                     return (
                       <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                         <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                           Tarif
                         </p>
                         <p className="mt-1 text-sm font-semibold text-[var(--gold-deep)]">{formatFCFA(open.price)}</p>
                       </div>
                     );
                   }
                   return null;
                 })()}
               </div>

               {(open as any).code && (
                 <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
                   <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                     Code produit
                   </p>
                   <p className="mt-1 text-sm font-semibold">{(open as any).code}</p>
                 </div>
               )}

               <div className="mt-5 flex gap-2">
                 <GlassButton
                   as="a"
                   href={waLinkFor(getSalonIdFromName(open.salon_name), `Bonjour ${getSalon(getSalonIdFromName(open.salon_name)).name}, je souhaite commander : ${open.title}${open.price ? ` — ${formatFCFA(open.price)}` : ""}${(open as any).code ? ` [Code: ${(open as any).code}]` : ""}.`)}
                   target="_blank"
                   rel="noreferrer"
                   variant="whatsapp"
                   size="md"
                   full
                   className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
                 >
                   <WhatsAppIcon className="h-4 w-4" style={{ color: "#25D366" }} /> Commander
                 </GlassButton>
                 <button
                   type="button"
                   onClick={() => {
                     handleToggleFavorite(open);
                     setOpen(null);
                   }}
                   className="rounded-full border border-stone-200 p-2.5 transition hover:bg-stone-50"
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
    </div>
  );
}
