"use client";
import { motion, useReducedMotion } from "framer-motion";
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { y: [18, 0], opacity: [0.72, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}
