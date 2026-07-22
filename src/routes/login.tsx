import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { authService } from "@/backend/services";
import profileIcon from "@/assets/icone/profil.svg";

const brandText = "Desmohair";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Desmohair" },
      { name: "description", content: "Connexion pour les clients et l’administrateur de Desmohair" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false;
    if (mode === "signup") {
      return Boolean(fullName.trim()) && password.length >= 6 && password === confirmPassword;
    }
    return true;
  }, [confirmPassword, email, fullName, mode, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "signup") {
        await authService.signUp(normalizedEmail, password, fullName.trim(), normalizedEmail === "essadjikeita794@gmail.com");
        setFullName("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setMode("login");
        setInfoMessage("Compte créé avec succès. Merci de valider votre adresse e-mail en cliquant sur le lien reçu avant de vous connecter.");
        return;
      }

      const user = await authService.signIn(normalizedEmail, password);

      if (user.role === "admin") {
        navigate({ to: "/profile" });
      } else {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "authNotice",
            "Vous êtes connecté(e). Vous serez informé(e) des mises à jour et nouveaux ajouts.",
          );
        }
        navigate({ to: "/profile" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title={mode === "signup" ? "Créer un compte" : "Connexion"} subtitle={mode === "signup" ? "Rejoignez Desmohair pour suivre les nouveautés du salon" : "Accédez à votre espace client avec simplicité"}>
      <div className="mt-6 rounded-[32px] border border-stone-200 bg-white p-5 shadow-[0_24px_90px_-32px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-3xl bg-white shadow-sm">
              <img src={profileIcon} alt="Icône profil" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">{brandText}</p>
              <p className="text-[11px] text-muted-foreground">Espace client & administration</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Bienvenue espace client.</p>
          <div className="mt-4 flex gap-2 rounded-full bg-white p-2 shadow-inner">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground"}`}>
              Connexion
            </button>
            <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground"}`}>
              Créer un compte
            </button>
          </div>
        </div>

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nom complet</span>
              <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 shadow-sm">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 shadow-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@example.com"
                className="w-full bg-transparent text-sm outline-none"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mot de passe</span>
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 shadow-sm">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-transparent text-sm outline-none"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Confirmer le mot de passe</span>
              <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 shadow-sm">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent text-sm outline-none"
                  autoComplete="new-password"
                />
              </div>
            </label>
          ) : null}

          {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          {infoMessage ? <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{infoMessage}</p> : null}

          <GlassButton type="submit" variant="light" size="md" full disabled={!canSubmit || loading}>
            {loading ? (mode === "signup" ? "Création..." : "Connexion...") : mode === "signup" ? "Créer mon compte" : "Se connecter"}
          </GlassButton>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/" className="font-semibold text-[var(--gold-deep)]">Retour à l’accueil</Link>
        </div>
      </div>
    </AppShell>
  );
}
