import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Heart,
  LogOut,
  Plus,
  Trash2,
  User,
  Settings,
  ShieldCheck,
  ChevronRight,
  Star,
  Bookmark,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { useToast } from "@/hooks/useToast";
import type { AppUser, FavoriteItem } from "@/backend/models";
import { authService, favoritesService, reviewsService, uploadService } from "@/backend/services";
import { getFavorites, saveFavorites, toggleFavorite } from "@/lib/favorites";
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
      {
        name: "description",
        content: "Profil utilisateur et espace administration Desmohair",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { setTheme, theme: currentTheme } = useTheme();
  const { success, error: toastError } = useToast();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductNote, setNewProductNote] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;
    let unsubscribeCleanup: (() => void) | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const loadUser = async () => {
      try {
        timeoutId = setTimeout(() => {
          if (active) {
            setLoading(false);
          }
        }, 10000);
        const currentUser = await authService.getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadUser();
    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      if (active) {
        setUser(nextUser);
        if (!nextUser && user) {
          toastError("Session", "Votre session a expiré. Veuillez vous reconnecter.");
        }
      }
    });

    const sessionCheckInterval = setInterval(async () => {
      if (!active) return;
      try {
        const currentUser = await authService.getCurrentUser();
        if (active && currentUser) {
          setUser(currentUser);
        }
      } catch {
        // Silently fail session check
      }
    }, 5 * 60 * 1000);

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSavedProducts(JSON.parse(stored));
        } catch {
          setSavedProducts([]);
        }
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
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
      clearInterval(sessionCheckInterval);
      if (unsubscribeCleanup) {
        unsubscribeCleanup();
      }
    };
  }, []);

  useEffect(() => {
    void loadFavoritesForUser(user);
  }, [user]);

  const changeTheme = async (next: Theme) => {
    setTheme(next);
    try {
      await authService.updateProfile({ theme: next });
    } catch (err) {
      console.warn("Impossible de sauvegarder le thème :", err);
    }
  };

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
      const avatarUrl = await uploadService.uploadAvatar(avatarFile, `avatar-${Date.now()}`);
      const updatedUser = await authService.updateProfile({
        avatar_url: avatarUrl,
      });
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

  const loadFavoritesForUser = async (currentUser: AppUser | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (!currentUser) {
      setFavorites(getFavorites());
      return;
    }

    setFavoritesLoading(true);
    try {
      const localFavorites = getFavorites();
      let backendFavorites: FavoriteItem[] = [];

      try {
        backendFavorites = await favoritesService.getUserFavorites();
      } catch (error) {
        console.error("Impossible de charger les favoris Supabase :", error);
      }

      const mergedFavorites = [
        ...backendFavorites,
        ...localFavorites.filter(
          (favorite) =>
            !backendFavorites.some(
              (backendFavorite) =>
                backendFavorite.kind === favorite.kind && backendFavorite.id === favorite.id,
            ),
        ),
      ];

      setFavorites(mergedFavorites);
      saveFavorites(mergedFavorites);

      if (localFavorites.length > 0) {
        const missingFavorites = localFavorites.filter(
          (favorite) =>
            !backendFavorites.some(
              (backendFavorite) =>
                backendFavorite.kind === favorite.kind && backendFavorite.id === favorite.id,
            ),
        );

        await Promise.all(
          missingFavorites.map((favorite) => favoritesService.addFavorite(favorite)),
        );
      }
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveSavedProduct = (id: string) => {
    const nextItems = savedProducts.filter((item) => item.id !== id);
    setSavedProducts(nextItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    }
  };

  const handleRemoveFavorite = async (favorite: FavoriteItem) => {
    if (user) {
      try {
        await favoritesService.removeFavorite(favorite.kind, favorite.id);
      } catch (error) {
        console.error("Impossible de retirer le favori Supabase :", error);
      }
    }

    const nextFavorites = toggleFavorite(favorite);
    setFavorites(nextFavorites);
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
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
        user_id: user?.id ?? null,
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

  const getFavoriteDestination = (favorite: FavoriteItem) => {
    if (favorite.kind === "catalog") {
      const category = favorite.category || favorite.title;
      return {
        to: "/catalog/$category",
        params: { category: norm(category) },
        search: { highlight: favorite.id },
      } as const;
    }

    if (favorite.kind === "service") {
      return {
        to: "/services",
        search: { highlight: favorite.id },
      } as const;
    }

    return {
      to: "/gallery",
      search: {} as any,
    } as const;
  };

  const handleOpenFavorite = (favorite: FavoriteItem) => {
    const destination = getFavoriteDestination(favorite);
    navigate(destination);
  };

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  if (loading) {
    return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col items-center justify-center gap-4"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--gold)]/30 border-t-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">Vérification de votre session…</p>
        </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="rounded-[32px] border-2 border-red-500/30 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 shadow-lg shadow-red-200/20">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-red-100/50 to-red-200/30 shadow-lg">
                <img
                  src={profileIcon}
                  alt="Icône profil"
                  className="h-8 w-8 object-contain filter brightness-0 saturate-100 invert-[0.8]"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-red-700">Votre espace personnel</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Retrouvez vos favoris, vos produits sauvegardés et gérez votre compte en toute simplicité.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <GlassButton as={Link} to="/login" variant="gold" size="md" full className="bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40">
                <User className="h-4 w-4" />
                Se connecter
              </GlassButton>
              <GlassButton as={Link} to="/" variant="light" size="md" full>
                Revenir à l’accueil
              </GlassButton>
            </div>
          </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Carte principale du profil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <div className="rounded-[32px] border border-blue-200/40 bg-gradient-to-br from-blue-50/80 to-white p-5 space-y-5 shadow-md shadow-blue-200/20">
          {/* En-tête profil */}
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold-deep)]/40 shadow-md">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <img src={profileIcon} alt="Icône profil" className="h-7 w-7 object-contain" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600">
                {isAdmin ? "Administrateur" : "Client"}
              </p>
              <p className="text-lg font-semibold text-foreground truncate">
                {user.full_name ?? user.email?.split("@")[0] ?? "Utilisateur"}
              </p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="rounded-full bg-blue-100/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
              {isAdmin ? (
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> Client
                </span>
              )}
            </div>
          </div>

          {/* Formulaire avatar */}
          <form className="flex flex-wrap items-center gap-2" onSubmit={handleAvatarUpload}>
            <label className="liquid-glass flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:scale-[1.02] active:scale-[0.98]">
              <Camera className="h-3.5 w-3.5 text-blue-600" />
              Changer la photo
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <GlassButton
              type="submit"
              variant="gold"
              size="sm"
              disabled={avatarLoading}
              className="rounded-full"
            >
              {avatarLoading ? "Envoi…" : "Enregistrer"}
            </GlassButton>
            {avatarFile ? (
              <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                {avatarFile.name}
              </span>
            ) : null}
          </form>
          {avatarFeedback ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-blue-600"
            >
              {avatarFeedback}
            </motion.p>
          ) : null}

          {/* Sélecteur de thème */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Thème de l'application
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => changeTheme("light")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${
                  currentTheme === "light"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-stone-200 bg-white text-foreground hover:border-stone-300"
                }`}
              >
                Clair
              </button>
              <button
                type="button"
                onClick={() => changeTheme("gold")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${
                  currentTheme === "gold"
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-stone-200 bg-white text-foreground hover:border-stone-300"
                }`}
              >
                Doré
              </button>
              <button
                type="button"
                onClick={() => changeTheme("silver")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${
                  currentTheme === "silver"
                    ? "border-slate-500 bg-slate-500 text-white"
                    : "border-stone-200 bg-white text-foreground hover:border-stone-300"
                }`}
              >
                Argent
              </button>
              <button
                type="button"
                onClick={() => changeTheme("green")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${
                  currentTheme === "green"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-stone-200 bg-white text-foreground hover:border-stone-300"
                }`}
              >
                Vert
              </button>
              <button
                type="button"
                onClick={() => changeTheme("red")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer hover:scale-105 active:scale-95 ${
                  currentTheme === "red"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-stone-200 bg-white text-foreground hover:border-stone-300"
                }`}
              >
                Rouge
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Produits sauvegardés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-4"
      >
        <div className="liquid-glass rounded-[32px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-foreground">Produits sauvegardés</h3>
          </div>

          <form className="space-y-2" onSubmit={handleAddSavedProduct}>
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
                value={newProductName}
                onChange={(event) => setNewProductName(event.target.value)}
                placeholder="Nom du produit"
              />
              <GlassButton
                type="submit"
                variant="gold"
                size="sm"
                className="shrink-0 inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </GlassButton>
            </div>
            <textarea
              className="min-h-16 w-full rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
              value={newProductNote}
              onChange={(event) => setNewProductNote(event.target.value)}
              placeholder="Note ou rappel (optionnel)"
            />
          </form>

          <div className="mt-4 space-y-2">
            {savedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun produit enregistré pour l’instant
              </p>
            ) : (
              <AnimatePresence>
                {savedProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white/60 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      {item.note ? (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                      ) : null}
                    </div>
                    <button
                      className="shrink-0 rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                      type="button"
                      onClick={() => handleRemoveSavedProduct(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-4"
      >
        <div className="liquid-glass rounded-[32px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-semibold text-foreground">Votre avis</h3>
          </div>

          <form className="space-y-3" onSubmit={handleSubmitReview}>
            <textarea
              className="min-h-20 w-full rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
              value={newReviewText}
              onChange={(event) => setNewReviewText(event.target.value)}
              placeholder="Partagez votre expérience avec nous..."
              rows={4}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      newReviewRating === index + 1
                        ? "bg-red-600 text-white"
                        : "bg-stone-100 text-muted-foreground hover:bg-stone-200"
                    }`}
                    onClick={() => setNewReviewRating(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <GlassButton
                type="submit"
                variant="gold"
                size="sm"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Envoi…" : "Envoyer mon avis"}
              </GlassButton>
            </div>
            {reviewFeedback && <p className="text-sm text-blue-600">{reviewFeedback}</p>}
          </form>
        </div>
      </motion.div>

      {/* Section Favoris */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-4"
      >
        <div className="liquid-glass rounded-[32px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-foreground">Favoris</h3>
          </div>

          <div className="space-y-2">
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun élément aimé pour l’instant. Appuyez sur ❤️ dans la galerie, les services ou le catalogue pour les retrouver ici.
              </p>
            ) : (
              <AnimatePresence>
                {favorites.map((favorite) => (
                  <motion.div
                    key={`${favorite.kind}-${favorite.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white/60 p-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenFavorite(favorite)}
                      className="min-w-0 text-left"
                    >
                      <p className="text-sm font-semibold text-foreground">{favorite.title}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        {favorite.category ? (
                          <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-1">
                            {favorite.category}
                          </span>
                        ) : null}
                        <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-1 uppercase tracking-[0.12em]">
                          {favorite.kind}
                        </span>
                        {favorite.price ? (
                          <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-1">
                            {favorite.price.toLocaleString()} F CFA
                          </span>
                        ) : null}
                      </div>
                    </button>
                    <button
                      className="shrink-0 rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                      type="button"
                      onClick={() => handleRemoveFavorite(favorite)}
                      title="Retirer des favoris"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* Section Accès rapides & Administration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-4"
      >
        <div className="liquid-glass rounded-[32px] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-foreground">Accès rapides</h3>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white/60 p-3 transition hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100/60">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-foreground">Continuer la visite</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <GlassButton
              type="button"
              onClick={handleSignOut}
              variant="light"
              size="md"
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white/60 p-3"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50">
                  <LogOut className="h-4 w-4 text-rose-500" />
                </div>
                <span className="text-sm font-medium text-foreground">Déconnexion</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </GlassButton>
          </div>

          {isAdmin ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pt-2 border-t border-red-200">
                <Settings className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-semibold text-foreground">Administration</h3>
              </div>

              <div className="flex flex-col gap-2">
                <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-3">
                  <p className="text-sm font-semibold text-foreground">Panneau d'administration</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gérez les services, le catalogue, la galerie et les informations du salon
                  </p>
                </div>
                <GlassButton
                  as={Link}
                  to="/admin"
                  variant="gold"
                  size="md"
                  full
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                >
                  <Settings className="h-4 w-4" />
                  Ouvrir l’administration
                </GlassButton>
              </div>
            </div>
          ) : null}
        </div>
        </motion.div>

        {/* Legal links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-4 text-[10px] text-muted-foreground"
        >
          <Link to="/privacy" className="underline underline-offset-2 hover:text-[var(--gold-deep)] transition">
            Politique de confidentialité
          </Link>
          <span className="text-stone-300">|</span>
          <Link to="/terms" className="underline underline-offset-2 hover:text-[var(--gold-deep)] transition">
            Conditions d'utilisation
          </Link>
          <span className="text-stone-300">|</span>
          <span>Parfait.design © 2026</span>
        </motion.div>
      </>
    );
  }
