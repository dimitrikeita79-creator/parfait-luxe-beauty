import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, LayoutGrid, LogOut, ShoppingBag, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import type { AppUser } from "@/backend/models";
import { authService } from "@/backend/services";

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

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    navigate({ to: "/login", replace: true });
  };

  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <AppShell title="Chargement du profil" subtitle="Connexion à votre espace personnel…">
        <div className="mt-6 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Vérification de votre session…</p>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Profil" subtitle="Connectez-vous pour accéder à votre espace personnel">
        <div className="mt-6 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/95 via-[var(--gold-soft)]/35 to-white/80 p-6 shadow-[0_24px_90px_-32px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="rounded-[24px] border border-[var(--gold-soft)]/70 bg-[var(--gold-soft)]/60 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-[var(--gold-deep)] shadow-sm">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">Espace client</p>
                <p className="font-semibold text-foreground">Bienvenue sur votre profil</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Retrouvez vos favoris, votre panier et votre suivi personnalisé en quelques secondes.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Accès sécurisé</p>
              <p className="mt-1 text-sm text-muted-foreground">Votre session reste protégée et vous pouvez revenir à tout moment.</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[var(--gold-soft)]/45 p-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Suivi personnalisé</p>
              <p className="mt-1 text-sm text-muted-foreground">Profitez d’un espace pensé pour les nouveautés, réservations et offres.</p>
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
    <AppShell title={isAdmin ? "Profil administrateur" : "Mon profil"} subtitle={isAdmin ? "Gérez votre accès et l’espace de modification Desmohair" : "Retrouvez vos favoris, votre panier et vos informations en un seul lieu"}>
      <div className="mt-6 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/95 via-[var(--gold-soft)]/35 to-white/80 p-6 shadow-[0_24px_90px_-32px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="rounded-[24px] border border-[var(--gold-soft)]/70 bg-[var(--gold-soft)]/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-[var(--gold-deep)] shadow-sm">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]">Bienvenue chez Desmohair</p>
                <p className="font-semibold text-foreground">{user?.full_name ?? user?.email?.split("@")[0] ?? "Utilisateur"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] shadow-sm">
              {isAdmin ? "Administrateur" : "Client"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-[var(--gold-soft)]/45 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--gold-deep)]">
              <Heart className="h-4 w-4" />
              <p className="text-sm font-semibold">Mes favoris</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Aucun favori enregistré pour le moment.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--gold-deep)]">
              <ShoppingBag className="h-4 w-4" />
              <p className="text-sm font-semibold">Mon panier</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Votre panier est vide pour l’instant.</p>
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
          <div className="mt-5 rounded-[24px] border border-[var(--gold-soft)]/80 bg-[var(--gold-soft)]/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--gold-deep)]">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">Partie modification</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Accédez à l’espace d’édition pour mettre à jour les services, le catalogue, la galerie et les informations du salon.</p>

            <div className="mt-4 space-y-2">
              {[
                { title: "Services", description: "Gérer les prestations", icon: Sparkles },
                { title: "Catalogue", description: "Ajouter ou modifier les produits", icon: LayoutGrid },
              ].map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--gold-soft)]/70 text-[var(--gold-deep)]">
                    <Icon className="h-4 w-4" />
                  </div>
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
    </AppShell>
  );
}
