import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { catalogService } from "@/backend/services";
import type { CatalogItem } from "@/backend/models";
import { useEffect, useState, useMemo } from "react";

// Import preview images for fallback
import coupe1 from "@/assets/catalog/Coupe_1.webp";
import m1_1 from "@/assets/catalog/new/M1-1.webp";
import p1_1 from "@/assets/catalog/new/P_1-1.webp";
import e1_1 from "@/assets/catalog/new/E_1-1.webp";
import promo1 from "@/assets/catalog/promo/promo_1.webp";
import pb1_1 from "@/assets/catalog/new/PB_1-1.webp";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalogue — Parfait.Design/Desmohair" },
      {
        name: "description",
        content:
          "Découvrez nos créations : coiffures, perruques, mariage, produits, équipements et promotions.",
      },
      { property: "og:title", content: "Catalogue — Parfait.Design/Desmohair" },
      {
        property: "og:description",
        content: "Toutes nos collections en un coup d'œil.",
      },
    ],
  }),
  component: CatalogLayout,
});

function CatalogLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map categories to their fallback preview images
  const categoryImagesFallback: Record<string, string> = {
    coiffure: coupe1,
    perruques: pb1_1,
    mariage: m1_1,
    produits: p1_1,
    equipement: e1_1,
    promotion: promo1,
  };

  // Charger les items du catalogue
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await catalogService.getAvailable();
        setItems(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du catalogue"
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // Grouper les items par catégorie et extraire les catégories
  const categories = useMemo(() => {
    if (pathname !== "/catalog") return [];
    const grouped = new Map<string, CatalogItem[]>();

    for (const item of items) {
      if (!grouped.has(item.category)) {
        grouped.set(item.category, []);
      }
      grouped.get(item.category)!.push(item);
    }

    return Array.from(grouped.entries()).map(([category, categoryItems]) => ({
      slug: category
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
      name: category.charAt(0).toUpperCase() + category.slice(1),
      countLabel: `${categoryItems.length} article${categoryItems.length > 1 ? "s" : ""}`,
      previewImage:
        categoryItems.find((i) => i.image_url)?.image_url ||
        categoryImagesFallback[category.toLowerCase()] ||
        categoryImagesFallback.coiffure,
    }));
  }, [items]);

  return (
    <AppShell title="Catalogue" subtitle="Explorez nos collections luxe">
      {/* Message d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {pathname !== "/catalog" ? (
        <Outlet />
      ) : loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">
            Chargement du catalogue...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 py-12"
        >
          <p className="text-sm text-muted-foreground">
            Aucune catégorie disponible.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-5 grid grid-cols-2 gap-3"
        >
          {categories.map((c, i) => {
            const inner = (
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--gold-soft)]/20 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/10 hover:-translate-y-1 group">
                <Frame
                  variant="plain"
                  rounded="rounded-[28px]"
                  className="aspect-[4/5] w-full"
                  image={c.previewImage}
                  alt={c.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className="absolute inset-x-2 bottom-2 rounded-2xl p-2.5 backdrop-blur-md transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      background: "oklch(1 0 0 / 0.85)",
                      border: "1px solid oklch(1 0 0 / 0.95)",
                    }}
                  >
                    <p className="font-display text-sm font-semibold leading-tight text-neutral-900">
                      {c.name}
                    </p>
                    <p
                      className="mt-0.5 text-[9px] font-medium"
                      style={{ color: "var(--gold-deep)" }}
                    >
                      {c.countLabel}
                    </p>
                  </div>
                </Frame>
              </div>
            );
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link
                  to="/catalog/$category"
                  params={{ category: c.slug }}
                  search={{} as any}
                  preload="intent"
                  className="block active:scale-[0.98] transition"
                >
                  {inner}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AppShell>
  );
}