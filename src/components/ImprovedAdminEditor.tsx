import { useEffect, useMemo, useState } from "react";
import { X, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import {
  catalogService,
  galleryService,
  servicesService,
  uploadService,
} from "@/backend/services";
import { SALONS } from "@/lib/salon-data";
import { GlassButton } from "@/components/GlassButton";
import { ImageCarousel } from "@/components/ImageCarousel";
import type { CatalogItem, GalleryItem, ServiceItem } from "@/backend/models";
import type { FormEvent } from "react";

type SectionKey = "gallery" | "catalog" | "services" | null;

const KNOWN_CATEGORY_ALIASES: Record<string, string> = {
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
  promotion: "Promo",
};

const defaultCatalogCategories = [
  "Coiffure",
  "Mèches",
  "Équipement",
  "Produits",
  "Perruques",
  "Promo",
  "Autre",
];

const galleryCategories = [
  "Coiffure",
  "Mèches",
  "Équipement",
  "Produits",
  "Perruques",
  "Autre",
] as const;

function normalizeCategory(raw?: string | null) {
  if (!raw) return "autres";
  const value = String(raw).trim();
  if (!value) return "autres";
  const mapped = KNOWN_CATEGORY_ALIASES[value.toLowerCase()];
  if (mapped) return mapped;
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

export function ImprovedAdminEditor() {
  const { success, error: toastError } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  const [catalogCategories, setCatalogCategories] = useState<string[]>(defaultCatalogCategories);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [codesLoaded, setCodesLoaded] = useState(false);

  useEffect(() => {
    const loadCodes = async () => {
      try {
        const codes = await catalogService.getAllCodes();
        setAvailableCodes(codes);
      } catch (e) {
        console.error("Failed to load catalog codes:", e);
      } finally {
        setCodesLoaded(true);
      }
    };
    void loadCodes();
  }, []);

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "coiffure" as GalleryItem["category"],
    isFeatured: false,
    salon_name: SALONS[0]?.name ?? "Parfait Design",
  });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryEditingId, setGalleryEditingId] = useState<string | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFeedback, setGalleryFeedback] = useState<string | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null);

  const [catalogForm, setCatalogForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    category: "Coiffure",
    code: "",
    isAvailable: true,
    salon_name: SALONS[0]?.name ?? "Parfait Design",
  });
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [catalogGalleryFiles, setCatalogGalleryFiles] = useState<File[]>([]);
  const [catalogGalleryUrls, setCatalogGalleryUrls] = useState<string[]>([]);
  const [catalogEditingId, setCatalogEditingId] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogFeedback, setCatalogFeedback] = useState<string | null>(null);
  const [catalogPreviewUrl, setCatalogPreviewUrl] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    price: "",
    durationMin: "",
    category: "Coiffure",
    imageUrl: "",
    code: "",
    active: true,
    salon_name: SALONS[0]?.name ?? "Parfait Design",
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [serviceGalleryFiles, setServiceGalleryFiles] = useState<File[]>([]);
  const [serviceGalleryUrls, setServiceGalleryUrls] = useState<string[]>([]);
  const [serviceEditingId, setServiceEditingId] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);
  const [servicePreviewUrl, setServicePreviewUrl] = useState<string | null>(null);

  const [gallerySearch, setGallerySearch] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [galleryData, catalogData, serviceData] = await Promise.all([
        galleryService.getAll(),
        catalogService.getAll(),
        servicesService.getAll(),
      ]);

      setGalleryItems(galleryData);
      setCatalogItems(catalogData);
      setServiceItems(serviceData);

      const desired = defaultCatalogCategories;
      const fromData: string[] = catalogData.map((item) => normalizeCategory(item.category));
      const merged = Array.from(new Set([...desired, ...fromData]));
      setCatalogCategories(merged);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      const msg = error instanceof Error ? error.message : "Erreur lors du chargement des données";
      setGalleryFeedback(msg);
      setCatalogFeedback(msg);
      setServiceFeedback(msg);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const saveCategories = (next: string[]) => {
    setCatalogCategories(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("desmohair-categories", JSON.stringify(next));
    }
  };

  const handleCreateCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const n = normalizeCategory(trimmed);
    const next = Array.from(new Set([n, ...catalogCategories]));
    saveCategories(next);
    setCatalogForm((current) => ({ ...current, category: n }));
    setNewCategoryName("");
  };

  const openSection = (section: SectionKey) => {
    setActiveSection(section);
    setGalleryFeedback(null);
    setCatalogFeedback(null);
    setServiceFeedback(null);
  };

  const startGalleryEdit = (item: GalleryItem) => {
    setGalleryEditingId(item.id);
    setGalleryForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.image_url,
      category: item.category,
      isFeatured: item.is_featured,
      salon_name: (item as any).salon_name ?? SALONS[0]?.name ?? "Parfait Design",
    });
    setGalleryFile(null);
    setGalleryPreviewUrl(item.image_url || null);
    setGalleryFeedback("Modifiez puis enregistrez.");
    setActiveSection("gallery");
    setSelectedGalleryId(item.id);
  };

  const handleGallerySubmit = async (event: FormEvent) => {
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
      const imageUrl = galleryFile
        ? await uploadService.uploadGalleryImage(galleryFile)
        : galleryForm.imageUrl.trim();
      const payload = {
        title: galleryForm.title,
        description: galleryForm.description || null,
        image_url: imageUrl,
        category: galleryForm.category,
        is_featured: galleryForm.isFeatured,
        sort_order: 0,
        salon_name: galleryForm.salon_name,
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
        isFeatured: false,
        salon_name: SALONS[0]?.name ?? "Parfait Design",
      });
      setGalleryFile(null);
      setGalleryPreviewUrl(null);
      setGalleryEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("[ImprovedAdminEditor] gallery error:", error);
      setGalleryFeedback(msg);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    await galleryService.delete(id);
    if (selectedGalleryId === id) setSelectedGalleryId(null);
    await loadData();
  };

  const startCatalogEdit = (item: CatalogItem) => {
    setCatalogEditingId(item.id);
    setCatalogForm({
      title: item.title,
      description: item.description || "",
      price: String(item.price),
      originalPrice: String((item as any).original_price || ""),
      imageUrl: item.image_url || "",
      category: item.category,
      code: item.code || "",
      isAvailable: item.is_available,
      salon_name: item.salon_name || (SALONS[0]?.name ?? "Parfait Design"),
    });
    setCatalogFile(null);
    setCatalogPreviewUrl(item.image_url || null);
    setCatalogGalleryFiles([]);
    setCatalogGalleryUrls(item.gallery_images ?? []);
    setCatalogFeedback("Modifiez puis enregistrez.");
    setActiveSection("catalog");
    setSelectedCatalogId(item.id);
  };

  const handleCatalogSubmit = async (event: FormEvent) => {
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

    const trimmedCode = catalogForm.code?.trim();
    if (trimmedCode) {
      const isDuplicate = availableCodes.some(
        (c) => c.toLowerCase() === trimmedCode.toLowerCase() && c !== catalogEditingId,
      );
      if (isDuplicate) {
        setCatalogFeedback(
          `Le code "${trimmedCode}" existe déjà. Veuillez utiliser un code unique ou le réutiliser en modifiant le produit existant.`,
        );
        return;
      }
    }

    try {
      setCatalogLoading(true);
      const imageUrl = catalogFile
        ? await uploadService.uploadGalleryImage(catalogFile)
        : catalogForm.imageUrl.trim();
      const galleryUrls: string[] = [];
      for (const file of catalogGalleryFiles) {
        const url = await uploadService.uploadGalleryImage(file);
        galleryUrls.push(url);
      }
      const existingGallery =
        (catalogItems.find((i) => i.id === catalogEditingId) as any)?.gallery_images ?? [];
      const combinedGallery = [...existingGallery, ...galleryUrls];
      const category = normalizeCategory(catalogForm.category);
      if (category && !catalogCategories.includes(category)) {
        saveCategories(Array.from(new Set([category, ...catalogCategories])));
      }
      const payload: Omit<CatalogItem, "id" | "created_at" | "updated_at"> = {
        title: catalogForm.title,
        description: catalogForm.description || null,
        price: Number(catalogForm.price) || 0,
        original_price: catalogForm.originalPrice ? Number(catalogForm.originalPrice) : null,
        image_url: imageUrl || null,
        gallery_images: combinedGallery,
        code: trimmedCode || undefined,
        category,
        is_available: catalogForm.isAvailable,
        sort_order: 0,
        salon_name: catalogForm.salon_name,
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
        originalPrice: "",
        imageUrl: "",
        category: catalogCategories[0] || "Coiffure",
        code: "",
        isAvailable: true,
        salon_name: SALONS[0]?.name ?? "Parfait Design",
      });
      setCatalogFile(null);
      setCatalogPreviewUrl(null);
      setCatalogGalleryFiles([]);
      setCatalogGalleryUrls([]);
      setCatalogEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("[ImprovedAdminEditor] catalog error:", error);
      setCatalogFeedback(msg);
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleCatalogDelete = async (id: string) => {
    await catalogService.delete(id);
    if (selectedCatalogId === id) setSelectedCatalogId(null);
    await loadData();
  };

  const startServiceEdit = (item: ServiceItem) => {
    setServiceEditingId(item.id);
    setServiceForm({
      title: item.title,
      description: item.description || "",
      price: String(item.price),
      durationMin: String(item.duration_min),
      category: item.category,
      imageUrl: item.image_url || "",
      code: item.code || "",
      active: item.active,
      salon_name: item.salon_name || (SALONS[0]?.name ?? "Parfait Design"),
    });
    setServiceFile(null);
    setServicePreviewUrl(item.image_url || null);
    setServiceGalleryFiles([]);
    setServiceGalleryUrls(item.gallery_images ?? []);
    setServiceFeedback("Modifiez puis enregistrez.");
    setActiveSection("services");
    setSelectedServiceId(item.id);
  };

  const handleServiceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServiceFeedback(null);
    if (!serviceForm.title.trim()) {
      setServiceFeedback("Le nom du service est obligatoire.");
      return;
    }

    try {
      setServiceLoading(true);
      const imageUrl = serviceFile
        ? await uploadService.uploadGalleryImage(serviceFile)
        : serviceForm.imageUrl.trim();
      const galleryUrls: string[] = [];
      for (const file of serviceGalleryFiles) {
        const url = await uploadService.uploadGalleryImage(file);
        galleryUrls.push(url);
      }
      const existingGallery =
        (serviceItems.find((i) => i.id === serviceEditingId) as any)?.gallery_images ?? [];
      const combinedGallery = [...existingGallery, ...galleryUrls];
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description || null,
        price: Number(serviceForm.price) || 0,
        duration_min: Number(serviceForm.durationMin) || 0,
        category: serviceForm.category,
        image_url: imageUrl || null,
        gallery_images: combinedGallery,
        code: serviceForm.code || null,
        active: serviceForm.active,
        salon_name: serviceForm.salon_name,
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
        code: "",
        active: true,
        salon_name: SALONS[0]?.name ?? "Parfait Design",
      });
      setServiceFile(null);
      setServicePreviewUrl(null);
      setServiceGalleryFiles([]);
      setServiceGalleryUrls([]);
      setServiceEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("[ImprovedAdminEditor] service error:", error);
      setServiceFeedback(msg);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleServiceDelete = async (id: string) => {
    await servicesService.delete(id);
    if (selectedServiceId === id) setSelectedServiceId(null);
    await loadData();
  };

  const previewCards = useMemo(
    () => [
      { key: "gallery", title: "Galerie", count: galleryItems.length, subtitle: "images" },
      { key: "catalog", title: "Catalogue", count: catalogItems.length, subtitle: "produits" },
      { key: "services", title: "Services", count: serviceItems.length, subtitle: "prestations" },
    ],
    [galleryItems, catalogItems, serviceItems],
  );

  return (
    <div className="mt-6 space-y-6">
      {/* Tableau de bord */}
      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
            Tableau de bord
          </p>
          <h2 className="text-xl font-semibold text-foreground">Modifications rapides</h2>
          <p className="text-sm text-muted-foreground">
            Cliquez sur une carte pour la modifier. Les modifications sont immédiates sur tout le
            site.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {previewCards.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-foreground">{card.count ?? 0}</p>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galerie */}
      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
            Galerie
          </p>
          <h3 className="text-lg font-semibold text-foreground">Images et mises en avant</h3>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]"
              placeholder="Rechercher une image..."
              value={gallerySearch}
              onChange={(event) => setGallerySearch(event.target.value)}
            />
          </div>
          {activeSection !== "gallery" ? (
            <GlassButton
              type="button"
              variant="primary"
              onClick={() => {
                setActiveSection("gallery");
                setGalleryEditingId(null);
                setGalleryForm({
                  title: "",
                  description: "",
                  imageUrl: "",
                  category: "coiffure",
                  isFeatured: false,
                  salon_name: SALONS[0]?.name ?? "Parfait Design",
                });
                setGalleryFile(null);
                setGalleryPreviewUrl(null);
                setGalleryFeedback(null);
              }}
            >
              Ajouter
            </GlassButton>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {galleryItems
            .filter((item) => {
              const q = gallerySearch.trim().toLowerCase();
              if (!q) return true;
              return (
                item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
              );
            })
            .map((item) => {
              const isSelected = selectedGalleryId === item.id;
              return (
                 <div
                   key={item.id}
                   className={`rounded-2xl border bg-white p-2 transition ${
                     isSelected ? "border-[var(--gold)] shadow-md" : "border-stone-200"
                   }`}
                 >
                   <div
                     role="button"
                     tabIndex={0}
                     onClick={() => startGalleryEdit(item)}
                     onKeyDown={(event) => {
                       if (event.key === "Enter" || event.key === " ") {
                         event.preventDefault();
                         startGalleryEdit(item);
                       }
                     }}
                     className="w-full text-left cursor-pointer"
                   >
                     {item.image_url && (
                       <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                         <img
                           src={item.image_url}
                           alt={item.title}
                           className="aspect-square w-full object-cover"
                           loading="lazy"
                         />
                       </div>
                     )}
                     <p
                       className={`text-xs font-semibold leading-tight line-clamp-2 ${item.image_url ? "mt-2" : ""}`}
                     >
                       {item.title}
                     </p>
                     <p className="text-[10px] text-muted-foreground capitalize">{item.category}</p>
                   </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            console.log('[bell] gallery edit clicked', item.title);
                            startGalleryEdit(item);
                          }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] transition"
                         aria-label="Modifier"
                       >
                         <Pencil className="h-5 w-5" />
                       </button>
                       <button
                         type="button"
                         onClick={(event) => {
                           event.stopPropagation();
                           console.log('[bell] gallery delete clicked', item.id);
                           void handleGalleryDelete(item.id);
                         }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-[0.97] transition"
                         aria-label="Supprimer"
                       >
                         <Trash2 className="h-5 w-5" />
                       </button>
                     </div>
                 </div>
              );
            })}
        </div>
        {galleryItems.filter((item) => {
          const q = gallerySearch.trim().toLowerCase();
          if (!q) return true;
          return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {gallerySearch ? "Aucun résultat trouvé" : "Aucune image dans la galerie"}
          </p>
        )}

        {activeSection === "gallery" ? (
          <form
            className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleGallerySubmit}
          >
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.title}
              onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })}
              placeholder="Titre"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.description}
              onChange={(event) =>
                setGalleryForm({ ...galleryForm, description: event.target.value })
              }
              placeholder="Description"
            />
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.category}
              onChange={(event) =>
                setGalleryForm({
                  ...galleryForm,
                  category: event.target.value as GalleryItem["category"],
                })
              }
            >
              {galleryCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.salon_name}
              onChange={(event) =>
                setGalleryForm({ ...galleryForm, salon_name: event.target.value })
              }
            >
              {SALONS.map((salon) => (
                <option key={salon.id} value={salon.name}>
                  {salon.name}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Lien image</label>
              <input
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={galleryForm.imageUrl}
                onChange={(event) => {
                  setGalleryForm({ ...galleryForm, imageUrl: event.target.value });
                  setGalleryPreviewUrl(event.target.value.trim() || null);
                }}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Image</label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50">
                <span>{galleryFile?.name ?? "Sélectionner une image"}</span>
                <span className="rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]">
                  Parcourir
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setGalleryFile(file);
                    if (file) setGalleryPreviewUrl(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            {galleryPreviewUrl ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Aperçu
                </p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <img
                    src={galleryPreviewUrl}
                    alt="Aperçu"
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={galleryForm.isFeatured}
                onChange={(event) =>
                  setGalleryForm({ ...galleryForm, isFeatured: event.target.checked })
                }
              />
              Mettre en avant
            </label>
            {galleryFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{galleryFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={galleryLoading}>
                {galleryLoading
                  ? "Enregistrement..."
                  : galleryEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </GlassButton>
              <GlassButton
                type="button"
                variant="light"
                onClick={() => {
                  setActiveSection(null);
                }}
              >
                Fermer
              </GlassButton>
            </div>
          </form>
        ) : null}
      </section>

      {/* Catalogue */}
      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
            Catalogue
          </p>
          <h3 className="text-lg font-semibold text-foreground">Produits, prix et catégories</h3>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]"
              placeholder="Rechercher un produit..."
              value={catalogSearch}
              onChange={(event) => setCatalogSearch(event.target.value)}
            />
          </div>
          {activeSection !== "catalog" ? (
            <GlassButton
              type="button"
              variant="primary"
              onClick={() => {
                setActiveSection("catalog");
                setCatalogEditingId(null);
                setCatalogForm({
                  title: "",
                  description: "",
                  price: "",
                  originalPrice: "",
                  imageUrl: "",
                  category: catalogCategories[0] || "Coiffure",
                  code: "",
                  isAvailable: true,
                  salon_name: SALONS[0]?.name ?? "Parfait Design",
                });
                setCatalogFile(null);
                setCatalogPreviewUrl(null);
                setCatalogFeedback(null);
              }}
            >
              Ajouter
            </GlassButton>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {catalogItems
            .filter((item) => {
              const q = catalogSearch.trim().toLowerCase();
              if (!q) return true;
              return (
                item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
              );
            })
            .map((item) => {
              const isSelected = selectedCatalogId === item.id;
              return (
                 <div
                   key={item.id}
                   className={`rounded-2xl border bg-white p-2 transition ${
                     isSelected ? "border-[var(--gold)] shadow-md" : "border-stone-200"
                   }`}
                 >
                   <div
                     role="button"
                     tabIndex={0}
                     onClick={() => startCatalogEdit(item)}
                     onKeyDown={(event) => {
                       if (event.key === "Enter" || event.key === " ") {
                         event.preventDefault();
                         startCatalogEdit(item);
                       }
                     }}
                     className="w-full text-left cursor-pointer"
                   >
                     {item.image_url && (
                       <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                         <img
                           src={item.image_url}
                           alt={item.title}
                           className="aspect-[4/5] w-full object-cover"
                           loading="lazy"
                         />
                       </div>
                     )}
                     <p
                       className={`text-xs font-semibold leading-tight line-clamp-2 ${item.image_url ? "mt-2" : ""}`}
                     >
                       {item.title}
                     </p>
                     <p className="text-[10px] text-muted-foreground">{item.category}</p>
                     {item.code && (
                       <p className="mt-1 text-[10px] font-mono font-semibold text-[var(--gold-deep)] bg-[var(--gold-soft)]/30 inline-block px-1.5 py-0.5 rounded-full">
                         Code: {item.code}
                       </p>
                     )}
                     {item.price > 0 && (
                       <p className="mt-1 text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                     )}
                   </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            console.log('[bell] catalog edit clicked', item.title);
                            startCatalogEdit(item);
                          }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] transition"
                         aria-label="Modifier"
                       >
                         <Pencil className="h-5 w-5" />
                       </button>
                       <button
                         type="button"
                         onClick={(event) => {
                           event.stopPropagation();
                           console.log('[bell] catalog delete clicked', item.id);
                           void handleCatalogDelete(item.id);
                         }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-[0.97] transition"
                         aria-label="Supprimer"
                       >
                         <Trash2 className="h-5 w-5" />
                       </button>
                     </div>
                 </div>
              );
            })}
        </div>
        {catalogItems.filter((item) => {
          const q = catalogSearch.trim().toLowerCase();
          if (!q) return true;
          return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {catalogSearch ? "Aucun résultat trouvé" : "Aucun produit dans le catalogue"}
          </p>
        )}

        {activeSection === "catalog" ? (
          <form
            className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleCatalogSubmit}
          >
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.title}
              onChange={(event) => setCatalogForm({ ...catalogForm, title: event.target.value })}
              placeholder="Nom du produit"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.description}
              onChange={(event) =>
                setCatalogForm({ ...catalogForm, description: event.target.value })
              }
              placeholder="Description"
            />
            <div className="flex flex-wrap gap-2">
              <select
                className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={catalogForm.category}
                onChange={(event) =>
                  setCatalogForm({ ...catalogForm, category: event.target.value })
                }
              >
                {catalogCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                className="min-w-[180px] rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Nouvelle catégorie"
              />
              <GlassButton type="button" variant="light" onClick={handleCreateCategory}>
                Créer
              </GlassButton>
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.price}
              onChange={(event) => setCatalogForm({ ...catalogForm, price: event.target.value })}
              placeholder="Prix (FCFA)"
            />
            {catalogForm.category === "Promo" && (
              <input
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={catalogForm.originalPrice}
                onChange={(event) =>
                  setCatalogForm({ ...catalogForm, originalPrice: event.target.value })
                }
                placeholder="Prix d'origine (FCFA)"
              />
            )}
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.salon_name}
              onChange={(event) =>
                setCatalogForm({ ...catalogForm, salon_name: event.target.value })
              }
            >
              {SALONS.map((salon) => (
                <option key={salon.id} value={salon.name}>
                  {salon.name}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Code</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2"
                  placeholder="ex: CF1, PB1..."
                  value={catalogForm.code}
                  onChange={(event) => setCatalogForm({ ...catalogForm, code: event.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Lien image</label>
              <input
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={catalogForm.imageUrl}
                onChange={(event) => {
                  setCatalogForm({ ...catalogForm, imageUrl: event.target.value });
                  setCatalogPreviewUrl(event.target.value.trim() || null);
                }}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Image</label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50">
                <span>{catalogFile?.name ?? "Sélectionner une image principale"}</span>
                <span className="rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]">
                  Parcourir
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setCatalogFile(file);
                    if (file) setCatalogPreviewUrl(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Images supplémentaires (galerie)
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50">
                <span>
                  {catalogGalleryFiles.length > 0
                    ? `${catalogGalleryFiles.length} image(s) sélectionnée(s)`
                    : "Ajouter des images pour le carrousel"}
                </span>
                <span className="rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]">
                  Ajouter
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setCatalogGalleryFiles((prev) => [...prev, ...files]);
                    const newUrls = files.map((f) => URL.createObjectURL(f));
                    setCatalogGalleryUrls((prev) => [...prev, ...newUrls]);
                  }}
                />
              </label>
              {catalogGalleryUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {catalogGalleryUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-stone-200"
                    >
                      <img
                        src={url}
                        alt={`Galerie ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCatalogGalleryFiles((prev) => prev.filter((_, i) => i !== index));
                          setCatalogGalleryUrls((prev) => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {catalogPreviewUrl || catalogGalleryUrls.length > 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Aperçu
                </p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <ImageCarousel
                    images={[catalogPreviewUrl, ...catalogGalleryUrls].filter(Boolean) as string[]}
                    autoPlayInterval={4000}
                  />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={catalogForm.isAvailable}
                onChange={(event) =>
                  setCatalogForm({ ...catalogForm, isAvailable: event.target.checked })
                }
              />
              Disponible à la vente
            </label>
            {catalogFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{catalogFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={catalogLoading}>
                {catalogLoading
                  ? "Enregistrement..."
                  : catalogEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </GlassButton>
              <GlassButton
                type="button"
                variant="light"
                onClick={() => {
                  setActiveSection(null);
                }}
              >
                Fermer
              </GlassButton>
            </div>
          </form>
        ) : null}
      </section>

      {/* Services */}
      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
            Services
          </p>
          <h3 className="text-lg font-semibold text-foreground">Prestations et disponibilités</h3>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]"
              placeholder="Rechercher un service..."
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
            />
          </div>
          {activeSection !== "services" ? (
            <GlassButton
              type="button"
              variant="primary"
              onClick={() => {
                setActiveSection("services");
                setServiceEditingId(null);
                setServiceForm({
                  title: "",
                  description: "",
                  price: "",
                  durationMin: "",
                  category: "Coiffure",
                  imageUrl: "",
                  code: "",
                  active: true,
                  salon_name: SALONS[0]?.name ?? "Parfait Design",
                });
                setServiceFile(null);
                setServicePreviewUrl(null);
                setServiceFeedback(null);
              }}
            >
              Ajouter
            </GlassButton>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {serviceItems
            .filter((item) => {
              const q = serviceSearch.trim().toLowerCase();
              if (!q) return true;
              return (
                item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
              );
            })
            .map((item) => {
              const isSelected = selectedServiceId === item.id;
              return (
                 <div
                   key={item.id}
                   className={`rounded-2xl border bg-white p-2 transition ${
                     isSelected ? "border-[var(--gold)] shadow-md" : "border-stone-200"
                   }`}
                 >
                   <div
                     role="button"
                     tabIndex={0}
                     onClick={() => startServiceEdit(item)}
                     onKeyDown={(event) => {
                       if (event.key === "Enter" || event.key === " ") {
                         event.preventDefault();
                         startServiceEdit(item);
                       }
                     }}
                     className="w-full text-left cursor-pointer"
                   >
                     {item.image_url && (
                       <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                         <img
                           src={item.image_url}
                           alt={item.title}
                           className="aspect-[4/5] w-full object-cover"
                           loading="lazy"
                         />
                       </div>
                     )}
                     <p
                       className={`text-xs font-semibold leading-tight line-clamp-2 ${item.image_url ? "mt-2" : ""}`}
                     >
                       {item.title}
                     </p>
                     <p className="text-[10px] text-muted-foreground">{item.category}</p>
                     <div className="mt-1 flex items-center gap-2">
                       {item.price > 0 && (
                         <p className="text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                       )}
                       <span className="text-[10px] text-muted-foreground">
                         {item.duration_min} min
                       </span>
                     </div>
                   </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            console.log('[bell] service edit clicked', item.title);
                            startServiceEdit(item);
                          }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] transition"
                         aria-label="Modifier"
                       >
                         <Pencil className="h-5 w-5" />
                       </button>
                       <button
                         type="button"
                         onClick={(event) => {
                           event.stopPropagation();
                           console.log('[bell] service delete clicked', item.id);
                           void handleServiceDelete(item.id);
                         }}
                         className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-[0.97] transition"
                         aria-label="Supprimer"
                       >
                         <Trash2 className="h-5 w-5" />
                       </button>
                     </div>
                 </div>
              );
            })}
        </div>
        {serviceItems.filter((item) => {
          const q = serviceSearch.trim().toLowerCase();
          if (!q) return true;
          return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {serviceSearch ? "Aucun résultat trouvé" : "Aucun service disponible"}
          </p>
        )}

        {activeSection === "services" ? (
          <form
            className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleServiceSubmit}
          >
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.title}
              onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })}
              placeholder="Nom du service"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.description}
              onChange={(event) =>
                setServiceForm({ ...serviceForm, description: event.target.value })
              }
              placeholder="Description"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.price}
              onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })}
              placeholder="Prix (FCFA)"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.durationMin}
              onChange={(event) =>
                setServiceForm({ ...serviceForm, durationMin: event.target.value })
              }
              placeholder="Durée en minutes"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.category}
              onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })}
              placeholder="Catégorie"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Code</label>
              <input
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
                placeholder="Code service (ex: SRV1...)"
                value={serviceForm.code}
                onChange={(event) => setServiceForm({ ...serviceForm, code: event.target.value })}
              />
            </div>
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.salon_name}
              onChange={(event) =>
                setServiceForm({ ...serviceForm, salon_name: event.target.value })
              }
            >
              {SALONS.map((salon) => (
                <option key={salon.id} value={salon.name}>
                  {salon.name}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Lien image</label>
              <input
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={serviceForm.imageUrl}
                onChange={(event) => {
                  setServiceForm({ ...serviceForm, imageUrl: event.target.value });
                  setServicePreviewUrl(event.target.value.trim() || null);
                }}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Image</label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50">
                <span>{serviceFile?.name ?? "Sélectionner une image principale"}</span>
                <span className="rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]">
                  Parcourir
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setServiceFile(file);
                    if (file) setServicePreviewUrl(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Images supplémentaires (galerie)
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-stone-50">
                <span>
                  {serviceGalleryFiles.length > 0
                    ? `${serviceGalleryFiles.length} image(s) sélectionnée(s)`
                    : "Ajouter des images pour le carrousel"}
                </span>
                <span className="rounded-full bg-[var(--gold-soft)] px-2 py-1 text-[11px] text-[var(--gold-deep)]">
                  Ajouter
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setServiceGalleryFiles((prev) => [...prev, ...files]);
                    const newUrls = files.map((f) => URL.createObjectURL(f));
                    setServiceGalleryUrls((prev) => [...prev, ...newUrls]);
                  }}
                />
              </label>
              {serviceGalleryUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {serviceGalleryUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-stone-200"
                    >
                      <img
                        src={url}
                        alt={`Galerie ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setServiceGalleryFiles((prev) => prev.filter((_, i) => i !== index));
                          setServiceGalleryUrls((prev) => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {servicePreviewUrl || serviceGalleryUrls.length > 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Aperçu
                </p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <ImageCarousel
                    images={[servicePreviewUrl, ...serviceGalleryUrls].filter(Boolean) as string[]}
                    autoPlayInterval={4000}
                  />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={serviceForm.active}
                onChange={(event) =>
                  setServiceForm({ ...serviceForm, active: event.target.checked })
                }
              />
              Service actif
            </label>
            {serviceFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{serviceFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={serviceLoading}>
                {serviceLoading
                  ? "Enregistrement..."
                  : serviceEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </GlassButton>
              <GlassButton
                type="button"
                variant="light"
                onClick={() => {
                  setActiveSection(null);
                }}
              >
                Fermer
              </GlassButton>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
