"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
const MotionLink = motion.create(Link);
export function Button({
  href,
  children,
  variant = "primary",
  arrow = "diagonal",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "light";
  arrow?: "diagonal" | "right";
  className?: string;
}) {
  const Icon = arrow === "right" ? ArrowRight : ArrowUpRight;
  return (
    <MotionLink
      href={href}
      className={`button button-${variant} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <Icon size={17} aria-hidden="true" />
    </MotionLink>
  );
}
