import type { ProjectColor } from "@/data/projects";

export function ProjectColorPalette({ colors }: { colors: ProjectColor[] }) {
  return (
    <ul className="project-palette">
      {colors.map((color) => (
        <li key={color.hex}>
          <div
            className="project-swatch"
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          <div className="swatch-label">
            <span>{color.name}</span>
            <span>{color.hex.toUpperCase()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
