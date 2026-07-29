import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { t as useToast } from "./useToast-sKNGuXCV.js";
import { n as useTheme } from "./ThemeContext-BRfi338G.js";
import { a as AppShell, i as supabase, l as profil_default, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as reviewsService } from "./reviews.service-FP-Ana9p.js";
import { t as uploadService } from "./upload.service-DTzRx-Dc.js";
import { i as toggleFavorite, n as getFavorites, r as saveFavorites } from "./favorites-Cd57hRD6.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, Camera, ChevronRight, Heart, LogOut, Plus, Settings, ShieldCheck, Star, Trash2, User } from "lucide-react";
//#region src/backend/services/favorites.service.ts
var FavoritesService = class {
	async getUserFavorites() {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;
			const user = sessionData.session?.user;
			if (!user?.id) return [];
			const { data, error } = await supabase.from(TABLES.FAVORITES).select("item_id, item_type, item_data").eq("user_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data.map((favorite) => ({
				id: favorite.item_id,
				kind: favorite.item_type,
				title: String(favorite.item_data.title ?? ""),
				description: favorite.item_data.description ?? null,
				price: favorite.item_data.price === null || favorite.item_data.price === void 0 ? null : Number(favorite.item_data.price),
				imageUrl: favorite.item_data.imageUrl ?? null,
				category: favorite.item_data.category ?? null
			}));
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async addFavorite(favorite) {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;
			const user = sessionData.session?.user;
			if (!user?.id) throw new ApiException("Utilisateur non connecté");
			const payload = {
				user_id: user.id,
				item_id: favorite.id,
				item_type: favorite.kind,
				item_data: {
					title: favorite.title,
					description: favorite.description,
					price: favorite.price,
					imageUrl: favorite.imageUrl,
					category: favorite.category
				}
			};
			const { error } = await supabase.from(TABLES.FAVORITES).upsert(payload, { onConflict: "(user_id, item_id, item_type)" });
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async removeFavorite(kind, itemId) {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;
			const user = sessionData.session?.user;
			if (!user?.id) throw new ApiException("Utilisateur non connecté");
			const { error } = await supabase.from(TABLES.FAVORITES).delete().eq("user_id", user.id).eq("item_id", itemId).eq("item_type", kind);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
};
var favoritesService = new FavoritesService();
//#endregion
//#region src/routes/profile.tsx?tsr-split=component
var STORAGE_KEY = "desmohair-saved-products";
function ProfilePage() {
	const navigate = useNavigate();
	const { setTheme, theme: currentTheme } = useTheme();
	const { success, error: toastError } = useToast();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [avatarFeedback, setAvatarFeedback] = useState(null);
	const [savedProducts, setSavedProducts] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [favoritesLoading, setFavoritesLoading] = useState(false);
	const [newProductName, setNewProductName] = useState("");
	const [newProductNote, setNewProductNote] = useState("");
	const [newReviewText, setNewReviewText] = useState("");
	const [newReviewRating, setNewReviewRating] = useState(5);
	const [reviewLoading, setReviewLoading] = useState(false);
	const [reviewFeedback, setReviewFeedback] = useState(null);
	const isAdmin = user?.role === "admin";
	useEffect(() => {
		let active = true;
		let unsubscribeCleanup = null;
		const loadUser = async () => {
			try {
				const currentUser = await authService.getCurrentUser();
				if (active) setUser(currentUser);
			} finally {
				if (active) setLoading(false);
			}
		};
		loadUser();
		const unsubscribe = authService.onAuthStateChange((nextUser) => {
			if (active) {
				setUser(nextUser);
				if (!nextUser && user) toastError("Session", "Votre session a expiré. Veuillez vous reconnecter.");
			}
		});
		const sessionCheckInterval = setInterval(async () => {
			if (!active) return;
			try {
				const currentUser = await authService.getCurrentUser();
				if (active && currentUser) setUser(currentUser);
			} catch {}
		}, 300 * 1e3);
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored) try {
				setSavedProducts(JSON.parse(stored));
			} catch {
				setSavedProducts([]);
			}
			setFavorites(getFavorites());
			const handleFavoritesUpdate = () => {
				setFavorites(getFavorites());
			};
			window.addEventListener("favorites-updated", handleFavoritesUpdate);
			window.addEventListener("storage", handleFavoritesUpdate);
			unsubscribeCleanup = () => {
				window.removeEventListener("favorites-updated", handleFavoritesUpdate);
				window.removeEventListener("storage", handleFavoritesUpdate);
			};
		}
		return () => {
			active = false;
			unsubscribe();
			clearInterval(sessionCheckInterval);
			if (unsubscribeCleanup) unsubscribeCleanup();
		};
	}, []);
	useEffect(() => {
		loadFavoritesForUser(user);
	}, [user]);
	const changeTheme = async (next) => {
		setTheme(next);
		try {
			await authService.updateProfile({ theme: next });
		} catch (err) {
			console.warn("Impossible de sauvegarder le thème :", err);
		}
	};
	const handleSignOut = async () => {
		await authService.signOut();
		navigate({
			to: "/login",
			replace: true
		});
	};
	const handleAvatarUpload = async (event) => {
		event.preventDefault();
		if (!avatarFile) {
			setAvatarFeedback("Choisissez une image avant de l’envoyer.");
			return;
		}
		try {
			setAvatarLoading(true);
			setAvatarFeedback(null);
			const avatarUrl = await uploadService.uploadAvatar(avatarFile, `avatar-${Date.now()}`);
			setUser(await authService.updateProfile({ avatar_url: avatarUrl }));
			setAvatarFile(null);
			setAvatarFeedback("Photo de profil mise à jour.");
		} catch (error) {
			setAvatarFeedback(error instanceof Error ? error.message : "Impossible de mettre à jour la photo.");
		} finally {
			setAvatarLoading(false);
		}
	};
	const handleAddSavedProduct = (event) => {
		event.preventDefault();
		const trimmed = newProductName.trim();
		if (!trimmed) return;
		const nextItems = [{
			id: `${Date.now()}`,
			title: trimmed,
			note: newProductNote.trim()
		}, ...savedProducts];
		setSavedProducts(nextItems);
		if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
		setNewProductName("");
		setNewProductNote("");
	};
	const loadFavoritesForUser = async (currentUser) => {
		if (typeof window === "undefined") return;
		if (!currentUser) {
			setFavorites(getFavorites());
			return;
		}
		setFavoritesLoading(true);
		try {
			const localFavorites = getFavorites();
			let backendFavorites = [];
			try {
				backendFavorites = await favoritesService.getUserFavorites();
			} catch (error) {
				console.error("Impossible de charger les favoris Supabase :", error);
			}
			const mergedFavorites = [...backendFavorites, ...localFavorites.filter((favorite) => !backendFavorites.some((backendFavorite) => backendFavorite.kind === favorite.kind && backendFavorite.id === favorite.id))];
			setFavorites(mergedFavorites);
			saveFavorites(mergedFavorites);
			if (localFavorites.length > 0) {
				const missingFavorites = localFavorites.filter((favorite) => !backendFavorites.some((backendFavorite) => backendFavorite.kind === favorite.kind && backendFavorite.id === favorite.id));
				await Promise.all(missingFavorites.map((favorite) => favoritesService.addFavorite(favorite)));
			}
		} finally {
			setFavoritesLoading(false);
		}
	};
	const handleRemoveSavedProduct = (id) => {
		const nextItems = savedProducts.filter((item) => item.id !== id);
		setSavedProducts(nextItems);
		if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
	};
	const handleRemoveFavorite = async (favorite) => {
		if (user) try {
			await favoritesService.removeFavorite(favorite.kind, favorite.id);
		} catch (error) {
			console.error("Impossible de retirer le favori Supabase :", error);
		}
		setFavorites(toggleFavorite(favorite));
	};
	const handleSubmitReview = async (event) => {
		event.preventDefault();
		if (!newReviewText.trim()) {
			setReviewFeedback("Votre avis ne peut pas être vide.");
			return;
		}
		try {
			setReviewLoading(true);
			setReviewFeedback(null);
			const authorName = user?.full_name || user?.email?.split("@")[0] || "Client";
			await reviewsService.submitReview({
				author_name: authorName,
				comment: newReviewText.trim(),
				rating: Math.min(5, Math.max(1, newReviewRating)),
				user_id: user?.id ?? null
			});
			setNewReviewText("");
			setNewReviewRating(5);
			setReviewFeedback(null);
			success("Avis envoyé", "Merci ! Votre avis a bien été envoyé pour modération.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Impossible d’envoyer votre avis pour le moment.";
			setReviewFeedback(message);
			toastError("Avis", message);
		} finally {
			setReviewLoading(false);
		}
	};
	const getFavoriteDestination = (favorite) => {
		if (favorite.kind === "catalog") return {
			to: "/catalog/$category",
			params: { category: norm(favorite.category || favorite.title) },
			search: { highlight: favorite.id }
		};
		if (favorite.kind === "service") return {
			to: "/services",
			search: { highlight: favorite.id }
		};
		return {
			to: "/gallery",
			search: {}
		};
	};
	const handleOpenFavorite = (favorite) => {
		navigate(getFavoriteDestination(favorite));
	};
	const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
	if (loading) return /* @__PURE__ */ jsx(AppShell, {
		title: "Chargement du profil",
		subtitle: "Vérification de votre session…",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .4 },
			className: "mt-6 flex flex-col items-center justify-center gap-4",
			children: [/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--gold)]/30 border-t-[var(--gold)]" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Vérification de votre session…"
			})]
		})
	});
	if (!user) return /* @__PURE__ */ jsx(AppShell, {
		title: "Desmohair",
		subtitle: "Connectez-vous pour accéder à votre espace client",
		children: /* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .4 },
			className: "mt-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-[32px] border-2 border-red-500/30 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 shadow-lg shadow-red-200/20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "grid h-20 w-20 place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-red-100/50 to-red-200/30 shadow-lg",
							children: /* @__PURE__ */ jsx("img", {
								src: profil_default,
								alt: "Icône profil",
								className: "h-8 w-8 object-contain filter brightness-0 saturate-100 invert-[0.8]"
							})
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-4 text-xl font-semibold text-red-700",
							children: "Votre espace personnel"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground max-w-xs",
							children: "Retrouvez vos favoris, vos produits sauvegardés et gérez votre compte en toute simplicité."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-col gap-3",
					children: [/* @__PURE__ */ jsxs(GlassButton, {
						as: Link,
						to: "/login",
						variant: "gold",
						size: "md",
						full: true,
						className: "bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40",
						children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), "Se connecter"]
					}), /* @__PURE__ */ jsx(GlassButton, {
						as: Link,
						to: "/",
						variant: "light",
						size: "md",
						full: true,
						children: "Revenir à l’accueil"
					})]
				})]
			})
		})
	});
	return /* @__PURE__ */ jsxs(AppShell, {
		title: isAdmin ? "Profil administrateur" : "Mon profil",
		subtitle: isAdmin ? "Gérez votre accès et l’espace de modification Desmohair" : "Retrouvez vos favoris, vos produits sauvegardés et vos informations",
		children: [
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .4 },
				className: "mt-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-[32px] border border-blue-200/40 bg-gradient-to-br from-blue-50/80 to-white p-5 space-y-5 shadow-md shadow-blue-200/20",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold-deep)]/40 shadow-md",
									children: user.avatar_url ? /* @__PURE__ */ jsx("img", {
										src: user.avatar_url,
										alt: "Avatar",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ jsx("img", {
										src: profil_default,
										alt: "Icône profil",
										className: "h-7 w-7 object-contain"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600",
											children: isAdmin ? "Administrateur" : "Client"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-lg font-semibold text-foreground truncate",
											children: user.full_name ?? user.email?.split("@")[0] ?? "Utilisateur"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-muted-foreground truncate",
											children: user.email
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "rounded-full bg-blue-100/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700",
									children: isAdmin ? /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }), " Admin"]
									}) : /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(User, { className: "h-3 w-3" }), " Client"]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "flex flex-wrap items-center gap-2",
							onSubmit: handleAvatarUpload,
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "liquid-glass flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:scale-[1.02] active:scale-[0.98]",
									children: [
										/* @__PURE__ */ jsx(Camera, { className: "h-3.5 w-3.5 text-blue-600" }),
										"Changer la photo",
										/* @__PURE__ */ jsx("input", {
											className: "sr-only",
											type: "file",
											accept: "image/*",
											onChange: (event) => setAvatarFile(event.target.files?.[0] ?? null)
										})
									]
								}),
								/* @__PURE__ */ jsx(GlassButton, {
									type: "submit",
									variant: "gold",
									size: "sm",
									disabled: avatarLoading,
									className: "rounded-full",
									children: avatarLoading ? "Envoi…" : "Enregistrer"
								}),
								avatarFile ? /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground truncate max-w-[120px]",
									children: avatarFile.name
								}) : null
							]
						}),
						avatarFeedback ? /* @__PURE__ */ jsx(motion.p, {
							initial: {
								opacity: 0,
								y: -4
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "text-sm text-blue-600",
							children: avatarFeedback
						}) : null,
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
								children: "Thème de l'application"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => changeTheme("light"),
										className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${currentTheme === "light" ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold-deep)]" : "border-stone-200 bg-white text-foreground hover:border-stone-300"}`,
										children: "Clair"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => changeTheme("gold"),
										className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${currentTheme === "gold" ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold-deep)]" : "border-stone-200 bg-white text-foreground hover:border-stone-300"}`,
										children: "Doré"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => changeTheme("silver"),
										className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${currentTheme === "silver" ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold-deep)]" : "border-stone-200 bg-white text-foreground hover:border-stone-300"}`,
										children: "Argent"
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: .1
				},
				className: "mt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "liquid-glass rounded-[32px] p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-foreground",
								children: "Produits sauvegardés"
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "space-y-2",
							onSubmit: handleAddSavedProduct,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									className: "flex-1 rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]",
									value: newProductName,
									onChange: (event) => setNewProductName(event.target.value),
									placeholder: "Nom du produit"
								}), /* @__PURE__ */ jsxs(GlassButton, {
									type: "submit",
									variant: "gold",
									size: "sm",
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), "Ajouter"]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								className: "min-h-16 w-full rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]",
								value: newProductNote,
								onChange: (event) => setNewProductNote(event.target.value),
								placeholder: "Note ou rappel (optionnel)"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4 space-y-2",
							children: savedProducts.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground text-center py-4",
								children: "Aucun produit enregistré pour l’instant"
							}) : /* @__PURE__ */ jsx(AnimatePresence, { children: savedProducts.map((item) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -10
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: {
									opacity: 0,
									x: 10
								},
								className: "flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white/60 p-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold text-foreground",
										children: item.title
									}), item.note ? /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: item.note
									}) : null]
								}), /* @__PURE__ */ jsx("button", {
									className: "shrink-0 rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700",
									type: "button",
									onClick: () => handleRemoveSavedProduct(item.id),
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
								})]
							}, item.id)) })
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: .1
				},
				className: "mt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "liquid-glass rounded-[32px] p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-red-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Votre avis"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						className: "space-y-3",
						onSubmit: handleSubmitReview,
						children: [
							/* @__PURE__ */ jsx("textarea", {
								className: "min-h-20 w-full rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]",
								value: newReviewText,
								onChange: (event) => setNewReviewText(event.target.value),
								placeholder: "Partagez votre expérience avec nous...",
								rows: 4
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2",
									children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ jsx("button", {
										type: "button",
										className: `rounded-full px-3 py-1 text-xs font-semibold transition ${newReviewRating === index + 1 ? "bg-red-600 text-white" : "bg-stone-100 text-muted-foreground hover:bg-stone-200"}`,
										onClick: () => setNewReviewRating(index + 1),
										children: index + 1
									}, index))
								}), /* @__PURE__ */ jsx(GlassButton, {
									type: "submit",
									variant: "gold",
									size: "sm",
									disabled: reviewLoading,
									children: reviewLoading ? "Envoi…" : "Envoyer mon avis"
								})]
							}),
							reviewFeedback && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-blue-600",
								children: reviewFeedback
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: .15
				},
				className: "mt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "liquid-glass rounded-[32px] p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Favoris"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: favorites.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground text-center py-4",
							children: "Aucun élément aimé pour l’instant. Appuyez sur ❤️ dans la galerie, les services ou le catalogue pour les retrouver ici."
						}) : /* @__PURE__ */ jsx(AnimatePresence, { children: favorites.map((favorite) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -10
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: 10
							},
							className: "flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white/60 p-3",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleOpenFavorite(favorite),
								className: "min-w-0 text-left",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold text-foreground",
									children: favorite.title
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex flex-wrap gap-2 text-[10px] text-muted-foreground",
									children: [
										favorite.category ? /* @__PURE__ */ jsx("span", {
											className: "rounded-full border border-stone-200 bg-stone-100 px-2 py-1",
											children: favorite.category
										}) : null,
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full border border-stone-200 bg-stone-100 px-2 py-1 uppercase tracking-[0.12em]",
											children: favorite.kind
										}),
										favorite.price ? /* @__PURE__ */ jsxs("span", {
											className: "rounded-full border border-stone-200 bg-stone-100 px-2 py-1",
											children: [favorite.price.toLocaleString(), " F CFA"]
										}) : null
									]
								})]
							}), /* @__PURE__ */ jsx("button", {
								className: "shrink-0 rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700",
								type: "button",
								onClick: () => handleRemoveFavorite(favorite),
								title: "Retirer des favoris",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
							})]
						}, `${favorite.kind}-${favorite.id}`)) })
					})]
				})
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: .25
				},
				className: "mt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "liquid-glass rounded-[32px] p-5 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-foreground",
								children: "Accès rapides"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "flex items-center justify-between rounded-2xl border border-stone-200 bg-white/60 p-3 transition hover:bg-white hover:shadow-sm",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-blue-100/60",
										children: /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 text-blue-600" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium text-foreground",
										children: "Continuer la visite"
									})]
								}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })]
							}), /* @__PURE__ */ jsxs(GlassButton, {
								type: "button",
								onClick: handleSignOut,
								variant: "light",
								size: "md",
								className: "flex items-center justify-between rounded-2xl border border-stone-200 bg-white/60 p-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-rose-50",
										children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4 text-rose-500" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium text-foreground",
										children: "Déconnexion"
									})]
								}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })]
							})]
						}),
						isAdmin ? /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 pt-2 border-t border-red-200",
								children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4 text-red-600" }), /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Administration"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold text-foreground",
										children: "Panneau d'administration"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Gérez les services, le catalogue, la galerie et les informations du salon"
									})]
								}), /* @__PURE__ */ jsxs(GlassButton, {
									as: Link,
									to: "/admin",
									variant: "gold",
									size: "md",
									full: true,
									className: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30",
									children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }), "Ouvrir l’administration"]
								})]
							})]
						}) : null
					]
				})
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
