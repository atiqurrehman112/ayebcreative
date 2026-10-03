"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";

export function ProjectCard({
  project,
  preload = false,
  slot = 0,
  sizes = "(max-width: 700px) calc(100vw - 32px), 66vw",
}: {
  project: Project;
  preload?: boolean;
  slot?: number;
  sizes?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="work-card"
      initial={false}
      whileHover={reduce ? undefined : "hover"}
    >
      <Link
        href={`/work/${project.slug}`}
        className="work-link"
        aria-label={`Explore ${project.title}, ${project.category}${project.isConcept ? " concept" : ""}`}
      >
        <div
          className={`work-image work-image-slot-${slot % 4}`}
          style={{
            aspectRatio: `${project.coverImage.width} / ${project.coverImage.height}`,
          }}
        >
          <motion.div
            className="work-image-inner"
            variants={{ hover: { scale: 1.02 } }}
            transition={{ duration: 0.4 }}
          >
            <ProjectImage
              image={project.coverImage}
              preload={preload}
              sizes={sizes}
            />
          </motion.div>
          <span className="project-view">
            <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </div>
        <div className="work-info">
          <div>
            <p className="eyebrow">
              {project.category} / {project.isConcept ? "Concept" : "Project"}{" "}
              {project.id}
            </p>
            <h3>
              {project.title}
              <ArrowUpRight size={21} aria-hidden="true" />
            </h3>
          </div>
          <span className="work-year">{project.year}</span>
        </div>
      </Link>
    </motion.article>
  );
}
