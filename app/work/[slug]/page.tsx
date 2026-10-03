import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  orderedProjects,
  getProject,
  getAdjacentProjects,
} from "@/data/projects";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";

type ProjectPageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return orderedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const title = `${project.title} — ${project.category} | Ayeb Creative`;
  const description = `${project.shortDescription} ${project.isConcept ? "An independent portfolio concept by Ayeb Creative." : project.description}`;
  const image =
    project.socialImage ?? project.heroImage?.src ?? project.coverImage.src;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Ayeb Creative",
      url: `/work/${project.slug}`,
      images: [
        {
          url: image,
          alt: `${project.title} — ${project.category}${project.isConcept ? " concept" : ""}`,
          ...(project.socialImage ? project.socialImageSize : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const adjacent = getAdjacentProjects(project.slug);
  return (
    <ProjectCaseStudy
      project={project}
      previous={adjacent?.previous}
      next={adjacent?.next}
    />
  );
}
