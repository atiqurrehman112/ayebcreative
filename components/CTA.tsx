import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { ArrowUpRight } from "lucide-react";
export function CTA({
  title,
  description,
}: { title?: React.ReactNode; description?: string } = {}) {
  return (
    <section className="cta-section section-pad" aria-labelledby="cta-heading">
      <div className="container">
        <Reveal>
          <p className="eyebrow section-label">
            LET’S MAKE OUR NEXT PROJECT YOURS.
          </p>
          <div className="cta-heading-row">
            <h2 id="cta-heading">
              {title ?? (
                <>
                  READY TO BUILD
                  <br />
                  SOMETHING DISTINCTIVE?
                </>
              )}
            </h2>
            <ArrowUpRight
              className="cta-arrow"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
          <div className="cta-bottom">
            <p>
              {description ??
                "Tell us about your project and let's create something worth remembering."}
            </p>
            <Button href="/contact" variant="light" arrow="right">
              START A PROJECT
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
