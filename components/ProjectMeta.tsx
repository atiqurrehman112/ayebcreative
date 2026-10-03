import type { Project } from "@/data/projects";

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="project-meta container">
      {project.client && (
        <div>
          <dt>{project.isConcept ? "PROJECT TYPE" : "CLIENT"}</dt>
          <dd>{project.client}</dd>
        </div>
      )}
      {!!project.services?.length && (
        <div>
          <dt>SERVICES</dt>
          <dd>{project.services.join(" / ")}</dd>
        </div>
      )}
      <div>
        <dt>YEAR</dt>
        <dd>{project.year}</dd>
      </div>
      {project.location ? (
        <div>
          <dt>LOCATION</dt>
          <dd>{project.location}</dd>
        </div>
      ) : (
        !!project.tags?.length && (
          <div>
            <dt>FOCUS</dt>
            <dd>{project.tags.join(" / ")}</dd>
          </div>
        )
      )}
    </dl>
  );
}
