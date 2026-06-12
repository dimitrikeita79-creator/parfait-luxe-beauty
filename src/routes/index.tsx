import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search, Calendar, MessageCircle, MapPin, BookOpen, Star, ChevronRight, Sparkles } from "lucide-react";
import { AppShell, GlassCard, SectionTitle } from "@/components/AppShell";
import { SERVICES, PRODUCTS, GALLERY, TESTIMONIALS, formatFCFA, waLink, LOCATION } from "@/lib/salon-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parfait Design Des Mohair — Accueil" },
      { name: "description", content: "Salon de beauté luxe à Ouagadougou : perruques, mèches, tresses, mariage." },
      { property: "og:title", content: "Parfait Design Des Mohair" },
      { property: "og:description", content: "Votre beauté, notre passion." },
    ],
  }),
  component: Index,
});

function Index() {
  const popularServices = SERVICES.slice(0, 4);
  const popularWigs = PRODUCTS.filter((p) => p.category.includes("Perruque")).slice(0, 4);
  const popularMeches = PRODUCTS.filter((p) => p.category.includes("Mèches")).slice(0, 4);
  const works = GALLERY.slice(0, 6);

  return (
    <AppShell>
      {/* Hero */}
      <section className="mt-3 animate-fade-up">
        <div className="glass-strong relative overflow-hidden rounded-[32px] p-6">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold opacity-40 blur-2xl" />
          <div className="relative">
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--gold-deep)]">
              <Sparkles className="h-3 w-3" /> Beauté premium
            </span>
            <h1 className="font-display mt-3 text-3xl leading-[1.1] font-semibold">
              Révélez votre <span className="text-gold">élégance</span> naturelle
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Perruques • Mèches • Coiffures • Mariage • Beauté
            </p>
            <div className="mt-5 flex gap-2">
              <Link to="/contact" className="bg-gold flex-1 rounded-full py-3 text-center text-sm font-semibold text-[oklch(0.15_0.01_60)] shadow-luxe active:scale-[0.98] transition">
                Réserver
              </Link>
              <Link to="/services" className="glass flex-1 rounded-full py-3 text-center text-sm font-semibold active:scale-[0.98] transition">
                Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="mt-5 glass flex items-center gap-2 rounded-full px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Rechercher un service, perruque…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[
          { label: "Réserver", icon: Calendar, to: "/contact" as const, href: undefined },
          { label: "WhatsApp", icon: MessageCircle, to: undefined, href: waLink() },
          { label: "Itinéraire", icon: MapPin, to: undefined, href: LOCATION.mapsLink },
          { label: "Catalogue", icon: BookOpen, to: "/products" as const, href: undefined },
        ].map(({ label, icon: Icon, to, href }) => {
          const inner = (
            <div className="glass flex flex-col items-center gap-1.5 rounded-2xl p-3 transition active:scale-95">
              <span className="bg-gold grid h-10 w-10 place-items-center rounded-full text-[oklch(0.15_0.01_60)] shadow-soft">
                <Icon className="h-4 w-4" />
              </span>
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
            <div className="glass w-44 shrink-0 rounded-[24px] p-4">
              <div className={`grid h-24 w-full place-items-center rounded-2xl bg-gradient-to-br ${s.tone} text-4xl`}>{s.emoji}</div>
              <p className="mt-3 font-semibold text-sm leading-tight">{s.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{s.desc}</p>
              <p className="mt-2 text-xs font-semibold text-gold">Dès {formatFCFA(s.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Realisations */}
      <SectionTitle title="Nos réalisations" action={<Link to="/gallery" className="text-xs font-medium text-[var(--gold-deep)]">Galerie</Link>} />
      <div className="grid grid-cols-3 gap-2">
        {works.map((g) => (
          <Link key={g.id} to="/gallery" className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${g.tone} grid place-items-center text-3xl shadow-soft`}>
            <span>{g.emoji}</span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-1.5 text-[9px] font-medium text-white">{g.cat}</span>
          </Link>
        ))}
      </div>

      {/* Popular wigs */}
      <SectionTitle title="Perruques populaires" action={<Link to="/products" className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularWigs.map((p) => (
          <Link key={p.id} to="/products" className="snap-start">
            <div className="glass w-40 shrink-0 rounded-[24px] p-3">
              <div className="grid h-28 w-full place-items-center rounded-2xl bg-gradient-to-br from-amber-200/60 to-rose-200/40 text-5xl">{p.emoji}</div>
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              <p className="mt-1 text-[11px] font-semibold text-gold">{formatFCFA(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular meches */}
      <SectionTitle title="Mèches populaires" action={<Link to="/products" className="text-xs font-medium text-[var(--gold-deep)]">Tout voir</Link>} />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {popularMeches.map((p) => (
          <Link key={p.id} to="/products" className="snap-start">
            <div className="glass w-40 shrink-0 rounded-[24px] p-3">
              <div className="grid h-28 w-full place-items-center rounded-2xl bg-gradient-to-br from-rose-200/60 to-amber-100/40 text-5xl">{p.emoji}</div>
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
              <p className="mt-1 text-[11px] font-semibold text-gold">{formatFCFA(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Reviews */}
      <SectionTitle title="Avis clientes" />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="glass w-72 shrink-0 snap-start rounded-[24px] p-4">
            <div className="flex items-center gap-1 text-[var(--gold)]">
              {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <p className="mt-2 text-sm leading-relaxed">"{t.text}"</p>
            <p className="mt-3 text-xs font-semibold">— {t.name}</p>
          </div>
        ))}
      </div>

      {/* Promo */}
      <SectionTitle title="Promotions" />
      <div className="glass-strong relative overflow-hidden rounded-[28px] p-5">
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gold opacity-30 blur-3xl" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)]">Offre du mois</span>
        <p className="font-display mt-1 text-xl font-semibold leading-tight">-20% sur la pose<br/>+ entretien offert</p>
        <p className="mt-1 text-xs text-muted-foreground">Valable jusqu'au 30/06</p>
        <a href={waLink("Bonjour, je souhaite profiter de la promo -20% sur la pose.")} target="_blank" rel="noreferrer" className="bg-gold mt-4 inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-[oklch(0.15_0.01_60)] shadow-luxe">
          Réserver maintenant <ChevronRight className="h-3 w-3" />
        </a>
      </div>

      {/* About teaser */}
      <SectionTitle title="À propos" action={<Link to="/about" className="text-xs font-medium text-[var(--gold-deep)]">Découvrir</Link>} />
      <GlassCard className="p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Un salon haut de gamme au cœur de Ouagadougou — dédié à la beauté, l'élégance et la confiance de chaque femme.
        </p>
      </GlassCard>
    </AppShell>
  );
}
