import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, X, Image as ImageIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { GlassButton } from "@/components/GlassButton";
import { galleryService, authService } from "@/backend/services";
import type { GalleryItem } from "@/backend/models";
import { useEffect, useState, useMemo } from "react";
import { asFavoriteItem, getFavorites, toggleFavorite } from "@/lib/favorites";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — Parfait.Design/Desmohair" },
      {
        name: "description",
        content:
          "Nos realisations : mariages, perruques, tresses, coloration.",
      },
      { property: "og:title", content: "Galerie — Parfait.Design/Desmohair" },
      {
        property: "og:description",
        content: "Inspirations et creations de notre salon.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState("Tout");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await galleryService.getAll();
        setItems(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de la galerie"
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((g) => g.category)));
    return ["Tout", ...unique];
  }, [items]);

  const list = useMemo(() => {
    return items.filter((g) => cat === "Tout" || g.category === cat);
  }, [items, cat]);

  const col1 = useMemo(() => list.filter((_, i) => i % 2 === 0), [list]);
  const col2 = useMemo(() => list.filter((_, i) => i % 2 === 1), [list]);

  const handleToggleFavorite = async (item: GalleryItem) => {
    // Vérifier si l'utilisateur est connecté
    const user = await authService.getCurrentUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    const nextItems = toggleFavorite(asFavoriteItem(item, "gallery"));
    setFavorites(nextItems);
  };

  return (
    <AppShell title="Galerie" subtitle="Nos plus belles realisations">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-2xl border border-[var(--gold-soft)]/50 bg-[var(--gold-light)]/50 p-4 text-sm text-[var(--gold-deep)] backdrop-blur-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5"
        >
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
        </motion.div>
      )}

      {/* Galerie */}
      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">
            Chargement de la galerie...
          </p>
        </div>
      ) : list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 py-12"
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucune image disponible pour cette categorie.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-5 grid grid-cols-2 gap-3"
        >
          {[col1, col2].map((col, k) => (
            <div key={k} className="flex flex-col gap-3">
              {col.map((g, i) => {
                const isFavorite = favorites.some(
                  (f) => f.kind === "gallery" && f.id === g.id
                );
                return (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                  >
                    <button
                      onClick={() => setOpen(g)}
                      className="relative block w-full active:scale-[0.98] transition overflow-hidden rounded-3xl group"
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
                          style={{
                            background: "oklch(1 0 0 / 0.85)",
                            color: "var(--gold-deep)",
                            border: "1px solid oklch(1 0 0 / 0.95)",
                          }}
                        >
                          {g.category}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(g);
                          }}
                          className={`absolute top-2 right-2 rounded-full p-1.5 transition ${
                            isFavorite
                              ? "bg-[var(--gold-deep)]/80 text-white"
                              : "bg-white/60 text-muted-foreground opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Heart className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                      </Frame>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl p-6"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="glass absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full text-white bg-[var(--gold-deep)]/80"
                onClick={() => setOpen(null)}
              >
                <X className="h-4 w-4" />
              </button>
              <Frame
                variant="plain"
                rounded="rounded-[32px]"
                className="aspect-[3/4] w-full"
                image={open.image_url}
                alt={open.title}
              />
              <div className="mt-4 rounded-[24px] border border-white/20 bg-white/10 p-4 text-center backdrop-blur">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-xl font-semibold text-white">
                    {open.title}
                  </p>
                  <button
                    type="button"
                    className={`rounded-full border p-2 text-sm font-semibold transition ${
                      favorites.some(
                        (f) => f.kind === "gallery" && f.id === open.id
                      )
                        ? "border-[var(--gold)] bg-[var(--gold-deep)]/20 text-[var(--gold)]"
                        : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleToggleFavorite(open)}
                  >
                    <Heart className="h-4 w-4" fill={favorites.some((f) => f.kind === "gallery" && f.id === open.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                {open.description && (
                  <p className="mt-2 text-sm text-white/80">
                    {open.description}
                  </p>
                )}
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  {open.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}