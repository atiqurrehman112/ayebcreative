import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectNavigation({
  previous,
  next,
}: {
  previous?: Project;
  next?: Project;
}) {
  return (
    <nav className="case-navigation container" aria-label="Project navigation">
      <Link className="text-link case-back" href="/work">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Work
      </Link>
      {(previous || next) && (
        <div className="case-adjacent">
          {previous && (
            <Link
              href={`/work/${previous.slug}`}
              rel="prev"
              aria-label={`Previous Project: ${previous.title}`}
            >
              <span className="eyebrow">PREVIOUS PROJECT</span>
              <span className="adjacent-title">
                <ArrowLeft aria-hidden="true" />
                {previous.title}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              rel="next"
              aria-label={`Next Project: ${next.title}`}
            >
              <span className="eyebrow">NEXT PROJECT</span>
              <span className="adjacent-title">
                {next.title}
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
