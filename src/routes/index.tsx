import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Calendar, MapPin, BookOpen, Star, ChevronRight, Sparkles, Scissors, Heart, Crown, Gem, Package } from "lucide-react";
import { AppShell, SectionTitle, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { GlassButton } from "@/components/GlassButton";
import { Frame } from "@/components/Frame";
import { CoverCarousel } from "@/components/CoverCarousel";
import { SERVICES, CATALOG, CATALOG_ITEMS, GALLERY, TESTIMONIALS, waLink, LOCATION } from "@/lib/salon-data";
// Import images for carousel and category previews
import coupe1 from "@/assets/catalog/Coupe_1.webp";
import coupe5 from "@/assets/catalog/Coupe_5.webp";
import coupe10 from "@/assets/catalog/Coupe_10.webp";
import m1_1 from "@/assets/catalog/new/M1-1.webp";
import m8_1 from "@/assets/catalog/new/M8-1.webp";
import promo1 from "@/assets/catalog/promo/promo_1.webp";
import promo6 from "@/assets/catalog/promo/promo_6.webp";
import p1_1 from "@/assets/catalog/new/P_1-1.webp";
import p12_1 from "@/assets/catalog/new/P_12-1.webp";
import e1_1 from "@/assets/catalog/new/E_1-1.webp";
import pb1_1 from "@/assets/catalog/new/PB_34-1.webp";

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  pose: Crown, tresses: Scissors, mariage: Heart, tissage: Sparkles, perruques: Gem, equipement: Package,
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type SearchHit =
  | { type: "item"; id: string; name: string; code?: string; category: string }
  | { type: "service"; id: string; name: string }
  | { type: "category"; slug: string; name: string };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desmohair — Accueil" },
      { name: "description", content: "Salon de beauté luxe à Ouagadougou : perruques, mèches, tresses, mariage." },
      { property: "og:title", content: "Desmohair" },
      { property: "og:description", content: "Votre beauté, notre passion." },
    ],
  }),
  component: Index,
});

function Index() {
  const popularServices = SERVICES.slice(0, 6);
  const popularWigs = CATALOG_ITEMS.perruques.slice(0, 8);
  const popularBraids = CATALOG_ITEMS.coiffure.slice(0, 8);
  const works = GALLERY.slice(0, 6);
  const topCategories = CATALOG.slice(0, 4);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    const storedNotice = window.sessionStorage.getItem("authNotice");
    if (storedNotice) {
      setNotice(storedNotice);
      window.sessionStorage.removeItem("authNotice");
      const timer = window.setTimeout(() => setNotice(null), 6000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  // Category preview images for catalog teaser
  const categoryImages: Record<string, string> = {
    coiffure: coupe1,
    perruques: pb1_1,
    mariage: m1_1,
    produits: p1_1,
    equipement: e1_1,
    promotion: promo1,
  };

  const searchIndex = useMemo<SearchHit[]>(() => {
    const out: SearchHit[] = [];
    for (const [slug, list] of Object.entries(CATALOG_ITEMS)) {
      for (const it of list) out.push({ type: "item", id: it.id, name: it.name, code: it.code, category: slug });
    }
    for (const s of SERVICES) out.push({ type: "service", id: s.id, name: s.title });
    for (const c of CATALOG) out.push({ type: "category", slug: c.slug, name: c.name });
    return out;
  }, []);

  const suggestions = useMemo<SearchHit[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    const scored: { hit: SearchHit; score: number }[] = [];
    for (const h of searchIndex) {
      const n = norm(h.name);
      const c = h.type === "item" ? norm(h.code || "") : "";
      let score = 0;
      
      // Exact matches
      if (n === q || c === q) score = 100;
      // Code prefix/exact (highest priority for codes like "M1", "PR1")
      else if (c.startsWith(q) && c.length <= q.length + 3) score = 95;
      // Name starts with query
      else if (n.startsWith(q)) score = 60;
      // Name contains query
      else if (n.includes(q)) score = 30;
      // Code contains query
      else if (c.includes(q)) score = 25;
      // Word starts with query
      else if (n.split(/\s+/).some((w) => w.startsWith(q))) score = 20;
      
      if (score > 0) scored.push({ hit: h, score: score + (h.type === "item" ? 5 : 0) });
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 6).map((s) => s.hit);
  }, [query, searchIndex]);

  const goToHit = (h: SearchHit) => {
    setFocused(false);
    setQuery("");
    if (h.type === "item") {
      navigate({ to: "/catalog/$category", params: { category: h.category }, search: { highlight: h.id } });
    } else if (h.type === "service") {
      navigate({ to: "/services" });
    } else {
      navigate({ to: "/catalog/$category", params: { category: h.slug } });
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) { goToHit(suggestions[0]); return; }
    const q = norm(query.trim());
    if (!q) return;
    if (q.includes("galerie") || q.includes("photo")) return navigate({ to: "/gallery" });
    if (q.includes("contact") || q.includes("rdv") || q.includes("rendez") || q.includes("reserv")) return navigate({ to: "/contact" });
    navigate({ to: "/catalog" });
  };

  // Covers with images for carousel
  const coversWithImages = [
    { id: "c1", title: "Coiffure Premium", subtitle: "Coupes signature", tone: "from-neutral-100 via-white to-amber-50", image: coupe1 },
    { id: "c2", title: "Coiffure Mariage", subtitle: "Le jour J, sublimée", tone: "from-rose-50 via-white to-amber-50", image: m1_1 },
    { id: "c3", title: "Offres du mois", subtitle: "Jusqu'à -40%", tone: "from-amber-100 via-white to-rose-50", image: promo1 },
    { id: "c4", title: "Soins Capillaires", subtitle: "Routine d'exception", tone: "from-white via-neutral-50 to-amber-50", image: p1_1 },
    { id: "c5", title: "Coiffures", subtitle: "Styles prisés", tone: "from-amber-50 via-white to-rose-50", image: coupe5 },
    { id: "c6", title: "Mariage Prestige", subtitle: "Votre jour parfait", tone: "from-rose-100 via-white to-amber-50", image: m8_1 },
    { id: "c7", title: "Promotions", subtitle: "Profitez vite", tone: "from-yellow-50 via-white to-rose-50", image: promo6 },
    { id: "c8", title: "Équipements", subtitle: "Outils professionnels", tone: "from-white via-amber-50 to-yellow-50", image: e1_1 },
  ];

  return (
    <AppShell>
      {/* Cover carousel */}
      <section className="mt-2 animate-fade-up">
        <CoverCarousel covers={coversWithImages} />
      </section>

      {/* Hero text */}
      <section className="mt-3 animate-fade-up">
        {notice ? (
          <div className="mb-3 rounded-2xl border border-[var(--gold-soft)]/80 bg-[var(--gold-soft)]/60 px-3 py-2 text-sm text-[var(--gold-deep)]">
            {notice}
          </div>
        ) : null}
        <h1 className="font-display mt-3 text-3xl leading-[1.1] font-semibold">
          Révélez votre <span className="text-gold">élégance</span> naturelle
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Perruques • Mèches • Coiffures • Mariage • Soins capillaires
        </p>
        <div className="mt-4 flex gap-2">
          <GlassButton as={Link} to="/contact" variant="light" size="md" full className="flex-1 opacity-100">
            <span className="gold-shimmer font-semibold">Réserver</span>
          </GlassButton>
          <GlassButton as={Link} to="/catalog" variant="light" size="md" full className="flex-1 opacity-100">
            <span className="gold-shimmer font-semibold">Catalogue</span>
          </GlassButton>
        </div>
      </section>

      {/* Search */}
      <div className="relative mt-5">
        <form
          onSubmit={handleSearch}
          className="glass flex items-center gap-2 rounded-full px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-[var(--gold-soft,oklch(0.85_0.08_85))]"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { blurTimer.current = window.setTimeout(() => setFocused(false), 150); }}
            onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLInputElement).blur(); }}
            placeholder="Rechercher : huile argan, perruque, mariage…"
            className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Recherche"
          />
          <GlassButton type="submit" variant="gold" size="sm">OK</GlassButton>
        </form>
        {focused && query.trim() && (
          <div
            className="liquid-glass absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-3xl p-1.5"
            onMouseDown={(e) => { e.preventDefault(); if (blurTimer.current) window.clearTimeout(blurTimer.current); }}
          >
            {suggestions.length === 0 ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">Aucun résultat pour « {query} »</p>
            ) : (
              suggestions.map((h) => (
                <button
                  key={`${h.type}-${"id" in h ? h.id : h.slug}`}
                  type="button"
                  onClick={() => goToHit(h)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white/70 active:scale-[0.98]"
                >
                  <IconBadge
                    icon={h.type === "item" ? Search : h.type === "service" ? Sparkles : BookOpen}
                    tone={h.type === "item" ? "gold" : h.type === "service" ? "pink" : "blue"}
                    size="sm"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold leading-tight truncate">{h.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {h.type === "item" ? `${h.code ? `Code: ${h.code} · ` : ""}${h.category}` : h.type === "service" ? "Service" : "Catégorie"}
                    </span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {([
          { label: "Réserver", icon: Calendar, tone: "gold" as const, to: "/contact" as const, href: undefined, wa: false },
          { label: "WhatsApp", icon: null,     tone: "green" as const, to: undefined, href: waLink(), wa: true },
          { label: "Itinéraire", icon: MapPin, tone: "rose" as const, to: undefined, href: LOCATION.mapsLink, wa: false },
          { label: "Catalogue", icon: BookOpen, tone: "blue" as const, to: "/catalog" as const, href: undefined, wa: false },
        ]).map(({ label, icon: Icon, tone, to, href, wa }) => {
          const inner = (
            <div className="liquid-glass group flex flex-col items-center gap-1 rounded-2xl p-2.5 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95">
              {wa ? (
                <IconBadge icon={WhatsAppIcon as any} tone="green" size="sm" className="group-hover:rotate-[-6deg]" />
              ) : Icon ? (
                <IconBadge icon={Icon} tone={tone} size="sm" className="group-hover:rotate-[-6deg]" />
              ) : null}
              <span className="text-[10px] font-medium text-center line-clamp-1">{label}</span>
            </div>
          );
          return to ? (
            <Link key={label} to={to}>{inner}</Link>
          ) : (
            <a key={label} href={href} target="_blank" rel="noreferrer">{inner}</a>
          );
        })}
      </div>

      {/* Popular services — text only */}
      <SectionTitle title="Services populaires" action={<Link to="/services" className="text-xs font-medium text-[var(--gold-deep)]">Voir tout</Link>} />
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularServices.map((s) => {
          const Icon = SERVICE_ICONS[s.id] ?? Sparkles;
          return (
            <Link key={s.id} to="/services" preload="intent" className="snap-start">
              <div className="liquid-glass w-44 shrink-0 rounded-[24px] p-3">
                <IconBadge icon={Icon} tone="gold" size="md" />
                <p className="mt-2 font-display text-sm font-semibold leading-tight">{s.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">{s.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Catalogue teaser */}
      <SectionTitle title="Catalogue" action={<Link to="/catalog" className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="grid grid-cols-2 gap-2">
        {topCategories.map((c) => (
          <Link key={c.slug} to="/catalog/$category" params={{ category: c.slug }} preload="intent" className="block">
            <Frame variant="plain" rounded="rounded-[24px]" className="aspect-[5/4] w-full" image={categoryImages[c.slug]} alt={c.name}>
              <div
                className="absolute inset-x-1.5 bottom-1.5 rounded-2xl p-2 backdrop-blur-md"
                style={{ background: "oklch(1 0 0 / 0.8)", border: "1px solid oklch(1 0 0 / 0.95)" }}
              >
                <p className="font-display text-xs font-semibold leading-tight text-neutral-900">{c.name}</p>
                <p className="text-[9px] font-medium" style={{ color: "var(--gold-deep)" }}>{c.countLabel}</p>
              </div>
            </Frame>
          </Link>
        ))}
      </div>

      {/* Realisations */}
      <SectionTitle title="Nos réalisations" action={<Link to="/gallery" className="text-xs font-medium text-[var(--gold-deep)]">Galerie</Link>} />
      <div className="grid grid-cols-3 gap-1.5">
        {works.map((g) => (
          <Link key={g.id} to="/gallery" preload="intent" className="block aspect-square">
            <Frame variant="plain" rounded="rounded-2xl" className="h-full w-full" image={g.image} alt={g.cat}>
              <span
                className="absolute left-1 bottom-1 rounded-full px-1 py-0.5 text-[8px] font-semibold backdrop-blur-md"
                style={{ background: "oklch(1 0 0 / 0.85)", color: "oklch(0.5 0.11 80)" }}
              >
                {g.cat}
              </span>
            </Frame>
          </Link>
        ))}
      </div>

      {/* Popular wigs */}
      <SectionTitle title="Perruques populaires" action={<Link to="/catalog/$category" params={{ category: "perruques" }} className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularWigs.map((p) => (
          <Link key={p.id} to="/catalog/$category" params={{ category: "perruques" }} className="snap-start">
            <div className="liquid-glass w-36 shrink-0 rounded-[24px] p-2.5">
              <Frame variant="plain" rounded="rounded-2xl" className="h-24 w-full" image={p.image} alt={p.name} />
              <p className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">{p.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular braids */}
      <SectionTitle title="Coiffures populaires" action={<Link to="/catalog/$category" params={{ category: "coiffure" }} className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularBraids.map((p) => (
          <Link key={p.id} to="/catalog/$category" params={{ category: "coiffure" }} className="snap-start">
            <div className="liquid-glass w-36 shrink-0 rounded-[24px] p-2.5">
              <Frame variant="plain" rounded="rounded-2xl" className="h-24 w-full" image={p.image} alt={p.name} />
              <p className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">{p.name}</p>

            </div>
          </Link>
        ))}
      </div>

      {/* Reviews */}
      <SectionTitle title="Avis clientes" />
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="liquid-glass w-64 shrink-0 snap-start rounded-[24px] p-3">
            <div className="flex items-center gap-0.5 text-[var(--gold)]">
              {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">"{t.text}"</p>
            <p className="mt-2 text-[11px] font-semibold">— {t.name}</p>
          </div>
        ))}
      </div>

      {/* Promo */}
      <SectionTitle title="Offres du mois" action={<Link to="/catalog/$category" params={{ category: "promotion" }} className="text-xs font-medium text-[var(--gold-deep)]">Voir tout</Link>} />
      <Link to="/catalog/$category" params={{ category: "promotion" }} preload="intent" className="block">
        <Frame variant="plain" rounded="rounded-[28px]" className="aspect-video w-full" image={CATALOG_ITEMS.promotion?.[0]?.image} alt="Promotions">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent rounded-b-[24px]" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-display text-lg font-semibold text-white">11 promotions</p>
            <p className="mt-0.5 text-xs text-white/80">Découvrez nos meilleures offres</p>
          </div>
        </Frame>
      </Link>
    </AppShell>
  );
}
