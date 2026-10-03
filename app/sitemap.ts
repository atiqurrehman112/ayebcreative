import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
import { orderedProjects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/work",
    "/services",
    "/about",
    "/contact",
    ...orderedProjects.map((p) => `/work/${p.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
