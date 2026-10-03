import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";
export function Introduction() {
  return (
    <section
      className="introduction container section-pad"
      id="introduction"
      aria-labelledby="intro-heading"
    >
      <p className="eyebrow">
        <span className="blue-dash" /> AYEB CREATIVE
      </p>
      <Reveal>
        <h2 id="intro-heading">
          Design with clarity.
          <br />
          <span className="muted-heading">Built with intention.</span>
        </h2>
      </Reveal>
      <Reveal className="intro-detail" delay={0.1}>
        <p>
          Starting out, finding focus, or moving in a new direction. We help
          brands turn those moments into a clear visual identity.
        </p>
        <p>
          Strategy gives us the starting point. Typography, color and
          composition make it yours.
        </p>
        <Link className="text-link" href="/about">
          A little about us <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
