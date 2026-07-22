import { createFileRoute } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { galleryService } from "@/backend/services";
import type { GalleryItem } from "@/backend/models";
import { useEffect, useState, useMemo } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";

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
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState("Tout");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());

  // Charger les données de la galerie
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await galleryService.getAll();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la galerie");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // Extraire les catégories uniques + "Tout"
  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((g) => g.category)));
    return ["Tout", ...unique];
  }, [items]);

  // Filtrer les éléments selon la catégorie sélectionnée
  const list = useMemo(() => {
    return items.filter((g) => cat === "Tout" || g.category === cat);
  }, [items, cat]);

  // Diviser en deux colonnes
  const col1 = useMemo(() => list.filter((_, i) => i % 2 === 0), [list]);
  const col2 = useMemo(() => list.filter((_, i) => i % 2 === 1), [list]);

  const handleToggleFavorite = (item: GalleryItem) => {
    const nextItems = toggleFavorite(asFavoriteItem(item, "gallery"));
    setFavorites(nextItems);
  };

  return (
    <AppShell title="Galerie" subtitle="Nos plus belles réalisations">
      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Catégories */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
        {categories.map((c) => (
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

      {/* Galerie - Affichage */}
      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current/20 border-t-current" />
          <p className="text-sm text-muted-foreground">Chargement de la galerie...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-sm text-muted-foreground">Aucune image disponible pour cette catégorie.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[col1, col2].map((col, k) => (
            <div key={k} className="flex flex-col gap-3">
              {col.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setOpen(g)}
                  className="relative block w-full active:scale-[0.98] transition overflow-hidden rounded-3xl"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <Frame 
                    variant="plain" 
                    rounded="rounded-3xl" 
                    className="h-full w-full aspect-square" 
                    image={g.image_url} 
                    alt={g.title}
                  >
                    <span
                      className="absolute left-2 bottom-2 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md capitalize"
                      style={{ background: "oklch(1 0 0 / 0.85)", color: "oklch(0.5 0.11 80)", border: "1px solid oklch(1 0 0 / 0.95)" }}
                    >
                      {g.category}
                    </span>
                  </Frame>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Modal - Image agrandie */}
      {open && (
        <div 
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl p-6 animate-fade-up" 
          onClick={() => setOpen(null)}
        >
          <button
            className="glass absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full text-white"
            onClick={() => setOpen(null)}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-full max-w-xs">
            <Frame
              variant="plain"
              rounded="rounded-[32px]"
              className="aspect-[3/4] w-full"
              image={open.image_url}
              alt={open.title}
            />
            <div className="mt-4 rounded-[24px] border border-white/20 bg-white/10 p-4 text-center backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-xl font-semibold text-white">{open.title}</p>
                <button
                  type="button"
                  className={`rounded-full border px-3 py-2 text-sm font-semibold ${favorites.some((favorite) => favorite.kind === "gallery" && favorite.id === open.id) ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-white/30 bg-white/10 text-white"}`}
                  onClick={() => handleToggleFavorite(open)}
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              {open.description && (
                <p className="mt-2 text-sm text-white/80">{open.description}</p>
              )}
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">{open.category}</p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}