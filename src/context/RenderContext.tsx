import { createContext, useContext, useEffect, useState } from "react";

interface RenderOptions {
  transitionDuration: number;
  animation: string;
  willChange: string;
  backfaceVisibility: string;
  gpuAccelerated: boolean;
  profile: "low" | "medium" | "high";
}

interface RenderContextValue {
  opts: RenderOptions;
}

const RenderContext = createContext<RenderContextValue>({
  opts: {
    transitionDuration: 250,
    animation: "auto",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    gpuAccelerated: true,
    profile: "high",
  },
});

export function RenderProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<RenderOptions>({
    transitionDuration: 250,
    animation: "auto",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    gpuAccelerated: true,
    profile: "high",
  });

  useEffect(() => {
    try {
      const cores = typeof navigator !== "undefined" && (navigator as any).hardwareConcurrency ? (navigator as any).hardwareConcurrency : 4;
      const memory = typeof navigator !== "undefined" && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reduce = mq.matches;

      let profile: RenderOptions["profile"] = "high";
      if (reduce || cores <= 2 || memory <= 2) {
        profile = "low";
      } else if (cores <= 4 || memory <= 4) {
        profile = "medium";
      }

      const next: RenderOptions = profile === "low"
        ? { transitionDuration: 0, animation: "none", willChange: "auto", backfaceVisibility: "visible", gpuAccelerated: false, profile }
        : profile === "medium"
          ? { transitionDuration: 150, animation: "auto", willChange: "auto", backfaceVisibility: "hidden", gpuAccelerated: false, profile }
          : { transitionDuration: 250, animation: "auto", willChange: "transform, opacity", backfaceVisibility: "hidden", gpuAccelerated: true, profile };

      setOpts(next);

      const root = document.documentElement;
      root.style.setProperty("--render-transition-duration", `${next.transitionDuration}ms`);
      root.style.setProperty("--render-animation", next.animation);
      root.style.setProperty("--render-will-change", next.willChange);
      root.style.setProperty("--render-backface-visibility", next.backfaceVisibility);
      root.classList.remove("gpu-accelerated");
      if (reduce) {
        root.classList.add("reduce-motion");
      } else {
        root.classList.remove("reduce-motion");
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <RenderContext.Provider value={{ opts }}>
      {children}
    </RenderContext.Provider>
  );
}

export function useRenderOptimizer() {
  return useContext(RenderContext);
}
