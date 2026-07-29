import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { a as AppShell } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as galleryService } from "./gallery.service-H0Kdh8VI.js";
import { i as toggleFavorite, n as getFavorites, t as asFavoriteItem } from "./favorites-Cd57hRD6.js";
import { t as Frame } from "./Frame-IJntKHyZ.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Image, X } from "lucide-react";
//#region src/routes/gallery.tsx?tsr-split=component
function GalleryPage() {
	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [cat, setCat] = useState("Tout");
	const [open, setOpen] = useState(null);
	const [favorites, setFavorites] = useState(getFavorites());
	useEffect(() => {
		const loadGallery = async () => {
			try {
				setLoading(true);
				setError(null);
				setItems(await galleryService.getAll());
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur lors du chargement de la galerie");
				setItems([]);
			} finally {
				setLoading(false);
			}
		};
		loadGallery();
	}, []);
	const categories = useMemo(() => {
		return ["Tout", ...Array.from(new Set(items.map((g) => g.category)))];
	}, [items]);
	const list = useMemo(() => {
		return items.filter((g) => cat === "Tout" || g.category === cat);
	}, [items, cat]);
	const col1 = useMemo(() => list.filter((_, i) => i % 2 === 0), [list]);
	const col2 = useMemo(() => list.filter((_, i) => i % 2 === 1), [list]);
	const handleToggleFavorite = async (item) => {
		if (!await authService.getCurrentUser()) {
			navigate({ to: "/login" });
			return;
		}
		setFavorites(toggleFavorite(asFavoriteItem(item, "gallery")));
	};
	return /* @__PURE__ */ jsxs(AppShell, {
		title: "Galerie",
		subtitle: "Nos plus belles realisations",
		children: [
			/* @__PURE__ */ jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -10
				},
				className: "mt-4 rounded-2xl border border-[var(--gold-soft)]/50 bg-[var(--gold-light)]/50 p-4 text-sm text-[var(--gold-deep)] backdrop-blur-sm",
				children: ["⚠️ ", error]
			}) }),
			!loading && /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .05 },
				className: "mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5",
				children: categories.map((c) => /* @__PURE__ */ jsx(GlassButton, {
					onClick: () => setCat(c),
					variant: cat === c ? "primary" : "light",
					size: "sm",
					className: "whitespace-nowrap",
					children: c
				}, c))
			}),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
				children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Chargement de la galerie..."
				})]
			}) : list.length === 0 ? /* @__PURE__ */ jsxs(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
				children: [/* @__PURE__ */ jsx(Image, { className: "h-10 w-10 text-muted-foreground/40" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Aucune image disponible pour cette categorie."
				})]
			}) : /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { duration: .3 },
				className: "mt-5 grid grid-cols-2 gap-3",
				children: [col1, col2].map((col, k) => /* @__PURE__ */ jsx("div", {
					className: "flex flex-col gap-3",
					children: col.map((g, i) => {
						const isFavorite = favorites.some((f) => f.kind === "gallery" && f.id === g.id);
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
								delay: i * .03,
								duration: .3
							},
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => setOpen(g),
								className: "relative block w-full active:scale-[0.98] transition overflow-hidden rounded-3xl group",
								children: /* @__PURE__ */ jsxs(Frame, {
									variant: "plain",
									rounded: "rounded-3xl",
									className: "h-full w-full aspect-square",
									image: g.image_url,
									alt: g.title,
									children: [/* @__PURE__ */ jsx("span", {
										className: "absolute left-2 bottom-2 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md capitalize",
										style: {
											background: "oklch(1 0 0 / 0.85)",
											color: "var(--gold-deep)",
											border: "1px solid oklch(1 0 0 / 0.95)"
										},
										children: g.category
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											handleToggleFavorite(g);
										},
										className: `absolute top-2 right-2 rounded-full p-1.5 transition ${isFavorite ? "bg-[var(--gold-deep)]/80 text-white" : "bg-white/60 text-muted-foreground opacity-0 group-hover:opacity-100"}`,
										children: /* @__PURE__ */ jsx(Heart, {
											className: "h-3.5 w-3.5",
											fill: isFavorite ? "currentColor" : "none"
										})
									})]
								})
							})
						}, g.id);
					})
				}, k))
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl p-6",
				onClick: () => setOpen(null),
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						scale: .95
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					exit: {
						opacity: 0,
						scale: .95
					},
					transition: {
						type: "spring",
						damping: 25,
						stiffness: 300
					},
					className: "w-full max-w-xs",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("button", {
							className: "glass absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full text-white bg-[var(--gold-deep)]/80",
							onClick: () => setOpen(null),
							children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx(Frame, {
							variant: "plain",
							rounded: "rounded-[32px]",
							className: "aspect-[3/4] w-full",
							image: open.image_url,
							alt: open.title
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 rounded-[24px] border border-white/20 bg-white/10 p-4 text-center backdrop-blur",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-display text-xl font-semibold text-white",
										children: open.title
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										className: `rounded-full border p-2 text-sm font-semibold transition ${favorites.some((f) => f.kind === "gallery" && f.id === open.id) ? "border-[var(--gold)] bg-[var(--gold-deep)]/20 text-[var(--gold)]" : "border-white/30 bg-white/10 text-white hover:bg-white/20"}`,
										onClick: () => handleToggleFavorite(open),
										children: /* @__PURE__ */ jsx(Heart, {
											className: "h-4 w-4",
											fill: favorites.some((f) => f.kind === "gallery" && f.id === open.id) ? "currentColor" : "none"
										})
									})]
								}),
								open.description && /* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-white/80",
									children: open.description
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-xs uppercase tracking-[0.2em] text-white/60",
									children: open.category
								})
							]
						})
					]
				})
			}) })
		]
	});
}
//#endregion
export { GalleryPage as component };
