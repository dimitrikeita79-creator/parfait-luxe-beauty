import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PRODUCTS, PRODUCT_CATEGORIES, formatFCFA, waLink } from "@/lib/salon-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Produits — Parfait Design Des Mohair" },
      { name: "description", content: "Perruques naturelles, lace front, mèches brésiliennes et produits capillaires." },
      { property: "og:title", content: "Produits — Parfait Design Des Mohair" },
      { property: "og:description", content: "Notre catalogue luxe de perruques et mèches." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [cat, setCat] = useState("Tout");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  const list = useMemo(
    () =>
      PRODUCTS.filter((p) => cat === "Tout" || p.category === cat).filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [cat, q]
  );

  return (
    <AppShell title="Boutique" subtitle="Perruques, mèches et soins capillaires">
      <div className="mt-4 glass flex items-center gap-2 rounded-full px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un produit…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
              cat === c ? "bg-gold text-[oklch(0.15_0.01_60)] shadow-luxe" : "glass text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {list.map((p, i) => (
          <div key={p.id} className="glass animate-fade-up rounded-[24px] p-3" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="relative grid h-32 w-full place-items-center rounded-2xl bg-gradient-to-br from-amber-200/60 via-rose-200/40 to-yellow-100/40 text-5xl">
              {p.emoji}
              {p.badge && (
                <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.15_0.01_60)]">
                  {p.badge}
                </span>
              )}
              <button
                onClick={() => setFavs((f) => ({ ...f, [p.id]: !f[p.id] }))}
                className="glass absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full"
                aria-label="Favori"
              >
                <Heart className={`h-3.5 w-3.5 ${favs[p.id] ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
              </button>
            </div>
            <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
            <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">{p.desc}</p>
            <p className="mt-1.5 text-sm font-bold text-gold">{formatFCFA(p.price)}</p>
            <a
              href={waLink(`Bonjour, je souhaite commander: ${p.name} (${formatFCFA(p.price)}).`)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full bg-[#25D366] py-2 text-[11px] font-semibold text-white shadow-soft active:scale-[0.98] transition"
            >
              <MessageCircle className="h-3 w-3" /> Commander
            </a>
          </div>
        ))}
        {list.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">Aucun produit trouvé.</p>
        )}
      </div>
    </AppShell>
  );
}