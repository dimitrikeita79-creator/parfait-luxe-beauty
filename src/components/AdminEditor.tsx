import { useEffect, useState } from "react";
import { catalogService, galleryService, salonService, servicesService, teamService, uploadService } from "@/backend/services";
import type { CatalogItem, GalleryItem, SalonInfo, ServiceItem, TeamMember } from "@/backend/models";

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

export function AdminEditor() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null);

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

  const [catalogForm, setCatalogForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isAvailable: true,
  });
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [catalogEditingId, setCatalogEditingId] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogFeedback, setCatalogFeedback] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    price: "",
    durationMin: "",
    category: "",
    imageUrl: "",
    active: true,
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [serviceEditingId, setServiceEditingId] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);

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

  const handleGallerySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGalleryFeedback(null);

    if (!galleryForm.title.trim()) {
      setGalleryFeedback("Le titre est obligatoire.");
      return;
    }

    if (!galleryForm.imageUrl.trim() && !galleryFile) {
      setGalleryFeedback("Ajoutez une URL ou une image à importer.");
      return;
    }

    try {
      setGalleryLoading(true);
      const imageUrl = galleryFile ? await uploadService.uploadGalleryImage(galleryFile) : galleryForm.imageUrl;
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
        setGalleryFeedback("Galerie mise à jour avec succès.");
      } else {
        await galleryService.create(payload);
        setGalleryFeedback("Nouvelle photo ajoutée avec succès.");
      }

      setGalleryForm({ title: "", description: "", imageUrl: "", category: "coiffure", isFeatured: false });
      setGalleryFile(null);
      setGalleryEditingId(null);
      await loadData();
    } catch (error) {
      setGalleryFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setGalleryLoading(false);
    }
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
    setGalleryFeedback("Modifiez les champs puis validez.");
  };

  const handleCatalogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCatalogFeedback(null);

    if (!catalogForm.title.trim()) {
      setCatalogFeedback("Le titre est obligatoire.");
      return;
    }

    if (!catalogForm.imageUrl.trim() && !catalogFile) {
      setCatalogFeedback("Ajoutez une URL ou une image à importer.");
      return;
    }

    try {
      setCatalogLoading(true);
      const imageUrl = catalogFile ? await uploadService.uploadGalleryImage(catalogFile) : catalogForm.imageUrl;
      const payload = {
        title: catalogForm.title,
        description: catalogForm.description || null,
        price: Number(catalogForm.price) || 0,
        image_url: imageUrl || null,
        category: catalogForm.category,
        is_available: catalogForm.isAvailable,
        sort_order: 0,
      };

      if (catalogEditingId) {
        await catalogService.update(catalogEditingId, payload);
        setCatalogFeedback("Catalogue mis à jour avec succès.");
      } else {
        await catalogService.create(payload);
        setCatalogFeedback("Nouvel élément ajouté au catalogue.");
      }

      setCatalogForm({ title: "", description: "", price: "", imageUrl: "", category: "", isAvailable: true });
      setCatalogFile(null);
      setCatalogEditingId(null);
      await loadData();
    } catch (error) {
      setCatalogFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setCatalogLoading(false);
    }
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
    setCatalogFeedback("Modifiez les champs puis validez.");
  };

  const handleServiceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServiceFeedback(null);

    if (!serviceForm.title.trim()) {
      setServiceFeedback("Le titre est obligatoire.");
      return;
    }

    if (!serviceForm.imageUrl.trim() && !serviceFile) {
      setServiceFeedback("Ajoutez une URL ou une image à importer.");
      return;
    }

    try {
      setServiceLoading(true);
      const imageUrl = serviceFile ? await uploadService.uploadGalleryImage(serviceFile) : serviceForm.imageUrl;
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
        setServiceFeedback("Service mis à jour avec succès.");
      } else {
        await servicesService.create(payload);
        setServiceFeedback("Nouveau service ajouté.");
      }

      setServiceForm({ title: "", description: "", price: "", durationMin: "", category: "", imageUrl: "", active: true });
      setServiceFile(null);
      setServiceEditingId(null);
      await loadData();
    } catch (error) {
      setServiceFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setServiceLoading(false);
    }
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
    setServiceFeedback("Modifiez les champs puis validez.");
  };

  const handleTeamSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTeamFeedback(null);

    if (!teamForm.fullName.trim()) {
      setTeamFeedback("Le nom du membre est obligatoire.");
      return;
    }

    if (!teamForm.photoUrl.trim() && !teamFile) {
      setTeamFeedback("Ajoutez une URL ou une photo à importer.");
      return;
    }

    try {
      setTeamLoading(true);
      const photoUrl = teamFile ? await uploadService.uploadTeamPhoto(teamFile) : teamForm.photoUrl;
      const payload = {
        full_name: teamForm.fullName,
        role: teamForm.role || "Membre",
        description: teamForm.description || null,
        photo_url: photoUrl,
        specialties: teamForm.specialties.split(",").map((value) => value.trim()).filter(Boolean),
      };

      if (teamEditingId) {
        await teamService.update(teamEditingId, payload);
        setTeamFeedback("Équipe mise à jour avec succès.");
      } else {
        await teamService.create(payload);
        setTeamFeedback("Nouveau membre ajouté à l’équipe.");
      }

      setTeamForm({ fullName: "", role: "", description: "", specialties: "", photoUrl: "" });
      setTeamFile(null);
      setTeamEditingId(null);
      await loadData();
    } catch (error) {
      setTeamFeedback(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setTeamLoading(false);
    }
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
    setTeamFeedback("Modifiez les champs puis validez.");
  };

  const handleSalonSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSalonFeedback(null);

    try {
      setSalonLoading(true);
      let logoUrl = salonForm.logoUrl;
      let bannerUrl = salonForm.bannerUrl;

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

      setSalonFeedback("Informations du salon enregistrées.");
      setLogoFile(null);
      setBannerFile(null);
      await loadData();
    } catch (error: any) {
      alert('ERREUR EXACTE : ' + (error.message || JSON.stringify(error)));
    } finally {
      setSalonLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">Gestion directe</p>
            <h2 className="text-xl font-semibold text-foreground">Édition admin via Supabase</h2>
          </div>
          <p className="text-sm text-muted-foreground">Vous pouvez importer une image ou utiliser un lien externe.</p>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.14)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Galerie</h3>
            <p className="text-sm text-muted-foreground">Ajouter ou modifier une photo avec une URL ou un fichier.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleGallerySubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} placeholder="Titre" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.description} onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })} placeholder="Description" />
          <select className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.category} onChange={(event) => setGalleryForm({ ...galleryForm, category: event.target.value as GalleryItem["category"] })}>
            {galleryCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.imageUrl} onChange={(event) => setGalleryForm({ ...galleryForm, imageUrl: event.target.value })} placeholder="Lien externe de l’image (https://...)" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" catch accept="image/*" onChange={(event) => setGalleryFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={galleryForm.isFeatured} onChange={(event) => setGalleryForm({ ...galleryForm, isFeatured: event.target.checked })} />
            Mettre en vedette
          </label>
          {galleryFeedback ? <p className="text-sm text-[var(--gold-deep)]">{galleryFeedback}</p> : null}
          <button className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={galleryLoading}>{galleryLoading ? "Enregistrement..." : galleryEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>

        <div className="mt-4 space-y-2">
          {galleryItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.is_featured ? "Vedette" : "Standard"}</p>
              </div>
              <button className="text-sm font-semibold text-[var(--gold-deep)]" type="button" onClick={() => startGalleryEdit(item)}>Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.14)]">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Catalogue</h3>
          <p className="text-sm text-muted-foreground">Ajoutez des produits, prix et images sans surcharger la base.</p>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleCatalogSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.title} onChange={(event) => setCatalogForm({ ...catalogForm, title: event.target.value })} placeholder="Nom du produit" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.description} onChange={(event) => setCatalogForm({ ...catalogForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.price} onChange={(event) => setCatalogForm({ ...catalogForm, price: event.target.value })} placeholder="Prix" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.category} onChange={(event) => setCatalogForm({ ...catalogForm, category: event.target.value })} placeholder="Catégorie" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.imageUrl} onChange={(event) => setCatalogForm({ ...catalogForm, imageUrl: event.target.value })} placeholder="Lien externe de l’image" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setCatalogFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={catalogForm.isAvailable} onChange={(event) => setCatalogForm({ ...catalogForm, isAvailable: event.target.checked })} />
            Disponible
          </label>
          {catalogFeedback ? <p className="text-sm text-[var(--gold-deep)]">{catalogFeedback}</p> : null}
          <button className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={catalogLoading}>{catalogLoading ? "Enregistrement..." : catalogEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {catalogItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.price}€</p>
              </div>
              <button className="text-sm font-semibold text-[var(--gold-deep)]" type="button" onClick={() => startCatalogEdit(item)}>Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.14)]">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Services</h3>
          <p className="text-sm text-muted-foreground">Modifiez les prestations et leurs images.</p>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleServiceSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.title} onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })} placeholder="Nom du service" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} placeholder="Prix" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.durationMin} onChange={(event) => setServiceForm({ ...serviceForm, durationMin: event.target.value })} placeholder="Durée en minutes" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.category} onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })} placeholder="Catégorie" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.imageUrl} onChange={(event) => setServiceForm({ ...serviceForm, imageUrl: event.target.value })} placeholder="Lien externe de l’image" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setServiceFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={serviceForm.active} onChange={(event) => setServiceForm({ ...serviceForm, active: event.target.checked })} />
            Actif
          </label>
          {serviceFeedback ? <p className="text-sm text-[var(--gold-deep)]">{serviceFeedback}</p> : null}
          <button className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={serviceLoading}>{serviceLoading ? "Enregistrement..." : serviceEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {serviceItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.price}€ • {item.duration_min} min</p>
              </div>
              <button className="text-sm font-semibold text-[var(--gold-deep)]" type="button" onClick={() => startServiceEdit(item)}>Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.14)]">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Équipe</h3>
          <p className="text-sm text-muted-foreground">Ajoutez ou mettez à jour les membres de l’équipe avec une photo ou un lien.</p>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleTeamSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.fullName} onChange={(event) => setTeamForm({ ...teamForm, fullName: event.target.value })} placeholder="Nom complet" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.role} onChange={(event) => setTeamForm({ ...teamForm, role: event.target.value })} placeholder="Rôle" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.description} onChange={(event) => setTeamForm({ ...teamForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.specialties} onChange={(event) => setTeamForm({ ...teamForm, specialties: event.target.value })} placeholder="Compétences (séparées par des virgules)" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.photoUrl} onChange={(event) => setTeamForm({ ...teamForm, photoUrl: event.target.value })} placeholder="Lien externe de la photo" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setTeamFile(event.target.files?.[0] ?? null)} />
          {teamFeedback ? <p className="text-sm text-[var(--gold-deep)]">{teamFeedback}</p> : null}
          <button className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={teamLoading}>{teamLoading ? "Enregistrement..." : teamEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{member.full_name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <button className="text-sm font-semibold text-[var(--gold-deep)]" type="button" onClick={() => startTeamEdit(member)}>Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.14)]">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Salon</h3>
          <p className="text-sm text-muted-foreground">Mettez à jour vos coordonnées, réseaux et visuels.</p>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleSalonSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.salonName} onChange={(event) => setSalonForm({ ...salonForm, salonName: event.target.value })} placeholder="Nom du salon" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.slogan} onChange={(event) => setSalonForm({ ...salonForm, slogan: event.target.value })} placeholder="Slogan" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.aboutText} onChange={(event) => setSalonForm({ ...salonForm, aboutText: event.target.value })} placeholder="À propos" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.address} onChange={(event) => setSalonForm({ ...salonForm, address: event.target.value })} placeholder="Adresse" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.phoneNumber} onChange={(event) => setSalonForm({ ...salonForm, phoneNumber: event.target.value })} placeholder="Téléphone" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.email} onChange={(event) => setSalonForm({ ...salonForm, email: event.target.value })} placeholder="Email" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.instagramUrl} onChange={(event) => setSalonForm({ ...salonForm, instagramUrl: event.target.value })} placeholder="Instagram" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.facebookUrl} onChange={(event) => setSalonForm({ ...salonForm, facebookUrl: event.target.value })} placeholder="Facebook" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.tiktokUrl} onChange={(event) => setSalonForm({ ...salonForm, tiktokUrl: event.target.value })} placeholder="TikTok" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.whatsappUrl} onChange={(event) => setSalonForm({ ...salonForm, whatsappUrl: event.target.value })} placeholder="WhatsApp" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.openingHours} onChange={(event) => setSalonForm({ ...salonForm, openingHours: event.target.value })} placeholder="Horaires" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.logoUrl} onChange={(event) => setSalonForm({ ...salonForm, logoUrl: event.target.value })} placeholder="Lien du logo" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={salonForm.bannerUrl} onChange={(event) => setSalonForm({ ...salonForm, bannerUrl: event.target.value })} placeholder="Lien de la bannière" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)} />
          {salonFeedback ? <p className="text-sm text-[var(--gold-deep)]">{salonFeedback}</p> : null}
          <button className="rounded-full bg-[var(--gold-deep)] px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={salonLoading}>{salonLoading ? "Enregistrement..." : "Enregistrer"}</button>
        </form>
      </section>
    </div>
  );
}
