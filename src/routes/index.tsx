import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Calendar,
  MapPin,
  BookOpen,
  Star,
  ChevronRight,
  Sparkles,
  Scissors,
  Heart,
  Crown,
  Gem,
  Package,
  MessageSquare,
  Send,
} from "lucide-react";
import { AppShell, SectionTitle, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { GlassButton } from "@/components/GlassButton";
import { Frame } from "@/components/Frame";
import { CoverCarousel } from "@/components/CoverCarousel";
import { WhatsAppSelector } from "@/components/WhatsAppSelector";
import { useToast } from "@/hooks/useToast";
import { galleryService, catalogService, servicesService, reviewsService, authService } from "@/backend/services";
import { TESTIMONIALS, waLink, LOCATION, SALONS, type SalonId } from "@/lib/salon-data";
import type { ServiceItem, CatalogItem, GalleryItem, Review } from "@/backend/models";
import { Trash2, Eye } from "lucide-react";
import coupe1 from "@/assets/catalog/Coupe_1.webp";
import coupe5 from "@/assets/catalog/Coupe_5.webp";
import m1_1 from "@/assets/catalog/new/M1-1.webp";
import m8_1 from "@/assets/catalog/new/M8-1.webp";
import promo1 from "@/assets/catalog/promo/promo_1.webp";
import promo6 from "@/assets/catalog/promo/promo_6.webp";
import p1_1 from "@/assets/catalog/new/P_1-1.webp";
import e1_1 from "@/assets/catalog/new/E_1-1.webp";
import pb1_1 from "@/assets/catalog/new/PB_34-1.webp";

const getCategoryIcon = (category: string): typeof Sparkles => {
  const cat = category.toLowerCase().trim();
  if (cat.includes("pose")) return Crown;
  if (cat.includes("tresse") || cat.includes("coiffure")) return Scissors;
  if (cat.includes("mariage")) return Heart;
  if (cat.includes("tissage")) return Sparkles;
  if (cat.includes("perruque")) return Gem;
  if (cat.includes("produit") || cat.includes("équipement")) return Package;
  return Sparkles;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

type SearchHit =
  | { type: "item"; id: string; name: string; category: string }
  | { type: "service"; id: string; name: string }
  | { type: "category"; name: string };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desmohair — Accueil" },
      {
        name: "description",
        content: "Salon de beauté luxe à Ouagadougou : perruques, mèches, tresses, mariage.",
      },
      { property: "og:title", content: "Desmohair" },
      {
        property: "og:description",
        content: "Votre beauté, notre passion.",
      },
    ],
  }),
  component: Index,
});

function ReviewForm({ onReviewSubmitted }: { onReviewSubmitted?: () => void }) {
  const { success, error: toastError } = useToast();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    const user = await authService.getCurrentUser();
    if (!user) {
      // Rediriger vers la page de connexion
      navigate({ to: "/login" });
      return;
    }
    
    if (!text.trim()) {
      setFeedback("Veuillez écrire un avis.");
      return;
    }
    if (!authorName.trim()) {
      setFeedback("Veuillez indiquer votre nom.");
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      await reviewsService.submitReview({
        author_name: authorName.trim(),
        comment: text.trim(),
        rating: Math.min(5, Math.max(1, rating)),
        user_id: user.id,
      });
      setText("");
      setRating(5);
      setAuthorName("");
      setFeedback(null);
      success("Avis envoyé", "Merci ! Votre avis a été envoyé et sera visible après modération.");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'envoi.";
      setFeedback(message);
      toastError("Avis", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-[var(--gold-soft)]/50 bg-gradient-to-br from-white to-[var(--gold-light)] p-4 shadow-lg shadow-[var(--gold)]/5"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Votre nom"
        />
        <textarea
          className="min-h-20 w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={3}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Note :</span>
          <div className="flex items-center gap-1 text-red-600">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="transition hover:scale-110"
              >
                <Star className={`h-5 w-5 ${i < rating ? "fill-current" : "fill-none opacity-40"}`} />
              </button>
            ))}
          </div>
        </div>
        {feedback && <p className="text-sm text-[var(--gold-deep)]">{feedback}</p>}
        <GlassButton type="submit" variant="gold" size="md" disabled={loading}>
          <Send className="h-4 w-4" />
          {loading ? "Envoi..." : "Envoyer mon avis"}
        </GlassButton>
      </form>
    </motion.div>
  );
}

function Index() {
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<SalonId>("parfait");
  const blurTimer = useRef<number | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const searchDebounce = useRef<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [servicesData, catalogData, galleryData] = await Promise.all([
          servicesService.getActive(),
          catalogService.getAvailable(),
          galleryService.getFeatured(),
        ]);
        setServices(servicesData);
        setCatalogItems(catalogData);
        setGalleryItems(galleryData);

        const reviewsData = await reviewsService.getAllReviews().catch((err) => {
          console.warn("Impossible de charger les avis :", err);
          return [] as Review[];
        });
        setReviews(reviewsData ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshKey]);

  const reviewSlides = reviews.length > 0 ? reviews : TESTIMONIALS;

  useEffect(() => {
    const container = reviewsRef.current;
    if (!container || reviewSlides.length === 0) return;

    let currentIndex = 0;
    container.scrollTo({ left: 0, behavior: "smooth" });

    const interval = window.setInterval(() => {
      if (!container) return;
      const slideWidth = container.clientWidth;
      currentIndex = (currentIndex + 1) % reviewSlides.length;
      const target = Math.min(
        currentIndex * (slideWidth * 0.7),
        container.scrollWidth - slideWidth,
      );
      container.scrollTo({ left: target, behavior: "smooth" });
    }, 4500);

    return () => window.clearInterval(interval);
  }, [reviewSlides.length]);

  useEffect(() => {
    const storedNotice = window.sessionStorage.getItem("authNotice");
    if (storedNotice) {
      setNotice(storedNotice);
      window.sessionStorage.removeItem("authNotice");
      const timer = window.setTimeout(() => setNotice(null), 6000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        const profile = await authService.getUserProfile(user.id);
        setIsAdmin(profile?.role === "admin");
      }
    };
    checkAdmin();
  }, []);

  // Fonction pour supprimer un avis
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    try {
      await reviewsService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const popularServices = useMemo(() => services.slice(0, 6), [services]);

  const categorizedCatalog = useMemo(() => {
    const grouped = new Map<string, CatalogItem[]>();
    for (const item of catalogItems) {
      if (!grouped.has(item.category)) {
        grouped.set(item.category, []);
      }
      grouped.get(item.category)!.push(item);
    }
    return grouped;
  }, [catalogItems]);

  const popularWigs = useMemo(
    () =>
      categorizedCatalog.get("Perruques")?.slice(0, 8) ||
      categorizedCatalog.get("perruques")?.slice(0, 8) ||
      [],
    [categorizedCatalog],
  );
  const popularBraids = useMemo(
    () =>
      categorizedCatalog.get("Coiffure")?.slice(0, 8) ||
      categorizedCatalog.get("coiffure")?.slice(0, 8) ||
      [],
    [categorizedCatalog],
  );
  const promotionItems = useMemo(
    () => categorizedCatalog.get("Promo") || categorizedCatalog.get("promotion") || [],
    [categorizedCatalog],
  );

  const works = useMemo(() => galleryItems.slice(0, 6), [galleryItems]);

  const categoryImages: Record<string, string> = {
    coiffure: coupe1,
    perruques: pb1_1,
    mariage: m1_1,
    produits: p1_1,
    equipement: e1_1,
    promotion: promo1,
  };

  const makeCategorySlug = (category: string) =>
    norm(category).replace(/\s+/g, "-");

  const searchIndex = useMemo<SearchHit[]>(() => {
    const out: SearchHit[] = [];
    for (const item of catalogItems) {
      out.push({
        type: "item",
        id: item.id,
        name: item.title,
        category: item.category,
      });
    }
    for (const s of services) {
      out.push({ type: "service", id: s.id, name: s.title });
    }
    const categories = Array.from(new Set(catalogItems.map((i) => i.category)));
    for (const cat of categories) {
      out.push({
        type: "category",
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
      });
    }
    return out;
  }, [catalogItems, services]);

  const suggestions = useMemo<SearchHit[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    const scored: { hit: SearchHit; score: number }[] = [];
    for (const h of searchIndex) {
      const n = norm(h.name);
      let score = 0;
      if (n === q) score = 100;
      else if (n.startsWith(q)) score = 60;
      else if (n.includes(q)) score = 30;
      else if (n.split(/\s+/).some((w) => w.startsWith(q))) score = 20;
      if (score > 0)
        scored.push({
          hit: h,
          score: score + (h.type === "item" ? 5 : 0),
        });
    }
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((s) => s.hit);
  }, [query, searchIndex]);

  const goToHit = (h: SearchHit) => {
    setFocused(false);
    setQuery("");
    if (h.type === "item") {
      navigate({
        to: "/catalog/$category",
        params: { category: makeCategorySlug(h.category) },
        search: { highlight: h.id },
      });
    } else if (h.type === "service") {
      navigate({
        to: "/services",
        search: { highlight: h.id },
      });
    } else {
      navigate({
        to: "/catalog/$category",
        params: { category: makeCategorySlug(h.name) },
        search: {} as any,
      });
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) {
      goToHit(suggestions[0]);
      return;
    }
    const q = norm(query.trim());
    if (!q) return;
    if (q.includes("galerie") || q.includes("photo")) return navigate({ to: "/gallery" });
    if (q.includes("contact") || q.includes("rdv") || q.includes("rendez") || q.includes("reserv"))
      return navigate({ to: "/contact" });
    navigate({ to: "/catalog" });
  };

  const defaultCovers = [
    {
      id: "c1",
      title: "Coiffure Premium",
      subtitle: "Coupes signature",
      tone: "from-neutral-100 via-white to-amber-50",
      image: coupe1,
    },
    {
      id: "c2",
      title: "Coiffure Mariage",
      subtitle: "Le jour J, sublimée",
      tone: "from-rose-50 via-white to-amber-50",
      image: m1_1,
    },
    {
      id: "c3",
      title: "Offres du mois",
      subtitle: "Jusqu'à -40%",
      tone: "from-amber-100 via-white to-rose-50",
      image: promo1,
    },
    {
      id: "c4",
      title: "Soins Capillaires",
      subtitle: "Routine d'exception",
      tone: "from-white via-neutral-50 to-amber-50",
      image: p1_1,
    },
    {
      id: "c5",
      title: "Coiffures",
      subtitle: "Styles prisés",
      tone: "from-amber-50 via-white to-rose-50",
      image: coupe5,
    },
    {
      id: "c6",
      title: "Mariage Prestige",
      subtitle: "Votre jour parfait",
      tone: "from-rose-100 via-white to-amber-50",
      image: m8_1,
    },
    {
      id: "c7",
      title: "Promotions",
      subtitle: "Profitez vite",
      tone: "from-yellow-50 via-white to-rose-50",
      image: promo6,
    },
    {
      id: "c8",
      title: "Équipements",
      subtitle: "Outils professionnels",
      tone: "from-white via-amber-50 to-yellow-50",
      image: e1_1,
    },
  ];

  const coversWithImages = defaultCovers;

  return (
    <AppShell>
      {/* Message d'erreur global */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover carousel */}
      {!loading && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2"
        >
          <CoverCarousel covers={coversWithImages} />
        </motion.section>
      )}

      {/* Hero text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-3"
      >
        {notice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 rounded-2xl border border-[var(--gold-soft)]/80 bg-[var(--gold-soft)]/60 px-3 py-2 text-sm text-[var(--gold-deep)]"
          >
            {notice}
          </motion.div>
        )}
        <div className="rounded-[24px] bg-gradient-to-br from-[var(--gold-light)] via-white to-[var(--gold-soft)]/30 p-5 border border-[var(--gold-soft)]/40 shadow-lg shadow-[var(--gold)]/5">
          <h1 className="font-display text-3xl leading-[1.1] font-semibold">
            Révélez votre <span className="text-gold">élégance</span> naturelle
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Perruques • Mèches • Coiffures • Mariage • Soins capillaires
          </p>
          <div className="mt-4 flex gap-2">
            <GlassButton as={Link} to="/contact" variant="gold" size="md" full className="flex-1 shadow-lg shadow-[var(--gold)]/20">
              <Calendar className="h-4 w-4" />
              Réserver
            </GlassButton>
            <GlassButton as={Link} to="/catalog" variant="light" size="md" full className="flex-1 border-[var(--gold-soft)]/50">
              <BookOpen className="h-4 w-4" />
              Catalogue
            </GlassButton>
          </div>
        </div>
      </motion.section>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative mt-5"
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 rounded-full border border-[var(--gold-soft)]/30 bg-white/80 pl-4 pr-1.5 py-1.5 transition focus-within:ring-2 focus-within:ring-[var(--crimson)]/40 focus-within:border-[var(--crimson)]/30 shadow-sm"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              blurTimer.current = window.setTimeout(() => setFocused(false), 150);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") (e.target as HTMLInputElement).blur();
            }}
            placeholder="Rechercher : huile argan, perruque, mariage…"
            className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Recherche"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-700 to-red-800 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            OK
          </button>
        </form>
        <AnimatePresence>
          {focused && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-3xl border border-[var(--gold-soft)]/30 bg-white/90 p-1.5 shadow-xl backdrop-blur-md"
              onMouseDown={(e) => {
                e.preventDefault();
                if (blurTimer.current) window.clearTimeout(blurTimer.current);
              }}
            >
              {suggestions.length === 0 ? (
                <p className="px-3 py-3 text-xs text-muted-foreground">
                  Aucun résultat pour « {query} »
                </p>
              ) : (
                suggestions.map((h) => (
                  <GlassButton
                    key={`${h.type}-${"id" in h ? h.id : h.name}`}
                    type="button"
                    onClick={() => goToHit(h)}
                    variant="light"
                    size="sm"
                    full
                    className="justify-start rounded-2xl px-3 py-2 text-left"
                  >
                    <IconBadge
                      icon={h.type === "item" ? Search : h.type === "service" ? Sparkles : BookOpen}
                      tone={h.type === "item" ? "gold" : h.type === "service" ? "pink" : "blue"}
                      size="sm"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold leading-tight truncate">
                        {h.name}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {h.type === "item"
                          ? h.category
                          : h.type === "service"
                            ? "Service"
                            : "Catégorie"}
                      </span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </GlassButton>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-5 grid grid-cols-4 gap-1.5"
      >
        {(
          [
            {
              label: "Réserver",
              icon: Calendar,
              tone: "gold" as const,
              to: "/contact" as const,
              href: undefined,
              wa: false,
            },
            {
              label: "WhatsApp",
              icon: null,
              tone: "green" as const,
              to: undefined,
              href: waLink(),
              wa: true,
            },
            {
              label: "Itinéraire",
              icon: MapPin,
              tone: "rose" as const,
              to: undefined,
              href: LOCATION.mapsLink,
              wa: false,
            },
            {
              label: "Catalogue",
              icon: BookOpen,
              tone: "blue" as const,
              to: "/catalog" as const,
              href: undefined,
              wa: false,
            },
          ] as const
        ).map(({ label, icon: Icon, tone, to, href, wa }) => {
          const inner = (
            <div className="rounded-2xl border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--gold)]/10 active:scale-95">
              {wa ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md">
                    <WhatsAppIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              ) : Icon ? (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md"
                    style={{
                      boxShadow: `0 4px 12px -2px ${
                        tone === "gold"
                          ? "rgba(200, 160, 80, 0.3)"
                          : tone === "blue"
                            ? "rgba(24, 119, 242, 0.3)"
                            : "rgba(254, 44, 85, 0.3)"
                      }`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{
                        color:
                          tone === "gold"
                            ? "#c8a050"
                            : tone === "blue"
                              ? "#1877F2"
                              : tone === "rose"
                                ? "#FE2C55"
                                : "#25D366",
                      }}
                    />
                  </div>
                </div>
              ) : null}
              <span className="text-[10px] font-medium text-center line-clamp-1 mt-1">{label}</span>
            </div>
          );
          return to ? (
            <Link key={label} to={to}>
              {inner}
            </Link>
          ) : (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {inner}
            </a>
          );
        })}
      </motion.div>

      {/* Services populaires */}
      {!loading && (
        <>
          <SectionTitle
            title="Services populaires"
            action={
              <Link to="/services" className="text-xs font-medium text-[var(--gold-deep)]">
                Voir tout
              </Link>
            }
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory"
          >
            {popularServices.map((s, i) => {
              const Icon = getCategoryIcon(s.category);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                >
                  <Link to="/services" preload="intent" className="snap-start block">
                    <div className="w-44 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-3 shadow-sm hover:shadow-md hover:shadow-[var(--gold)]/10 transition-all duration-200">
                      {s.image_url ? (
                        <div className="mb-2 h-20 w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
                          <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      ) : (
                        <IconBadge icon={Icon} tone="gold" size="md" />
                      )}
                      <p className="mt-2 font-display text-sm font-semibold leading-tight">
                        {s.title}
                      </p>
                      {s.description && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Catalogue teaser */}
          <SectionTitle
            title="Catalogue"
            action={
              <Link to="/catalog" className="text-xs font-medium text-[var(--gold-deep)]">
                Tout voir
              </Link>
            }
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2"
          >
            {Array.from(categorizedCatalog.entries())
              .slice(0, 4)
              .map(([cat, items], i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <Link
                    to="/catalog/$category"
                    params={{ category: makeCategorySlug(cat) }}
                    search={{} as any}
                    preload="intent"
                    className="block"
                  >
                    <Frame
                      variant="plain"
                      rounded="rounded-[24px]"
                      className="aspect-[5/4] w-full"
                      image={items[0]?.image_url || categoryImages[cat.toLowerCase()]}
                      alt={cat}
                    >
                      <div
                        className="absolute left-1 bottom-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur-md capitalize"
                        style={{
                          background: "oklch(1 0 0 / 0.85)",
                          color: "var(--gold-deep)",
                        }}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                    </Frame>
                  </Link>
                </motion.div>
              ))}
          </motion.div>

          {/* Réalisations */}
          {works.length > 0 && (
            <>
              <SectionTitle
                title="Nos réalisations"
                action={
                  <Link to="/gallery" className="text-xs font-medium text-[var(--gold-deep)]">
                    Galerie
                  </Link>
                }
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-1.5"
              >
                {works.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.03 }}
                  >
                    <Link to="/gallery" preload="intent" className="block aspect-square">
                      <Frame
                        variant="plain"
                        rounded="rounded-2xl"
                        className="h-full w-full"
                        image={g.image_url}
                        alt={g.title}
                      >
                        <span
                          className="absolute left-1 bottom-1 rounded-full px-1 py-0.5 text-[8px] font-semibold backdrop-blur-md capitalize"
                          style={{
                            background: "oklch(1 0 0 / 0.85)",
                            color: "var(--gold-deep)",
                          }}
                        >
                          {g.category}
                        </span>
                      </Frame>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Perruques populaires */}
          {popularWigs.length > 0 && (
            <>
              <SectionTitle
                title="Perruques populaires"
                action={
                  <Link
                    to="/catalog/$category"
                    params={{ category: makeCategorySlug("Perruques") }}
                    search={{} as any}
                    className="text-xs font-medium text-[var(--gold-deep)]"
                  >
                    Tout voir
                  </Link>
                }
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory"
              >
                {popularWigs.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                    className="snap-start"
                  >
                    <Link
                      to="/catalog/$category"
                      params={{ category: makeCategorySlug("Perruques") }}
                      search={{} as any}
                      className="block"
                    >
                      <div className="w-36 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 shadow-sm">
                        {p.image_url && (
                          <Frame
                            variant="plain"
                            rounded="rounded-2xl"
                            className="h-24 w-full"
                            image={p.image_url}
                            alt={p.title}
                          />
                        )}
                        <p className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Coiffures populaires */}
          {popularBraids.length > 0 && (
            <>
              <SectionTitle
                title="Coiffures populaires"
                action={
                  <Link
                    to="/catalog/$category"
                    params={{ category: makeCategorySlug("Coiffure") }}
                    search={{} as any}
                    className="text-xs font-medium text-[var(--gold-deep)]"
                  >
                    Tout voir
                  </Link>
                }
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory"
              >
                {popularBraids.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.03 }}
                    className="snap-start"
                  >
                    <Link
                      to="/catalog/$category"
                      params={{ category: makeCategorySlug("Coiffure") }}
                      search={{} as any}
                      className="block"
                    >
                      <div className="w-36 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 shadow-sm">
                        {p.image_url && (
                          <Frame
                            variant="plain"
                            rounded="rounded-2xl"
                            className="h-24 w-full"
                            image={p.image_url}
                            alt={p.title}
                          />
                        )}
                        <p className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Avis clientes */}
          <SectionTitle title="Avis clientes" />
          <motion.div
            ref={reviewsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth"
          >
            {reviewSlides.map((t, i) => {
              const reviewObj = typeof t === "object" && t !== null ? (t as Record<string, unknown>) : null;
              const reviewId = reviewObj?.id ? String(reviewObj.id) : null;
              return (
                <motion.div
                  key={reviewObj?.id ? String(reviewObj.id) : `r-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                  className="relative min-w-[18rem] shrink-0 snap-start rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-3 shadow-sm"
                >
                  <div className="flex items-center gap-0.5 text-red-600">
                    {Array.from({ length: (reviewObj?.rating as number) ?? 5 }).map((_, k) => (
                      <Star key={k} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    "{(reviewObj?.comment as string) ?? (reviewObj?.text as string) ?? (reviewObj?.message as string) ?? "Excellent service."}"
                  </p>
                  <p className="mt-2 text-[11px] font-semibold">
                    — {(reviewObj?.author_name as string) ?? (reviewObj?.name as string) ?? "Client satisfait"}
                  </p>
                  {isAdmin && reviewId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(reviewId)}
                      className="absolute top-2 right-2 rounded-full p-1 text-xs text-red-500 hover:bg-red-50 transition"
                      title="Supprimer cet avis"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Formulaire d'avis */}
          <section className="mt-6">
            <SectionTitle title="Donnez votre avis" />
            <ReviewForm onReviewSubmitted={() => setRefreshKey((prev) => prev + 1)} />
          </section>

          {/* Promotions */}
          {promotionItems.length > 0 && (
            <>
              <SectionTitle
                title="Offres du mois"
                action={
                  <Link
                    to="/catalog/$category"
                    params={{ category: makeCategorySlug("Promo") }}
                    search={{} as any}
                    className="text-xs font-medium text-[var(--gold-deep)]"
                  >
                    Voir tout
                  </Link>
                }
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/catalog/$category"
                  params={{ category: "promotion" }}
                  search={{} as any}
                  preload="intent"
                  className="block"
                >
                  <Frame
                    variant="plain"
                    rounded="rounded-[28px]"
                    className="aspect-video w-full"
                    image={promotionItems[0]?.image_url || promo1}
                    alt="Promotions"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent rounded-b-[24px]" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-display text-lg font-semibold text-white">
                        {promotionItems.length} promotions
                      </p>
                      <p className="mt-0.5 text-xs text-white/80">
                        Découvrez nos meilleures offres
                      </p>
                    </div>
                  </Frame>
                </Link>
              </motion.div>
            </>
          )}
        </>
      )}
    </AppShell>
  );
}