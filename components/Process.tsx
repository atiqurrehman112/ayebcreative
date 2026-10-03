import { processSteps } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ProcessSteps } from "./ProcessSteps";
export function Process() {
  return (
    <section
      className="process-section section-pad"
      id="process"
      aria-label="Our process"
    >
      <div className="container">
        <SectionHeading label="03 — HOW WE WORK" title="From idea to identity.">
          <p className="section-support">
            Four stages. A shared direction.
            <br />
            Room for the right questions.
          </p>
        </SectionHeading>
        <Reveal>
          <ProcessSteps steps={processSteps} />
        </Reveal>
      </div>
    </section>
  );
}
