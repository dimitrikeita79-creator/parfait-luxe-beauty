import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { t as useToast } from "./useToast-sKNGuXCV.js";
import { a as AppShell, u as CATALOG_ITEMS } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { t as galleryService } from "./gallery.service-H0Kdh8VI.js";
import { t as catalogService } from "./catalog.service-JKK9H3e4.js";
import { t as servicesService } from "./services.service-CX6ui3Je.js";
import { t as uploadService } from "./upload.service-DTzRx-Dc.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Check, Image, LayoutGrid, Search, Settings, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
//#region src/components/ImprovedAdminEditor.tsx
var KNOWN_CATEGORY_ALIASES = {
	coiffure: "Coiffure",
	meches: "Mèches",
	mèches: "Mèches",
	equipement: "Équipement",
	équipement: "Équipement",
	produits: "Produits",
	produit: "Produits",
	autre: "Autre",
	autres: "Autre",
	perruques: "Perruques",
	perruque: "Perruques",
	mariage: "Mariage",
	promo: "Promo",
	promotion: "Promo"
};
var defaultCatalogCategories = [
	"Coiffure",
	"Mèches",
	"Équipement",
	"Produits",
	"Autre"
];
var galleryCategories = [
	"Coiffure",
	"Mèches",
	"Équipement",
	"Produits",
	"Autre"
];
function normalizeCategory(raw) {
	if (!raw) return "autres";
	const value = String(raw).trim();
	if (!value) return "autres";
	const mapped = KNOWN_CATEGORY_ALIASES[value.toLowerCase()];
	if (mapped) return mapped;
	return value.trim().split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
function formatPrice(value) {
	return `${value.toLocaleString("fr-FR")} FCFA`;
}
function ImprovedAdminEditor() {
	const { success, error: toastError } = useToast();
	const [galleryItems, setGalleryItems] = useState([]);
	const [catalogItems, setCatalogItems] = useState([]);
	const [serviceItems, setServiceItems] = useState([]);
	const [activeSection, setActiveSection] = useState(null);
	const [catalogCategories, setCatalogCategories] = useState(defaultCatalogCategories);
	const [newCategoryName, setNewCategoryName] = useState("");
	const availableCodes = useMemo(() => {
		const codes = /* @__PURE__ */ new Set();
		Object.values(CATALOG_ITEMS).forEach((list) => {
			if (!Array.isArray(list)) return;
			list.forEach((item) => {
				if (item?.code) codes.add(item.code);
			});
		});
		return [...codes].sort();
	}, []);
	const [galleryForm, setGalleryForm] = useState({
		title: "",
		description: "",
		imageUrl: "",
		category: "coiffure",
		isFeatured: false
	});
	const [galleryFile, setGalleryFile] = useState(null);
	const [galleryEditingId, setGalleryEditingId] = useState(null);
	const [galleryLoading, setGalleryLoading] = useState(false);
	const [galleryFeedback, setGalleryFeedback] = useState(null);
	const [galleryPreviewUrl, setGalleryPreviewUrl] = useState(null);
	const [catalogForm, setCatalogForm] = useState({
		title: "",
		description: "",
		price: "",
		imageUrl: "",
		category: "Coiffure",
		code: "",
		isAvailable: true
	});
	const [catalogFile, setCatalogFile] = useState(null);
	const [catalogEditingId, setCatalogEditingId] = useState(null);
	const [catalogLoading, setCatalogLoading] = useState(false);
	const [catalogFeedback, setCatalogFeedback] = useState(null);
	const [catalogPreviewUrl, setCatalogPreviewUrl] = useState(null);
	const [serviceForm, setServiceForm] = useState({
		title: "",
		description: "",
		price: "",
		durationMin: "",
		category: "Coiffure",
		imageUrl: "",
		active: true
	});
	const [serviceFile, setServiceFile] = useState(null);
	const [serviceEditingId, setServiceEditingId] = useState(null);
	const [serviceLoading, setServiceLoading] = useState(false);
	const [serviceFeedback, setServiceFeedback] = useState(null);
	const [servicePreviewUrl, setServicePreviewUrl] = useState(null);
	const [gallerySearch, setGallerySearch] = useState("");
	const [catalogSearch, setCatalogSearch] = useState("");
	const [serviceSearch, setServiceSearch] = useState("");
	const [selectedGalleryId, setSelectedGalleryId] = useState(null);
	const [selectedCatalogId, setSelectedCatalogId] = useState(null);
	const [selectedServiceId, setSelectedServiceId] = useState(null);
	const loadData = async () => {
		try {
			const [galleryData, catalogData, serviceData] = await Promise.all([
				galleryService.getAll(),
				catalogService.getAll(),
				servicesService.getAll()
			]);
			setGalleryItems(galleryData);
			setCatalogItems(catalogData);
			setServiceItems(serviceData);
			const desired = defaultCatalogCategories;
			const fromData = catalogData.map((item) => normalizeCategory(item.category));
			setCatalogCategories(Array.from(new Set([...desired, ...fromData])));
		} catch (error) {
			console.error("Failed to load admin data:", error);
			const msg = error instanceof Error ? error.message : "Erreur lors du chargement des données";
			setGalleryFeedback(msg);
			setCatalogFeedback(msg);
			setServiceFeedback(msg);
		}
	};
	useEffect(() => {
		loadData();
	}, []);
	const saveCategories = (next) => {
		setCatalogCategories(next);
		if (typeof window !== "undefined") window.localStorage.setItem("desmohair-categories", JSON.stringify(next));
	};
	const handleCreateCategory = () => {
		const trimmed = newCategoryName.trim();
		if (!trimmed) return;
		const n = normalizeCategory(trimmed);
		saveCategories(Array.from(new Set([n, ...catalogCategories])));
		setCatalogForm((current) => ({
			...current,
			category: n
		}));
		setNewCategoryName("");
	};
	const startGalleryEdit = (item) => {
		setGalleryEditingId(item.id);
		setGalleryForm({
			title: item.title,
			description: item.description || "",
			imageUrl: item.image_url,
			category: item.category,
			isFeatured: item.is_featured
		});
		setGalleryFile(null);
		setGalleryPreviewUrl(item.image_url || null);
		setGalleryFeedback("Modifiez puis enregistrez.");
		setActiveSection("gallery");
		setSelectedGalleryId(item.id);
	};
	const handleGallerySubmit = async (event) => {
		event.preventDefault();
		setGalleryFeedback(null);
		if (!galleryForm.title.trim()) {
			setGalleryFeedback("Le titre est obligatoire.");
			return;
		}
		if (!galleryForm.imageUrl.trim() && !galleryFile) {
			setGalleryFeedback("Ajoutez une URL ou une image.");
			return;
		}
		try {
			setGalleryLoading(true);
			const imageUrl = galleryFile ? await uploadService.uploadGalleryImage(galleryFile) : galleryForm.imageUrl.trim();
			const payload = {
				title: galleryForm.title,
				description: galleryForm.description || null,
				image_url: imageUrl,
				category: galleryForm.category,
				is_featured: galleryForm.isFeatured,
				sort_order: 0
			};
			if (galleryEditingId) {
				await galleryService.update(galleryEditingId, payload);
				setGalleryFeedback("Élément mis à jour.");
				success("Galerie", "Élément mis à jour.");
			} else {
				await galleryService.create(payload);
				setGalleryFeedback("Élément ajouté.");
				success("Galerie", "Élément ajouté.");
			}
			setGalleryForm({
				title: "",
				description: "",
				imageUrl: "",
				category: "coiffure",
				isFeatured: false
			});
			setGalleryFile(null);
			setGalleryPreviewUrl(null);
			setGalleryEditingId(null);
			await loadData();
		} catch (error) {
			const msg = error instanceof Error ? error.message : "Erreur inconnue";
			alert("Erreur Supabase : " + msg);
			setGalleryFeedback(msg);
		} finally {
			setGalleryLoading(false);
		}
	};
	const handleGalleryDelete = async (id) => {
		await galleryService.delete(id);
		if (selectedGalleryId === id) setSelectedGalleryId(null);
		await loadData();
	};
	const startCatalogEdit = (item) => {
		setCatalogEditingId(item.id);
		setCatalogForm({
			title: item.title,
			description: item.description || "",
			price: String(item.price),
			imageUrl: item.image_url || "",
			category: item.category,
			code: item.code || "",
			isAvailable: item.is_available
		});
		setCatalogFile(null);
		setCatalogPreviewUrl(item.image_url || null);
		setCatalogFeedback("Modifiez puis enregistrez.");
		setActiveSection("catalog");
		setSelectedCatalogId(item.id);
	};
	const handleCatalogSubmit = async (event) => {
		event.preventDefault();
		setCatalogFeedback(null);
		if (!catalogForm.title.trim()) {
			setCatalogFeedback("Le nom du produit est obligatoire.");
			return;
		}
		if (!catalogForm.imageUrl.trim() && !catalogFile) {
			setCatalogFeedback("Ajoutez une image ou un lien externe.");
			return;
		}
		try {
			setCatalogLoading(true);
			const imageUrl = catalogFile ? await uploadService.uploadGalleryImage(catalogFile) : catalogForm.imageUrl.trim();
			const category = normalizeCategory(catalogForm.category);
			if (category && !catalogCategories.includes(category)) saveCategories(Array.from(new Set([category, ...catalogCategories])));
			const payload = {
				title: catalogForm.title,
				description: catalogForm.description || null,
				price: Number(catalogForm.price) || 0,
				image_url: imageUrl || null,
				code: catalogForm.code?.trim() || void 0,
				category,
				is_available: catalogForm.isAvailable,
				sort_order: 0
			};
			if (catalogEditingId) {
				await catalogService.update(catalogEditingId, payload);
				setCatalogFeedback("Produit mis à jour.");
				success("Catalogue", "Produit mis à jour.");
			} else {
				await catalogService.create(payload);
				setCatalogFeedback("Produit ajouté au catalogue.");
				success("Catalogue", "Produit ajouté au catalogue.");
			}
			setCatalogForm({
				title: "",
				description: "",
				price: "",
				imageUrl: "",
				category: catalogCategories[0] || "Coiffure",
				code: "",
				isAvailable: true
			});
			setCatalogFile(null);
			setCatalogPreviewUrl(null);
			setCatalogEditingId(null);
			await loadData();
		} catch (error) {
			const msg = error instanceof Error ? error.message : "Erreur inconnue";
			alert("Erreur Supabase : " + msg);
			setCatalogFeedback(msg);
		} finally {
			setCatalogLoading(false);
		}
	};
	const handleCatalogDelete = async (id) => {
		await catalogService.delete(id);
		if (selectedCatalogId === id) setSelectedCatalogId(null);
		await loadData();
	};
	const startServiceEdit = (item) => {
		setServiceEditingId(item.id);
		setServiceForm({
			title: item.title,
			description: item.description || "",
			price: String(item.price),
			durationMin: String(item.duration_min),
			category: item.category,
			imageUrl: item.image_url || "",
			active: item.active
		});
		setServiceFile(null);
		setServicePreviewUrl(item.image_url || null);
		setServiceFeedback("Modifiez puis enregistrez.");
		setActiveSection("services");
		setSelectedServiceId(item.id);
	};
	const handleServiceSubmit = async (event) => {
		event.preventDefault();
		setServiceFeedback(null);
		if (!serviceForm.title.trim()) {
			setServiceFeedback("Le nom du service est obligatoire.");
			return;
		}
		try {
			setServiceLoading(true);
			const imageUrl = serviceFile ? await uploadService.uploadGalleryImage(serviceFile) : serviceForm.imageUrl.trim();
			const payload = {
				title: serviceForm.title,
				description: serviceForm.description || null,
				price: Number(serviceForm.price) || 0,
				duration_min: Number(serviceForm.durationMin) || 0,
				category: serviceForm.category,
				image_url: imageUrl || null,
				active: serviceForm.active
			};
			if (serviceEditingId) {
				await servicesService.update(serviceEditingId, payload);
				setServiceFeedback("Service mis à jour.");
				success("Services", "Service mis à jour.");
			} else {
				await servicesService.create(payload);
				setServiceFeedback("Service ajouté.");
				success("Services", "Service ajouté.");
			}
			setServiceForm({
				title: "",
				description: "",
				price: "",
				durationMin: "",
				category: "coiffure",
				imageUrl: "",
				active: true
			});
			setServiceFile(null);
			setServicePreviewUrl(null);
			setServiceEditingId(null);
			await loadData();
		} catch (error) {
			const msg = error instanceof Error ? error.message : "Erreur inconnue";
			alert("Erreur Supabase : " + msg);
			setServiceFeedback(msg);
		} finally {
			setServiceLoading(false);
		}
	};
	const handleServiceDelete = async (id) => {
		await servicesService.delete(id);
		if (selectedServiceId === id) setSelectedServiceId(null);
		await loadData();
	};
	const previewCards = useMemo(() => [
		{
			key: "gallery",
			title: "Galerie",
			count: galleryItems.length,
			subtitle: "images"
		},
		{
			key: "catalog",
			title: "Catalogue",
			count: catalogItems.length,
			subtitle: "produits"
		},
		{
			key: "services",
			title: "Services",
			count: serviceItems.length,
			subtitle: "prestations"
		}
	], [
		galleryItems,
		catalogItems,
		serviceItems
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-6 space-y-6",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]",
							children: "Tableau de bord"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold text-foreground",
							children: "Modifications rapides"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Cliquez sur une carte pour la modifier. Les modifications sont immédiates sur tout le site."
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: previewCards.map((card) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
								children: card.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-2xl font-bold text-foreground",
								children: card.count ?? 0
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: card.subtitle
							})
						]
					}, card.key))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]",
							children: "Galerie"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Images et mises en avant"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
								className: "w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]",
								placeholder: "Rechercher une image...",
								value: gallerySearch,
								onChange: (event) => setGallerySearch(event.target.value)
							})]
						}), activeSection !== "gallery" ? /* @__PURE__ */ jsx(GlassButton, {
							type: "button",
							variant: "primary",
							onClick: () => {
								setActiveSection("gallery");
								setGalleryEditingId(null);
								setGalleryForm({
									title: "",
									description: "",
									imageUrl: "",
									category: "coiffure",
									isFeatured: false
								});
								setGalleryFile(null);
								setGalleryPreviewUrl(null);
								setGalleryFeedback(null);
							},
							children: "Ajouter"
						}) : null]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: galleryItems.filter((item) => {
							const q = gallerySearch.trim().toLowerCase();
							if (!q) return true;
							return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
						}).map((item) => {
							return /* @__PURE__ */ jsxs("div", {
								className: `rounded-2xl border bg-white p-2 transition ${selectedGalleryId === item.id ? "border-[var(--gold)] shadow-md" : "border-stone-200"}`,
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => startGalleryEdit(item),
									className: "w-full text-left",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "overflow-hidden rounded-2xl ring-1 ring-black/5",
											children: item.image_url ? /* @__PURE__ */ jsx("img", {
												src: item.image_url,
												alt: item.title,
												className: "aspect-square w-full object-cover",
												loading: "lazy"
											}) : /* @__PURE__ */ jsx("div", { className: "aspect-square w-full bg-stone-100" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-xs font-semibold leading-tight line-clamp-2",
											children: item.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[10px] text-muted-foreground capitalize",
											children: item.category
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => startGalleryEdit(item),
										className: "flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition",
										children: "Modifier"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => void handleGalleryDelete(item.id),
										className: "rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition",
										children: "Supprimer"
									})]
								})]
							}, item.id);
						})
					}),
					galleryItems.filter((item) => {
						const q = gallerySearch.trim().toLowerCase();
						if (!q) return true;
						return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
					}).length === 0 && /* @__PURE__ */ jsx("p", {
						className: "mt-4 text-center text-sm text-muted-foreground",
						children: gallerySearch ? "Aucun résultat trouvé" : "Aucune image dans la galerie"
					}),
					activeSection === "gallery" ? /* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4",
						onSubmit: handleGallerySubmit,
						children: [
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: galleryForm.title,
								onChange: (event) => setGalleryForm({
									...galleryForm,
									title: event.target.value
								}),
								placeholder: "Titre"
							}),
							/* @__PURE__ */ jsx("textarea", {
								className: "min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: galleryForm.description,
								onChange: (event) => setGalleryForm({
									...galleryForm,
									description: event.target.value
								}),
								placeholder: "Description"
							}),
							/* @__PURE__ */ jsx("select", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: galleryForm.category,
								onChange: (event) => setGalleryForm({
									...galleryForm,
									category: event.target.value
								}),
								children: galleryCategories.map((category) => /* @__PURE__ */ jsx("option", {
									value: category,
									children: category
								}, category))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Lien image"
								}), /* @__PURE__ */ jsx("input", {
									className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
									value: galleryForm.imageUrl,
									onChange: (event) => {
										setGalleryForm({
											...galleryForm,
											imageUrl: event.target.value
										});
										setGalleryPreviewUrl(event.target.value.trim() || null);
									},
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Image"
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50",
									children: [
										/* @__PURE__ */ jsx("span", { children: galleryFile?.name ?? "Sélectionner une image" }),
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]",
											children: "Parcourir"
										}),
										/* @__PURE__ */ jsx("input", {
											className: "sr-only",
											type: "file",
											accept: "image/*",
											onChange: (event) => {
												const file = event.target.files?.[0] ?? null;
												setGalleryFile(file);
												if (file) setGalleryPreviewUrl(URL.createObjectURL(file));
											}
										})
									]
								})]
							}),
							galleryPreviewUrl ? /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-stone-200 bg-white p-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
									children: "Aperçu"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 overflow-hidden rounded-[24px] bg-stone-100",
									children: /* @__PURE__ */ jsx("img", {
										src: galleryPreviewUrl,
										alt: "Aperçu",
										className: "aspect-[4/3] w-full object-cover",
										loading: "lazy"
									})
								})]
							}) : null,
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: galleryForm.isFeatured,
									onChange: (event) => setGalleryForm({
										...galleryForm,
										isFeatured: event.target.checked
									})
								}), "Mettre en avant"]
							}),
							galleryFeedback ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-[var(--gold-deep)]",
								children: galleryFeedback
							}) : null,
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsx(GlassButton, {
									type: "submit",
									variant: "primary",
									disabled: galleryLoading,
									children: galleryLoading ? "Enregistrement..." : galleryEditingId ? "Enregistrer" : "Ajouter"
								}), /* @__PURE__ */ jsx(GlassButton, {
									type: "button",
									variant: "light",
									onClick: () => {
										setActiveSection(null);
									},
									children: "Fermer"
								})]
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]",
							children: "Catalogue"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Produits, prix et catégories"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
								className: "w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]",
								placeholder: "Rechercher un produit...",
								value: catalogSearch,
								onChange: (event) => setCatalogSearch(event.target.value)
							})]
						}), activeSection !== "catalog" ? /* @__PURE__ */ jsx(GlassButton, {
							type: "button",
							variant: "primary",
							onClick: () => {
								setActiveSection("catalog");
								setCatalogEditingId(null);
								setCatalogForm({
									title: "",
									description: "",
									price: "",
									imageUrl: "",
									category: catalogCategories[0] || "Coiffure",
									code: "",
									isAvailable: true
								});
								setCatalogFile(null);
								setCatalogPreviewUrl(null);
								setCatalogFeedback(null);
							},
							children: "Ajouter"
						}) : null]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: catalogItems.filter((item) => {
							const q = catalogSearch.trim().toLowerCase();
							if (!q) return true;
							return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
						}).map((item) => {
							return /* @__PURE__ */ jsxs("div", {
								className: `rounded-2xl border bg-white p-2 transition ${selectedCatalogId === item.id ? "border-[var(--gold)] shadow-md" : "border-stone-200"}`,
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => startCatalogEdit(item),
									className: "w-full text-left",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "overflow-hidden rounded-2xl ring-1 ring-black/5",
											children: item.image_url && /* @__PURE__ */ jsx("img", {
												src: item.image_url,
												alt: item.title,
												className: "aspect-[4/5] w-full object-cover",
												loading: "lazy"
											})
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-xs font-semibold leading-tight line-clamp-2",
											children: item.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[10px] text-muted-foreground",
											children: item.category
										}),
										item.price > 0 && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm font-bold text-gold",
											children: formatPrice(item.price)
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => startCatalogEdit(item),
										className: "flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition",
										children: "Modifier"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => void handleCatalogDelete(item.id),
										className: "rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition",
										children: "Supprimer"
									})]
								})]
							}, item.id);
						})
					}),
					catalogItems.filter((item) => {
						const q = catalogSearch.trim().toLowerCase();
						if (!q) return true;
						return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
					}).length === 0 && /* @__PURE__ */ jsx("p", {
						className: "mt-4 text-center text-sm text-muted-foreground",
						children: catalogSearch ? "Aucun résultat trouvé" : "Aucun produit dans le catalogue"
					}),
					activeSection === "catalog" ? /* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4",
						onSubmit: handleCatalogSubmit,
						children: [
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: catalogForm.title,
								onChange: (event) => setCatalogForm({
									...catalogForm,
									title: event.target.value
								}),
								placeholder: "Nom du produit"
							}),
							/* @__PURE__ */ jsx("textarea", {
								className: "min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: catalogForm.description,
								onChange: (event) => setCatalogForm({
									...catalogForm,
									description: event.target.value
								}),
								placeholder: "Description"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: catalogForm.price,
								onChange: (event) => setCatalogForm({
									...catalogForm,
									price: event.target.value
								}),
								placeholder: "Prix (FCFA)"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ jsx("select", {
										className: "flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2",
										value: catalogForm.category,
										onChange: (event) => setCatalogForm({
											...catalogForm,
											category: event.target.value
										}),
										children: catalogCategories.map((category) => /* @__PURE__ */ jsx("option", {
											value: category,
											children: category
										}, category))
									}),
									/* @__PURE__ */ jsx("input", {
										className: "min-w-[180px] rounded-xl border border-stone-200 bg-white px-3 py-2",
										value: newCategoryName,
										onChange: (event) => setNewCategoryName(event.target.value),
										placeholder: "Nouvelle catégorie"
									}),
									/* @__PURE__ */ jsx(GlassButton, {
										type: "button",
										variant: "light",
										onClick: handleCreateCategory,
										children: "Créer"
									})
								]
							}),
							/* @__PURE__ */ jsxs("select", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: catalogForm.code,
								onChange: (event) => setCatalogForm({
									...catalogForm,
									code: event.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Code produit (optionnel)"
								}), availableCodes.map((c) => /* @__PURE__ */ jsx("option", {
									value: c,
									children: c
								}, c))]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Lien image"
								}), /* @__PURE__ */ jsx("input", {
									className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
									value: catalogForm.imageUrl,
									onChange: (event) => {
										setCatalogForm({
											...catalogForm,
											imageUrl: event.target.value
										});
										setCatalogPreviewUrl(event.target.value.trim() || null);
									},
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Image"
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50",
									children: [
										/* @__PURE__ */ jsx("span", { children: catalogFile?.name ?? "Sélectionner une image" }),
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]",
											children: "Parcourir"
										}),
										/* @__PURE__ */ jsx("input", {
											className: "sr-only",
											type: "file",
											accept: "image/*",
											onChange: (event) => {
												const file = event.target.files?.[0] ?? null;
												setCatalogFile(file);
												if (file) setCatalogPreviewUrl(URL.createObjectURL(file));
											}
										})
									]
								})]
							}),
							catalogPreviewUrl ? /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-stone-200 bg-white p-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
									children: "Aperçu"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 overflow-hidden rounded-[24px] bg-stone-100",
									children: /* @__PURE__ */ jsx("img", {
										src: catalogPreviewUrl,
										alt: "Aperçu",
										className: "aspect-[4/3] w-full object-cover",
										loading: "lazy"
									})
								})]
							}) : null,
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: catalogForm.isAvailable,
									onChange: (event) => setCatalogForm({
										...catalogForm,
										isAvailable: event.target.checked
									})
								}), "Disponible à la vente"]
							}),
							catalogFeedback ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-[var(--gold-deep)]",
								children: catalogFeedback
							}) : null,
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsx(GlassButton, {
									type: "submit",
									variant: "primary",
									disabled: catalogLoading,
									children: catalogLoading ? "Enregistrement..." : catalogEditingId ? "Enregistrer" : "Ajouter"
								}), /* @__PURE__ */ jsx(GlassButton, {
									type: "button",
									variant: "light",
									onClick: () => {
										setActiveSection(null);
									},
									children: "Fermer"
								})]
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]",
							children: "Services"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Prestations et disponibilités"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
								className: "w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]",
								placeholder: "Rechercher un service...",
								value: serviceSearch,
								onChange: (event) => setServiceSearch(event.target.value)
							})]
						}), activeSection !== "services" ? /* @__PURE__ */ jsx(GlassButton, {
							type: "button",
							variant: "primary",
							onClick: () => {
								setActiveSection("services");
								setServiceEditingId(null);
								setServiceForm({
									title: "",
									description: "",
									price: "",
									durationMin: "",
									category: "Coiffure",
									imageUrl: "",
									active: true
								});
								setServiceFile(null);
								setServicePreviewUrl(null);
								setServiceFeedback(null);
							},
							children: "Ajouter"
						}) : null]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: serviceItems.filter((item) => {
							const q = serviceSearch.trim().toLowerCase();
							if (!q) return true;
							return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
						}).map((item) => {
							return /* @__PURE__ */ jsxs("div", {
								className: `rounded-2xl border bg-white p-2 transition ${selectedServiceId === item.id ? "border-[var(--gold)] shadow-md" : "border-stone-200"}`,
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => startServiceEdit(item),
									className: "w-full text-left",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "overflow-hidden rounded-2xl ring-1 ring-black/5",
											children: item.image_url && /* @__PURE__ */ jsx("img", {
												src: item.image_url,
												alt: item.title,
												className: "aspect-[4/5] w-full object-cover",
												loading: "lazy"
											})
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-xs font-semibold leading-tight line-clamp-2",
											children: item.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[10px] text-muted-foreground",
											children: item.category
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-1 flex items-center gap-2",
											children: [item.price > 0 && /* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-gold",
												children: formatPrice(item.price)
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-[10px] text-muted-foreground",
												children: [item.duration_min, " min"]
											})]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => startServiceEdit(item),
										className: "flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition",
										children: "Modifier"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => void handleServiceDelete(item.id),
										className: "rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition",
										children: "Supprimer"
									})]
								})]
							}, item.id);
						})
					}),
					serviceItems.filter((item) => {
						const q = serviceSearch.trim().toLowerCase();
						if (!q) return true;
						return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
					}).length === 0 && /* @__PURE__ */ jsx("p", {
						className: "mt-4 text-center text-sm text-muted-foreground",
						children: serviceSearch ? "Aucun résultat trouvé" : "Aucun service disponible"
					}),
					activeSection === "services" ? /* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4",
						onSubmit: handleServiceSubmit,
						children: [
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: serviceForm.title,
								onChange: (event) => setServiceForm({
									...serviceForm,
									title: event.target.value
								}),
								placeholder: "Nom du service"
							}),
							/* @__PURE__ */ jsx("textarea", {
								className: "min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: serviceForm.description,
								onChange: (event) => setServiceForm({
									...serviceForm,
									description: event.target.value
								}),
								placeholder: "Description"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: serviceForm.price,
								onChange: (event) => setServiceForm({
									...serviceForm,
									price: event.target.value
								}),
								placeholder: "Prix (FCFA)"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: serviceForm.durationMin,
								onChange: (event) => setServiceForm({
									...serviceForm,
									durationMin: event.target.value
								}),
								placeholder: "Durée en minutes"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
								value: serviceForm.category,
								onChange: (event) => setServiceForm({
									...serviceForm,
									category: event.target.value
								}),
								placeholder: "Catégorie"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Lien image"
								}), /* @__PURE__ */ jsx("input", {
									className: "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
									value: serviceForm.imageUrl,
									onChange: (event) => {
										setServiceForm({
											...serviceForm,
											imageUrl: event.target.value
										});
										setServicePreviewUrl(event.target.value.trim() || null);
									},
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-foreground",
									children: "Image"
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50",
									children: [
										/* @__PURE__ */ jsx("span", { children: serviceFile?.name ?? "Sélectionner une image" }),
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]",
											children: "Parcourir"
										}),
										/* @__PURE__ */ jsx("input", {
											className: "sr-only",
											type: "file",
											accept: "image/*",
											onChange: (event) => {
												const file = event.target.files?.[0] ?? null;
												setServiceFile(file);
												if (file) setServicePreviewUrl(URL.createObjectURL(file));
											}
										})
									]
								})]
							}),
							servicePreviewUrl ? /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-stone-200 bg-white p-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
									children: "Aperçu"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 overflow-hidden rounded-[24px] bg-stone-100",
									children: /* @__PURE__ */ jsx("img", {
										src: servicePreviewUrl,
										alt: "Aperçu",
										className: "aspect-[4/3] w-full object-cover",
										loading: "lazy"
									})
								})]
							}) : null,
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: serviceForm.active,
									onChange: (event) => setServiceForm({
										...serviceForm,
										active: event.target.checked
									})
								}), "Service actif"]
							}),
							serviceFeedback ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-[var(--gold-deep)]",
								children: serviceFeedback
							}) : null,
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsx(GlassButton, {
									type: "submit",
									variant: "primary",
									disabled: serviceLoading,
									children: serviceLoading ? "Enregistrement..." : serviceEditingId ? "Enregistrer" : "Ajouter"
								}), /* @__PURE__ */ jsx(GlassButton, {
									type: "button",
									variant: "light",
									onClick: () => {
										setActiveSection(null);
									},
									children: "Fermer"
								})]
							})
						]
					}) : null
				]
			})
		]
	});
}
//#endregion
//#region src/components/AdminNotifications.tsx
function AdminNotifications({ isAdmin }) {
	const [notifications, setNotifications] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const loadNotifications = useCallback(() => {
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				const stored = window.localStorage.getItem("admin-notifications");
				if (stored) {
					const parsed = JSON.parse(stored);
					setNotifications(parsed);
					setUnreadCount(parsed.filter((n) => !n.read).length);
					return;
				}
			}
			setNotifications([]);
			setUnreadCount(0);
		} catch (error) {
			console.error("Failed to load notifications:", error);
			setNotifications([]);
			setUnreadCount(0);
		}
	}, []);
	useEffect(() => {
		if (!isAdmin) return;
		loadNotifications();
		const interval = setInterval(loadNotifications, 3e4);
		return () => clearInterval(interval);
	}, [isAdmin, loadNotifications]);
	const markAsRead = (id) => {
		setNotifications((prev) => {
			const updated = prev.map((n) => n.id === id ? {
				...n,
				read: true
			} : n);
			setUnreadCount(updated.filter((n) => !n.read).length);
			if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
			return updated;
		});
	};
	const markAllAsRead = () => {
		setNotifications((prev) => {
			const updated = prev.map((n) => ({
				...n,
				read: true
			}));
			setUnreadCount(0);
			if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
			return updated;
		});
	};
	const deleteNotification = (id) => {
		setNotifications((prev) => {
			const updated = prev.filter((n) => n.id !== id);
			setUnreadCount(updated.filter((n) => !n.read).length);
			if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
			return updated;
		});
	};
	const clearAll = () => {
		setNotifications([]);
		setUnreadCount(0);
		if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("admin-notifications", JSON.stringify([]));
	};
	if (!isAdmin) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setIsOpen((prev) => !prev),
			className: "relative rounded-full p-2 hover:bg-stone-100 transition",
			"aria-expanded": isOpen,
			"aria-label": "Notifications",
			children: [/* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-muted-foreground" }), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white",
				children: unreadCount > 9 ? "9+" : unreadCount
			})]
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			className: "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm",
			onClick: () => setIsOpen(false)
		}), /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				scale: .95,
				y: 10
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: 10
			},
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 300
			},
			className: "absolute right-0 top-full z-50 mt-2 w-80 max-h-96 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-stone-100 p-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-semibold text-foreground",
					children: "Notifications"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [unreadCount > 0 && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: markAllAsRead,
						className: "text-xs font-medium text-blue-600 hover:text-blue-700",
						children: "Tout marquer comme lu"
					}), notifications.length > 0 && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: clearAll,
						className: "text-xs font-medium text-red-600 hover:text-red-700",
						children: "Tout effacer"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "max-h-72 overflow-y-auto",
				children: notifications.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Aucune notification"
				}) : notifications.map((notification) => /* @__PURE__ */ jsx("div", {
					className: `border-b border-stone-50 p-4 ${!notification.read ? "bg-blue-50/50" : ""}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-foreground",
									children: notification.message
								}),
								notification.rating && /* @__PURE__ */ jsx("div", {
									className: "mt-1 flex items-center gap-1",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("span", {
										className: `text-xs ${i < notification.rating ? "text-yellow-500" : "text-gray-300"}`,
										children: "★"
									}, i))
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: new Date(notification.timestamp).toLocaleString("fr-FR")
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-1",
							children: [!notification.read && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => markAsRead(notification.id),
								className: "rounded-full p-1 hover:bg-blue-100 transition",
								title: "Marquer comme lu",
								children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-blue-600" })
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => deleteNotification(notification.id),
								className: "rounded-full p-1 hover:bg-red-100 transition",
								title: "Supprimer",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3 text-red-600" })
							})]
						})]
					})
				}, notification.id))
			})]
		})] }) })]
	});
}
//#endregion
//#region src/routes/admin.tsx?tsr-split=component
function AdminPage() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [checking, setChecking] = useState(true);
	useEffect(() => {
		const active = { current: true };
		const loadUser = async () => {
			try {
				const currentUser = await authService.getCurrentUser();
				if (active.current) {
					setUser(currentUser);
					if (!currentUser || currentUser.role !== "admin") navigate({
						to: "/profile",
						replace: true
					});
				}
			} catch {
				if (active.current) navigate({
					to: "/login",
					replace: true
				});
			} finally {
				if (active.current) setChecking(false);
			}
		};
		loadUser();
		return () => {
			active.current = false;
		};
	}, [navigate]);
	const actions = [
		{
			title: "Éditer les services",
			description: "Gérer les prestations et leur visibilité",
			icon: Sparkles
		},
		{
			title: "Gérer le catalogue",
			description: "Ajouter, modifier ou retirer les produits",
			icon: LayoutGrid
		},
		{
			title: "Mettre à jour la galerie",
			description: "Publier de nouveaux visuels",
			icon: Image
		},
		{
			title: "Paramètres salon",
			description: "Coordonnées, horaires et informations",
			icon: Settings
		}
	];
	if (checking) return /* @__PURE__ */ jsx(AppShell, {
		title: "Vérification de l'accès",
		subtitle: "Connexion sécurisée en cours…",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			className: "mt-6 flex flex-col items-center justify-center py-16",
			children: [/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-600" }), /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Vérification du statut administrateur…"
			})]
		})
	});
	if (!user || user.role !== "admin") return null;
	return /* @__PURE__ */ jsx(AppShell, {
		title: "Administration",
		subtitle: "Espace réservé aux comptes administrateurs",
		headerRight: /* @__PURE__ */ jsx(AdminNotifications, { isAdmin: true }),
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
				className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-blue-700",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.2em]",
							children: "Accès sécurisé"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-red-50 p-5 shadow-sm",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold text-blue-700",
							children: "Bienvenue dans votre tableau de bord"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-slate-600",
							children: "Vous êtes connecté en tant qu'administrateur. Cette vue vous permet de préparer les modifications du salon."
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: actions.map(({ title, description, icon: Icon }, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: 10
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: .1 + i * .05 },
							className: "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-sm",
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-slate-900",
								children: title
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: description
							})] })]
						}, title))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ jsx(GlassButton, {
							as: Link,
							to: "/",
							variant: "gold",
							size: "md",
							children: "Retour à l'accueil"
						}), /* @__PURE__ */ jsx(GlassButton, {
							as: Link,
							to: "/login",
							variant: "light",
							size: "md",
							children: "Changer de compte"
						})]
					}),
					/* @__PURE__ */ jsx(ImprovedAdminEditor, {})
				]
			})
		})
	});
}
//#endregion
export { AdminPage as component };
