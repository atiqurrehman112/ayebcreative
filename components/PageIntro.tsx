import { Reveal } from "./Reveal";
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <Reveal>
        <p className="eyebrow section-label">
          <span className="blue-dash" />
          {label}
        </p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </Reveal>
    </section>
  );
}
