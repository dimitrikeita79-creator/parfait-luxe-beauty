import { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import {
  catalogService,
  galleryService,
  servicesService,
  uploadService,
} from "@/backend/services";
import { CATALOG_ITEMS } from "@/lib/salon-data";
import { GlassButton } from "@/components/GlassButton";
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

const defaultCatalogCategories = ["Coiffure", "Mèches", "Équipement", "Produits", "Autre"];

const galleryCategories = ["Coiffure", "Mèches", "Équipement", "Produits", "Autre"] as const;

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
  const availableCodes = useMemo(() => {
    const codes = new Set<string>();
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
    category: "coiffure" as GalleryItem["category"],
    isFeatured: false,
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
    imageUrl: "",
    category: "Coiffure",
    code: "",
    isAvailable: true,
  });
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
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
    active: true,
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
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
      });
      setGalleryFile(null);
      setGalleryPreviewUrl(null);
      setGalleryEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur Supabase : " + msg);
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
      imageUrl: item.image_url || "",
      category: item.category,
      code: (item as any).code || "",
      isAvailable: item.is_available,
    });
    setCatalogFile(null);
    setCatalogPreviewUrl(item.image_url || null);
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

    try {
      setCatalogLoading(true);
      const imageUrl = catalogFile
        ? await uploadService.uploadGalleryImage(catalogFile)
        : catalogForm.imageUrl.trim();
      const category = normalizeCategory(catalogForm.category);
      if (category && !catalogCategories.includes(category)) {
        saveCategories(Array.from(new Set([category, ...catalogCategories])));
      }
      const payload: Omit<CatalogItem, "id" | "created_at" | "updated_at"> = {
        title: catalogForm.title,
        description: catalogForm.description || null,
        price: Number(catalogForm.price) || 0,
        image_url: imageUrl || null,
        code: catalogForm.code?.trim() || undefined,
        category,
        is_available: catalogForm.isAvailable,
        sort_order: 0,
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
        isAvailable: true,
      });
      setCatalogFile(null);
      setCatalogPreviewUrl(null);
      setCatalogEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur Supabase : " + msg);
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
      active: item.active,
    });
    setServiceFile(null);
    setServicePreviewUrl(item.image_url || null);
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
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description || null,
        price: Number(serviceForm.price) || 0,
        duration_min: Number(serviceForm.durationMin) || 0,
        category: serviceForm.category,
        image_url: imageUrl || null,
        active: serviceForm.active,
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
        active: true,
      });
      setServiceFile(null);
      setServicePreviewUrl(null);
      setServiceEditingId(null);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur Supabase : " + msg);
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
            Cliquez sur une carte pour la modifier. Les modifications sont immédiates sur tout le site.
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
              <p className="text-2xl font-bold text-foreground">
                {card.count ?? 0}
              </p>
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
            <GlassButton type="button" variant="primary" onClick={() => {
              setActiveSection("gallery");
              setGalleryEditingId(null);
              setGalleryForm({ title: "", description: "", imageUrl: "", category: "coiffure", isFeatured: false });
              setGalleryFile(null);
              setGalleryPreviewUrl(null);
              setGalleryFeedback(null);
            }}>
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
                item.title.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q)
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
                  <button
                    type="button"
                    onClick={() => startGalleryEdit(item)}
                    className="w-full text-left"
                  >
                    <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="aspect-square w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-square w-full bg-stone-100" />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{item.category}</p>
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startGalleryEdit(item)}
                      className="flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleGalleryDelete(item.id)}
                      className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {galleryItems.filter((item) => {
          const q = gallerySearch.trim().toLowerCase();
          if (!q) return true;
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {gallerySearch ? "Aucun résultat trouvé" : "Aucune image dans la galerie"}
          </p>
        )}

        {activeSection === "gallery" ? (
          <form className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4" onSubmit={handleGallerySubmit}>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.title}
              onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })}
              placeholder="Titre"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.description}
              onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })}
              placeholder="Description"
            />
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.category}
              onChange={(event) =>
                setGalleryForm({ ...galleryForm, category: event.target.value as GalleryItem["category"] })
              }
            >
              {galleryCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Aperçu</p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <img src={galleryPreviewUrl} alt="Aperçu" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={galleryForm.isFeatured}
                onChange={(event) => setGalleryForm({ ...galleryForm, isFeatured: event.target.checked })}
              />
              Mettre en avant
            </label>
            {galleryFeedback ? <p className="text-sm text-[var(--gold-deep)]">{galleryFeedback}</p> : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={galleryLoading}>
                {galleryLoading ? "Enregistrement..." : galleryEditingId ? "Enregistrer" : "Ajouter"}
              </GlassButton>
              <GlassButton type="button" variant="light" onClick={() => { setActiveSection(null); }}>
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
            <GlassButton type="button" variant="primary" onClick={() => {
              setActiveSection("catalog");
              setCatalogEditingId(null);
              setCatalogForm({ title: "", description: "", price: "", imageUrl: "", category: catalogCategories[0] || "Coiffure", code: "", isAvailable: true });
              setCatalogFile(null);
              setCatalogPreviewUrl(null);
              setCatalogFeedback(null);
            }}>
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
                item.title.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q)
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
                  <button
                    type="button"
                    onClick={() => startCatalogEdit(item)}
                    className="w-full text-left"
                  >
                    <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="aspect-[4/5] w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                    {item.price > 0 && (
                      <p className="mt-1 text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                    )}
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startCatalogEdit(item)}
                      className="flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCatalogDelete(item.id)}
                      className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {catalogItems.filter((item) => {
          const q = catalogSearch.trim().toLowerCase();
          if (!q) return true;
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {catalogSearch ? "Aucun résultat trouvé" : "Aucun produit dans le catalogue"}
          </p>
        )}

        {activeSection === "catalog" ? (
          <form className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4" onSubmit={handleCatalogSubmit}>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.title}
              onChange={(event) => setCatalogForm({ ...catalogForm, title: event.target.value })}
              placeholder="Nom du produit"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.description}
              onChange={(event) => setCatalogForm({ ...catalogForm, description: event.target.value })}
              placeholder="Description"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.price}
              onChange={(event) => setCatalogForm({ ...catalogForm, price: event.target.value })}
              placeholder="Prix (FCFA)"
            />
            <div className="flex flex-wrap gap-2">
              <select
                className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2"
                value={catalogForm.category}
                onChange={(event) => setCatalogForm({ ...catalogForm, category: event.target.value })}
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
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={(catalogForm as any).code}
              onChange={(event) => setCatalogForm({ ...catalogForm, code: event.target.value })}
            >
              <option value="">Code produit (optionnel)</option>
              {availableCodes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
                <span>{catalogFile?.name ?? "Sélectionner une image"}</span>
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
            {catalogPreviewUrl ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Aperçu</p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <img src={catalogPreviewUrl} alt="Aperçu" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={catalogForm.isAvailable}
                onChange={(event) => setCatalogForm({ ...catalogForm, isAvailable: event.target.checked })}
              />
              Disponible à la vente
            </label>
            {catalogFeedback ? <p className="text-sm text-[var(--gold-deep)]">{catalogFeedback}</p> : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={catalogLoading}>
                {catalogLoading ? "Enregistrement..." : catalogEditingId ? "Enregistrer" : "Ajouter"}
              </GlassButton>
              <GlassButton type="button" variant="light" onClick={() => { setActiveSection(null); }}>
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
            <GlassButton type="button" variant="primary" onClick={() => {
              setActiveSection("services");
              setServiceEditingId(null);
              setServiceForm({ title: "", description: "", price: "", durationMin: "", category: "Coiffure", imageUrl: "", active: true });
              setServiceFile(null);
              setServicePreviewUrl(null);
              setServiceFeedback(null);
            }}>
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
                item.title.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q)
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
                  <button
                    type="button"
                    onClick={() => startServiceEdit(item)}
                    className="w-full text-left"
                  >
                    <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="aspect-[4/5] w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {item.price > 0 && (
                        <p className="text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                      )}
                      <span className="text-[10px] text-muted-foreground">{item.duration_min} min</span>
                    </div>
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startServiceEdit(item)}
                      className="flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.97] transition"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleServiceDelete(item.id)}
                      className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {serviceItems.filter((item) => {
          const q = serviceSearch.trim().toLowerCase();
          if (!q) return true;
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }).length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {serviceSearch ? "Aucun résultat trouvé" : "Aucun service disponible"}
          </p>
        )}

        {activeSection === "services" ? (
          <form className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4" onSubmit={handleServiceSubmit}>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.title}
              onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })}
              placeholder="Nom du service"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.description}
              onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
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
              onChange={(event) => setServiceForm({ ...serviceForm, durationMin: event.target.value })}
              placeholder="Durée en minutes"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.category}
              onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })}
              placeholder="Catégorie"
            />
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
                <span>{serviceFile?.name ?? "Sélectionner une image"}</span>
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
            {servicePreviewUrl ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Aperçu</p>
                <div className="mt-2 overflow-hidden rounded-[24px] bg-stone-100">
                  <img src={servicePreviewUrl} alt="Aperçu" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={serviceForm.active}
                onChange={(event) => setServiceForm({ ...serviceForm, active: event.target.checked })}
              />
              Service actif
            </label>
            {serviceFeedback ? <p className="text-sm text-[var(--gold-deep)]">{serviceFeedback}</p> : null}
            <div className="flex flex-wrap gap-2">
              <GlassButton type="submit" variant="primary" disabled={serviceLoading}>
                {serviceLoading ? "Enregistrement..." : serviceEditingId ? "Enregistrer" : "Ajouter"}
              </GlassButton>
              <GlassButton type="button" variant="light" onClick={() => { setActiveSection(null); }}>
                Fermer
              </GlassButton>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
