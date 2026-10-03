import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { ProjectGrid } from "./ProjectGrid";
import { Reveal } from "./Reveal";

// The established homepage composition is retained; only its data source changes.
export function WorkGrid() {
  return (
    <section
      className="work-section section-pad"
      id="work"
      aria-label="Selected work"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            label={
              featuredProjects.every((project) => project.isConcept)
                ? "01 — SELECTED EXPLORATIONS"
                : "01 — SELECTED WORK"
            }
            title="Selected Work"
          >
            <Link className="text-link" href="/work">
              View All Work <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </SectionHeading>
        </Reveal>
        <ProjectGrid projects={featuredProjects} featured />
        {featuredProjects.some((project) => project.isConcept) && (
          <p className="concept-note">
            {featuredProjects.every((project) => project.isConcept)
              ? "Independent concepts in identity, digital design and packaging."
              : "Projects marked Concept are independent design explorations."}
          </p>
        )}
      </div>
    </section>
  );
}
