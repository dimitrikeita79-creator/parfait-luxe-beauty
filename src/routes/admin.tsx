import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Settings, Image as ImageIcon, LayoutGrid, Phone, Database } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Parfait.Design/Desmohair" },
      { name: "description", content: "Espace d’édition réservé aux administrateurs Parfait.Design/Desmohair" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const actions = [
    { title: "Éditer les services", description: "Gérer les prestations et leur visibilité", icon: Sparkles },
    { title: "Gérer le catalogue", description: "Ajouter, modifier ou retirer les produits", icon: LayoutGrid },
    { title: "Mettre à jour la galerie", description: "Publier de nouveaux visuels", icon: ImageIcon },
    { title: "Paramètres salon", description: "Coordonnées, horaires et informations", icon: Settings },
  ];

  return (
    <AppShell title="Administration" subtitle="Espace réservé aux comptes administrateurs">
      <div className="mt-6 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-[var(--gold-deep)]">
          <ShieldCheck className="h-4 w-4" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">Accès sécurisé</p>
        </div>

        <div className="mt-4 rounded-3xl border border-[var(--gold-soft)]/70 bg-[var(--gold-soft)]/50 p-4">
          <p className="text-sm font-semibold text-[var(--gold-deep)]">Bienvenue dans votre tableau de bord</p>
          <p className="mt-1 text-sm text-muted-foreground">Vous êtes connecté en tant qu’administrateur. Cette vue vous permet de préparer les modifications du salon.</p>
        </div>

        <div className="mt-4 space-y-2">
          {actions.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-3 py-3">
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

        <div className="mt-5 flex flex-wrap gap-2">
          <GlassButton as={Link} to="/" variant="gold" size="md">
            Retour à l’accueil
          </GlassButton>
          <GlassButton as={Link} to="/login" variant="light" size="md">
            Changer de compte
          </GlassButton>
        </div>
      </div>
    </AppShell>
  );
}
