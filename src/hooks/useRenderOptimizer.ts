import { useEffect, useMemo, useState } from "react";

type PerfProfile = "low" | "medium" | "high";

export function useRenderOptimizer() {
  const [profile, setProfile] = useState<PerfProfile>("high");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const cores = typeof navigator !== "undefined" && (navigator as any).hardwareConcurrency ? (navigator as any).hardwareConcurrency : 4;
      const memory = typeof navigator !== "undefined" && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
      if (cores <= 2 || memory <= 2) {
        setProfile("low");
      } else if (cores <= 4 || memory <= 4) {
        setProfile("medium");
      } else {
        setProfile("high");
      }
    } catch {
      setProfile("high");
    }
  }, []);

  const opts = useMemo(() => {
    if (reduceMotion || profile === "low") {
      return {
        transitionDuration: 0,
        animation: "none",
        willChange: "auto",
        backfaceVisibility: "visible",
        gpuAccelerated: false,
      };
    }
    if (profile === "medium") {
      return {
        transitionDuration: 150,
        animation: "auto",
        willChange: "auto",
        backfaceVisibility: "hidden",
        gpuAccelerated: false,
      };
    }
    return {
      transitionDuration: 250,
      animation: "auto",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      gpuAccelerated: true,
    };
  }, [reduceMotion, profile]);

  return { profile, reduceMotion, opts };
}
