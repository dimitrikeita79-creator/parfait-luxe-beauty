import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassButton } from "@/components/GlassButton";
import { useToast } from "@/hooks/useToast";
import { authService } from "@/backend/services";
import profileIcon from "@/assets/icone/profil.svg";

const brandText = "Desmohair";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Desmohair" },
      { name: "description", content: "Connexion pour les clients et l'administrateur de Desmohair" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "signup") {
        await authService.signUp(normalizedEmail, password, fullName.trim(), normalizedEmail === "essadjikeita794@gmail.com");
        setFullName("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setMode("login");
        success("Compte créé", "Vérifiez votre e-mail pour valider votre compte.");
        return;
      }

      const user = await authService.signIn(normalizedEmail, password);

      if (user.role === "admin") {
        navigate({ to: "/profile" });
      } else {
        navigate({ to: "/profile" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      toastError("Connexion", message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mt-6 rounded-[32px] border border-blue-200/40 bg-gradient-to-br from-blue-50/80 to-white p-5 shadow-md shadow-blue-200/20 sm:p-6">
        <div className="rounded-[24px] border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/60 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-blue-200/30">
              <img src={profileIcon} alt="Icône profil" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{brandText}</p>
              <p className="text-[11px] text-muted-foreground">Espace client & administration</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Bienvenue espace client.</p>
          <div className="mt-4 flex gap-2 rounded-full bg-blue-50/50 p-2 shadow-inner ring-1 ring-blue-100/30">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                mode === "login" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30" 
                  : "bg-white/80 text-foreground border border-blue-200/30"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                mode === "signup" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30" 
                  : "bg-white/80 text-foreground border border-blue-200/30"
              }`}
            >
              Créer un compte
            </button>
          </div>
        </div>

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nom complet</span>
              <div className="flex items-center gap-2 rounded-2xl border border-blue-200/30 bg-white/80 px-3 py-3 shadow-sm">
                <UserRound className="h-4 w-4 text-blue-400" />
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
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-blue-300/40 bg-white/90 px-3 py-3 shadow-sm">
              <Mail className="h-4 w-4 text-blue-600" />
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
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">Mot de passe</span>
            <div className="flex items-center gap-2 rounded-2xl border border-blue-300/40 bg-white/90 px-3 py-3 shadow-sm">
              <Lock className="h-4 w-4 text-blue-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-transparent text-sm outline-none"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-blue-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Confirmer le mot de passe</span>
              <div className="flex items-center gap-2 rounded-2xl border border-blue-200/30 bg-white/80 px-3 py-3 shadow-sm">
                <Lock className="h-4 w-4 text-blue-400" />
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

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (mode === "signup" ? "Création..." : "Connexion...") : mode === "signup" ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/" className="font-semibold text-blue-600">Retour à l'accueil</Link>
        </div>

        {/* Legal links */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <Link to="/privacy" className="underline underline-offset-2 hover:text-[var(--gold-deep)] transition">
            Politique de confidentialité
          </Link>
          <span className="text-stone-300">|</span>
          <Link to="/terms" className="underline underline-offset-2 hover:text-[var(--gold-deep)] transition">
            Conditions d'utilisation
          </Link>
        </div>
      </div>
  );
}