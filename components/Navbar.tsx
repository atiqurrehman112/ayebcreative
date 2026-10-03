"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { navigation } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (position) =>
    setScrolled(position > 32),
  );
  const toggle = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setOpen(false);
  const currentLocation = (href: string) =>
    pathname === href
      ? ("page" as const)
      : href === "/work" && pathname.startsWith("/work/")
        ? ("location" as const)
        : undefined;
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 701px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);
  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="container nav-inner">
        <Link
          href="/"
          aria-label="Ayeb Creative home"
          className="logo-link"
          onClick={closeMenu}
        >
          <BrandLogo variant="primary" size="md" decorative />
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={currentLocation(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="nav-cta"
          onClick={closeMenu}
          aria-current={currentLocation("/contact")}
        >
          Start a Project <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <button
          className="menu-toggle"
          ref={toggle}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <div className="container">
              {navigation.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={currentLocation(link.href)}
                >
                  <span className="eyebrow">0{i + 1}</span>
                  {link.label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="mobile-project"
                aria-current={currentLocation("/contact")}
              >
                Start a Project <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
