import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceList } from "@/components/ServiceList";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { serviceProcess } from "@/data/services";
import { CTA } from "@/components/CTA";
const title = "Services — Ayeb Creative";
const description =
  "Visual identity, branding and creative design services from Ayeb Creative.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    title,
    description,
    url: "/services",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};
export default function ServicesPage() {
  return (
    <div className="services-page">
      <PageIntro
        label="AYEB CREATIVE / SERVICES"
        title={
          <>
            WHAT WE CREATE<span className="blue">.</span>
          </>
        }
        description="Visual identities and creative systems designed to help brands communicate with clarity and distinction."
      />
      <ServiceList />
      <section
        className="process-section services-process section-pad"
        aria-label="How we work"
      >
        <div className="container">
          <SectionHeading
            label="02 — FROM FIRST CONVERSATION TO FINAL FILES"
            title="HOW WE WORK"
          >
            <Link className="text-link" href="/contact">
              Start a Project <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </SectionHeading>
          <Reveal>
            <ProcessSteps steps={serviceProcess} />
          </Reveal>
        </div>
      </section>
      <FAQ />
      <CTA
        title={
          <>
            HAVE A BRAND
            <br />
            WORTH BUILDING?
          </>
        }
        description="Tell us what you're working on and we'll take it from there."
      />
    </div>
  );
}
