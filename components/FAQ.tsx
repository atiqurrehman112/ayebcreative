import { Plus } from "lucide-react";
import { serviceFAQs } from "@/data/services";

export function FAQ() {
  return (
    <section
      className="service-faq container section-pad"
      aria-labelledby="faq-title"
    >
      <div>
        <p className="eyebrow section-label">
          <span className="blue-dash" />
          03 — A FEW ANSWERS
        </p>
        <h2 id="faq-title">
          Before
          <br /> we begin.
        </h2>
      </div>
      <div className="faq-list">
        {serviceFAQs.map(({ question, answer }) => (
          <details key={question}>
            <summary>
              {question}
              <Plus size={18} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
