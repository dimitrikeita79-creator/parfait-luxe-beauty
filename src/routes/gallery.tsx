import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { GALLERY, GALLERY_CATEGORIES } from "@/lib/salon-data";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — Parfait.Design/Desmohair" },
      { name: "description", content: "Nos réalisations : mariages, perruques, tresses, coloration." },
      { property: "og:title", content: "Galerie — Parfait.Design/Desmohair" },
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
          <GlassButton
            key={c}
            onClick={() => setCat(c)}
            variant={cat === c ? "primary" : "light"}
            size="sm"
            className="whitespace-nowrap"
          >
            {c}
          </GlassButton>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {[col1, col2].map((col, k) => (
          <div key={k} className="flex flex-col gap-3">
            {col.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setOpen(g)}
                className="relative block w-full active:scale-[0.98] transition"
                style={{ height: g.h, animationDelay: `${i * 30}ms` }}
              >
                <Frame variant="plain" rounded="rounded-3xl" className="h-full w-full" image={g.image} alt={g.cat}>
                  <span
                    className="absolute left-2 bottom-2 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                    style={{ background: "oklch(1 0 0 / 0.85)", color: "oklch(0.5 0.11 80)", border: "1px solid oklch(1 0 0 / 0.95)" }}
                  >
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
          <Frame variant="plain" rounded="rounded-[32px]" className="aspect-[3/4] w-full max-w-xs" image={open.image} alt={open.cat} />
          <p className="mt-4 font-display text-xl font-semibold text-white">{open.cat}</p>
        </div>
      )}
    </AppShell>
  );
}