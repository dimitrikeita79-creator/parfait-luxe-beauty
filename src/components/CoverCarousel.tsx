import { useEffect, useRef, useState, useCallback } from "react";
import { Frame } from "@/components/Frame";

export type Cover = { id: string; title: string; subtitle: string; tone: string; image?: string };

export const DEFAULT_COVERS: Cover[] = [
  { id: "c1", title: "Pose Perruque", subtitle: "Lace HD glueless", tone: "from-neutral-100 via-white to-amber-50" },
  { id: "c2", title: "Coiffure Mariage", subtitle: "Le jour J, sublimée", tone: "from-rose-50 via-white to-amber-50" },
  { id: "c3", title: "Tissage Premium", subtitle: "Brésilien · Péruvien", tone: "from-amber-50 via-white to-neutral-100" },
  { id: "c4", title: "Box Braids", subtitle: "Tresses signature", tone: "from-stone-100 via-white to-amber-50" },
  { id: "c5", title: "Perruques Naturelles", subtitle: "18'' à 30''", tone: "from-amber-50 via-white to-rose-50" },
  { id: "c6", title: "Coloration", subtitle: "Reflets sur-mesure", tone: "from-rose-50 via-amber-50 to-white" },
  { id: "c7", title: "Soins Capillaires", subtitle: "Routine d'exception", tone: "from-white via-neutral-50 to-amber-50" },
  { id: "c8", title: "Équipements Pro", subtitle: "Salon & maison", tone: "from-neutral-50 via-white to-stone-100" },
  { id: "c9", title: "Conseils Beauté", subtitle: "Diagnostic offert", tone: "from-amber-50 via-rose-50 to-white" },
  { id: "c10", title: "Offres du mois", subtitle: "Jusqu'à -40%", tone: "from-amber-100 via-white to-rose-50" },
];

export function CoverCarousel({ covers = DEFAULT_COVERS }: { covers?: Cover[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const rafRef = useRef<number>(0);
  const stepRef = useRef(0);
  const pausedRef = useRef(false);

  pausedRef.current = paused;

  const computeStep = useCallback(() => {
    const el = ref.current;
    if (!el) return 0;
    const item = el.querySelector('[data-carousel-item]');
    if (!item) {
      const fallback = Math.max(el.clientWidth * 0.88 + 12, 1);
      stepRef.current = fallback;
      return fallback;
    }
    const width = (item as HTMLElement).offsetWidth;
    const step = (width > 0 ? width : el.clientWidth * 0.88) + 12;
    stepRef.current = step;
    return step;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);

    const step = computeStep();
    const target = Math.max(0, Math.min(index, covers.length - 1)) * step;
    indexRef.current = Math.max(0, Math.min(index, covers.length - 1));
    setActive(indexRef.current);

    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) {
      el.scrollLeft = target;
      scheduleAutoScroll();
      return;
    }

    const duration = 600;
    const startTime = performance.now();

    const stepFn = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.scrollLeft = start + distance * eased;
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(stepFn);
      } else {
        scheduleAutoScroll();
      }
    };
    rafRef.current = requestAnimationFrame(stepFn);
  }, [covers.length, computeStep]);

  const scheduleAutoScroll = useCallback(() => {
    clearInterval(timerRef.current);
    if (pausedRef.current) return;

    timerRef.current = setInterval(() => {
      const el = ref.current;
      if (!el || pausedRef.current) return;

      const step = computeStep();
      const maxIdx = Math.max(0, covers.length - 1);
      const next = indexRef.current + 1;
      const targetIndex = next > maxIdx ? 0 : next;
      const target = targetIndex * step;

      indexRef.current = targetIndex;
      setActive(targetIndex);

      const start = el.scrollLeft;
      const distance = target - start;
      if (Math.abs(distance) < 1) {
        el.scrollLeft = target;
        return;
      }

      const duration = 600;
      const startTime = performance.now();

      const stepFn = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.scrollLeft = start + distance * eased;
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(stepFn);
        }
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(stepFn);
    }, 3500);
  }, [covers.length, computeStep]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    computeStep();
    scheduleAutoScroll();

    const onScroll = () => {
      const step = stepRef.current || computeStep();
      const idx = Math.round(el.scrollLeft / step);
      if (idx !== indexRef.current) {
        indexRef.current = idx;
        setActive(idx);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("scroll", onScroll);
    };
  }, [covers.length, computeStep, scheduleAutoScroll]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative mx-0"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "linear-gradient(90deg, var(--background) 0%, transparent 8%, transparent 92%, var(--background) 100%)",
        }}
        aria-hidden
      />
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", willChange: "scroll-position", background: "var(--background)" }}
      >
        {covers.map((c, idx) => (
          <div key={c.id} data-carousel-item className="w-[88%] shrink-0 snap-center">
            <div className="rounded-[28px] bg-white">
              <Frame tone={c.tone} rounded="rounded-[28px]" aspectRatio="16/10" className="w-full" image={c.image} alt={c.title} loading={idx === 0 ? "eager" : "lazy"}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">{c.subtitle}</p>
                  <p className="font-display mt-1 text-2xl font-semibold leading-tight text-white drop-shadow">{c.title}</p>
                </div>
              </Frame>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {covers.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Aller au cadre ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
