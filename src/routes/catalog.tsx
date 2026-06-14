import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Frame } from "@/components/Frame";
import { CATALOG } from "@/lib/salon-data";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalogue — Parfait.Design/Desmohair" },
      { name: "description", content: "Découvrez nos créations : coiffures, perruques, mariage, produits, équipements et promotions." },
      { property: "og:title", content: "Catalogue — Parfait.Design/Desmohair" },
      { property: "og:description", content: "Toutes nos collections en un coup d'œil." },
    ],
  }),
  component: CatalogLayout,
});

function CatalogLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/catalog") return <Outlet />;
  return (
    <AppShell title="Catalogue" subtitle="Explorez nos collections luxe">
      <div className="mt-5 grid grid-cols-2 gap-3">
        {CATALOG.map((c, i) => {
          const inner = (
            <Frame tone={c.tone} rounded="rounded-[28px]" className="aspect-[4/5] w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              {c.comingSoon && (
                <span className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black backdrop-blur">
                  Bientôt
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-xl font-semibold text-white drop-shadow-lg">{c.name}</p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--gold-soft)] drop-shadow">{c.countLabel}</p>
              </div>
            </Frame>
          );
          return c.comingSoon ? (
            <div key={c.slug} className="opacity-90 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>{inner}</div>
          ) : (
            <Link key={c.slug} to="/catalog/$category" params={{ category: c.slug }} className="block animate-fade-up active:scale-[0.98] transition" style={{ animationDelay: `${i * 40}ms` }}>
              {inner}
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}