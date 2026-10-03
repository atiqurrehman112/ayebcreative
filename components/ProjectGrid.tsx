import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function ProjectGrid({
  projects,
  featured = false,
}: {
  projects: Project[];
  featured?: boolean;
}) {
  const columns = featured ? [8, 4, 5, 7] : [7, 5, 5, 7, 8, 4];
  const imageSizes = (index: number) => {
    const fraction = columns[index % columns.length] / 12;
    return `(max-width: 700px) calc(100vw - 32px), (min-width: 1536px) ${Math.ceil(1328 * fraction)}px, ${Math.ceil(100 * fraction)}vw`;
  };
  return (
    <div className={featured ? "work-grid" : "portfolio-grid"}>
      {projects.map((project, index) => (
        <Reveal
          key={project.id}
          className={
            featured
              ? `work-entry work-entry-slot-${index % 4}`
              : "portfolio-entry"
          }
        >
          <ProjectCard
            project={project}
            slot={index}
            sizes={imageSizes(index)}
            preload={!featured && index === 0}
          />
        </Reveal>
      ))}
    </div>
  );
}
