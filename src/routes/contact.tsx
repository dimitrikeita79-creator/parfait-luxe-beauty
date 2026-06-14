import { createFileRoute } from "@tanstack/react-router";
import { AppShell, GlassCard, WhatsAppIcon } from "@/components/AppShell";
import { MapPin, Phone, Facebook, Instagram, Globe } from "lucide-react";
import { SERVICES, SOCIALS, LOCATION, WHATSAPP_DISPLAY, waLink } from "@/lib/salon-data";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

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
  const [form, setForm] = useState({ nom: "", tel: "", service: SERVICES[0].title, date: "", message: "" });
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour Parfait.Design/Desmohair,\n\nJe souhaite réserver :\n• Nom : ${form.nom}\n• Téléphone : ${form.tel}\n• Service : ${form.service}\n• Date souhaitée : ${form.date}\n\n${form.message}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <AppShell title="Contact" subtitle="Réservez votre moment beauté">
      <form onSubmit={onSubmit} className="mt-5 glass rounded-[28px] p-5 space-y-3">
        <Field label="Nom complet">
          <input required value={form.nom} onChange={set("nom")} className="input" placeholder="Votre nom" />
        </Field>
        <Field label="Téléphone">
          <input required type="tel" value={form.tel} onChange={set("tel")} className="input" placeholder="+226 ..." />
        </Field>
        <Field label="Service souhaité">
          <select value={form.service} onChange={set("service")} className="input">
            {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
          </select>
        </Field>
        <Field label="Date souhaitée">
          <input required type="date" value={form.date} onChange={set("date")} className="input" />
        </Field>
        <Field label="Message">
          <textarea value={form.message} onChange={set("message")} rows={3} className="input resize-none" placeholder="Précisez votre demande…" />
        </Field>
        <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-luxe active:scale-[0.98] transition">
          <WhatsAppIcon className="h-4 w-4" /> Envoyer via WhatsApp
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a href={`tel:+${WHATSAPP_DISPLAY.replace(/[^0-9]/g, "")}`} className="liquid-glass rounded-2xl p-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white"><Phone className="h-4 w-4" /></span>
          <p className="mt-2 text-xs font-semibold">Téléphone</p>
          <p className="text-[11px] text-muted-foreground">{WHATSAPP_DISPLAY}</p>
        </a>
        <a href={LOCATION.mapsLink} target="_blank" rel="noreferrer" className="liquid-glass rounded-2xl p-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white"><MapPin className="h-4 w-4" /></span>
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
        <a href={LOCATION.mapsLink} target="_blank" rel="noreferrer" className="bg-gold block py-3 text-center text-xs font-semibold text-[oklch(0.15_0.01_60)]">
          Obtenir l'itinéraire
        </a>
      </GlassCard>

      <h2 className="font-display mt-7 mb-3 text-xl font-semibold">Suivez-nous</h2>
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Facebook, label: "Facebook", href: SOCIALS.facebook },
          { icon: Instagram, label: "Instagram", href: SOCIALS.instagram },
          { icon: TikTokIcon, label: "TikTok", href: SOCIALS.tiktok },
          { icon: Globe, label: "Site web", href: SOCIALS.website },
        ].map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="liquid-glass flex flex-col items-center gap-1 rounded-2xl p-3 active:scale-95 transition">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white"><Icon className="h-4 w-4" /></span>
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </div>

      <style>{`
        .input {
          width: 100%;
          background: color-mix(in oklab, var(--card) 50%, transparent);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 12px 14px;
          font-size: 13px;
          color: var(--foreground);
          outline: none;
          transition: border-color .2s;
        }
        .input:focus { border-color: var(--gold); }
      `}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.3a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.2a3 3 0 1 0 2.1 2.9V3h3z"/>
    </svg>
  );
}