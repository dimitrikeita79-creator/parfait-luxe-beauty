import { createFileRoute } from '@tanstack/react-router'
import { Link, useSafeNavigate } from "@/hooks/useSafeNavigate";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Sparkles,
  Settings,
  Image as ImageIcon,
  LayoutGrid,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { ImprovedAdminEditor } from "@/components/ImprovedAdminEditor";
import type { AppUser } from "@/backend/models";
import { authService } from "@/backend/services";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Parfait.Design/Desmohair" },
      {
        name: "description",
        content:
          "Espace d'édition réservé aux administrateurs Parfait.Design/Desmohair",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useSafeNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const active = { current: true };

    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        if (active.current) {
          setUser(currentUser);

          if (!currentUser || currentUser.role !== "admin") {
            navigate({ to: "/profile", replace: true });
          }
        }
      } catch {
        if (active.current) {
          navigate({ to: "/login", replace: true });
        }
      } finally {
        if (active.current) {
          setChecking(false);
        }
      }
    };

    void loadUser();

    return () => {
      active.current = false;
    };
  }, [navigate]);

  const actions = [
    {
      title: "Éditer les services",
      description: "Gérer les prestations et leur visibilité",
      icon: Sparkles,
    },
    {
      title: "Gérer le catalogue",
      description: "Ajouter, modifier ou retirer les produits",
      icon: LayoutGrid,
    },
    {
      title: "Mettre à jour la galerie",
      description: "Publier de nouveaux visuels",
      icon: ImageIcon,
    },
    {
      title: "Paramètres salon",
      description: "Coordonnées, horaires et informations",
      icon: Settings,
    },
  ];

  if (checking) {
    return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-col items-center justify-center py-16"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-muted-foreground">
            Vérification du statut administrateur…
          </p>
        </motion.div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl space-y-6">

          {/* Badge */}
          <div className="flex items-center gap-2 text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Accès sécurisé
            </p>
          </div>

          {/* Carte de bienvenue */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-red-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">
              Bienvenue dans votre tableau de bord
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Vous êtes connecté en tant qu'administrateur. Cette vue vous permet
              de préparer les modifications du salon.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {actions.map(({ title, description, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {title}
                  </p>

                  <p className="text-xs text-slate-500">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Boutons */}
          <div className="flex flex-wrap gap-3">
            <GlassButton as={Link} to="/" variant="gold" size="md">
              Retour à l'accueil
            </GlassButton>

            <GlassButton as={Link} to="/login" variant="light" size="md">
              Changer de compte
            </GlassButton>
          </div>

          {/* Éditeur */}
          <ImprovedAdminEditor />

        </div>
      </motion.div>
  );
}
