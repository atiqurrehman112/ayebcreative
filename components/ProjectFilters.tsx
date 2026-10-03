"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  portfolioCategories,
  type PortfolioCategory,
  type Project,
} from "@/data/projects";
import { ProjectGrid } from "./ProjectGrid";

export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<PortfolioCategory>("All");
  const reduce = useReducedMotion();
  const visible =
    active === "All"
      ? projects
      : projects.filter((project) => project.filterCategory === active);
  return (
    <section
      className="portfolio-section container"
      aria-labelledby="portfolio-heading"
    >
      <h2 id="portfolio-heading" className="sr-only">
        Portfolio projects
      </h2>
      <div className="portfolio-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label="Filter work by category"
        >
          {portfolioCategories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={active === category}
              aria-controls="portfolio-results"
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <p
          className="portfolio-count"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {String(visible.length).padStart(2, "0")}{" "}
          {visible.length === 1 ? "PROJECT" : "PROJECTS"}
        </p>
      </div>
      <div id="portfolio-results">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <ProjectGrid projects={visible} />
          </motion.div>
        </AnimatePresence>
      </div>
      {visible.some((project) => project.isConcept) && (
        <p className="concept-note portfolio-note">
          {visible.every((project) => project.isConcept)
            ? "Independent portfolio concepts for fictional brands. An exploration of what a clear idea can become."
            : "Projects marked Concept are independent explorations for fictional brands."}
        </p>
      )}
    </section>
  );
}
