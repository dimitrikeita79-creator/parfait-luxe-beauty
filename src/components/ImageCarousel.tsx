import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageCarouselProps = {
  images: string[];
  aspectRatio?: string;
  className?: string;
  autoPlayInterval?: number;
};

export function ImageCarousel({
  images,
  aspectRatio = "aspect-[4/5]",
  className = "",
  autoPlayInterval = 4000,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const safeImages = images.filter(Boolean);
  const count = safeImages.length;

  const goTo = useCallback((next: number) => {
    if (isTransitioning || count <= 1) return;
    setIsTransitioning(true);
    setIndex((prev) => {
      const target = ((next % count) + count) % count;
      return target;
    });
    setTimeout(() => setIsTransitioning(false), 300);
  }, [count, isTransitioning]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, paused, next, autoPlayInterval]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - currentX.current;
    const threshold = 40;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
    setPaused(false);
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-stone-100 select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={`flex ${aspectRatio} transition-transform duration-300 ease-out`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {safeImages.map((src, i) => (
          <div key={i} className="w-full shrink-0">
            <img
              src={src}
              alt={`Aperçu ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur-md shadow-sm active:scale-95 transition"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur-md shadow-sm active:scale-95 transition"
            aria-label="Suivant"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? "h-2 w-4 bg-white" : "h-2 w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
