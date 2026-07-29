import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AppShell, GlassCard, WhatsAppIcon } from "@/components/AppShell";
import { IconBadge } from "@/components/IconBadge";
import { GlassButton } from "@/components/GlassButton";
import {
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Globe,
  User,
  Calendar,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Building2,
} from "lucide-react";
import {
  SALONS,
  SOCIALS,
  waLinkFor,
  pickSalonFor,
  type SalonId,
} from "@/lib/salon-data";
import { servicesService, catalogService, salonService } from "@/backend/services";
import type { ServiceItem, CatalogItem, SalonInfo } from "@/backend/models";
import {
  useMemo,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

const formatFCFA = (price: number) => {
  return new Intl.NumberFormat("fr-BF", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title: "Contact & Reservation — Parfait.Design / Desmo Hair / Beaute Essentielle",
      },
      {
        name: "description",
        content:
          "Reservez votre rendez-vous dans l'un de nos trois etablissements a Ouagadougou.",
      },
      {
        property: "og:title",
        content: "Contact — Parfait.Design / Desmo Hair / Beaute Essentielle",
      },
      {
        property: "og:description",
        content:
          "Trois adresses a Ouagadougou pour vos coiffures, perruques, produits et equipements.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [mapSalon, setMapSalon] = useState<SalonId>("parfait");
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    service: "",
    produit: "aucun",
    salonId: "parfait" as SalonId,
    date: "",
    message: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesData, catalogData, salonData] = await Promise.all([
          servicesService.getActive(),
          catalogService.getAvailable(),
          salonService.getInfo(),
        ]);
        setServices(servicesData);
        setCatalogItems(catalogData);
        setSalonInfo(salonData);
        if (servicesData.length > 0) {
          setForm((f) => ({ ...f, service: servicesData[0].title }));
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const products = useMemo(() => {
    const result = catalogItems
      .filter((item) =>
        ["produits", "equipement", "perruques"].includes(
          item.category.toLowerCase()
        )
      )
      .slice(0, 40)
      .map((p) => ({
        id: p.id,
        label: `${p.category} · ${p.title}`,
        price: p.price,
        cat: p.category,
        code: (p as any).code,
        image_url: p.image_url,
      }));
    return result;
  }, [catalogItems]);

  const set = (k: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: value } as typeof f;
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
    const prodCode = prod?.code ? `• Code : ${prod.code}\n` : "";
    const prodLine = prod
      ? `• Produit : ${prod.label}${prod.price ? ` (${formatFCFA(prod.price)})` : ""}\n`
      : "";
    const prodImageLine = prod?.image_url ? `• Image : ${prod.image_url}\n` : "";
    const salon = SALONS.find((s) => s.id === form.salonId)!;
    const msg = `Bonjour ${salon.name},\n\nJe souhaite reserver :\n• Nom : ${form.nom}\n• Telephone : ${form.tel}\n• Service : ${form.service}\n${prodCode}${prodLine}${prodImageLine}• Date souhaitee : ${form.date}\n\n${form.message}`;
    const url = waLinkFor(form.salonId, msg);
    window.open(url, "_blank");
  };

  const mergedSalons = useMemo(() => {
    if (!salonInfo) return SALONS;
    const dbSalon: typeof SALONS[0] = {
      id: "parfait",
      name: salonInfo.salon_name || "Parfait Design", // Use default if database is empty
      area: salonInfo.address || SALONS[0].area,
      city: SALONS[0].city,
      phone: salonInfo.phone_number || SALONS[0].phone,
      phoneDisplay: salonInfo.phone_number || SALONS[0].phoneDisplay,
      whatsapp: (salonInfo.whatsapp_url || SALONS[0].whatsapp).replace(/\D/g, ""),
      mapsLink: SALONS[0].mapsLink,
      embed: SALONS[0].embed,
      logo: SALONS[0].logo,
      tags: SALONS[0].tags,
    };
    return [dbSalon, SALONS[1], SALONS[2]];
  }, [salonInfo]);

  return (
    <AppShell title="Contact" subtitle="Trois adresses a votre service">
      {/* Etablissements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-5 space-y-3"
      >
        {mergedSalons.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="liquid-glass rounded-[24px] p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
                style={{
                  boxShadow: "0 6px 16px -8px oklch(0.78 0.1 85 / 0.4)",
                }}
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-semibold leading-tight">
                  {s.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin
                    className="h-3 w-3"
                    style={{ color: "var(--gold-deep)" }}
                  />{" "}
                  {s.area} · {s.phoneDisplay}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--gold-deep)]">
                  {s.tags.includes("produits")
                    ? "Produits & Equipements"
                    : "Services · Perruques · Mariage · Promo"}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <GlassButton
                as="a"
                href={`tel:${s.phone}`}
                variant="light"
                size="sm"
              >
                <Phone className="h-3 w-3" /> Appeler
              </GlassButton>
              <GlassButton
                as="a"
                href={waLinkFor(s.id)}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="sm"
              >
                <WhatsAppIcon
                  className="h-3 w-3"
                  style={{ color: "#25D366" }}
                />{" "}
                WhatsApp
              </GlassButton>
              <button
                onClick={() => window.open(s.mapsLink, "_blank")}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-red-500/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                <MapPin className="h-3 w-3" /> Itineraire
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form
          onSubmit={onSubmit}
          className="mt-6 liquid-glass rounded-[28px] p-5 space-y-4"
        >
          <SectionLabel>Coordonnees</SectionLabel>
          <Field label="Nom complet" icon={User}>
            <input
              required
              value={form.nom}
              onChange={set("nom")}
              className="input"
              placeholder="Votre nom"
            />
          </Field>
          <Field label="Telephone" icon={Phone}>
            <input
              required
              type="tel"
              value={form.tel}
              onChange={set("tel")}
              className="input"
              placeholder="+226 ..."
            />
          </Field>

          <SectionLabel>Demande</SectionLabel>
          <Field label="Etablissement" icon={Building2}>
            <select
              value={form.salonId}
              onChange={set("salonId")}
              className="input"
            >
              {SALONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.area}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Service souhaite" icon={Sparkles}>
            <select
              value={form.service}
              onChange={set("service")}
              className="input"
            >
              {services.map((s) => (
                <option key={s.id}>{s.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Produit / Equipement (optionnel)" icon={ShoppingBag}>
            <select
              value={form.produit}
              onChange={set("produit")}
              className="input"
            >
              <option value="aucun">Aucun</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                  {p.price ? ` — ${formatFCFA(p.price)}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date souhaitee" icon={Calendar}>
            <input
              required
              type="date"
              value={form.date}
              onChange={set("date")}
              className="input"
            />
          </Field>
          <Field label="Message" icon={MessageSquare}>
            <textarea
              value={form.message}
              onChange={set("message")}
              rows={3}
              className="input resize-none"
              placeholder="Precisez votre demande..."
            />
          </Field>
          <GlassButton
            type="submit"
            variant="whatsapp"
            size="lg"
            full
            className="mt-2"
          >
            <WhatsAppIcon
              className="h-5 w-5"
              style={{ color: "#25D366" }}
            />
            <span>Envoyer via WhatsApp</span>
          </GlassButton>
        </form>
      </motion.div>

      {/* Carte */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display mt-7 mb-3 text-xl font-semibold"
      >
        Nous trouver
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="liquid-glass rounded-full p-1 flex gap-1"
      >
        {SALONS.map((s) => (
          <GlassButton
            key={s.id}
            type="button"
            onClick={() => setMapSalon(s.id)}
            variant={mapSalon === s.id ? "primary" : "light"}
            size="sm"
            className="flex-1 whitespace-nowrap"
          >
            {s.name}
          </GlassButton>
        ))}
      </motion.div>
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
          Obtenir l'itineraire
        </GlassButton>
      </GlassCard>

      {/* Reseaux */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-display mt-7 mb-3 text-xl font-semibold"
      >
        Suivez-nous
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-4 gap-2"
      >
        {([
          { icon: Facebook, label: "Facebook", href: SOCIALS.facebook, tone: "blue" as const },
          { icon: Instagram, label: "Instagram", href: SOCIALS.instagram, tone: "pink" as const },
          { icon: TikTokIcon, label: "TikTok", href: SOCIALS.tiktok, tone: "rose" as const },
          { icon: Globe, label: "Site web", href: SOCIALS.website, tone: "gold" as const },
        ] as const).map(({ icon: Icon, label, href, tone }) => (
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
      </motion.div>

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
        {Icon && (
          <Icon className="h-3 w-3" style={{ color: "var(--gold-deep)" }} />
        )}
        {label}
      </span>
      {children}
    </label>
  );
}

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.3a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.2a3 3 0 1 0 2.1 2.9V3h3z"
        fill="currentColor"
      />
    </svg>
  );
}