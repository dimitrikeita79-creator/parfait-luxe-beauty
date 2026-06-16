import { useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Calendar, MapPin, BookOpen, Star, ChevronRight, Sparkles, Scissors, Heart, Crown, Gem, Package } from "lucide-react";
import { AppShell, SectionTitle, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { GlassButton } from "@/components/GlassButton";
import { Frame } from "@/components/Frame";
import { CoverCarousel } from "@/components/CoverCarousel";
import { SERVICES, CATALOG, CATALOG_ITEMS, GALLERY, TESTIMONIALS, formatFCFA, waLink, LOCATION } from "@/lib/salon-data";

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  pose: Crown, tresses: Scissors, mariage: Heart, tissage: Sparkles, perruques: Gem, equipement: Package,
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type SearchHit =
  | { type: "item"; id: string; name: string; category: string }
  | { type: "service"; id: string; name: string }
  | { type: "category"; slug: string; name: string };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parfait.Design/Desmohair — Accueil" },
      { name: "description", content: "Salon de beauté luxe à Ouagadougou : perruques, mèches, tresses, mariage." },
      { property: "og:title", content: "Parfait.Design/Desmohair" },
      { property: "og:description", content: "Votre beauté, notre passion." },
    ],
  }),
  component: Index,
});

function Index() {
  const popularServices = SERVICES.slice(0, 4);
  const popularWigs = CATALOG_ITEMS.perruques.slice(0, 4);
  const popularBraids = CATALOG_ITEMS.coiffure.slice(0, 4);
  const works = GALLERY.slice(0, 6);
  const topCategories = CATALOG.slice(0, 4);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const searchIndex = useMemo<SearchHit[]>(() => {
    const out: SearchHit[] = [];
    for (const [slug, list] of Object.entries(CATALOG_ITEMS)) {
      for (const it of list) out.push({ type: "item", id: it.id, name: it.name, category: slug });
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
      let score = 0;
      if (n === q) score = 100;
      else if (n.startsWith(q)) score = 60;
      else if (n.includes(q)) score = 30;
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

  return (
    <AppShell>
      {/* Cover carousel */}
      <section className="mt-3 animate-fade-up">
        <CoverCarousel />
      </section>

      {/* Hero text */}
      <section className="mt-4 animate-fade-up">
        <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--gold-deep)]">
          <Sparkles className="h-3 w-3" /> Beauté premium
        </span>
        <h1 className="font-display mt-3 text-3xl leading-[1.1] font-semibold">
          Révélez votre <span className="text-gold">élégance</span> naturelle
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Perruques • Mèches • Coiffures • Mariage • Beauté
        </p>
        <div className="mt-4 flex gap-2">
          <GlassButton as={Link} to="/contact" variant="primary" size="lg" full className="flex-1">Réserver</GlassButton>
          <GlassButton as={Link} to="/catalog" variant="light" size="lg" full className="flex-1">Catalogue</GlassButton>
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
                      {h.type === "item" ? `Catalogue · ${h.category}` : h.type === "service" ? "Service" : "Catégorie"}
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
      <div className="mt-5 grid grid-cols-4 gap-2">
        {([
          { label: "Réserver", icon: Calendar, tone: "gold" as const, to: "/contact" as const, href: undefined, wa: false },
          { label: "WhatsApp", icon: null,     tone: "green" as const, to: undefined, href: waLink(), wa: true },
          { label: "Itinéraire", icon: MapPin, tone: "rose" as const, to: undefined, href: LOCATION.mapsLink, wa: false },
          { label: "Catalogue", icon: BookOpen, tone: "blue" as const, to: "/catalog" as const, href: undefined, wa: false },
        ]).map(({ label, icon: Icon, tone, to, href, wa }) => {
          const inner = (
            <div className="liquid-glass group flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95">
              {wa ? (
                <IconBadge icon={WhatsAppIcon as any} tone="green" size="md" className="group-hover:rotate-[-6deg]" />
              ) : Icon ? (
                <IconBadge icon={Icon} tone={tone} size="md" className="group-hover:rotate-[-6deg]" />
              ) : null}
              <span className="text-[11px] font-medium">{label}</span>
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
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularServices.map((s) => {
          const Icon = SERVICE_ICONS[s.id] ?? Sparkles;
          return (
            <Link key={s.id} to="/services" preload="intent" className="snap-start">
              <div className="liquid-glass w-48 shrink-0 rounded-[24px] p-4">
                <IconBadge icon={Icon} tone="gold" size="md" />
                <p className="mt-3 font-display text-base font-semibold leading-tight">{s.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{s.desc}</p>
                <p className="mt-2 text-xs font-semibold text-gold">Dès {formatFCFA(s.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Catalogue teaser */}
      <SectionTitle title="Catalogue" action={<Link to="/catalog" className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="grid grid-cols-2 gap-3">
        {topCategories.map((c) => (
          <Link key={c.slug} to="/catalog/$category" params={{ category: c.slug }} preload="intent" className="block">
            <Frame variant="plain" rounded="rounded-[24px]" className="aspect-[5/4] w-full">
              <div
                className="absolute inset-x-2 bottom-2 rounded-2xl p-2.5 backdrop-blur-md"
                style={{ background: "oklch(1 0 0 / 0.8)", border: "1px solid oklch(1 0 0 / 0.95)" }}
              >
                <p className="font-display text-sm font-semibold leading-tight text-neutral-900">{c.name}</p>
                <p className="text-[10px] font-medium" style={{ color: "var(--gold-deep)" }}>{c.countLabel}</p>
              </div>
            </Frame>
          </Link>
        ))}
      </div>

      {/* Realisations */}
      <SectionTitle title="Nos réalisations" action={<Link to="/gallery" className="text-xs font-medium text-[var(--gold-deep)]">Galerie</Link>} />
      <div className="grid grid-cols-3 gap-2">
        {works.map((g) => (
          <Link key={g.id} to="/gallery" preload="intent" className="block aspect-square">
            <Frame variant="plain" rounded="rounded-2xl" className="h-full w-full">
              <span
                className="absolute left-1.5 bottom-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur-md"
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
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularWigs.map((p) => (
          <Link key={p.id} to="/catalog/$category" params={{ category: "perruques" }} className="snap-start">
            <div className="liquid-glass w-40 shrink-0 rounded-[24px] p-3">
              <Frame variant="plain" rounded="rounded-2xl" className="h-28 w-full" />
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              <p className="mt-1 text-[11px] font-semibold text-gold">{formatFCFA(p.price ?? 0)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular braids */}
      <SectionTitle title="Coiffures populaires" action={<Link to="/catalog/$category" params={{ category: "coiffure" }} className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularBraids.map((p) => (
          <Link key={p.id} to="/catalog/$category" params={{ category: "coiffure" }} className="snap-start">
            <div className="liquid-glass w-40 shrink-0 rounded-[24px] p-3">
              <Frame variant="plain" rounded="rounded-2xl" className="h-28 w-full" />
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              <p className="mt-1 text-[11px] font-semibold text-gold">{formatFCFA(p.price ?? 0)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Reviews */}
      <SectionTitle title="Avis clientes" />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="liquid-glass w-72 shrink-0 snap-start rounded-[24px] p-4">
            <div className="flex items-center gap-1 text-[var(--gold)]">
              {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <p className="mt-2 text-sm leading-relaxed">"{t.text}"</p>
            <p className="mt-3 text-xs font-semibold">— {t.name}</p>
          </div>
        ))}
      </div>

      {/* Promo */}
      <SectionTitle title="Offres du mois" action={<Link to="/catalog/$category" params={{ category: "promotion" }} className="text-xs font-medium text-[var(--gold-deep)]">Voir tout</Link>} />
      <Link to="/catalog/$category" params={{ category: "promotion" }} preload="intent" className="block">
        <div className="glass-strong relative overflow-hidden rounded-[28px] p-5 transition hover:scale-[1.01] active:scale-[0.99]">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gold opacity-20 blur-3xl" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)]">Offre du mois</span>
          <p className="font-display mt-1 text-xl font-semibold leading-tight">-20% sur la pose<br/>+ entretien offert</p>
          <p className="mt-1 text-xs text-muted-foreground">11 promos disponibles ce mois</p>
          <GlassButton variant="gold" size="md" className="mt-4">
            Découvrir les promos <ChevronRight className="h-3 w-3" />
          </GlassButton>
        </div>
      </Link>
    </AppShell>
  );
}
