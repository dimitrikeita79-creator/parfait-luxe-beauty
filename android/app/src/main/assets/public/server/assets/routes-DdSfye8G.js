import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { t as useToast } from "./useToast-sKNGuXCV.js";
import { C as promo_1_default, D as Coupe_1_default, E as Coupe_5_default, S as promo_6_default, T as M1_1_default, a as AppShell, b as P_1_1_default, c as WhatsAppIcon, d as LOCATION, g as waLink, m as TESTIMONIALS, s as SectionTitle, v as PB_34_1_default, w as M8_1_default, x as E_1_1_default } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as galleryService } from "./gallery.service-H0Kdh8VI.js";
import { t as catalogService } from "./catalog.service-JKK9H3e4.js";
import { t as servicesService } from "./services.service-CX6ui3Je.js";
import { t as reviewsService } from "./reviews.service-FP-Ana9p.js";
import { t as Frame } from "./Frame-IJntKHyZ.js";
import { t as IconBadge } from "./IconBadge-CwX7FJJ7.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Calendar, ChevronRight, Crown, Gem, Heart, MapPin, Package, Scissors, Search, Send, Sparkles, Star, Trash2 } from "lucide-react";
//#region src/components/CoverCarousel.tsx
var DEFAULT_COVERS = [
	{
		id: "c1",
		title: "Pose Perruque",
		subtitle: "Lace HD glueless",
		tone: "from-neutral-100 via-white to-amber-50"
	},
	{
		id: "c2",
		title: "Coiffure Mariage",
		subtitle: "Le jour J, sublimée",
		tone: "from-rose-50 via-white to-amber-50"
	},
	{
		id: "c3",
		title: "Tissage Premium",
		subtitle: "Brésilien · Péruvien",
		tone: "from-amber-50 via-white to-neutral-100"
	},
	{
		id: "c4",
		title: "Box Braids",
		subtitle: "Tresses signature",
		tone: "from-stone-100 via-white to-amber-50"
	},
	{
		id: "c5",
		title: "Perruques Naturelles",
		subtitle: "18'' à 30''",
		tone: "from-amber-50 via-white to-rose-50"
	},
	{
		id: "c6",
		title: "Coloration",
		subtitle: "Reflets sur-mesure",
		tone: "from-rose-50 via-amber-50 to-white"
	},
	{
		id: "c7",
		title: "Soins Capillaires",
		subtitle: "Routine d'exception",
		tone: "from-white via-neutral-50 to-amber-50"
	},
	{
		id: "c8",
		title: "Équipements Pro",
		subtitle: "Salon & maison",
		tone: "from-neutral-50 via-white to-stone-100"
	},
	{
		id: "c9",
		title: "Conseils Beauté",
		subtitle: "Diagnostic offert",
		tone: "from-amber-50 via-rose-50 to-white"
	},
	{
		id: "c10",
		title: "Offres du mois",
		subtitle: "Jusqu'à -40%",
		tone: "from-amber-100 via-white to-rose-50"
	}
];
function CoverCarousel({ covers = DEFAULT_COVERS }) {
	const ref = useRef(null);
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const onScroll = () => {
		const el = ref.current;
		if (!el) return;
		const idx = Math.round(el.scrollLeft / el.clientWidth);
		if (idx !== active) setActive(idx);
	};
	useEffect(() => {
		if (paused) return;
		if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			const el = ref.current;
			if (!el) return;
			const next = Math.round(el.scrollLeft / el.clientWidth) + 1;
			const target = next > covers.length - 1 ? 0 : next;
			el.scrollTo({
				left: target * el.clientWidth,
				behavior: "smooth"
			});
		}, 4e3);
		return () => window.clearInterval(id);
	}, [paused, covers.length]);
	return /* @__PURE__ */ jsxs("div", {
		className: "-mx-5",
		onPointerDown: () => setPaused(true),
		onPointerUp: () => setPaused(false),
		onPointerLeave: () => setPaused(false),
		children: [/* @__PURE__ */ jsx("div", {
			ref,
			onScroll,
			className: "flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: covers.map((c) => /* @__PURE__ */ jsx("div", {
				className: "w-[88%] shrink-0 snap-center",
				children: /* @__PURE__ */ jsxs(Frame, {
					tone: c.tone,
					rounded: "rounded-[28px]",
					className: "aspect-[16/10] w-full",
					image: c.image,
					alt: c.title,
					children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" }), /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-x-0 bottom-0 p-5",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85",
							children: c.subtitle
						}), /* @__PURE__ */ jsx("p", {
							className: "font-display mt-1 text-2xl font-semibold leading-tight text-white drop-shadow",
							children: c.title
						})]
					})]
				})
			}, c.id))
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-2 flex justify-center gap-1.5",
			children: covers.map((_, i) => /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": `Aller au cadre ${i + 1}`,
				onClick: () => {
					const el = ref.current;
					if (!el) return;
					el.scrollTo({
						left: i * el.clientWidth,
						behavior: "smooth"
					});
				},
				className: `h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25"}`
			}, i))
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var getCategoryIcon = (category) => {
	const cat = category.toLowerCase().trim();
	if (cat.includes("pose")) return Crown;
	if (cat.includes("tresse") || cat.includes("coiffure")) return Scissors;
	if (cat.includes("mariage")) return Heart;
	if (cat.includes("tissage")) return Sparkles;
	if (cat.includes("perruque")) return Gem;
	if (cat.includes("produit") || cat.includes("équipement")) return Package;
	return Sparkles;
};
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function ReviewForm({ onReviewSubmitted }) {
	const { success, error: toastError } = useToast();
	const [text, setText] = useState("");
	const [rating, setRating] = useState(5);
	const [authorName, setAuthorName] = useState("");
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = await authService.getCurrentUser();
		if (!user) {
			navigate({ to: "/login" });
			return;
		}
		if (!text.trim()) {
			setFeedback("Veuillez écrire un avis.");
			return;
		}
		if (!authorName.trim()) {
			setFeedback("Veuillez indiquer votre nom.");
			return;
		}
		try {
			setLoading(true);
			setFeedback(null);
			await reviewsService.submitReview({
				author_name: authorName.trim(),
				comment: text.trim(),
				rating: Math.min(5, Math.max(1, rating)),
				user_id: user.id
			});
			setText("");
			setRating(5);
			setAuthorName("");
			setFeedback(null);
			success("Avis envoyé", "Merci ! Votre avis a été envoyé et sera visible après modération.");
			if (onReviewSubmitted) onReviewSubmitted();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Erreur lors de l'envoi.";
			setFeedback(message);
			toastError("Avis", message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "rounded-[24px] border border-[var(--gold-soft)]/50 bg-gradient-to-br from-white to-[var(--gold-light)] p-4 shadow-lg shadow-[var(--gold)]/5",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsx("input", {
					className: "w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]",
					value: authorName,
					onChange: (e) => setAuthorName(e.target.value),
					placeholder: "Votre nom"
				}),
				/* @__PURE__ */ jsx("textarea", {
					className: "min-h-20 w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Partagez votre expérience...",
					rows: 3
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Note :"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1 text-red-600",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setRating(i + 1),
							className: "transition hover:scale-110",
							children: /* @__PURE__ */ jsx(Star, { className: `h-5 w-5 ${i < rating ? "fill-current" : "fill-none opacity-40"}` })
						}, i))
					})]
				}),
				feedback && /* @__PURE__ */ jsx("p", {
					className: "text-sm text-[var(--gold-deep)]",
					children: feedback
				}),
				/* @__PURE__ */ jsxs(GlassButton, {
					type: "submit",
					variant: "gold",
					size: "md",
					disabled: loading,
					children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), loading ? "Envoi..." : "Envoyer mon avis"]
				})
			]
		})
	});
}
function Index() {
	const navigate = useNavigate();
	const [services, setServices] = useState([]);
	const [catalogItems, setCatalogItems] = useState([]);
	const [galleryItems, setGalleryItems] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState("");
	const [focused, setFocused] = useState(false);
	const [notice, setNotice] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);
	const [isAdmin, setIsAdmin] = useState(false);
	const [selectedSalon, setSelectedSalon] = useState("parfait");
	const blurTimer = useRef(null);
	const reviewsRef = useRef(null);
	useRef(null);
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);
				const [servicesData, catalogData, galleryData] = await Promise.all([
					servicesService.getActive(),
					catalogService.getAvailable(),
					galleryService.getFeatured()
				]);
				setServices(servicesData);
				setCatalogItems(catalogData);
				setGalleryItems(galleryData);
				setReviews(await reviewsService.getAllReviews().catch((err) => {
					console.warn("Impossible de charger les avis :", err);
					return [];
				}) ?? []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [refreshKey]);
	const reviewSlides = reviews.length > 0 ? reviews : TESTIMONIALS;
	useEffect(() => {
		const container = reviewsRef.current;
		if (!container || reviewSlides.length === 0) return;
		let currentIndex = 0;
		container.scrollTo({
			left: 0,
			behavior: "smooth"
		});
		const interval = window.setInterval(() => {
			if (!container) return;
			const slideWidth = container.clientWidth;
			currentIndex = (currentIndex + 1) % reviewSlides.length;
			const target = Math.min(currentIndex * (slideWidth * .7), container.scrollWidth - slideWidth);
			container.scrollTo({
				left: target,
				behavior: "smooth"
			});
		}, 4500);
		return () => window.clearInterval(interval);
	}, [reviewSlides.length]);
	useEffect(() => {
		const storedNotice = window.sessionStorage.getItem("authNotice");
		if (storedNotice) {
			setNotice(storedNotice);
			window.sessionStorage.removeItem("authNotice");
			const timer = window.setTimeout(() => setNotice(null), 6e3);
			return () => window.clearTimeout(timer);
		}
	}, []);
	useEffect(() => {
		const checkAdmin = async () => {
			const user = await authService.getCurrentUser();
			if (user) setIsAdmin((await authService.getUserProfile(user.id))?.role === "admin");
		};
		checkAdmin();
	}, []);
	const handleDeleteReview = async (id) => {
		if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
		try {
			await reviewsService.deleteReview(id);
			setReviews((prev) => prev.filter((r) => r.id !== id));
		} catch (err) {
			console.error("Erreur lors de la suppression :", err);
		}
	};
	const popularServices = useMemo(() => services.slice(0, 6), [services]);
	const categorizedCatalog = useMemo(() => {
		const grouped = /* @__PURE__ */ new Map();
		for (const item of catalogItems) {
			if (!grouped.has(item.category)) grouped.set(item.category, []);
			grouped.get(item.category).push(item);
		}
		return grouped;
	}, [catalogItems]);
	const popularWigs = useMemo(() => categorizedCatalog.get("Perruques")?.slice(0, 8) || categorizedCatalog.get("perruques")?.slice(0, 8) || [], [categorizedCatalog]);
	const popularBraids = useMemo(() => categorizedCatalog.get("Coiffure")?.slice(0, 8) || categorizedCatalog.get("coiffure")?.slice(0, 8) || [], [categorizedCatalog]);
	const promotionItems = useMemo(() => categorizedCatalog.get("Promo") || categorizedCatalog.get("promotion") || [], [categorizedCatalog]);
	const works = useMemo(() => galleryItems.slice(0, 6), [galleryItems]);
	const categoryImages = {
		coiffure: Coupe_1_default,
		perruques: PB_34_1_default,
		mariage: M1_1_default,
		produits: P_1_1_default,
		equipement: E_1_1_default,
		promotion: promo_1_default
	};
	const makeCategorySlug = (category) => norm(category).replace(/\s+/g, "-");
	const searchIndex = useMemo(() => {
		const out = [];
		for (const item of catalogItems) out.push({
			type: "item",
			id: item.id,
			name: item.title,
			category: item.category
		});
		for (const s of services) out.push({
			type: "service",
			id: s.id,
			name: s.title
		});
		const categories = Array.from(new Set(catalogItems.map((i) => i.category)));
		for (const cat of categories) out.push({
			type: "category",
			name: cat.charAt(0).toUpperCase() + cat.slice(1)
		});
		return out;
	}, [catalogItems, services]);
	const suggestions = useMemo(() => {
		const q = norm(query.trim());
		if (!q) return [];
		const scored = [];
		for (const h of searchIndex) {
			const n = norm(h.name);
			let score = 0;
			if (n === q) score = 100;
			else if (n.startsWith(q)) score = 60;
			else if (n.includes(q)) score = 30;
			else if (n.split(/\s+/).some((w) => w.startsWith(q))) score = 20;
			if (score > 0) scored.push({
				hit: h,
				score: score + (h.type === "item" ? 5 : 0)
			});
		}
		return scored.sort((a, b) => b.score - a.score).slice(0, 8).map((s) => s.hit);
	}, [query, searchIndex]);
	const goToHit = (h) => {
		setFocused(false);
		setQuery("");
		if (h.type === "item") navigate({
			to: "/catalog/$category",
			params: { category: makeCategorySlug(h.category) },
			search: { highlight: h.id }
		});
		else if (h.type === "service") navigate({
			to: "/services",
			search: { highlight: h.id }
		});
		else navigate({
			to: "/catalog/$category",
			params: { category: makeCategorySlug(h.name) },
			search: {}
		});
	};
	const handleSearch = (e) => {
		e.preventDefault();
		if (suggestions[0]) {
			goToHit(suggestions[0]);
			return;
		}
		const q = norm(query.trim());
		if (!q) return;
		if (q.includes("galerie") || q.includes("photo")) return navigate({ to: "/gallery" });
		if (q.includes("contact") || q.includes("rdv") || q.includes("rendez") || q.includes("reserv")) return navigate({ to: "/contact" });
		navigate({ to: "/catalog" });
	};
	const coversWithImages = [
		{
			id: "c1",
			title: "Coiffure Premium",
			subtitle: "Coupes signature",
			tone: "from-neutral-100 via-white to-amber-50",
			image: Coupe_1_default
		},
		{
			id: "c2",
			title: "Coiffure Mariage",
			subtitle: "Le jour J, sublimée",
			tone: "from-rose-50 via-white to-amber-50",
			image: M1_1_default
		},
		{
			id: "c3",
			title: "Offres du mois",
			subtitle: "Jusqu'à -40%",
			tone: "from-amber-100 via-white to-rose-50",
			image: promo_1_default
		},
		{
			id: "c4",
			title: "Soins Capillaires",
			subtitle: "Routine d'exception",
			tone: "from-white via-neutral-50 to-amber-50",
			image: P_1_1_default
		},
		{
			id: "c5",
			title: "Coiffures",
			subtitle: "Styles prisés",
			tone: "from-amber-50 via-white to-rose-50",
			image: Coupe_5_default
		},
		{
			id: "c6",
			title: "Mariage Prestige",
			subtitle: "Votre jour parfait",
			tone: "from-rose-100 via-white to-amber-50",
			image: M8_1_default
		},
		{
			id: "c7",
			title: "Promotions",
			subtitle: "Profitez vite",
			tone: "from-yellow-50 via-white to-rose-50",
			image: promo_6_default
		},
		{
			id: "c8",
			title: "Équipements",
			subtitle: "Outils professionnels",
			tone: "from-white via-amber-50 to-yellow-50",
			image: E_1_1_default
		}
	];
	return /* @__PURE__ */ jsxs(AppShell, { children: [
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
			className: "mt-2 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-600 backdrop-blur-sm",
			children: ["⚠️ ", error]
		}) }),
		!loading && /* @__PURE__ */ jsx(motion.section, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .5 },
			className: "mt-2",
			children: /* @__PURE__ */ jsx(CoverCarousel, { covers: coversWithImages })
		}),
		/* @__PURE__ */ jsxs(motion.section, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .5,
				delay: .1
			},
			className: "mt-3",
			children: [notice && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				className: "mb-3 rounded-2xl border border-[var(--gold-soft)]/80 bg-[var(--gold-soft)]/60 px-3 py-2 text-sm text-[var(--gold-deep)]",
				children: notice
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[24px] bg-gradient-to-br from-[var(--gold-light)] via-white to-[var(--gold-soft)]/30 p-5 border border-[var(--gold-soft)]/40 shadow-lg shadow-[var(--gold)]/5",
				children: [
					/* @__PURE__ */ jsxs("h1", {
						className: "font-display text-3xl leading-[1.1] font-semibold",
						children: [
							"Révélez votre ",
							/* @__PURE__ */ jsx("span", {
								className: "text-gold",
								children: "élégance"
							}),
							" naturelle"
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Perruques • Mèches • Coiffures • Mariage • Soins capillaires"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ jsxs(GlassButton, {
							as: Link,
							to: "/contact",
							variant: "gold",
							size: "md",
							full: true,
							className: "flex-1 shadow-lg shadow-[var(--gold)]/20",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), "Réserver"]
						}), /* @__PURE__ */ jsxs(GlassButton, {
							as: Link,
							to: "/catalog",
							variant: "light",
							size: "md",
							full: true,
							className: "flex-1 border-[var(--gold-soft)]/50",
							children: [/* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }), "Catalogue"]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .4,
				delay: .15
			},
			className: "relative mt-5",
			children: [/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSearch,
				className: "flex items-center gap-2 rounded-full border border-[var(--gold-soft)]/30 bg-white/80 pl-4 pr-1.5 py-1.5 transition focus-within:ring-2 focus-within:ring-[var(--crimson)]/40 focus-within:border-[var(--crimson)]/30 shadow-sm",
				children: [
					/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
					/* @__PURE__ */ jsx("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						onFocus: () => setFocused(true),
						onBlur: () => {
							blurTimer.current = window.setTimeout(() => setFocused(false), 150);
						},
						onKeyDown: (e) => {
							if (e.key === "Escape") e.target.blur();
						},
						placeholder: "Rechercher : huile argan, perruque, mariage…",
						className: "flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground",
						"aria-label": "Recherche"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-700 to-red-800 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
						children: "OK"
					})
				]
			}), /* @__PURE__ */ jsx(AnimatePresence, { children: focused && query.trim() && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: -8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -8
				},
				className: "absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-3xl border border-[var(--gold-soft)]/30 bg-white/90 p-1.5 shadow-xl backdrop-blur-md",
				onMouseDown: (e) => {
					e.preventDefault();
					if (blurTimer.current) window.clearTimeout(blurTimer.current);
				},
				children: suggestions.length === 0 ? /* @__PURE__ */ jsxs("p", {
					className: "px-3 py-3 text-xs text-muted-foreground",
					children: [
						"Aucun résultat pour « ",
						query,
						" »"
					]
				}) : suggestions.map((h) => /* @__PURE__ */ jsxs(GlassButton, {
					type: "button",
					onClick: () => goToHit(h),
					variant: "light",
					size: "sm",
					full: true,
					className: "justify-start rounded-2xl px-3 py-2 text-left",
					children: [
						/* @__PURE__ */ jsx(IconBadge, {
							icon: h.type === "item" ? Search : h.type === "service" ? Sparkles : BookOpen,
							tone: h.type === "item" ? "gold" : h.type === "service" ? "pink" : "blue",
							size: "sm"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold leading-tight truncate",
								children: h.name
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-[10px] text-muted-foreground",
								children: h.type === "item" ? h.category : h.type === "service" ? "Service" : "Catégorie"
							})]
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" })
					]
				}, `${h.type}-${"id" in h ? h.id : h.name}`))
			}) })]
		}),
		/* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: 10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .4,
				delay: .2
			},
			className: "mt-5 grid grid-cols-4 gap-1.5",
			children: [
				{
					label: "Réserver",
					icon: Calendar,
					tone: "gold",
					to: "/contact",
					href: void 0,
					wa: false
				},
				{
					label: "WhatsApp",
					icon: null,
					tone: "green",
					to: void 0,
					href: waLink(),
					wa: true
				},
				{
					label: "Itinéraire",
					icon: MapPin,
					tone: "rose",
					to: void 0,
					href: LOCATION.mapsLink,
					wa: false
				},
				{
					label: "Catalogue",
					icon: BookOpen,
					tone: "blue",
					to: "/catalog",
					href: void 0,
					wa: false
				}
			].map(({ label, icon: Icon, tone, to, href, wa }) => {
				const inner = /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--gold)]/10 active:scale-95",
					children: [wa ? /* @__PURE__ */ jsx("div", {
						className: "flex flex-col items-center gap-1",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md",
							children: /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-5 w-5 text-green-600" })
						})
					}) : Icon ? /* @__PURE__ */ jsx("div", {
						className: "flex flex-col items-center gap-1",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md",
							style: { boxShadow: `0 4px 12px -2px ${tone === "gold" ? "rgba(200, 160, 80, 0.3)" : tone === "blue" ? "rgba(24, 119, 242, 0.3)" : "rgba(254, 44, 85, 0.3)"}` },
							children: /* @__PURE__ */ jsx(Icon, {
								className: "h-5 w-5",
								style: { color: tone === "gold" ? "#c8a050" : tone === "blue" ? "#1877F2" : tone === "rose" ? "#FE2C55" : "#25D366" }
							})
						})
					}) : null, /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-medium text-center line-clamp-1 mt-1",
						children: label
					})]
				});
				return to ? /* @__PURE__ */ jsx(Link, {
					to,
					children: inner
				}, label) : /* @__PURE__ */ jsx("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					children: inner
				}, label);
			})
		}),
		!loading && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(SectionTitle, {
				title: "Services populaires",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/services",
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Voir tout"
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .25 },
				className: "flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory",
				children: popularServices.map((s, i) => {
					const Icon = getCategoryIcon(s.category);
					return /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: .3 + i * .04 },
						children: /* @__PURE__ */ jsx(Link, {
							to: "/services",
							preload: "intent",
							className: "snap-start block",
							children: /* @__PURE__ */ jsxs("div", {
								className: "w-44 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-3 shadow-sm hover:shadow-md hover:shadow-[var(--gold)]/10 transition-all duration-200",
								children: [
									s.image_url ? /* @__PURE__ */ jsx("div", {
										className: "mb-2 h-20 w-full overflow-hidden rounded-2xl ring-1 ring-black/5",
										children: /* @__PURE__ */ jsx("img", {
											src: s.image_url,
											alt: s.title,
											className: "h-full w-full object-cover",
											loading: "lazy"
										})
									}) : /* @__PURE__ */ jsx(IconBadge, {
										icon: Icon,
										tone: "gold",
										size: "md"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 font-display text-sm font-semibold leading-tight",
										children: s.title
									}),
									s.description && /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-[10px] text-muted-foreground line-clamp-2",
										children: s.description
									})
								]
							})
						})
					}, s.id);
				})
			}),
			/* @__PURE__ */ jsx(SectionTitle, {
				title: "Catalogue",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/catalog",
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Tout voir"
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .3 },
				className: "grid grid-cols-2 gap-2",
				children: Array.from(categorizedCatalog.entries()).slice(0, 4).map(([cat, items], i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .35 + i * .05 },
					children: /* @__PURE__ */ jsx(Link, {
						to: "/catalog/$category",
						params: { category: makeCategorySlug(cat) },
						search: {},
						preload: "intent",
						className: "block",
						children: /* @__PURE__ */ jsx(Frame, {
							variant: "plain",
							rounded: "rounded-[24px]",
							className: "aspect-[5/4] w-full",
							image: items[0]?.image_url || categoryImages[cat.toLowerCase()],
							alt: cat,
							children: /* @__PURE__ */ jsx("div", {
								className: "absolute left-1 bottom-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur-md capitalize",
								style: {
									background: "oklch(1 0 0 / 0.85)",
									color: "var(--gold-deep)"
								},
								children: cat.charAt(0).toUpperCase() + cat.slice(1)
							})
						})
					})
				}, cat))
			}),
			works.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SectionTitle, {
				title: "Nos réalisations",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/gallery",
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Galerie"
				})
			}), /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .4 },
				className: "grid grid-cols-3 gap-1.5",
				children: works.map((g, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						scale: .95
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: { delay: .45 + i * .03 },
					children: /* @__PURE__ */ jsx(Link, {
						to: "/gallery",
						preload: "intent",
						className: "block aspect-square",
						children: /* @__PURE__ */ jsx(Frame, {
							variant: "plain",
							rounded: "rounded-2xl",
							className: "h-full w-full",
							image: g.image_url,
							alt: g.title,
							children: /* @__PURE__ */ jsx("span", {
								className: "absolute left-1 bottom-1 rounded-full px-1 py-0.5 text-[8px] font-semibold backdrop-blur-md capitalize",
								style: {
									background: "oklch(1 0 0 / 0.85)",
									color: "var(--gold-deep)"
								},
								children: g.category
							})
						})
					})
				}, g.id))
			})] }),
			popularWigs.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SectionTitle, {
				title: "Perruques populaires",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/catalog/$category",
					params: { category: makeCategorySlug("Perruques") },
					search: {},
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Tout voir"
				})
			}), /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .45 },
				className: "flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory",
				children: popularWigs.map((p, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .5 + i * .03 },
					className: "snap-start",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/catalog/$category",
						params: { category: makeCategorySlug("Perruques") },
						search: {},
						className: "block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "w-36 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 shadow-sm",
							children: [p.image_url && /* @__PURE__ */ jsx(Frame, {
								variant: "plain",
								rounded: "rounded-2xl",
								className: "h-24 w-full",
								image: p.image_url,
								alt: p.title
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2",
								children: p.title
							})]
						})
					})
				}, p.id))
			})] }),
			popularBraids.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SectionTitle, {
				title: "Coiffures populaires",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/catalog/$category",
					params: { category: makeCategorySlug("Coiffure") },
					search: {},
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Tout voir"
				})
			}), /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .5 },
				className: "flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory",
				children: popularBraids.map((p, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .55 + i * .03 },
					className: "snap-start",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/catalog/$category",
						params: { category: makeCategorySlug("Coiffure") },
						search: {},
						className: "block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "w-36 shrink-0 rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-2.5 shadow-sm",
							children: [p.image_url && /* @__PURE__ */ jsx(Frame, {
								variant: "plain",
								rounded: "rounded-2xl",
								className: "h-24 w-full",
								image: p.image_url,
								alt: p.title
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2",
								children: p.title
							})]
						})
					})
				}, p.id))
			})] }),
			/* @__PURE__ */ jsx(SectionTitle, { title: "Avis clientes" }),
			/* @__PURE__ */ jsx(motion.div, {
				ref: reviewsRef,
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .55 },
				className: "flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth",
				children: reviewSlides.map((t, i) => {
					const reviewObj = typeof t === "object" && t !== null ? t : null;
					const reviewId = reviewObj?.id ? String(reviewObj.id) : null;
					return /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: .6 + i * .04 },
						className: "relative min-w-[18rem] shrink-0 snap-start rounded-[24px] border border-[var(--gold-soft)]/20 bg-white/70 p-3 shadow-sm",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-0.5 text-red-600",
								children: Array.from({ length: reviewObj?.rating ?? 5 }).map((_, k) => /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }, k))
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1.5 text-sm leading-relaxed",
								children: [
									"\"",
									reviewObj?.comment ?? reviewObj?.text ?? reviewObj?.message ?? "Excellent service.",
									"\""
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 text-[11px] font-semibold",
								children: ["— ", reviewObj?.author_name ?? reviewObj?.name ?? "Client satisfait"]
							}),
							isAdmin && reviewId && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleDeleteReview(reviewId),
								className: "absolute top-2 right-2 rounded-full p-1 text-xs text-red-500 hover:bg-red-50 transition",
								title: "Supprimer cet avis",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
							})
						]
					}, reviewObj?.id ? String(reviewObj.id) : `r-${i}`);
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ jsx(SectionTitle, { title: "Donnez votre avis" }), /* @__PURE__ */ jsx(ReviewForm, { onReviewSubmitted: () => setRefreshKey((prev) => prev + 1) })]
			}),
			promotionItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SectionTitle, {
				title: "Offres du mois",
				action: /* @__PURE__ */ jsx(Link, {
					to: "/catalog/$category",
					params: { category: makeCategorySlug("Promo") },
					search: {},
					className: "text-xs font-medium text-[var(--gold-deep)]",
					children: "Voir tout"
				})
			}), /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .6 },
				children: /* @__PURE__ */ jsx(Link, {
					to: "/catalog/$category",
					params: { category: "promotion" },
					search: {},
					preload: "intent",
					className: "block",
					children: /* @__PURE__ */ jsxs(Frame, {
						variant: "plain",
						rounded: "rounded-[28px]",
						className: "aspect-video w-full",
						image: promotionItems[0]?.image_url || "/assets/promo_1-kYNMlUML.webp",
						alt: "Promotions",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent rounded-b-[24px]" }), /* @__PURE__ */ jsxs("div", {
							className: "absolute bottom-0 left-0 right-0 p-4",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "font-display text-lg font-semibold text-white",
								children: [promotionItems.length, " promotions"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-xs text-white/80",
								children: "Découvrez nos meilleures offres"
							})]
						})]
					})
				})
			})] })
		] })
	] });
}
//#endregion
export { Index as component };
