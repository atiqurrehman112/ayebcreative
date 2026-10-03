import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProjectFilters } from "@/components/ProjectFilters";
import { orderedProjects } from "@/data/projects";
import { CTA } from "@/components/CTA";
const conceptsOnly = orderedProjects.every((project) => project.isConcept);
const description =
  "A selection of identities, visual systems and creative work developed with intention." +
  (conceptsOnly ? " Independent portfolio concepts by Ayeb Creative." : "");
export const metadata: Metadata = {
  title: "Selected Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work | Ayeb Creative",
    description,
    url: "/work",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work | Ayeb Creative",
    description,
    images: ["/opengraph-image"],
  },
};
export default function WorkPage() {
  return (
    <>
      <PageIntro
        label={
          conceptsOnly
            ? "PORTFOLIO / CONCEPT EXPLORATIONS"
            : "PORTFOLIO / SELECTED PROJECTS"
        }
        title="SELECTED WORK"
        description="A selection of identities, visual systems and creative work developed with intention."
      />
      <ProjectFilters projects={orderedProjects} />
      <CTA />
    </>
  );
}
