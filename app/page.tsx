import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Introduction } from "@/components/Introduction";
import { WorkGrid } from "@/components/WorkGrid";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { siteUrl } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ayeb Creative",
    url: siteUrl,
    email: "AyebCreative@gmail.com",
    description: "Visual identities & creative design studio",
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Introduction />
      <WorkGrid />
      <Services />
      <Process />
      <About />
      <CTA />
    </>
  );
}
