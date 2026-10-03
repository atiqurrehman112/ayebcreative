export function ProcessSteps({
  steps,
}: {
  steps: readonly { title: string; description: string }[];
}) {
  return (
    <ol className="process-grid">
      {steps.map((step, index) => (
        <li className="process-step" key={step.title}>
          <span className="timeline-point" aria-hidden="true" />
          <div className="step-heading">
            <span className="step-number">
              {String(index + 1).padStart(2, "0")}{" "}
              <span aria-hidden="true">—</span>
            </span>
            <h3>{step.title}</h3>
          </div>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
