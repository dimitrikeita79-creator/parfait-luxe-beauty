import { motion } from "motion/react";

export function ColorScrollbar() {
  const colors = [
    "bg-[var(--gold-soft)]",
    "bg-[var(--gold)]",
    "bg-[var(--gold-deep)]",
    "bg-[var(--gold-soft)]",
  ];

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[90] h-0.5 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold)] to-[var(--gold-deep)]"
      animate={{
        opacity: [0.4, 1, 0.4],
        scaleX: [0.85, 1, 0.85],
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
