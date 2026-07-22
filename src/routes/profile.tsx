import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Heart,
  LayoutGrid,
  LogOut,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import type { AppUser } from "@/backend/models";
import { authService, uploadService } from "@/backend/services";
import profileIcon from "@/assets/icone/profil.svg";

interface SavedProduct {
  id: string;
  title: string;
  note: string;
}

const STORAGE_KEY = "desmohair-saved-products";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Desmohair" },
      { name: "description", content: "Profil utilisateur et espace administration Desmohair" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductNote, setNewProductNote] = useState("");

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadUser();
    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      if (active) {
        setUser(nextUser);
      }
    });

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSavedProducts(JSON.parse(stored));
        } catch {
          setSavedProducts([]);
        }
      }
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    navigate({ to: "/login", replace: true });
  };

  const handleAvatarUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!avatarFile) {
      setAvatarFeedback("Choisissez une image avant de l’envoyer.");
      return;
    }

    try {
      setAvatarLoading(true);
      setAvatarFeedback(null);
      const avatarUrl = await uploadService.uploadLogo(avatarFile, `avatar-${Date.now()}`);
      const updatedUser = await authService.updateProfile({ avatar_url: avatarUrl });
      setUser(updatedUser);
      setAvatarFile(null);
      setAvatarFeedback("Photo de profil mise à jour.");
    } catch (error) {
      setAvatarFeedback(
        error instanceof Error ? error.message : "Impossible de mettre à jour la photo.",
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAddSavedProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newProductName.trim();
    if (!trimmed) return;

    const nextItem: SavedProduct = {
      id: `${Date.now()}`,
      title: trimmed,
      note: newProductNote.trim(),
    };

    const nextItems = [nextItem, ...savedProducts];
    setSavedProducts(nextItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    }
    setNewProductName("");
    setNewProductNote("");
  };

  const handleRemoveSavedProduct = (id: string) => {
    const nextItems = savedProducts.filter((item) => item.id !== id);
    setSavedProducts(nextItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    }
  };

  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <AppShell title="Chargement du profil" subtitle="Connexion à votre espace personnel…">
        <div className="mt-6 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.18)]">
          <p className="text-sm text-muted-foreground">Vérification de votre session…</p>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Desmohair" subtitle="Connectez-vous pour accéder à votre espace client">
        <div className="mt-6 rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_24px_90px_-32px_rgba(0,0,0,0.24)]">
          <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[var(--gold-soft)]/70 text-[var(--gold-deep)] shadow-sm">
                <img src={profileIcon} alt="Icône profil" className="h-5 w-5 object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">
                  Espace client
                </p>
                <p className="font-semibold text-foreground">Desmohair</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Retrouvez vos favoris, vos produits sauvegardés et votre espace sécurisé en un seul
              lieu.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Accès sécurisé</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Votre session reste protégée et vous pouvez revenir à tout moment.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Produits sauvegardés</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez vos articles préférés depuis cette page.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <GlassButton as={Link} to="/login" variant="gold" size="md">
              Se connecter
            </GlassButton>
            <GlassButton as={Link} to="/" variant="light" size="md">
              Revenir à l’accueil
            </GlassButton>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={isAdmin ? "Profil administrateur" : "Mon profil"}
      subtitle={
        isAdmin
          ? "Gérez votre accès et l’espace de modification Desmohair"
          : "Retrouvez vos favoris, vos produits sauvegardés et vos informations en un seul lieu"
      }
    >
      <div className="mt-6 rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_24px_90px_-32px_rgba(0,0,0,0.24)]">
        <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-[var(--gold-soft)]/70 text-[var(--gold-deep)] shadow-sm">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <img src={profileIcon} alt="Icône profil" className="h-6 w-6 object-contain" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">
                  Bienvenue chez Desmohair
                </p>
                <p className="font-semibold text-foreground">
                  {user.full_name ?? user.email?.split("@")[0] ?? "Utilisateur"}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] shadow-sm">
              {isAdmin ? "Administrateur" : "Client"}
            </div>
          </div>

          <form className="mt-4 flex flex-wrap items-center gap-2" onSubmit={handleAvatarUpload}>
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-foreground">
              <Camera className="h-4 w-4" />
              Changer la photo
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button
              className="rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
              type="submit"
              disabled={avatarLoading}
            >
              {avatarLoading ? "Envoi…" : "Enregistrer"}
            </button>
            {avatarFile ? (
              <span className="text-sm text-muted-foreground">{avatarFile.name}</span>
            ) : null}
          </form>
          {avatarFeedback ? (
            <p className="mt-2 text-sm text-[var(--gold-deep)]">{avatarFeedback}</p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-semibold">Produits sauvegardés</p>
            <form className="mt-3 space-y-2" onSubmit={handleAddSavedProduct}>
              <input
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                value={newProductName}
                onChange={(event) => setNewProductName(event.target.value)}
                placeholder="Nom du produit"
              />
              <textarea
                className="min-h-20 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                value={newProductNote}
                onChange={(event) => setNewProductNote(event.target.value)}
                placeholder="Note ou rappel"
              />
              <button
                className="flex items-center gap-2 rounded-full bg-[var(--gold-deep)] px-3 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </form>
            <div className="mt-3 space-y-2">
              {savedProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun produit enregistré pour l’instant.
                </p>
              ) : (
                savedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-2xl border border-stone-200 bg-white px-3 py-3"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      {item.note ? (
                        <p className="text-sm text-muted-foreground">{item.note}</p>
                      ) : null}
                    </div>
                    <button
                      className="text-sm font-semibold text-rose-600"
                      type="button"
                      onClick={() => handleRemoveSavedProduct(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold">Vos accès rapides</p>
            <div className="mt-3 space-y-2">
              {isAdmin ? (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-sm font-semibold text-foreground">Administration</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Gérez les services, le catalogue, la galerie et les informations du salon.
                  </p>
                </div>
              ) : null}
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-sm font-semibold text-foreground">Retour à l’accueil</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Continuez votre visite sur le site et découvrez les nouveautés.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <GlassButton as={Link} to="/" variant="gold" size="md">
                Continuer la visite
              </GlassButton>
              <GlassButton onClick={handleSignOut} variant="light" size="md">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </GlassButton>
            </div>

            {isAdmin ? (
              <div className="mt-4 rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em]">
                  Administration
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    { title: "Services", description: "Gérer les prestations" },
                    {
                      title: "Catalogue",
                      description: "Ajouter ou modifier les produits",
                    },
                  ].map(({ title, description }) => (
                    <div
                      key={title}
                      className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <GlassButton as={Link} to="/admin" variant="gold" size="md">
                    Ouvrir l’administration
                  </GlassButton>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
