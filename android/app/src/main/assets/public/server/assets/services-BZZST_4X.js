import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { _ as waLinkFor, a as AppShell, c as WhatsAppIcon, f as SALONS } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as servicesService } from "./services.service-CX6ui3Je.js";
import { t as WhatsAppSalonModal } from "./WhatsAppSalonModal-hUfbzaoi.js";
import { i as toggleFavorite, n as getFavorites, t as asFavoriteItem } from "./favorites-Cd57hRD6.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Eye, Heart, Sparkles, X } from "lucide-react";
//#region src/routes/services.tsx?tsr-split=component
function ServicesPage() {
	const navigate = useNavigate();
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [active, setActive] = useState(null);
	const [favorites, setFavorites] = useState(getFavorites());
	const [open, setOpen] = useState(null);
	const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [userName, setUserName] = useState(null);
	const [salonId, setSalonId] = useState("parfait");
	useEffect(() => {
		const loadServices = async () => {
			try {
				setLoading(true);
				setError(null);
				setServices(await servicesService.getActive());
				const user = await authService.getCurrentUser();
				if (user) setUserName(user.full_name || user.email);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
				setServices([]);
			} finally {
				setLoading(false);
			}
		};
		loadServices();
	}, []);
	const categories = useMemo(() => {
		return ["Tout", ...Array.from(new Set(services.map((s) => s.category)))];
	}, [services]);
	const filteredServices = useMemo(() => {
		return services.filter((s) => !active || s.category === active);
	}, [services, active]);
	const handleToggleFavorite = async (service) => {
		if (!await authService.getCurrentUser()) {
			navigate({ to: "/login" });
			return;
		}
		setFavorites(toggleFavorite(asFavoriteItem(service, "service")));
	};
	const handleWhatsAppClick = (service) => {
		setSelectedItem(service);
		setWhatsappModalOpen(true);
	};
	return /* @__PURE__ */ jsxs(AppShell, {
		title: "Nos Services",
		subtitle: "Une prestation pensée pour vous",
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
				className: "mt-4 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm",
				children: ["⚠️ ", error]
			}) }),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .05 },
				className: "mt-4 liquid-glass rounded-full p-1 flex gap-1",
				children: SALONS.filter((s) => s.tags.includes("services")).map((s) => /* @__PURE__ */ jsx(GlassButton, {
					type: "button",
					onClick: () => setSalonId(s.id),
					variant: salonId === s.id ? "primary" : "light",
					size: "sm",
					className: "flex-1 whitespace-nowrap",
					children: /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-1",
						children: [s.name, /* @__PURE__ */ jsxs("span", {
							className: "text-[9px] opacity-70",
							children: ["· ", s.area]
						})]
					})
				}, s.id))
			}),
			!loading && /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .1 },
				className: "mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5",
				children: categories.map((t) => /* @__PURE__ */ jsx(GlassButton, {
					onClick: () => setActive(t === "Tout" ? null : t),
					variant: t === "Tout" && !active || active === t ? "primary" : "light",
					size: "sm",
					className: "whitespace-nowrap",
					children: t
				}, t))
			}),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
				children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)]/30 border-t-[var(--gold)]" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Chargement des services..."
				})]
			}) : filteredServices.length === 0 ? /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				className: "mt-8 flex flex-col items-center justify-center gap-3 py-12",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Aucun service disponible."
				})
			}) : /* @__PURE__ */ jsx("div", {
				className: "mt-5 grid grid-cols-1 gap-4",
				children: filteredServices.map((s, i) => {
					const durationDisplay = s.duration_min ? `${s.duration_min} min` : "Sur mesure";
					const isFavorite = favorites.some((f) => f.id === s.id && f.kind === "service");
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
						children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setOpen(s),
							className: "liquid-glass w-full rounded-[28px] p-5 text-left transition hover:shadow-md active:scale-[0.99]",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [s.image_url ? /* @__PURE__ */ jsx("div", {
										className: "flex h-20 w-20 shrink-0 overflow-hidden rounded-[24px] bg-stone-100 ring-1 ring-black/5",
										children: /* @__PURE__ */ jsx("img", {
											className: "h-full w-full object-cover",
											src: s.image_url,
											alt: s.title,
											loading: "lazy"
										})
									}) : /* @__PURE__ */ jsx("div", {
										className: "flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold-deep)]/20 text-xs font-semibold uppercase text-muted-foreground",
										children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6 text-[var(--gold-deep)]" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "font-display text-xl font-semibold leading-tight",
											children: s.title
										}), s.description && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm text-muted-foreground line-clamp-2",
											children: s.description
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex flex-wrap items-center gap-2 text-[11px]",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "glass inline-flex items-center gap-1 rounded-full px-2.5 py-1",
											children: [
												/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
												" ",
												durationDisplay
											]
										}),
										s.price > 0 && /* @__PURE__ */ jsxs("span", {
											className: "glass inline-flex items-center gap-1 rounded-full px-2.5 py-1",
											children: [
												"💰 ",
												s.price.toLocaleString(),
												" F CFA"
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "glass inline-flex items-center gap-1 rounded-full px-2.5 py-1",
											children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), " Voir détails"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-4 flex gap-2",
									children: [/* @__PURE__ */ jsxs(GlassButton, {
										type: "button",
										onClick: () => handleWhatsAppClick(s),
										variant: "whatsapp",
										size: "md",
										full: true,
										className: "flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30",
										children: [/* @__PURE__ */ jsx(WhatsAppIcon, {
											className: "h-3.5 w-3.5",
											style: { color: "#25D366" }
										}), " Réserver"]
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											handleToggleFavorite(s);
										},
										className: `rounded-full p-2 transition ${isFavorite ? "text-rose-600" : "text-muted-foreground hover:text-rose-400"}`,
										title: isFavorite ? "Retirer des favoris" : "Ajouter aux favoris",
										children: /* @__PURE__ */ jsx(Heart, {
											className: "h-5 w-5",
											fill: isFavorite ? "currentColor" : "none"
										})
									})]
								})
							]
						})
					}, s.id);
				})
			}),
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
					className: "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-[var(--gold-soft)]/30 bg-gradient-to-br from-white to-[var(--gold-light)] p-6 shadow-xl shadow-[var(--gold)]/10",
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
								open.duration_min > 0 && /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-stone-200 bg-stone-50 p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
										children: "Durée"
									}), /* @__PURE__ */ jsxs("p", {
										className: "mt-1 text-sm font-semibold",
										children: [open.duration_min, " minutes"]
									})]
								}),
								open.price > 0 && /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-stone-200 bg-stone-50 p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
										children: "Tarif"
									}), /* @__PURE__ */ jsxs("p", {
										className: "mt-1 text-sm font-semibold",
										children: [open.price.toLocaleString(), " F CFA"]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ jsxs(GlassButton, {
								as: "a",
								href: waLinkFor(salonId, `Bonjour, je souhaite réserver : ${open.title}.`),
								target: "_blank",
								rel: "noreferrer",
								variant: "whatsapp",
								size: "md",
								full: true,
								className: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30",
								children: [/* @__PURE__ */ jsx(WhatsAppIcon, {
									className: "h-4 w-4",
									style: { color: "#25D366" }
								}), " Réserver"]
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
									fill: favorites.some((f) => f.id === open.id && f.kind === "service") ? "currentColor" : "none"
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
				message: `Bonjour, je souhaite réserver : ${selectedItem?.title || ""}.`,
				itemLink: selectedItem ? `${window.location.origin}/services` : void 0,
				itemCategory: selectedItem?.category,
				userName: userName || void 0
			})
		]
	});
}
//#endregion
export { ServicesPage as component };
