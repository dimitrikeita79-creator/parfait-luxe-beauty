import { useEffect, useMemo, useState } from "react";
import {
  catalogService,
  galleryService,
  salonService,
  servicesService,
  teamService,
  uploadService,
} from "@/backend/services";
import type {
  CatalogItem,
  GalleryItem,
  SalonInfo,
  ServiceItem,
  TeamMember,
} from "@/backend/models";
import type { Cover } from "@/components/CoverCarousel";

type SectionKey = "gallery" | "catalog" | "services" | "team" | "salon" | "carousel" | null;

const galleryCategories = ["coiffure", "maquillage", "ongles", "soin", "autre"] as const;

function isValidUrl(value: string) {
  if (!value.trim()) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

export function ImprovedAdminEditor() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  const [catalogCategories, setCatalogCategories] = useState<string[]>([
    "coiffure",
    "maquillage",
    "ongles",
    "soin",
    "autre",
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [carouselCovers, setCarouselCovers] = useState<Cover[]>([]);
  const [carouselForm, setCarouselForm] = useState({
    title: "",
    subtitle: "",
    tone: "from-neutral-100 via-white to-amber-50",
    image: "",
  });
  const [carouselEditingId, setCarouselEditingId] = useState<string | null>(null);
  const [carouselFeedback, setCarouselFeedback] = useState<string | null>(null);

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
    category: "coiffure",
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
    category: "coiffure",
    imageUrl: "",
    active: true,
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [serviceEditingId, setServiceEditingId] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);
  const [servicePreviewUrl, setServicePreviewUrl] = useState<string | null>(null);

  const [teamForm, setTeamForm] = useState({
    fullName: "",
    role: "",
    description: "",
    specialties: "",
    photoUrl: "",
  });
  const [teamFile, setTeamFile] = useState<File | null>(null);
  const [teamEditingId, setTeamEditingId] = useState<string | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamFeedback, setTeamFeedback] = useState<string | null>(null);
  const [teamPreviewUrl, setTeamPreviewUrl] = useState<string | null>(null);

  const [salonForm, setSalonForm] = useState({
    salonName: "",
    slogan: "",
    aboutText: "",
    address: "",
    phoneNumber: "",
    email: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    whatsappUrl: "",
    openingHours: "",
    logoUrl: "",
    bannerUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [salonLoading, setSalonLoading] = useState(false);
  const [salonFeedback, setSalonFeedback] = useState<string | null>(null);
  const [salonPreviewUrl, setSalonPreviewUrl] = useState<string | null>(null);

  const loadData = async () => {
    const [galleryData, catalogData, serviceData, teamData, salonData] = await Promise.all([
      galleryService.getAll(),
      catalogService.getAll(),
      servicesService.getAll(),
      teamService.getAll(),
      salonService.getInfo(),
    ]);

    setGalleryItems(galleryData);
    setCatalogItems(catalogData);
    setServiceItems(serviceData);
    setTeamMembers(teamData);
    setSalonInfo(salonData);

    // Load carousel covers from localStorage
    if (typeof window !== "undefined") {
      const savedCovers = window.localStorage.getItem("desmohair-carousel-covers");
      if (savedCovers) {
        try {
          setCarouselCovers(JSON.parse(savedCovers));
        } catch {
          // Silent fail
        }
      }
    }

    const savedCategories =
      typeof window !== "undefined" ? window.localStorage.getItem("desmohair-categories") : null;
    const mergedCategories = Array.from(
      new Set([
        ...(savedCategories ? JSON.parse(savedCategories) : []),
        ...catalogData.map((item) => item.category).filter(Boolean),
      ]),
    );
    setCatalogCategories(
      mergedCategories.length
        ? mergedCategories
        : ["coiffure", "maquillage", "ongles", "soin", "autre"],
    );

    setSalonForm({
      salonName: salonData.salon_name || "",
      slogan: salonData.slogan || "",
      aboutText: salonData.about_text || "",
      address: salonData.address || "",
      phoneNumber: salonData.phone_number || "",
      email: salonData.email || "",
      instagramUrl: salonData.instagram_url || "",
      facebookUrl: salonData.facebook_url || "",
      tiktokUrl: salonData.tiktok_url || "",
      whatsappUrl: salonData.whatsapp_url || "",
      openingHours: salonData.opening_hours || "",
      logoUrl: salonData.logo_url || "",
      bannerUrl: salonData.banner_url || "",
    });
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
    const next = Array.from(new Set([trimmed, ...catalogCategories]));
    saveCategories(next);
    setCatalogForm((current) => ({ ...current, category: trimmed }));
    setNewCategoryName("");
  };

  const openSection = (section: SectionKey) => {
    setActiveSection(section);
    setGalleryFeedback(null);
    setCatalogFeedback(null);
    setServiceFeedback(null);
    setTeamFeedback(null);
    setSalonFeedback(null);
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
    setGalleryFeedback("Modifiez puis enregistrez.");
    setActiveSection("gallery");
  };

  const handleGallerySubmit = async (event: React.FormEvent) => {
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
      } else {
        await galleryService.create(payload);
        setGalleryFeedback("Élément ajouté.");
      }

      setGalleryForm({
        title: "",
        description: "",
        imageUrl: "",
        category: "coiffure",
        isFeatured: false,
      });
      setGalleryFile(null);
      setGalleryEditingId(null);
      await loadData();
    } catch (error: any) {
      console.error("Erreur complète :", error);
      alert("Erreur Supabase : " + (error.message || JSON.stringify(error)));
      setGalleryFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    await galleryService.delete(id);
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
      isAvailable: item.is_available,
    });
    setCatalogFile(null);
    setCatalogFeedback("Modifiez puis enregistrez.");
    setActiveSection("catalog");
  };

  const handleCatalogSubmit = async (event: React.FormEvent) => {
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
      const category = catalogForm.category.trim();
      if (category && !catalogCategories.includes(category)) {
        saveCategories(Array.from(new Set([category, ...catalogCategories])));
      }
      const payload = {
        title: catalogForm.title,
        description: catalogForm.description || null,
        price: Number(catalogForm.price) || 0,
        image_url: imageUrl || null,
        category,
        is_available: catalogForm.isAvailable,
        sort_order: 0,
      };

      if (catalogEditingId) {
        await catalogService.update(catalogEditingId, payload);
        setCatalogFeedback("Produit mis à jour.");
      } else {
        await catalogService.create(payload);
        setCatalogFeedback("Produit ajouté au catalogue.");
      }

      setCatalogForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        category: catalogCategories[0] || "coiffure",
        isAvailable: true,
      });
      setCatalogFile(null);
      setCatalogEditingId(null);
      await loadData();
    } catch (error: any) {
      console.error("Erreur complète :", error);
      alert("Erreur Supabase : " + (error.message || JSON.stringify(error)));
      setCatalogFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleCatalogDelete = async (id: string) => {
    await catalogService.delete(id);
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
    setServiceFeedback("Modifiez puis enregistrez.");
    setActiveSection("services");
  };

  const handleServiceSubmit = async (event: React.FormEvent) => {
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
      } else {
        await servicesService.create(payload);
        setServiceFeedback("Service ajouté.");
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
      setServiceEditingId(null);
      await loadData();
    } catch (error: any) {
      console.error("Erreur complète :", error);
      alert("Erreur Supabase : " + (error.message || JSON.stringify(error)));
      setServiceFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleServiceDelete = async (id: string) => {
    await servicesService.delete(id);
    await loadData();
  };

  const startTeamEdit = (member: TeamMember) => {
    setTeamEditingId(member.id);
    setTeamForm({
      fullName: member.full_name,
      role: member.role,
      description: member.description || "",
      specialties: member.specialties.join(", "),
      photoUrl: member.photo_url,
    });
    setTeamFile(null);
    setTeamFeedback("Modifiez puis enregistrez.");
    setActiveSection("team");
  };

  const handleTeamDelete = async (id: string) => {
    await teamService.delete(id);
    await loadData();
  };

  const handleTeamSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTeamFeedback(null);
    if (!teamForm.fullName.trim()) {
      setTeamFeedback("Le nom du membre est obligatoire.");
      return;
    }

    try {
      setTeamLoading(true);
      const photoUrl = teamFile ? await uploadService.uploadTeamPhoto(teamFile) : teamForm.photoUrl.trim();
      const payload = {
        full_name: teamForm.fullName,
        role: teamForm.role || "Membre",
        description: teamForm.description || null,
        photo_url: photoUrl,
        specialties: teamForm.specialties
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      };

      if (teamEditingId) {
        await teamService.update(teamEditingId, payload);
        setTeamFeedback("Membre mis à jour.");
      } else {
        await teamService.create(payload);
        setTeamFeedback("Membre ajouté.");
      }

      setTeamForm({ fullName: "", role: "", description: "", specialties: "", photoUrl: "" });
      setTeamFile(null);
      setTeamEditingId(null);
      await loadData();
    } catch (error: any) {
      console.error("Erreur complète :", error);
      alert("Erreur Supabase : " + (error.message || JSON.stringify(error)));
      setTeamFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setTeamLoading(false);
    }
  };

  const handleCarouselSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCarouselFeedback(null);
    if (!carouselForm.title.trim()) {
      setCarouselFeedback("Le titre est obligatoire.");
      return;
    }

    try {
      let nextCovers: Cover[];
      if (carouselEditingId) {
        nextCovers = carouselCovers.map((c) =>
          c.id === carouselEditingId
            ? { ...c, title: carouselForm.title, subtitle: carouselForm.subtitle, tone: carouselForm.tone, image: carouselForm.image || undefined }
            : c
        );
        setCarouselFeedback("Diapositive mise à jour.");
      } else {
        const newCover: Cover = {
          id: `cover-${Date.now()}`,
          title: carouselForm.title,
          subtitle: carouselForm.subtitle,
          tone: carouselForm.tone,
          image: carouselForm.image || undefined,
        };
        nextCovers = [...carouselCovers, newCover];
        setCarouselFeedback("Diapositive ajoutée.");
      }

      setCarouselCovers(nextCovers);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("desmohair-carousel-covers", JSON.stringify(nextCovers));
      }

      setCarouselForm({ title: "", subtitle: "", tone: "from-neutral-100 via-white to-amber-50", image: "" });
      setCarouselEditingId(null);
    } catch (error) {
      setCarouselFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  const handleCarouselDelete = (id: string) => {
    const nextCovers = carouselCovers.filter((c) => c.id !== id);
    setCarouselCovers(nextCovers);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("desmohair-carousel-covers", JSON.stringify(nextCovers));
    }
  };

  const startCarouselEdit = (cover: Cover) => {
    setCarouselEditingId(cover.id);
    setCarouselForm({
      title: cover.title,
      subtitle: cover.subtitle,
      tone: cover.tone,
      image: cover.image || "",
    });
    setCarouselFeedback("Modifiez puis enregistrez.");
    setActiveSection("carousel");
  };

  const handleSalonSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSalonFeedback(null);
    try {
      setSalonLoading(true);
      let logoUrl = salonForm.logoUrl.trim();
      let bannerUrl = salonForm.bannerUrl.trim();
      if (logoFile) {
        logoUrl = await uploadService.uploadLogo(logoFile);
      }
      if (bannerFile) {
        bannerUrl = await uploadService.uploadBanner(bannerFile);
      }

      await salonService.updateInfo({
        salon_name: salonForm.salonName,
        slogan: salonForm.slogan || null,
        about_text: salonForm.aboutText || null,
        address: salonForm.address || null,
        phone_number: salonForm.phoneNumber || null,
        email: salonForm.email || null,
        instagram_url: salonForm.instagramUrl || null,
        facebook_url: salonForm.facebookUrl || null,
        tiktok_url: salonForm.tiktokUrl || null,
        whatsapp_url: salonForm.whatsappUrl || null,
        opening_hours: salonForm.openingHours || null,
        logo_url: logoUrl || null,
        banner_url: bannerUrl || null,
      });

      setSalonFeedback("Informations enregistrées.");
      setLogoFile(null);
      setBannerFile(null);
      await loadData();
    } catch (error: any) {
      console.error("Erreur complète :", error);
      alert("Erreur Supabase : " + (error.message || JSON.stringify(error)));
      setSalonFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setSalonLoading(false);
    }
  };

  const previewCards = useMemo(
    () => [
      {
        key: "gallery",
        title: "Galerie",
        count: galleryItems.length,
        subtitle: "Images visibles sur le site",
      },
      {
        key: "catalog",
        title: "Catalogue",
        count: catalogItems.length,
        subtitle: "Produits à vendre",
      },
      {
        key: "services",
        title: "Services",
        count: serviceItems.length,
        subtitle: "Prestations actives",
      },
      { key: "team", title: "Équipe", count: teamMembers.length, subtitle: "Portraits et rôles" },
      {
        key: "carousel",
        title: "Carousel",
        count: carouselCovers.length,
        subtitle: "Diapositives d'accueil",
      },
      {
        key: "salon",
        title: "Salon",
        subtitle: salonInfo
          ? `${salonInfo.phone_number || "—"} • ${salonInfo.address || "—"}`
          : "Coordonnées à jour",
      },
    ],
    [catalogItems.length, galleryItems.length, salonInfo, serviceItems.length, teamMembers.length, carouselCovers.length],
  );

  return (
    <div className="mt-6 space-y-3">
      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Tableau de bord
            </p>
            <h2 className="text-xl font-semibold text-foreground">Modifications rapides</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Chaque section dispose d’un panneau dédié pour modifier, supprimer ou prévisualiser
              les informations.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--gold-soft)] bg-[var(--gold-soft)]/70 px-3 py-2 text-right text-sm text-[var(--gold-deep)]">
            <p className="font-semibold">
              {previewCards
                .filter((card) => card.key !== "salon")
                .reduce((total, card) => total + (card.count ?? 0), 0)}{" "}
              éléments
            </p>
            <p className="text-xs">à gérer</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {previewCards.map((card) => (
            <div key={card.key} className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {card.title}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {card.count ?? card.subtitle}
              </p>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Galerie
            </p>
            <h3 className="text-lg font-semibold text-foreground">Images et mises en avant</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("gallery")}
          >
            Ajouter / modifier
          </button>
        </div>
        {activeSection === "gallery" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
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
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={galleryForm.imageUrl}
              onChange={(event) => setGalleryForm({ ...galleryForm, imageUrl: event.target.value })}
              placeholder="Lien externe (https://...)"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setGalleryFile(event.target.files?.[0] ?? null)}
            />
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
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
                disabled={galleryLoading}
              >
                {galleryLoading
                  ? "Enregistrement..."
                  : galleryEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
        <div className="mt-4 space-y-2">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3"
            >
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.category} • {item.is_featured ? "Vedette" : "Standard"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-[var(--gold-deep)]"
                  type="button"
                  onClick={() => startGalleryEdit(item)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm font-semibold text-rose-600"
                  type="button"
                  onClick={() => void handleGalleryDelete(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Catalogue
            </p>
            <h3 className="text-lg font-semibold text-foreground">Produits, prix et catégories</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("catalog")}
          >
            Ajouter / modifier
          </button>
        </div>
        {activeSection === "catalog" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
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
              <button
                className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={handleCreateCategory}
              >
                Créer
              </button>
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={catalogForm.imageUrl}
              onChange={(event) => setCatalogForm({ ...catalogForm, imageUrl: event.target.value })}
              placeholder="Lien externe"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setCatalogFile(event.target.files?.[0] ?? null)}
            />
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
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
                disabled={catalogLoading}
              >
                {catalogLoading
                  ? "Enregistrement..."
                  : catalogEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {catalogCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {catalogItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3"
            >
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.category} • {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-[var(--gold-deep)]"
                  type="button"
                  onClick={() => startCatalogEdit(item)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm font-semibold text-rose-600"
                  type="button"
                  onClick={() => void handleCatalogDelete(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Services
            </p>
            <h3 className="text-lg font-semibold text-foreground">Prestations et disponibilités</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("services")}
          >
            Ajouter / modifier
          </button>
        </div>
        {activeSection === "services" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
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
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={serviceForm.imageUrl}
              onChange={(event) => setServiceForm({ ...serviceForm, imageUrl: event.target.value })}
              placeholder="Lien externe"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setServiceFile(event.target.files?.[0] ?? null)}
            />
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
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
                disabled={serviceLoading}
              >
                {serviceLoading
                  ? "Enregistrement..."
                  : serviceEditingId
                    ? "Enregistrer"
                    : "Ajouter"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
        <div className="mt-4 space-y-2">
          {serviceItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3"
            >
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.category} • {formatPrice(item.price)} • {item.duration_min} min
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-[var(--gold-deep)]"
                  type="button"
                  onClick={() => startServiceEdit(item)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm font-semibold text-rose-600"
                  type="button"
                  onClick={() => void handleServiceDelete(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Équipe
            </p>
            <h3 className="text-lg font-semibold text-foreground">Portraits et profils</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("team")}
          >
            Ajouter / modifier
          </button>
        </div>
        {activeSection === "team" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleTeamSubmit}
          >
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={teamForm.fullName}
              onChange={(event) => setTeamForm({ ...teamForm, fullName: event.target.value })}
              placeholder="Nom complet"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={teamForm.role}
              onChange={(event) => setTeamForm({ ...teamForm, role: event.target.value })}
              placeholder="Rôle"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={teamForm.description}
              onChange={(event) => setTeamForm({ ...teamForm, description: event.target.value })}
              placeholder="Description"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={teamForm.specialties}
              onChange={(event) => setTeamForm({ ...teamForm, specialties: event.target.value })}
              placeholder="Compétences (séparées par des virgules)"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={teamForm.photoUrl}
              onChange={(event) => setTeamForm({ ...teamForm, photoUrl: event.target.value })}
              placeholder="Lien externe"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setTeamFile(event.target.files?.[0] ?? null)}
            />
            {teamFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{teamFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
                disabled={teamLoading}
              >
                {teamLoading ? "Enregistrement..." : teamEditingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
        <div className="mt-4 space-y-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3"
            >
              <div>
                <p className="font-semibold text-foreground">{member.full_name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-[var(--gold-deep)]"
                  type="button"
                  onClick={() => startTeamEdit(member)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm font-semibold text-rose-600"
                  type="button"
                  onClick={() => void handleTeamDelete(member.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Salon
            </p>
            <h3 className="text-lg font-semibold text-foreground">Coordonnées et informations</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("salon")}
          >
            Prévisualiser / modifier
          </button>
        </div>
        {salonInfo ? (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-semibold text-foreground">Informations actuelles</p>
            <p className="mt-1 text-sm text-muted-foreground">{salonInfo.salon_name}</p>
            <p className="text-sm text-muted-foreground">
              {salonInfo.phone_number || "Aucun numéro"} • {salonInfo.address || "Aucune adresse"}
            </p>
            <p className="text-sm text-muted-foreground">
              {salonInfo.opening_hours || "Aucun horaire défini"}
            </p>
          </div>
        ) : null}
        {activeSection === "salon" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleSalonSubmit}
          >
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-muted-foreground">
              Valeur actuelle : {salonInfo?.salon_name || "—"}
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.salonName}
              onChange={(event) => setSalonForm({ ...salonForm, salonName: event.target.value })}
              placeholder="Nom du salon"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.slogan}
              onChange={(event) => setSalonForm({ ...salonForm, slogan: event.target.value })}
              placeholder="Slogan"
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.aboutText}
              onChange={(event) => setSalonForm({ ...salonForm, aboutText: event.target.value })}
              placeholder="À propos"
            />
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-muted-foreground">
              Adresse actuelle : {salonInfo?.address || "—"}
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.address}
              onChange={(event) => setSalonForm({ ...salonForm, address: event.target.value })}
              placeholder="Adresse"
            />
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-muted-foreground">
              Téléphone actuel : {salonInfo?.phone_number || "—"}
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.phoneNumber}
              onChange={(event) => setSalonForm({ ...salonForm, phoneNumber: event.target.value })}
              placeholder="Téléphone"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.email}
              onChange={(event) => setSalonForm({ ...salonForm, email: event.target.value })}
              placeholder="Email"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.openingHours}
              onChange={(event) => setSalonForm({ ...salonForm, openingHours: event.target.value })}
              placeholder="Horaires"
            />
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-muted-foreground">
              Instagram actuel : {salonInfo?.instagram_url || "—"}
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.instagramUrl}
              onChange={(event) => setSalonForm({ ...salonForm, instagramUrl: event.target.value })}
              placeholder="Instagram"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.facebookUrl}
              onChange={(event) => setSalonForm({ ...salonForm, facebookUrl: event.target.value })}
              placeholder="Facebook"
            />
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] text-muted-foreground">
              WhatsApp actuel : {salonInfo?.whatsapp_url || "—"}
            </div>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.whatsappUrl}
              onChange={(event) => setSalonForm({ ...salonForm, whatsappUrl: event.target.value })}
              placeholder="WhatsApp"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.logoUrl}
              onChange={(event) => setSalonForm({ ...salonForm, logoUrl: event.target.value })}
              placeholder="Lien du logo"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={salonForm.bannerUrl}
              onChange={(event) => setSalonForm({ ...salonForm, bannerUrl: event.target.value })}
              placeholder="Lien de la bannière"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
            />
            {salonFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{salonFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
                disabled={salonLoading}
              >
                {salonLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Carousel
            </p>
            <h3 className="text-lg font-semibold text-foreground">Diapositives d'accueil</h3>
          </div>
          <button
            className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => openSection("carousel")}
          >
            Ajouter / modifier
          </button>
        </div>
        {activeSection === "carousel" ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
            onSubmit={handleCarouselSubmit}
          >
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={carouselForm.title}
              onChange={(event) => setCarouselForm({ ...carouselForm, title: event.target.value })}
              placeholder="Titre principal"
            />
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={carouselForm.subtitle}
              onChange={(event) => setCarouselForm({ ...carouselForm, subtitle: event.target.value })}
              placeholder="Sous-titre"
            />
            <select
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={carouselForm.tone}
              onChange={(event) => setCarouselForm({ ...carouselForm, tone: event.target.value })}
            >
              <option value="from-neutral-100 via-white to-amber-50">Neutre</option>
              <option value="from-rose-50 via-white to-amber-50">Rose</option>
              <option value="from-amber-50 via-white to-neutral-100">Ambré</option>
              <option value="from-stone-100 via-white to-amber-50">Pierre</option>
              <option value="from-white via-neutral-50 to-amber-50">Blanc</option>
            </select>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2"
              value={carouselForm.image}
              onChange={(event) => setCarouselForm({ ...carouselForm, image: event.target.value })}
              placeholder="URL de l'image (optionnel)"
            />
            {carouselFeedback ? (
              <p className="text-sm text-[var(--gold-deep)]">{carouselFeedback}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                {carouselEditingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-foreground"
                type="button"
                onClick={() => setActiveSection(null)}
              >
                Fermer
              </button>
            </div>
          </form>
        ) : null}
        <div className="mt-4 space-y-2">
          {carouselCovers.map((cover) => (
            <div
              key={cover.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3"
            >
              <div>
                <p className="font-semibold text-foreground">{cover.title}</p>
                <p className="text-sm text-muted-foreground">{cover.subtitle || "—"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-[var(--gold-deep)]"
                  type="button"
                  onClick={() => startCarouselEdit(cover)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm font-semibold text-rose-600"
                  type="button"
                  onClick={() => handleCarouselDelete(cover.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
