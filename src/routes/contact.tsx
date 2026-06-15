import { createFileRoute } from "@tanstack/react-router";
import { AppShell, GlassCard, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { MapPin, Phone, Facebook, Instagram, Globe, User, Calendar, MessageSquare, Sparkles, ShoppingBag } from "lucide-react";
import { SERVICES, SOCIALS, LOCATION, WHATSAPP_DISPLAY, waLink, CATALOG_ITEMS, formatFCFA } from "@/lib/salon-data";
import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Réservation — Parfait.Design/Desmohair" },
      { name: "description", content: "Réservez votre rendez-vous. WhatsApp +226 70 02 83 36, Ouagadougou." },
      { property: "og:title", content: "Contact — Parfait.Design/Desmohair" },
      { property: "og:description", content: "Contactez notre salon de beauté à Ouagadougou." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const products = useMemo(
    () => [
      ...CATALOG_ITEMS.produits.map((p) => ({ id: p.id, label: `Produit · ${p.name}`, price: p.price })),
      ...CATALOG_ITEMS.equipement.map((p) => ({ id: p.id, label: `Équipement · ${p.name}`, price: p.price })),
      ...CATALOG_ITEMS.perruques.slice(0, 12).map((p) => ({ id: p.id, label: `Perruque · ${p.name}`, price: p.price })),
    ],
    [],
  );
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    service: SERVICES[0].title,
    produit: "aucun",
    date: "",
    message: "",
  });
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === form.produit);
    const prodLine = prod ? `• Produit : ${prod.label}${prod.price ? ` (${formatFCFA(prod.price)})` : ""}\n` : "";
    const msg = `Bonjour Parfait.Design/Desmohair,\n\nJe souhaite réserver :\n• Nom : ${form.nom}\n• Téléphone : ${form.tel}\n• Service : ${form.service}\n${prodLine}• Date souhaitée : ${form.date}\n\n${form.message}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <AppShell title="Contact" subtitle="Réservez votre moment beauté">
      <form onSubmit={onSubmit} className="mt-5 liquid-glass rounded-[28px] p-5 space-y-4">
        <SectionLabel>Coordonnées</SectionLabel>
        <Field label="Nom complet" icon={User}>
          <input required value={form.nom} onChange={set("nom")} className="input" placeholder="Votre nom" />
        </Field>
        <Field label="Téléphone" icon={Phone}>
          <input required type="tel" value={form.tel} onChange={set("tel")} className="input" placeholder="+226 ..." />
        </Field>

        <SectionLabel>Demande</SectionLabel>
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
        <button
          type="submit"
          className="liquid-glass mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition hover:scale-[1.01] active:scale-[0.98]"
          style={{ color: "#0f8a3f", boxShadow: "0 12px 28px -14px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)" }}
        >
          <WhatsAppIcon className="h-5 w-5" style={{ color: "#25D366" }} />
          <span>Envoyer via WhatsApp</span>
          <span className="text-[10px] font-normal opacity-70">· réponse rapide</span>
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a href={`tel:+${WHATSAPP_DISPLAY.replace(/[^0-9]/g, "")}`} className="liquid-glass rounded-2xl p-4 transition hover:scale-[1.02] active:scale-95">
          <IconBadge icon={Phone} tone="gold" />
          <p className="mt-2 text-xs font-semibold">Téléphone</p>
          <p className="text-[11px] text-muted-foreground">{WHATSAPP_DISPLAY}</p>
        </a>
        <a href={LOCATION.mapsLink} target="_blank" rel="noreferrer" className="liquid-glass rounded-2xl p-4 transition hover:scale-[1.02] active:scale-95">
          <IconBadge icon={MapPin} tone="green" />
          <p className="mt-2 text-xs font-semibold">Adresse</p>
          <p className="text-[11px] text-muted-foreground">{LOCATION.city}</p>
        </a>
      </div>

      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Nous trouver</h2>
      <GlassCard className="overflow-hidden p-0">
        <iframe
          src={LOCATION.embed}
          className="h-56 w-full border-0"
          loading="lazy"
          title="Carte du salon"
        />
        <a href={LOCATION.mapsLink} target="_blank" rel="noreferrer" className="liquid-glass block py-3 text-center text-xs font-semibold" style={{ color: "var(--gold-deep)" }}>
          Obtenir l'itinéraire
        </a>
      </GlassCard>

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

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: typeof Phone;
  children: ReactNode;
}) {
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
