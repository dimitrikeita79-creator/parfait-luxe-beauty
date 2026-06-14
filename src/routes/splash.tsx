import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logoAsset from "@/assets/logo.asset.json";

export const Route = createFileRoute("/splash")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/" }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative mx-auto grid min-h-screen max-w-md place-items-center overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[var(--gold-soft)] opacity-50 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--rose)] opacity-50 blur-3xl" />
      </div>
      <div className="relative text-center animate-fade-up">
        <div className="glass-strong mx-auto grid h-36 w-36 place-items-center rounded-[40px] shadow-luxe overflow-hidden p-3">
          <img src={logoAsset.url} alt="Parfait.Design/Desmohair" className="h-full w-full object-contain animate-float" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-semibold leading-tight">
          Parfait.Design<br/><span className="text-gold">/Desmohair</span>
        </h1>
        <p className="mt-3 text-sm italic text-muted-foreground">"Votre beauté, notre passion"</p>
        <div className="mx-auto mt-8 h-1 w-32 overflow-hidden rounded-full bg-[var(--muted)]">
          <div className="h-full w-1/3 animate-shimmer rounded-full bg-gold" />
        </div>
      </div>
    </div>
  );
}