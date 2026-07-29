import { C as promo_1_default, D as Coupe_1_default, T as M1_1_default, a as AppShell, b as P_1_1_default, x as E_1_1_default, y as PB_1_1_default } from "./exceptions-CejCju6t.js";
import { t as catalogService } from "./catalog.service-JKK9H3e4.js";
import { t as Frame } from "./Frame-IJntKHyZ.js";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
//#region src/routes/catalog.tsx?tsr-split=component
function CatalogLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const categoryImagesFallback = {
		coiffure: Coupe_1_default,
		perruques: PB_1_1_default,
		mariage: M1_1_default,
		produits: P_1_1_default,
		equipement: E_1_1_default,
		promotion: promo_1_default
	};
	useEffect(() => {
		const loadCatalog = async () => {
			try {
				setLoading(true);
				setError(null);
				setItems(await catalogService.getAvailable());
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur lors du chargement du catalogue");
				setItems([]);
			} finally {
				setLoading(false);
			}
		};
		loadCatalog();
	}, []);
	const categories = useMemo(() => {
		if (pathname !== "/catalog") return [];
		const grouped = /* @__PURE__ */ new Map();
		for (const item of items) {
			if (!grouped.has(item.category)) grouped.set(item.category, []);
			grouped.get(item.category).push(item);
		}
		return Array.from(grouped.entries()).map(([category, categoryItems]) => ({
			slug: category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
			name: category.charAt(0).toUpperCase() + category.slice(1),
			countLabel: `${categoryItems.length} article${categoryItems.length > 1 ? "s" : ""}`,
			previewImage: categoryItems.find((i) => i.image_url)?.image_url || categoryImagesFallback[category.toLowerCase()] || categoryImagesFallback.coiffure
		}));
	}, [items]);
	return /* @__PURE__ */ jsxs(AppShell, {
		title: "Catalogue",
		subtitle: "Explorez nos collections luxe",
		children: [error && /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: -10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm",
			children: ["⚠️ ", error]
		}), pathname !== "/catalog" ? /* @__PURE__ */ jsx(Outlet, {}) : loading ? /* @__PURE__ */ jsxs("div", {
			className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
			children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Chargement du catalogue..."
			})]
		}) : categories.length === 0 ? /* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Aucune catégorie disponible."
			})
		}) : /* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { duration: .3 },
			className: "mt-5 grid grid-cols-2 gap-3",
			children: categories.map((c, i) => {
				const inner = /* @__PURE__ */ jsx("div", {
					className: "relative overflow-hidden rounded-[28px] border border-[var(--gold-soft)]/20 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/10 hover:-translate-y-1 group",
					children: /* @__PURE__ */ jsxs(Frame, {
						variant: "plain",
						rounded: "rounded-[28px]",
						className: "aspect-[4/5] w-full",
						image: c.previewImage,
						alt: c.name,
						children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), /* @__PURE__ */ jsxs("div", {
							className: "absolute inset-x-2 bottom-2 rounded-2xl p-2.5 backdrop-blur-md transition-all duration-300 group-hover:scale-[1.02]",
							style: {
								background: "oklch(1 0 0 / 0.85)",
								border: "1px solid oklch(1 0 0 / 0.95)"
							},
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-sm font-semibold leading-tight text-neutral-900",
								children: c.name
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-[9px] font-medium",
								style: { color: "var(--gold-deep)" },
								children: c.countLabel
							})]
						})]
					})
				});
				return /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						delay: i * .04,
						duration: .35
					},
					children: /* @__PURE__ */ jsx(Link, {
						to: "/catalog/$category",
						params: { category: c.slug },
						search: {},
						preload: "intent",
						className: "block active:scale-[0.98] transition",
						children: inner
					})
				}, c.slug);
			})
		})]
	});
}
//#endregion
export { CatalogLayout as component };
