import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Reveal } from "./Reveal";
export function About({ studioHref = "/about" }: { studioHref?: string }) {
  return (
    <section
      className="about-section section-pad"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="container">
        <div className="about-topline">
          <p className="eyebrow">
            <span className="blue-dash" />
            04 — THE STUDIO
          </p>
          <BrandLogo
            variant="monogram"
            size="sm"
            monogramTone="white"
            className="manifesto-mark"
            decorative
          />
        </div>
        <div className="about-grid">
          <Reveal>
            <h2 id="about-heading">
              GOOD DESIGN
              <br />
              MAKES BRANDS
              <br />
              <span>FEEL DIFFERENT.</span>
            </h2>
          </Reveal>
          <div className="about-copy">
            <p className="manifesto-lead">
              A logo is only <br />
              the beginning.
            </p>
            <p>
              We build the visual language around it. Type, color and
              composition working together to give your brand a clear,
              distinctive voice.
            </p>
            <p>
              We ask questions, explore ideas and refine the details with you.
              The result is a thoughtful identity that feels like you, with a
              practical design system to carry it forward.
            </p>
            <Link href={studioHref} className="text-link">
              Inside the studio <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="about-bottom">
          <span>THINK CLEARLY. MAKE IT MATTER.</span>
          <span>AYEB CREATIVE</span>
        </div>
      </div>
    </section>
  );
}
