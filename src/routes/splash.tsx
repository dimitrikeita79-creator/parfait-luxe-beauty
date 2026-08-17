import { createFileRoute } from '@tanstack/react-router'
import { useSafeNavigate } from "@/hooks/useSafeNavigate";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import logoAsset from "@/assets/DESMOHAIR.jpg";

export const Route = createFileRoute("/splash")({
  component: Splash,
});

function Splash() {
  const navigate = useSafeNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => navigate({ to: "/" }), 600);
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[var(--gold-soft)] opacity-50 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--rose)] opacity-50 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
          className="mx-auto grid h-36 w-36 place-items-center rounded-[40px] shadow-luxe overflow-hidden"
        >
          <img src={logoAsset} alt="Desmohair" className="h-full w-full object-contain p-2" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-display mt-6 text-3xl font-semibold leading-tight"
        >
          Desmohair
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-3 text-sm italic text-muted-foreground"
        >
          {"Votre beauté, notre passion"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mx-auto mt-8 flex items-center justify-center gap-1"
        >
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="h-2 w-2 rounded-full bg-[var(--gold)]"
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
            className="h-2 w-2 rounded-full bg-[var(--gold)]"
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            className="h-2 w-2 rounded-full bg-[var(--gold)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

