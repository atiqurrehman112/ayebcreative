export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow section-label">
          <span className="blue-dash" />
          {label}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
