import { Button } from "./Button";
import { Reveal } from "./Reveal";

export function ProjectCTA() {
  return (
    <section className="case-cta" aria-labelledby="case-cta-heading">
      <Reveal className="container case-cta-inner">
        <div>
          <p className="eyebrow section-label">
            LET’S MAKE THE NEXT ONE YOURS.
          </p>
          <h2 id="case-cta-heading">
            HAVE A PROJECT
            <br />
            IN MIND?
          </h2>
        </div>
        <Button href="/contact" variant="light" arrow="right">
          START A PROJECT
        </Button>
      </Reveal>
    </section>
  );
}
