import { projectImage } from "./project-images";

export const portfolioCategories = [
  "All",
  "Brand Identity",
  "Logo Design",
  "Social Media",
  "Creative Design",
] as const;
export type PortfolioCategory = (typeof portfolioCategories)[number];

export type ProjectVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  role?: "identity" | "application" | "detail";
  fit?: "cover" | "contain";
  position?: string;
  background?: string;
};
export type ProjectColor = { name: string; hex: string };
export type ProjectTypeface = {
  family: string;
  role: string;
  weights: string;
  sample: string;
  style: "display" | "body";
};
export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  filterCategory: Exclude<PortfolioCategory, "All">;
  year: string;
  shortDescription: string;
  description: string;
  coverImage: ProjectVisual;
  isConcept: boolean;
  services?: string[];
  heroImage?: ProjectVisual;
  gallery?: ProjectVisual[];
  client?: string;
  location?: string;
  tags?: string[];
  colors?: ProjectColor[];
  typography?: ProjectTypeface[];
  challenge?: string;
  approach?: string;
  solution?: string;
  deliverables?: string[];
  result?: string;
  featured?: boolean;
  order?: number;
  socialImage?: string;
  socialImageSize?: { width: number; height: number };
};

const palette: ProjectColor[] = [
  { name: "Charcoal", hex: "#0F172A" },
  { name: "Electric Blue", hex: "#2563EB" },
  { name: "Off White", hex: "#F8F9FA" },
  { name: "Slate", hex: "#94A3B8" },
];
const typeSystem = (sample: string): ProjectTypeface[] => [
  {
    family: "Space Grotesk",
    role: "Display / headlines",
    weights: "Medium / Bold",
    sample,
    style: "display",
  },
  {
    family: "Inter",
    role: "Text / information",
    weights: "Regular / Medium",
    sample: "Small details. Clear communication.",
    style: "body",
  },
];
const coverBackgrounds: Record<string, string> = {
  nova: "#2563EB",
  vanta: "#0F172A",
  orbit: "#94A3B8",
  form: "#F8F9FA",
  kova: "#F8F9FA",
  nexa: "#2563EB",
};
const visual = (slug: string, name: string, alt: string): ProjectVisual => ({
  ...projectImage(slug, name),
  alt,
  ...(name === "cover"
    ? { fit: "contain" as const, background: coverBackgrounds[slug] }
    : {}),
});
const sharingImage = (slug: string) => {
  const { src, width, height } = projectImage(slug, "social");
  return { socialImage: src, socialImageSize: { width, height } };
};
const gallery = (
  slug: string,
  title: string,
  captions: [string, string, string, string],
): ProjectVisual[] => [
  {
    ...visual(
      slug,
      "identity",
      `${title} concept logo and symbol in its primary and inverse treatments`,
    ),
    role: "identity",
    caption: "Primary identity / positive and inverse",
  },
  {
    ...visual(slug, "application-01", `${title} concept: ${captions[0]}`),
    role: "application",
    caption: captions[0],
  },
  {
    ...visual(slug, "application-02", `${title} concept: ${captions[1]}`),
    role: "application",
    caption: captions[1],
  },
  {
    ...visual(slug, "detail-01", `${title} concept detail: ${captions[2]}`),
    role: "detail",
    caption: captions[2],
  },
  {
    ...visual(slug, "detail-02", `${title} concept detail: ${captions[3]}`),
    role: "detail",
    caption: captions[3],
  },
];

// Replace individual records and local image paths, not page markup.
// All current entries are self-initiated explorations for fictional brands.
export const projects: Project[] = [
  {
    id: "01",
    slug: "nova",
    title: "NOVA",
    category: "Brand Identity",
    filterCategory: "Brand Identity",
    year: "2026",
    order: 1,
    featured: true,
    isConcept: true,
    shortDescription: "A considered identity for spaces still to come.",
    description:
      "NOVA is a concept for an independent architecture practice. The identity brings the precision of a plan together with the openness of a new space: clear, adaptable and quietly confident.",
    services: [
      "Brand identity",
      "Logo system",
      "Editorial design",
      "Brand guidelines",
    ],
    client: "Self-initiated concept",
    tags: ["Architecture", "Spatial thinking", "Identity systems"],
    coverImage: visual(
      "nova",
      "cover",
      "NOVA architecture concept: black wordmark and geometric N on an off-white construction grid",
    ),
    heroImage: visual(
      "nova",
      "hero",
      "NOVA architectural identity applied to a studio entrance, signage and presentation boards",
    ),
    ...sharingImage("nova"),
    gallery: gallery("nova", "NOVA", [
      "Identity manual and project stationery",
      "Studio signage and architectural applications",
      "The modular N, built on a shared grid",
      "Fine rules and generous typographic space",
    ]),
    colors: palette,
    typography: typeSystem("Space for what's next."),
    challenge:
      "Give an emerging architecture practice a recognizable voice without relying on building silhouettes or the usual austere wordmark. The system needed to feel precise and open to different kinds of work.",
    approach:
      "We used the plan as a starting point. A modular N, measured intervals and fine construction lines connect the identity to spatial thinking. Electric blue gives those quiet foundations a clear point of recognition.",
    solution:
      "The mark and grid work as one system, from a compact business card to a project publication. Large, plain-spoken headlines balance the technical details, leaving room for the architecture itself.",
    deliverables: [
      "Primary and compact logos",
      "Color and typography system",
      "Stationery suite",
      "Project publication layouts",
      "Identity usage guide",
    ],
    result:
      "A coherent architecture identity with a clear rhythm: structured enough to stay consistent, open enough to support the next idea.",
  },
  {
    id: "02",
    slug: "vanta",
    title: "VANTA",
    category: "Logo & Visual Identity",
    filterCategory: "Logo Design",
    year: "2026",
    order: 2,
    featured: true,
    isConcept: true,
    shortDescription: "Sound, given a visual signature.",
    description:
      "VANTA is a fictional independent sound studio. This logo exploration translates rhythm, pause and resonance into a compact identity that can sit confidently on a record sleeve, a screen or a production credit.",
    services: ["Logo design", "Visual identity", "Art direction"],
    client: "Self-initiated concept",
    tags: ["Sound", "Monogram", "Independent culture"],
    coverImage: visual(
      "vanta",
      "cover",
      "VANTA sound studio concept: white wordmark, blue waveform symbol and sound wave on black",
    ),
    heroImage: visual(
      "vanta",
      "hero",
      "VANTA wordmark and blue waveform identity inside a recording studio",
    ),
    ...sharingImage("vanta"),
    gallery: gallery("vanta", "VANTA", [
      "Stationery, headphones and studio merchandise",
      "Record packaging, poster and digital applications",
      "Waveform symbol and wordmark on textured stock",
      "Wordmark spacing and supporting information",
    ]),
    colors: [palette[0], palette[2], palette[1]],
    typography: typeSystem("Listen a little closer."),
    challenge:
      "Build a mark that suggests sound without drawing a speaker, waveform or music note. It had to retain its character in a tiny credit as well as a large studio application.",
    approach:
      "A repeated diagonal creates a V with a distinct internal rhythm. Charcoal and off-white let the silhouette do the work, while small blue accents introduce a controlled change of pace.",
    solution:
      "A compact symbol anchors a straightforward wordmark and a restrained graphic system. The same angled cuts carry into crops, dividers and layouts, making the identity recognizable beyond the logo.",
    deliverables: [
      "Primary wordmark",
      "V monogram",
      "Positive and inverse marks",
      "Studio stationery",
      "Poster direction",
    ],
    result:
      "A focused logo system whose character comes from its silhouette, spacing and repetition. Designed to be recognizable at both ends of the scale.",
  },
  {
    id: "03",
    slug: "orbit",
    title: "ORBIT",
    category: "Social Identity",
    filterCategory: "Social Media",
    year: "2026",
    order: 3,
    featured: true,
    isConcept: true,
    shortDescription: "A moving frame for culture and conversation.",
    description:
      "ORBIT is a concept for an independent culture platform. Its social identity gives exhibitions, conversations and new ideas a common visual home, without making every post feel the same.",
    services: ["Social art direction", "Content templates", "Visual identity"],
    client: "Self-initiated concept",
    tags: ["Culture", "Digital publishing", "Social systems"],
    coverImage: visual(
      "orbit",
      "cover",
      "ORBIT culture platform concept: black wordmark, circular textures and blue accents on off-white",
    ),
    heroImage: visual(
      "orbit",
      "hero",
      "ORBIT culture identity across gallery banners, posters and exhibition signage",
    ),
    ...sharingImage("orbit"),
    gallery: gallery("orbit", "ORBIT", [
      "A connected family of printed invitations and stationery",
      "Exhibition posters and outdoor announcements",
      "Wordmark and circular detail on textured paper",
      "Circular textures and editorial typography",
    ]),
    colors: [palette[1], palette[2], palette[0], palette[3]],
    typography: typeSystem("Culture in circulation."),
    challenge:
      "Create consistency across a changing mix of stories, announcements and conversations. A rigid template would flatten the content; a loose set of graphics would make the platform hard to recognize.",
    approach:
      "Circles became a flexible framing device. They can hold a headline, create a crop or simply set a pace. A fixed information band gives dates and categories a reliable place to live.",
    solution:
      "Square posts, portrait stories and editorial tiles share a clear type scale and a simple circular language. Layouts can change from post to post while retaining the same recognizable structure.",
    deliverables: [
      "Social visual direction",
      "Square post templates",
      "Portrait story templates",
      "Event announcement system",
      "Content layout guidance",
    ],
    result:
      "A social identity with room for variety and a dependable visual rhythm. One system, many conversations.",
  },
  {
    id: "04",
    slug: "form",
    title: "FORM",
    category: "Brand Identity",
    filterCategory: "Brand Identity",
    year: "2026",
    order: 4,
    featured: false,
    isConcept: true,
    shortDescription: "Everyday objects. A clear point of view.",
    description:
      "FORM is a fictional furniture label built around useful, well-considered objects. The identity takes its cues from how furniture is made: simple parts, thoughtful proportions and a structure that holds together.",
    services: ["Brand identity", "Logo design", "Catalog design"],
    client: "Self-initiated concept",
    tags: ["Furniture", "Product", "Editorial"],
    coverImage: visual(
      "form",
      "cover",
      "FORM furniture identity concept: refined wordmark and geometric symbol in muted neutrals",
    ),
    heroImage: visual(
      "form",
      "hero",
      "FORM furniture identity in a showroom, catalog and printed brand materials",
    ),
    ...sharingImage("form"),
    gallery: gallery("form", "FORM", [
      "Product catalog, packaging and printed stationery",
      "Furniture catalog spreads and product layouts",
      "Wordmark and geometric symbol on textured paper",
      "Product labels, cards and furniture brochures",
    ]),
    colors: [palette[2], palette[0], palette[3], palette[1]],
    typography: typeSystem("Made for everyday living."),
    challenge:
      "Give a furniture label its own presence while leaving the objects at the center. The identity needed to communicate care and utility across detailed specifications and more expressive editorial pages.",
    approach:
      "We built a modular F from the same simple geometry that appears in a furniture joint. Open layouts, thin rules and numbered details echo the language of a product drawing.",
    solution:
      "The identity pairs a strong, compact mark with calm typography and a flexible catalog grid. Product names, dimensions and stories each have a clear level in the hierarchy.",
    deliverables: [
      "Wordmark and symbol",
      "Identity foundations",
      "Product catalog layouts",
      "Specification sheets",
      "Product labels",
    ],
    result:
      "A practical visual foundation that gives everyday objects a thoughtful setting, from the first introduction to the smallest product detail.",
  },
  {
    id: "05",
    slug: "kova",
    title: "KOVA",
    category: "Packaging & Visual Identity",
    filterCategory: "Creative Design",
    year: "2026",
    order: 5,
    featured: true,
    isConcept: true,
    shortDescription: "A familiar ritual, with a distinctive face.",
    description:
      "KOVA is a coffee packaging concept. Bold typography and a clear information system bring character to the daily ritual, with a family of packs designed to feel related without becoming interchangeable.",
    services: ["Packaging direction", "Visual identity", "Label design"],
    client: "Self-initiated concept",
    tags: ["Coffee", "Packaging", "Information design"],
    coverImage: visual(
      "kova",
      "cover",
      "KOVA specialty coffee concept: dark brown wordmark with cream and terracotta shapes",
    ),
    heroImage: visual(
      "kova",
      "hero",
      "KOVA coffee packaging and takeaway applications arranged in a cafe",
    ),
    ...sharingImage("kova"),
    gallery: gallery("kova", "KOVA", [
      "The packaging family and front-label system",
      "Shopping bag, cup and takeaway applications",
      "A close look at the label hierarchy",
      "The packaging range with shared organic graphics",
    ]),
    colors: [palette[1], palette[2], palette[0]],
    typography: typeSystem("A better daily ritual."),
    challenge:
      "Make a coffee pack distinctive at a glance and useful up close. The expressive elements had to coexist with clear space for blend names, roast information and practical product details.",
    approach:
      "A large wordmark gives the pack its first read. Beneath it, a structured label separates the range number from supporting information. The geometry stays simple enough to carry across pack sizes.",
    solution:
      "Blue, charcoal and off-white establish a connected packaging family. Consistent label zones and a small geometric stamp create continuity across bags, sleeves and takeaway applications.",
    deliverables: [
      "Packaging concept",
      "Primary identity",
      "Front and wraparound labels",
      "Range identification system",
      "Takeaway application",
    ],
    result:
      "A packaging direction that balances a strong shelf presence with quiet, legible information. A clear system for an everyday object.",
  },
  {
    id: "06",
    slug: "nexa",
    title: "NEXA",
    category: "Creative Campaign",
    filterCategory: "Creative Design",
    year: "2026",
    order: 6,
    featured: false,
    isConcept: true,
    shortDescription: "New perspectives, brought into the same space.",
    description:
      "NEXA is a campaign concept for a fictional design forum. An expressive typographic system connects talks, workshops and printed announcements around a simple invitation: look again.",
    services: [
      "Creative direction",
      "Campaign design",
      "Print and digital design",
    ],
    client: "Self-initiated concept",
    tags: ["Design culture", "Campaign", "Typography"],
    coverImage: visual(
      "nexa",
      "cover",
      "NEXA campaign concept: angular wordmark, bold blue geometry and black-and-white textures",
    ),
    heroImage: visual(
      "nexa",
      "hero",
      "NEXA campaign on urban billboards with bold typography and blue geometric graphics",
    ),
    ...sharingImage("nexa"),
    gallery: gallery("nexa", "NEXA", [
      "An outdoor poster series with shared geometric language",
      "Campaign layouts across screens and billboards",
      "Letterform and print texture close-up",
      "Printed campaign cards with bold diagonal graphics",
    ]),
    colors: [palette[1], palette[0], palette[2], palette[3]],
    typography: typeSystem("Look again. Think ahead."),
    challenge:
      "Create an energetic campaign that can hold different voices together. Headlines needed to feel immediate, while dates, locations and session information stayed easy to find.",
    approach:
      "Diagonal cuts suggest a shift in perspective. Oversized type carries the invitation; a steady information band grounds it. Alternating blue and charcoal gives the campaign variation without visual noise.",
    solution:
      "A repeatable composition adapts across posters, announcements and passes. The balance between expressive type and structured details keeps the campaign connected at every scale.",
    deliverables: [
      "Campaign concept",
      "Poster series",
      "Digital announcements",
      "Printed invitations",
      "Event pass direction",
    ],
    result:
      "A flexible campaign language that makes room for different ideas while keeping one clear visual invitation.",
  },
];

export const orderedProjects = [...projects].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999),
);
export const featuredProjects = orderedProjects.filter(
  (project) => project.featured,
);
export const getProject = (slug: string) =>
  orderedProjects.find((project) => project.slug === slug);
export function getAdjacentProjects(slug: string) {
  const index = orderedProjects.findIndex((project) => project.slug === slug);
  if (index < 0 || orderedProjects.length < 2) return undefined;
  return {
    previous:
      orderedProjects[
        (index - 1 + orderedProjects.length) % orderedProjects.length
      ],
    next: orderedProjects[(index + 1) % orderedProjects.length],
  };
}
