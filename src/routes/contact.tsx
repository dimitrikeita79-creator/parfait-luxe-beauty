import { createFileRoute } from "@tanstack/react-router";
import { AppShell, GlassCard, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { GlassButton } from "@/components/GlassButton";
import { MapPin, Phone, Facebook, Instagram, Globe, User, Calendar, MessageSquare, Sparkles, ShoppingBag, Building2 } from "lucide-react";
import {
  SERVICES, SOCIALS, SALONS, CATALOG_ITEMS, formatFCFA,
  waLinkFor, pickSalonFor, type SalonId,
} from "@/lib/salon-data";
import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Réservation — Parfait.Design / Desmo Hair / Beauté Essentielle" },
      { name: "description", content: "Réservez votre rendez-vous dans l'un de nos trois établissements à Ouagadougou." },
      { property: "og:title", content: "Contact — Parfait.Design / Desmo Hair / Beauté Essentielle" },
      { property: "og:description", content: "Trois adresses à Ouagadougou pour vos coiffures, perruques, produits et équipements." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const products = useMemo(
    () => [
      ...CATALOG_ITEMS.produits.map((p) => ({ id: p.id, label: `Produit · ${p.name}`, price: p.price, cat: "produits" })),
      ...CATALOG_ITEMS.equipement.map((p) => ({ id: p.id, label: `Équipement · ${p.name}`, price: p.price, cat: "equipement" })),
      ...CATALOG_ITEMS.perruques.slice(0, 16).map((p) => ({ id: p.id, label: `Perruque · ${p.name}`, price: p.price, cat: "perruques" })),
    ],
    [],
  );
  const [mapSalon, setMapSalon] = useState<SalonId>("parfait");
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    service: SERVICES[0].title,
    produit: "aucun",
    salonId: "parfait" as SalonId,
    date: "",
    message: "",
  });
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: value } as typeof f;
      // auto-pick salon if user changes produit
      if (k === "produit" && value !== "aucun") {
        const p = products.find((x) => x.id === value);
        if (p) next.salonId = pickSalonFor(p.cat).id;
      }
      return next;
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === form.produit);
    const prodLine = prod ? `• Produit : ${prod.label}${prod.price ? ` (${formatFCFA(prod.price)})` : ""}\n` : "";
    const salon = SALONS.find((s) => s.id === form.salonId)!;
    const msg = `Bonjour ${salon.name},\n\nJe souhaite réserver :\n• Nom : ${form.nom}\n• Téléphone : ${form.tel}\n• Service : ${form.service}\n${prodLine}• Date souhaitée : ${form.date}\n\n${form.message}`;
    window.open(waLinkFor(form.salonId, msg), "_blank");
  };

  return (
    <AppShell title="Contact" subtitle="Trois adresses à votre service">
      {/* Établissements */}
      <section className="mt-5 space-y-3">
        {SALONS.map((s, i) => (
          <article
            key={s.id}
            className="liquid-glass animate-fade-up rounded-[24px] p-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
                style={{ boxShadow: "0 6px 16px -8px oklch(0.78 0.1 85 / 0.4)" }}
              >
                <img src={s.logo} alt={s.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-semibold leading-tight">{s.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" style={{ color: "var(--gold-deep)" }} /> {s.area} · {s.phoneDisplay}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--gold-deep)]">
                  {s.tags.includes("produits") ? "Produits & Équipements" : "Services · Perruques · Mariage · Promo"}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <GlassButton as="a" href={`tel:${s.phone}`} variant="light" size="sm">
                <Phone className="h-3 w-3" /> Appeler
              </GlassButton>
              <GlassButton as="a" href={waLinkFor(s.id)} target="_blank" rel="noreferrer" variant="whatsapp" size="sm">
                <WhatsAppIcon className="h-3 w-3" style={{ color: "#25D366" }} /> WhatsApp
              </GlassButton>
              <GlassButton as="a" href={s.mapsLink} target="_blank" rel="noreferrer" variant="gold" size="sm">
                <MapPin className="h-3 w-3" /> Itinéraire
              </GlassButton>
            </div>
          </article>
        ))}
      </section>

      {/* Formulaire */}
      <form onSubmit={onSubmit} className="mt-6 liquid-glass rounded-[28px] p-5 space-y-4">
        <SectionLabel>Coordonnées</SectionLabel>
        <Field label="Nom complet" icon={User}>
          <input required value={form.nom} onChange={set("nom")} className="input" placeholder="Votre nom" />
        </Field>
        <Field label="Téléphone" icon={Phone}>
          <input required type="tel" value={form.tel} onChange={set("tel")} className="input" placeholder="+226 ..." />
        </Field>

        <SectionLabel>Demande</SectionLabel>
        <Field label="Établissement" icon={Building2}>
          <select value={form.salonId} onChange={set("salonId")} className="input">
            {SALONS.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.area}</option>)}
          </select>
        </Field>
        <Field label="Service souhaité" icon={Sparkles}>
          <select value={form.service} onChange={set("service")} className="input">
            {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
          </select>
        </Field>
        <Field label="Produit / Équipement (optionnel)" icon={ShoppingBag}>
          <select value={form.produit} onChange={set("produit")} className="input">
            <option value="aucun">Aucun</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.label}{p.price ? ` — ${formatFCFA(p.price)}` : ""}</option>
            ))}
          </select>
        </Field>
        <Field label="Date souhaitée" icon={Calendar}>
          <input required type="date" value={form.date} onChange={set("date")} className="input" />
        </Field>
        <Field label="Message" icon={MessageSquare}>
          <textarea value={form.message} onChange={set("message")} rows={3} className="input resize-none" placeholder="Précisez votre demande…" />
        </Field>
        <GlassButton type="submit" variant="whatsapp" size="lg" full className="mt-2">
          <WhatsAppIcon className="h-5 w-5" style={{ color: "#25D366" }} />
          <span>Envoyer via WhatsApp</span>
        </GlassButton>
      </form>

      {/* Carte */}
      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Nous trouver</h2>
      <div className="liquid-glass rounded-full p-1 flex gap-1">
        {SALONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setMapSalon(s.id)}
            className={`flex-1 rounded-full px-2 py-1.5 text-[10px] font-semibold transition ${mapSalon === s.id ? "bg-white shadow-sm text-[var(--gold-deep)]" : "text-muted-foreground"}`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <GlassCard className="mt-3 overflow-hidden p-0">
        <iframe
          key={mapSalon}
          src={SALONS.find((s) => s.id === mapSalon)!.embed}
          className="h-56 w-full border-0"
          loading="lazy"
          title={`Carte ${mapSalon}`}
        />
        <GlassButton
          as="a"
          href={SALONS.find((s) => s.id === mapSalon)!.mapsLink}
          target="_blank"
          rel="noreferrer"
          variant="gold"
          size="md"
          full
          className="rounded-none rounded-b-[28px]"
        >
          Obtenir l'itinéraire
        </GlassButton>
      </GlassCard>

      {/* Réseaux */}
      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Suivez-nous</h2>
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Facebook,   label: "Facebook",  href: SOCIALS.facebook,  tone: "blue"  as const },
          { icon: Instagram,  label: "Instagram", href: SOCIALS.instagram, tone: "pink"  as const },
          { icon: TikTokIcon, label: "TikTok",    href: SOCIALS.tiktok,    tone: "rose"  as const },
          { icon: Globe,      label: "Site web",  href: SOCIALS.website,   tone: "gold"  as const },
        ].map(({ icon: Icon, label, href, tone }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass flex flex-col items-center gap-1.5 rounded-2xl p-3 transition hover:scale-105 active:scale-95"
          >
            <IconBadge icon={Icon} tone={tone} />
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </div>

      <style>{`
        .input {
          width: 100%;
          background: linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.6));
          backdrop-filter: blur(14px) saturate(170%);
          border: 1px solid oklch(1 0 0 / 0.8);
          border-radius: 16px;
          padding: 12px 14px;
          font-size: 13px;
          color: var(--foreground);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.6);
        }
        .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px oklch(0.85 0.1 85 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.6); }
      `}</style>
    </AppShell>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent" />
    </p>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: typeof Phone; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" style={{ color: "var(--gold-deep)" }} />}
        {label}
      </span>
      {children}
    </label>
  );
}

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.3a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.2a3 3 0 1 0 2.1 2.9V3h3z" fill="currentColor"/>
    </svg>
  );
}
