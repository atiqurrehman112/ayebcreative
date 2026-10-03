export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#process" },
];

export { services } from "@/data/services";

export const processSteps = [
  {
    title: "Discover",
    description: "Understand the brand, audience and goals.",
    detail:
      "We begin with a conversation. Your story, ambitions and audience shape a clear creative brief.",
  },
  {
    title: "Define",
    description: "Establish the visual direction and creative concept.",
    detail:
      "We explore ideas, find the right references and agree on a direction with purpose behind it.",
  },
  {
    title: "Design",
    description: "Build the identity and supporting visual system.",
    detail:
      "We bring the concept to life, refine it together and consider how it works in the real world.",
  },
  {
    title: "Deliver",
    description: "Prepare polished, practical brand assets for launch.",
    detail:
      "You receive organized files and clear guidance to put your new identity to work with confidence.",
  },
];

export const email = "AyebCreative@gmail.com";
export { siteUrl } from "./site-url";
export const socialLinks = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
];
