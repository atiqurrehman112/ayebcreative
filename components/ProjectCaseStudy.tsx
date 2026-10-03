import type { Project } from "@/data/projects";
import { ProjectHero } from "./ProjectHero";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectSection } from "./ProjectSection";
import { ProjectImage } from "./ProjectImage";
import { ProjectColorPalette } from "./ProjectColorPalette";
import { ProjectNavigation } from "./ProjectNavigation";
import { ProjectCTA } from "./ProjectCTA";

export function ProjectCaseStudy({
  project,
  previous,
  next,
}: {
  project: Project;
  previous?: Project;
  next?: Project;
}) {
  const identity =
    project.gallery?.filter((image) => image.role === "identity") ?? [];
  const applications =
    project.gallery?.filter(
      (image) => !image.role || image.role === "application",
    ) ?? [];
  const details =
    project.gallery?.filter((image) => image.role === "detail") ?? [];
  return (
    <article className="case-study">
      <ProjectHero project={project} />
      <ProjectMeta project={project} />
      <ProjectSection
        title="THE BRIEF"
        id="brief"
        number="01"
        className="case-brief case-split"
      >
        <p>{project.description}</p>
        {project.isConcept && (
          <p className="case-concept-note">
            A self-initiated design exploration for a fictional brand. This is
            not commissioned client work.
          </p>
        )}
      </ProjectSection>
      <div className="case-narrative">
        {(
          [
            ["THE CHALLENGE", "challenge", project.challenge],
            ["THE APPROACH", "approach", project.approach],
            ["THE SOLUTION", "solution", project.solution],
          ] as const
        ).map(
          ([title, id, copy], index) =>
            copy && (
              <ProjectSection
                key={id}
                title={title}
                id={id}
                number={`0${index + 2}`}
                className="case-story case-split"
              >
                <p>{copy}</p>
              </ProjectSection>
            ),
        )}
      </div>
      {!!identity.length && (
        <ProjectSection title="LOGO / IDENTITY" id="identity" number="05">
          {identity.map((image) => (
            <figure key={image.src}>
              <ProjectImage image={image} />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </ProjectSection>
      )}
      {!!project.colors?.length && (
        <ProjectSection title="COLOR SYSTEM" id="color" number="06">
          <ProjectColorPalette colors={project.colors} />
        </ProjectSection>
      )}
      {!!project.typography?.length && (
        <ProjectSection title="TYPOGRAPHY" id="typography" number="07">
          <div className="project-type-grid">
            {project.typography.map((typeface) => (
              <div
                className={`project-type-specimen type-${typeface.style}`}
                key={typeface.family}
              >
                <div className="type-meta">
                  <h3>{typeface.family}</h3>
                  <span>{typeface.weights}</span>
                </div>
                <p className="type-sample">{typeface.sample}</p>
                <p className="type-alphabet">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 &amp;@?!
                </p>
                <p className="eyebrow">{typeface.role}</p>
              </div>
            ))}
          </div>
        </ProjectSection>
      )}
      {!!applications.length && (
        <ProjectSection title="APPLICATIONS" id="applications" number="08">
          <div className="case-applications">
            {applications.map((image, index) => (
              <figure key={image.src}>
                <ProjectImage
                  image={image}
                  sizes={
                    index % 2 === 0
                      ? "(max-width: 700px) calc(100vw - 32px), (min-width: 1536px) 755px, 56vw"
                      : "(max-width: 700px) calc(100vw - 32px), (min-width: 1536px) 540px, 40vw"
                  }
                />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </ProjectSection>
      )}
      {!!details.length && (
        <ProjectSection title="SELECTED DETAILS" id="details" number="09">
          <div className="case-details">
            {details.map((image) => (
              <figure key={image.src}>
                <ProjectImage
                  image={image}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </ProjectSection>
      )}
      {(project.result || !!project.deliverables?.length) && (
        <ProjectSection
          title="THE RESULT"
          id="result"
          number="10"
          className="case-result case-split"
        >
          {project.result && <p>{project.result}</p>}
          {!!project.deliverables?.length && (
            <div className="case-deliverables">
              <h3>DELIVERABLES</h3>
              <ul>
                {project.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </ProjectSection>
      )}
      <ProjectNavigation previous={previous} next={next} />
      <ProjectCTA />
    </article>
  );
}
