"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "./Button";
import { HeroArtwork } from "./HeroArtwork";
export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-topline">
        <p className="eyebrow hero-eyebrow">
          <span className="blue-dash" />
          <span>
            VISUAL IDENTITIES &<br />
            CREATIVE DESIGN STUDIO
          </span>
        </p>
        <p className="hero-studio-note">
          Independent thinking.
          <br />
          Distinctive design.
        </p>
      </div>
      <h1 id="hero-title">
        {[
          <>
            WE BUILD <br className="hero-mobile-break" />
            BRANDS{" "}
          </>,
          <>
            PEOPLE <br className="hero-mobile-break" />
            <span className="blue">REMEMBER.</span>
          </>,
        ].map((line, i) => (
          <motion.span
            key={i}
            className="hero-line"
            initial={false}
            animate={{
              y: reduce ? 0 : [16, 0],
              opacity: reduce ? 1 : [0.65, 1],
            }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {line}
          </motion.span>
        ))}
      </h1>
      <div className="hero-lower">
        <div className="hero-copy">
          <p className="hero-description">
            Ayeb Creative creates distinctive visual identities and creative
            systems for brands ready to stand out.
          </p>
          <div className="button-row">
            <Button href="/contact">Start a Project</Button>
            <Button href="#work" variant="outline" arrow="right">
              View Our Work
            </Button>
          </div>
        </div>
        <HeroArtwork />
      </div>
      <div className="hero-foot">
        <span>CLARITY IN THINKING. CHARACTER IN DESIGN.</span>
        <a href="#introduction">
          SCROLL TO EXPLORE <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
