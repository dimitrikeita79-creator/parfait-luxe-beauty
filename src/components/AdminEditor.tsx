import { useEffect, useMemo, useState } from "react";
import { catalogService, galleryService, servicesService, teamService, uploadService } from "@/backend/services";
import type { CatalogItem, GalleryItem, ServiceItem } from "@/backend/models";
import { CATALOG_ITEMS } from "@/lib/salon-data";
import { Image, Package, Scissors, Users } from "lucide-react";

const galleryCategories = ["Coiffure", "équipement", "Produits", "Promo", "autres"] as const;

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
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Coiffure" as GalleryItem["category"],
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
    code: "",
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

  const loadData = async () => {
    const [galleryData, catalogData, serviceData, teamData] = await Promise.all([
      galleryService.getAll(),
      catalogService.getAll(),
      servicesService.getAll(),
      teamService.getAll(),
    ]);
    setGalleryItems(galleryData);
    setCatalogItems(catalogData);
    setServiceItems(serviceData);
    setTeamMembers(teamData);
  };

  const availableCodes = useMemo(() => {
    const s = new Set<string>();
    Object.values(CATALOG_ITEMS).forEach((list) => list.forEach((it) => it.code && s.add(it.code)));
    return Array.from(s).sort();
  }, []);

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
      const desired = ["Coiffure", "équipement", "Produits", "Promo", "autres"];
      const normalize = (raw?: string | null) => {
        if (!raw) return "autres";
        const v = String(raw).trim().toLowerCase();
        for (const d of desired) if (d.toLowerCase() === v) return d;
        return "autres";
      };
      const category = normalize(catalogForm.category);
      const savedCategories = typeof window !== "undefined" ? window.localStorage.getItem("desmohair-categories") : null;
      const fromSaved: string[] = savedCategories ? JSON.parse(savedCategories).map((s: string) => normalize(s)) : [];
      const fromData: string[] = catalogItems.map((it) => normalize(it.category));
      const merged = Array.from(new Set(["Coiffure", "équipement", "Produits", "Promo", "autres", ...fromSaved, ...fromData, category]));
      if (typeof window !== "undefined") window.localStorage.setItem("desmohair-categories", JSON.stringify(merged));
      const payload = {
        title: catalogForm.title,
        description: catalogForm.description || null,
        code: (catalogForm as any).code?.trim() || null,
        price: Number(catalogForm.price) || 0,
        image_url: imageUrl || null,
        category,
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

      setCatalogForm({ title: "", description: "", price: "", imageUrl: "", category: "", code: "", isAvailable: true });
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
      code: (item as any).code || "",
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
      const photoUrl = teamFile ? await uploadService.uploadGalleryImage(teamFile) : teamForm.photoUrl;
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
        setTeamFeedback("Nouveau membre ajouté à l'équipe.");
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

  const startTeamEdit = (member: any) => {
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

  const btnBase = "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]";
  const redAddBtnClass = "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40";
  const blueEditBtnClass = "text-sm font-semibold text-blue-600 hover:text-blue-700";

  return (
    <div className="mt-6 space-y-4">
      <section className="rounded-[28px] border border-blue-200/40 bg-gradient-to-br from-blue-50/80 to-white p-5 shadow-md shadow-blue-200/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Gestion directe</p>
            <h2 className="text-xl font-semibold text-foreground">Édition admin via Supabase</h2>
          </div>
          <p className="text-sm text-muted-foreground">Vous pouvez importer une image ou utiliser un lien externe.</p>
        </div>
      </section>

      <section className="rounded-[24px] border border-blue-200 bg-white/95 p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Image className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Galerie</h3>
            <p className="text-sm text-muted-foreground">Ajouter ou modifier une photo avec une URL ou un fichier.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleGallerySubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} placeholder="Titre" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.description} onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })} placeholder="Description" />
          <select className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.category} onChange={(event) => setGalleryForm({ ...galleryForm, category: event.target.value as GalleryItem["category"] })}>
            {galleryCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={galleryForm.imageUrl} onChange={(event) => setGalleryForm({ ...galleryForm, imageUrl: event.target.value })} placeholder="Lien externe de l'image (https://...)" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setGalleryFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={galleryForm.isFeatured} onChange={(event) => setGalleryForm({ ...galleryForm, isFeatured: event.target.checked })} />
            Mettre en vedette
          </label>
          {galleryFeedback ? <p className="text-sm text-[var(--gold-deep)]">{galleryFeedback}</p> : null}
          <button className={`${btnBase} ${redAddBtnClass}`} type="submit" disabled={galleryLoading}>{galleryLoading ? "Enregistrement..." : galleryEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>

        <div className="mt-4 space-y-2">
          {galleryItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.is_featured ? "Vedette" : "Standard"}</p>
              </div>
              <button className={blueEditBtnClass} type="button" onClick={() => startGalleryEdit(item)}>✎ Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-red-200 bg-white/95 p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-100">
            <Package className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Catalogue</h3>
            <p className="text-sm text-muted-foreground">Ajoutez des produits, prix et images sans surcharger la base.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleCatalogSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.title} onChange={(event) => setCatalogForm({ ...catalogForm, title: event.target.value })} placeholder="Nom du produit" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.description} onChange={(event) => setCatalogForm({ ...catalogForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.price} onChange={(event) => setCatalogForm({ ...catalogForm, price: event.target.value })} placeholder="Prix" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.category} onChange={(event) => setCatalogForm({ ...catalogForm, category: event.target.value })} placeholder="Catégorie" />
          <select className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={(catalogForm as any).code} onChange={(event) => setCatalogForm({ ...catalogForm, code: event.target.value })}>
            <option value="">Utiliser un code existant (optionnel)</option>
            {availableCodes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={catalogForm.imageUrl} onChange={(event) => setCatalogForm({ ...catalogForm, imageUrl: event.target.value })} placeholder="Lien externe de l'image" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setCatalogFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={catalogForm.isAvailable} onChange={(event) => setCatalogForm({ ...catalogForm, isAvailable: event.target.checked })} />
            Disponible
          </label>
          {catalogFeedback ? <p className="text-sm text-[var(--gold-deep)]">{catalogFeedback}</p> : null}
          <button className={`${btnBase} ${redAddBtnClass}`} type="submit" disabled={catalogLoading}>{catalogLoading ? "Enregistrement..." : catalogEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {catalogItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.price}€</p>
              </div>
              <button className={blueEditBtnClass} type="button" onClick={() => startCatalogEdit(item)}>✎ Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-blue-200 bg-white/95 p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Scissors className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Services</h3>
            <p className="text-sm text-muted-foreground">Modifiez les prestations et leurs images.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleServiceSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.title} onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })} placeholder="Nom du service" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} placeholder="Prix" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.durationMin} onChange={(event) => setServiceForm({ ...serviceForm, durationMin: event.target.value })} placeholder="Durée en minutes" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.category} onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })} placeholder="Catégorie" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={serviceForm.imageUrl} onChange={(event) => setServiceForm({ ...serviceForm, imageUrl: event.target.value })} placeholder="Lien externe de l'image" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setServiceFile(event.target.files?.[0] ?? null)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={serviceForm.active} onChange={(event) => setServiceForm({ ...serviceForm, active: event.target.checked })} />
            Actif
          </label>
          {serviceFeedback ? <p className="text-sm text-[var(--gold-deep)]">{serviceFeedback}</p> : null}
          <button className={`${btnBase} ${redAddBtnClass}`} type="submit" disabled={serviceLoading}>{serviceLoading ? "Enregistrement..." : serviceEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {serviceItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category} • {item.price}€ • {item.duration_min} min</p>
              </div>
              <button className={blueEditBtnClass} type="button" onClick={() => startServiceEdit(item)}>✎ Éditer</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-red-200 bg-white/95 p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-100">
            <Users className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Équipe</h3>
            <p className="text-sm text-muted-foreground">Ajoutez ou mettez à jour les membres de l'équipe avec une photo ou un lien.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleTeamSubmit}>
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.fullName} onChange={(event) => setTeamForm({ ...teamForm, fullName: event.target.value })} placeholder="Nom complet" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.role} onChange={(event) => setTeamForm({ ...teamForm, role: event.target.value })} placeholder="Rôle" />
          <textarea className="min-h-24 w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.description} onChange={(event) => setTeamForm({ ...teamForm, description: event.target.value })} placeholder="Description" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.specialties} onChange={(event) => setTeamForm({ ...teamForm, specialties: event.target.value })} placeholder="Compétences (séparées par des virgules)" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" value={teamForm.photoUrl} onChange={(event) => setTeamForm({ ...teamForm, photoUrl: event.target.value })} placeholder="Lien externe de la photo" />
          <input className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2" type="file" accept="image/*" onChange={(event) => setTeamFile(event.target.files?.[0] ?? null)} />
          {teamFeedback ? <p className="text-sm text-[var(--gold-deep)]">{teamFeedback}</p> : null}
          <button className={`${btnBase} ${redAddBtnClass}`} type="submit" disabled={teamLoading}>{teamLoading ? "Enregistrement..." : teamEditingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
        <div className="mt-4 space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
              <div>
                <p className="font-medium text-foreground">{member.full_name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <button className={blueEditBtnClass} type="button" onClick={() => startTeamEdit(member)}>✎ Éditer</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}