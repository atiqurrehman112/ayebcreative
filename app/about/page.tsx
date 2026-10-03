import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
const description =
  "Meet Ayeb Creative, an independent visual identity and creative design studio combining clear thinking with a distinctive visual voice.";
export const metadata: Metadata = {
  title: "The Studio",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "The Studio — Ayeb Creative",
    description,
    url: "/about",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Studio — Ayeb Creative",
    description,
    images: ["/opengraph-image"],
  },
};
export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="THE INDEPENDENT STUDIO"
        title={
          <>
            A small studio.
            <br />
            <span className="blue">A distinct perspective.</span>
          </>
        }
        description="We’re Ayeb Creative. We work with people who care about what they’re building, and help them give it a visual identity that feels like their own."
      />
      <About studioHref="#values" />
      <section id="values" className="container section-pad values-section">
        <p className="eyebrow section-label">
          <span className="blue-dash" /> WHAT WE BELIEVE
        </p>
        <div className="values-grid">
          {[
            {
              title: "The idea leads.",
              body: "Before choosing a typeface or a color, we get to know the brand. What it stands for. Who it speaks to. What it wants to change.",
            },
            {
              title: "The details count.",
              body: "A good identity holds together on a business card, a screen and a shelf. We think about how it will be used while we’re making it.",
            },
            {
              title: "Keep talking.",
              body: "You know your business. We know design. The best work happens when both perspectives are part of the conversation.",
            },
          ].map((value, i) => (
            <Reveal key={value.title} delay={i * 0.08}>
              <span className="service-index">0{i + 1}</span>
              <h2>{value.title}</h2>
              <p>{value.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
