"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={{ opacity: reduce ? 1 : [0.85, 1] }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
