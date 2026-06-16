import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Calendar, MapPin, BookOpen, Star, ChevronRight, Sparkles } from "lucide-react";
import { AppShell, SectionTitle, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { Frame } from "@/components/Frame";
import { CoverCarousel } from "@/components/CoverCarousel";
import { SERVICES, CATALOG, CATALOG_ITEMS, GALLERY, TESTIMONIALS, formatFCFA, waLink, LOCATION } from "@/lib/salon-data";

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

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    // Catégories du catalogue
    const catMap: Record<string, string> = {
      promo: "promotion", promotion: "promotion", solde: "promotion",
      perruque: "perruques", perruques: "perruques", lace: "perruques",
      meche: "meche", mèche: "meche", tissage: "perruques",
      coiffure: "coiffure", tresse: "coiffure", tresses: "coiffure", braids: "coiffure",
      mariage: "mariage", mariée: "mariage",
      produit: "produits", produits: "produits", soin: "produits", soins: "produits",
      equipement: "equipement", équipement: "equipement", materiel: "equipement",
    };
    for (const key of Object.keys(catMap)) {
      if (q.includes(key)) {
        navigate({ to: "/catalog/$category", params: { category: catMap[key] } });
        return;
      }
    }
    if (q.includes("service") || q.includes("prestation") || q.includes("pose")) {
      navigate({ to: "/services" }); return;
    }
    if (q.includes("galerie") || q.includes("photo") || q.includes("realisation") || q.includes("réalisation")) {
      navigate({ to: "/gallery" }); return;
    }
    if (q.includes("contact") || q.includes("rendez") || q.includes("rdv") || q.includes("reserv")) {
      navigate({ to: "/contact" }); return;
    }
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
          <Link
            to="/contact"
            className="flex-1 rounded-full py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] active:scale-[0.98]"
            style={{ background: "linear-gradient(180deg, oklch(0.32 0.01 60), oklch(0.18 0.005 60))" }}
          >
            Réserver
          </Link>
          <Link to="/catalog" className="glass flex-1 rounded-full py-3 text-center text-sm font-semibold active:scale-[0.98] transition">
            Catalogue
          </Link>
        </div>
      </section>

      {/* Search */}
      <form onSubmit={handleSearch} className="mt-5 glass flex items-center gap-2 rounded-full px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-[var(--gold-soft,oklch(0.85_0.08_85))]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher : service, promo, perruque, mariage…"
          className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Recherche"
        />
        <button
          type="submit"
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-soft transition hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(180deg, oklch(0.32 0.01 60), oklch(0.18 0.005 60))" }}
        >
          OK
        </button>
      </form>

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

      {/* Popular services */}
      <SectionTitle title="Services populaires" action={<Link to="/services" className="text-xs font-medium text-[var(--gold-deep)]">Voir tout</Link>} />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularServices.map((s) => (
          <Link key={s.id} to="/services" className="snap-start">
            <div className="liquid-glass w-44 shrink-0 rounded-[24px] p-4">
              <Frame tone={s.tone} rounded="rounded-2xl" className="h-24 w-full" />
              <p className="mt-3 font-semibold text-sm leading-tight">{s.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{s.desc}</p>
              <p className="mt-2 text-xs font-semibold text-gold">Dès {formatFCFA(s.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Catalogue teaser */}
      <SectionTitle title="Catalogue" action={<Link to="/catalog" className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="grid grid-cols-2 gap-3">
        {topCategories.map((c) => (
          <Link key={c.slug} to="/catalog/$category" params={{ category: c.slug }} className="block">
            <Frame tone={c.tone} rounded="rounded-[24px]" className="aspect-[5/4] w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-base font-semibold text-white drop-shadow">{c.name}</p>
                <p className="text-[10px] font-medium text-white/85">{c.countLabel}</p>
              </div>
            </Frame>
          </Link>
        ))}
      </div>

      {/* Realisations */}
      <SectionTitle title="Nos réalisations" action={<Link to="/gallery" className="text-xs font-medium text-[var(--gold-deep)]">Galerie</Link>} />
      <div className="grid grid-cols-3 gap-2">
        {works.map((g) => (
          <Link key={g.id} to="/gallery" className="block aspect-square">
            <Frame tone={g.tone} rounded="rounded-2xl" className="h-full w-full">
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-1.5 text-[9px] font-medium text-white">{g.cat}</span>
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
              <Frame tone="from-neutral-100 via-white to-amber-50" rounded="rounded-2xl" className="h-28 w-full" />
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
              <Frame tone="from-rose-50 via-white to-amber-50" rounded="rounded-2xl" className="h-28 w-full" />
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
      <Link to="/catalog/$category" params={{ category: "promotion" }} className="block">
        <div className="glass-strong relative overflow-hidden rounded-[28px] p-5 transition hover:scale-[1.01] active:scale-[0.99]">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gold opacity-20 blur-3xl" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)]">Offre du mois</span>
          <p className="font-display mt-1 text-xl font-semibold leading-tight">-20% sur la pose<br/>+ entretien offert</p>
          <p className="mt-1 text-xs text-muted-foreground">11 promos disponibles ce mois</p>
          <span
            className="mt-4 inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-soft"
            style={{ background: "linear-gradient(180deg, oklch(0.32 0.01 60), oklch(0.18 0.005 60))" }}
          >
            Découvrir les promos <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </AppShell>
  );
}
