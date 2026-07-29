import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { t as Route } from "./catalog._category-CAZr3nnN.js";
import { _ as waLinkFor, c as WhatsAppIcon, f as SALONS, h as pickSalonFor } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as catalogService } from "./catalog.service-JKK9H3e4.js";
import { t as salonService } from "./salon.service-Dxw5GUBm.js";
import { t as WhatsAppSalonModal } from "./WhatsAppSalonModal-hUfbzaoi.js";
import { i as toggleFavorite, n as getFavorites, t as asFavoriteItem } from "./favorites-Cd57hRD6.js";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, Eye, Heart, ShoppingCart, X } from "lucide-react";
//#region src/routes/catalog.$category.tsx?tsr-split=component
var formatFCFA = (price) => {
	return new Intl.NumberFormat("fr-BF", {
		style: "currency",
		currency: "XOF",
		minimumFractionDigits: 0
	}).format(price);
};
function CategoryPage() {
	const { category } = Route.useParams();
	const { highlight } = useSearch({ from: "/catalog/$category" });
	const [items, setItems] = useState([]);
	const [salonInfo, setSalonInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [favorites, setFavorites] = useState(getFavorites());
	const [open, setOpen] = useState(null);
	const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [userName, setUserName] = useState(null);
	const navigate = useNavigate();
	const refs = useRef({});
	category.charAt(0).toUpperCase() + category.slice(1);
	const salon = SALONS.find((s) => s.tags.some((tag) => tag === category)) || pickSalonFor(category);
	useEffect(() => {
		const loadCategory = async () => {
			try {
				setLoading(true);
				setError(null);
				setItems(await catalogService.getByCategory(category));
				const user = await authService.getCurrentUser();
				if (user) setUserName(user.full_name || user.email);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur lors du chargement de la catégorie");
				setItems([]);
			} finally {
				setLoading(false);
			}
		};
		loadCategory();
	}, [category]);
	useEffect(() => {
		const loadSalonInfo = async () => {
			try {
				setSalonInfo(await salonService.getInfo());
			} catch {}
		};
		loadSalonInfo();
	}, []);
	const handleToggleFavorite = async (item) => {
		if (!await authService.getCurrentUser()) {
			navigate({ to: "/login" });
			return;
		}
		setFavorites(toggleFavorite(asFavoriteItem(item, "catalog")));
	};
	const handleWhatsAppClick = (item) => {
		setSelectedItem(item);
		setWhatsappModalOpen(true);
	};
	useEffect(() => {
		if (!highlight) return;
		const el = refs.current[highlight];
		if (el) el.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}, [highlight]);
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "px-4 pb-32",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: "/catalog",
			className: "glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium",
			children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3 w-3" }), " Catalogue"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
			children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Chargement des articles..."
			})]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 pb-32",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/catalog",
				className: "glass mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium",
				children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3 w-3" }), " Catalogue"]
			}),
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
				className: "mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm",
				children: ["⚠️ ", error]
			}) }),
			items.length === 0 ? /* @__PURE__ */ jsxs(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				className: "glass-strong mt-8 rounded-[28px] p-8 text-center",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-display text-2xl font-semibold text-gold",
						children: "Aucun article"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Aucun article disponible dans cette catégorie pour le moment."
					}),
					/* @__PURE__ */ jsx(GlassButton, {
						as: Link,
						to: "/catalog",
						variant: "whatsapp",
						size: "md",
						className: "mt-5",
						children: "Retour au catalogue"
					})
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(motion.p, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .1 },
				className: "mt-3 text-[11px] text-muted-foreground",
				children: [
					"Commandes traitées par",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-[var(--gold-deep)]",
						children: salon.name
					}),
					" ·",
					" ",
					salon.area
				]
			}), /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { duration: .3 },
				className: "mt-3 grid grid-cols-2 gap-3",
				children: items.map((p, i) => {
					const isFavorite = favorites.some((f) => f.kind === "catalog" && f.id === p.id);
					return /* @__PURE__ */ jsxs(motion.div, {
						ref: (el) => {
							refs.current[p.id] = el;
						},
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
						className: `liquid-glass rounded-[24px] p-3 transition-all duration-300 ${highlight === p.id ? "ring-2 ring-[var(--gold)] scale-[1.02]" : ""}`,
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setOpen(p),
								className: "w-full text-left",
								children: [
									p.image_url && /* @__PURE__ */ jsx("div", {
										className: "overflow-hidden rounded-2xl ring-1 ring-black/5",
										children: /* @__PURE__ */ jsx("img", {
											src: p.image_url,
											alt: p.title,
											className: "aspect-[4/5] w-full object-cover transition hover:scale-[1.03]",
											loading: "lazy"
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-xs font-semibold leading-tight line-clamp-2",
										children: p.title
									}),
									p.description && /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-[10px] text-muted-foreground line-clamp-1",
										children: p.description
									}),
									p.price > 0 && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 flex items-baseline gap-1.5",
										children: /* @__PURE__ */ jsx("span", {
											className: "text-sm font-bold text-gold",
											children: formatFCFA(p.price)
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs(GlassButton, {
								type: "button",
								onClick: () => handleWhatsAppClick(p),
								variant: "whatsapp",
								size: "sm",
								full: true,
								className: "mt-2",
								children: [/* @__PURE__ */ jsx(WhatsAppIcon, {
									className: "h-3 w-3",
									style: { color: "#25D366" }
								}), " Commander"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpen(p),
									className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[var(--gold-deep)] transition",
									children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), " Voir détails"]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: `rounded-full border px-2.5 py-1.5 text-sm transition ${isFavorite ? "border-rose-400 bg-rose-500/10 text-rose-600" : "border-stone-300 text-stone-600 hover:border-rose-300 hover:text-rose-500"}`,
									onClick: () => handleToggleFavorite(p),
									children: /* @__PURE__ */ jsx(Heart, { className: "h-3.5 w-3.5" })
								})]
							})
						]
					}, p.id);
				})
			})] }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm",
				onClick: () => setOpen(null),
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						scale: .95,
						y: 20
					},
					animate: {
						opacity: 1,
						scale: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95,
						y: 20
					},
					transition: {
						type: "spring",
						damping: 25,
						stiffness: 300
					},
					onClick: (e) => e.stopPropagation(),
					className: "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-stone-200 bg-white p-6 shadow-lg",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "flex-1 pr-2 font-display text-2xl font-semibold",
								children: open.title
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setOpen(null),
								className: "rounded-full p-2 hover:bg-stone-100 transition",
								children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
							})]
						}),
						open.image_url && /* @__PURE__ */ jsx("div", {
							className: "mt-4 overflow-hidden rounded-[32px] border border-stone-200 bg-stone-100",
							children: /* @__PURE__ */ jsx("img", {
								className: "aspect-[4/3] w-full object-cover",
								src: open.image_url,
								alt: open.title,
								loading: "lazy"
							})
						}),
						open.description && /* @__PURE__ */ jsx("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: open.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-stone-200 bg-stone-50 p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
										children: "Catégorie"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm font-semibold",
										children: open.category
									})]
								}),
								open.price > 0 && /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-stone-200 bg-stone-50 p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
										children: "Prix"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm font-semibold text-gold",
										children: formatFCFA(open.price)
									})]
								}),
								open.code && /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-stone-200 bg-stone-50 p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
										children: "Code"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm font-semibold",
										children: open.code
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ jsxs(GlassButton, {
								as: "a",
								href: waLinkFor(salon.id, `Bonjour ${salon.name}, je souhaite commander : ${open.title}${open.price ? ` — ${formatFCFA(open.price)}` : ""}.`),
								target: "_blank",
								rel: "noreferrer",
								variant: "whatsapp",
								size: "md",
								full: true,
								children: [/* @__PURE__ */ jsx(ShoppingCart, {
									className: "h-4 w-4",
									style: { color: "#25D366" }
								}), " Commander"]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									handleToggleFavorite(open);
									setOpen(null);
								},
								className: "rounded-full border border-stone-200 p-3 transition hover:bg-stone-50",
								title: "Ajouter aux favoris",
								children: /* @__PURE__ */ jsx(Heart, {
									className: "h-5 w-5",
									fill: favorites.some((f) => f.id === open.id && f.kind === "catalog") ? "currentColor" : "none"
								})
							})]
						})
					]
				})
			}) }),
			/* @__PURE__ */ jsx(WhatsAppSalonModal, {
				isOpen: whatsappModalOpen,
				onClose: () => setWhatsappModalOpen(false),
				itemName: selectedItem?.title || "",
				itemImage: selectedItem?.image_url,
				itemPrice: selectedItem?.price ? formatFCFA(selectedItem.price) : void 0,
				itemLink: selectedItem ? `${window.location.origin}/catalog/${category}?highlight=${selectedItem.id}` : void 0,
				itemCategory: category,
				userName: userName || void 0
			})
		]
	});
}
//#endregion
export { CategoryPage as component };
