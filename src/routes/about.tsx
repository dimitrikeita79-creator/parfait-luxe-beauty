import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, GlassCard } from "@/components/AppShell";
import { Sparkles, Heart, Crown, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Parfait Design Des Mohair" },
      { name: "description", content: "Notre histoire, mission, vision et équipe." },
      { property: "og:title", content: "À propos — Parfait Design Des Mohair" },
      { property: "og:description", content: "Salon de beauté luxe à Ouagadougou." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell title="À propos" subtitle="L'élégance racontée">
      <GlassCard className="mt-5 p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)]">Notre histoire</span>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Parfait Design Des Mohair est né à Ouagadougou d'une passion : sublimer la femme africaine.
          Depuis nos débuts, nous combinons savoir-faire artisanal et standards de luxe pour offrir une
          expérience beauté unique, chaleureuse et raffinée.
        </p>
      </GlassCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: Heart, t: "Mission", d: "Révéler la beauté de chaque cliente." },
          { icon: Crown, t: "Vision", d: "Devenir la référence beauté en Afrique de l'Ouest." },
          { icon: Sparkles, t: "Valeurs", d: "Excellence, écoute, élégance." },
          { icon: Users, t: "Équipe", d: "Stylistes passionnés et certifiés." },
        ].map(({ icon: Icon, t, d }) => (
          <GlassCard key={t} className="p-4">
            <span className="bg-gold grid h-10 w-10 place-items-center rounded-full text-[oklch(0.15_0.01_60)] shadow-soft">
              <Icon className="h-4 w-4" />
            </span>
            <p className="font-display mt-3 text-base font-semibold">{t}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{d}</p>
          </GlassCard>
        ))}
      </div>

      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Notre équipe</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
        {[
          { n: "Awa", r: "Cheffe styliste", e: "👩🏾‍🎨" },
          { n: "Salimata", r: "Spécialiste perruques", e: "💁🏾‍♀️" },
          { n: "Bintou", r: "Coloration", e: "🎨" },
          { n: "Mariam", r: "Tresses", e: "💇🏾‍♀️" },
        ].map((m) => (
          <div key={m.n} className="glass w-36 shrink-0 rounded-[24px] p-4 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-200/60 to-rose-200/40 text-4xl">{m.e}</div>
            <p className="mt-3 font-semibold text-sm">{m.n}</p>
            <p className="text-[10px] text-muted-foreground">{m.r}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Notre salon</h2>
      <div className="grid grid-cols-3 gap-2">
        {["🪞", "💺", "✨", "🌸", "🕯️", "👑"].map((e, i) => (
          <div key={i} className="aspect-square grid place-items-center rounded-2xl bg-gradient-to-br from-amber-200/50 to-rose-200/40 text-4xl shadow-soft">{e}</div>
        ))}
      </div>

      <Link to="/contact" className="bg-gold mt-7 block rounded-full py-3.5 text-center text-sm font-semibold text-[oklch(0.15_0.01_60)] shadow-luxe">
        Prendre rendez-vous
      </Link>
    </AppShell>
  );
}