import { useRef, useState } from "react";
import { Frame } from "@/components/Frame";

export type Cover = { id: string; title: string; subtitle: string; tone: string };

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

  // Track active via scroll
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  return (
    <div className="-mx-5">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {covers.map((c) => (
          <div key={c.id} className="w-[88%] shrink-0 snap-center">
            <Frame tone={c.tone} rounded="rounded-[28px]" className="aspect-[16/10] w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">{c.subtitle}</p>
                <p className="font-display mt-1 text-2xl font-semibold leading-tight text-white drop-shadow">{c.title}</p>
              </div>
            </Frame>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {covers.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Aller au cadre ${i + 1}`}
            onClick={() => {
              const el = ref.current;
              const slide = el?.children[i] as HTMLElement | undefined;
              slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            }}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25"}`}
          />
        ))}
      </div>
    </div>
  );
}