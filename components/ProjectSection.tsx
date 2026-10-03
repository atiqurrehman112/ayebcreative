import { Reveal } from "./Reveal";

export function ProjectSection({
  title,
  id,
  number,
  children,
  className = "",
}: {
  title: string;
  id: string;
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`case-section container ${className}`}
      aria-labelledby={id}
    >
      <div className="case-section-heading">
        {number && (
          <span className="case-section-number" aria-hidden="true">
            {number}
          </span>
        )}
        <h2 id={id}>{title}</h2>
      </div>
      <Reveal className="case-section-content">{children}</Reveal>
    </section>
  );
}
