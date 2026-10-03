import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { Reveal } from "./Reveal";

export function ProjectHero({ project }: { project: Project }) {
  return (
    <>
      <header className="case-intro container">
        <div className="case-topline">
          <Link href="/work" className="text-link case-back">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Work
          </Link>
          <span className="eyebrow">
            PROJECT {project.id} / {project.year}
          </span>
        </div>
        <Reveal>
          <div className="case-category">
            <p className="eyebrow">
              <span className="blue-dash" />
              {project.category}
            </p>
            {project.isConcept && (
              <span className="eyebrow">INDEPENDENT CONCEPT</span>
            )}
          </div>
          <div className="case-title-row">
            <h1>{project.title}</h1>
            <p>{project.shortDescription}</p>
          </div>
        </Reveal>
      </header>
      <div className="container case-hero">
        <ProjectImage image={project.heroImage ?? project.coverImage} preload />
      </div>
    </>
  );
}
