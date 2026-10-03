import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProjectVisual } from "@/data/projects";

export function ProjectImage({
  image,
  preload = false,
  sizes = "(max-width: 700px) 100vw, 90vw",
  className = "",
}: {
  image: ProjectVisual;
  preload?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`project-image ${className}`}
      style={
        {
          "--image-ratio": `${image.width} / ${image.height}`,
          backgroundColor: image.background,
        } as CSSProperties
      }
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        style={{
          objectFit: image.fit ?? "cover",
          objectPosition: image.position ?? "center",
        }}
      />
    </div>
  );
}
