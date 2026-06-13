import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GALLERY, GALLERY_CATEGORIES } from "@/lib/salon-data";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — Parfait Design Des Mohair" },
      { name: "description", content: "Nos réalisations : mariages, perruques, tresses, coloration." },
      { property: "og:title", content: "Galerie — Parfait Design Des Mohair" },
      { property: "og:description", content: "Inspirations et créations de notre salon." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [cat, setCat] = useState("Tout");
  const [open, setOpen] = useState<typeof GALLERY[number] | null>(null);
  const list = GALLERY.filter((g) => cat === "Tout" || g.cat === cat);
  const col1 = list.filter((_, i) => i % 2 === 0);
  const col2 = list.filter((_, i) => i % 2 === 1);

  return (
    <AppShell title="Galerie" subtitle="Nos plus belles réalisations">
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
        {GALLERY_CATEGORIES.map((c) => (
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
        {[col1, col2].map((col, k) => (
          <div key={k} className="flex flex-col gap-3">
            {col.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setOpen(g)}
                className="relative block w-full active:scale-[0.98] transition animate-fade-up"
                style={{ height: g.h, animationDelay: `${i * 60}ms` }}
              >
                <Frame tone={g.tone} rounded="rounded-3xl" className="h-full w-full">
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-left text-xs font-semibold text-white">
                    {g.cat}
                  </span>
                </Frame>
              </button>
            ))}
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl p-6 animate-fade-up" onClick={() => setOpen(null)}>
          <button className="glass absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full text-white" onClick={() => setOpen(null)}>
            <X className="h-4 w-4" />
          </button>
          <Frame tone={open.tone} rounded="rounded-[32px]" className="aspect-[3/4] w-full max-w-xs" />
          <p className="mt-4 font-display text-xl font-semibold text-white">{open.cat}</p>
        </div>
      )}
    </AppShell>
  );
}