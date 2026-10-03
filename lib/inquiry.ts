import { services } from "@/data/services";
import { email } from "@/lib/content";

export const inquiryServices = [
  ...services.map(({ title }) => ({
    value: title,
    label:
      title === "Marketing & Campaign Design"
        ? "Marketing / Campaign Design"
        : title,
  })),
  { value: "Something else", label: "Something else" },
];
export const budgetOptions = [
  "Not sure yet",
  "Under $500",
  "$500–$1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "$5,000+",
];
export const timelineOptions = [
  "Flexible",
  "Within 2–4 weeks",
  "Within 1–2 months",
  "Specific launch date",
  "Not sure yet",
];

export type Inquiry = {
  name: string;
  email: string;
  company: string;
  website: string;
  services: string[];
  budget: string;
  timeline: string;
  launchDate: string;
  message: string;
  referral: string;
};
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export type InquiryResponse =
  | { status: "received" }
  | { status: "draft" }
  | { status: "error"; message: string; errors?: InquiryErrors };

export function readInquiry(form: FormData) {
  return { ...Object.fromEntries(form), services: form.getAll("services") };
}

// Shared by the browser and route handler: the server never trusts client validation.
export function validateInquiry(input: unknown): {
  values: Inquiry;
  errors: InquiryErrors;
} {
  const data: Record<string, unknown> =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const value = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";
  const values: Inquiry = {
    name: value("name"),
    email: value("email"),
    company: value("company"),
    website: value("website"),
    services: Array.isArray(data.services)
      ? [
          ...new Set(
            data.services.filter(
              (item): item is string => typeof item === "string",
            ),
          ),
        ]
      : [],
    budget: value("budget"),
    timeline: value("timeline"),
    launchDate: value("launchDate"),
    message: value("message"),
    referral: value("referral"),
  };
  const errors: InquiryErrors = {};
  if (!values.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Please enter a valid email address.";
  if (
    !values.services.length ||
    values.services.some(
      (item) => !inquiryServices.some(({ value }) => value === item),
    )
  )
    errors.services = "Choose at least one service, or Something else.";
  if (!values.message) errors.message = "Tell us a little about your project.";
  const limits = {
    name: 100,
    email: 254,
    company: 150,
    website: 500,
    message: 2500,
    referral: 250,
  } as const;
  for (const [key, limit] of Object.entries(limits)) {
    const field = key as keyof typeof limits;
    if (values[field].length > limit)
      errors[field] = `Please use ${limit} characters or fewer.`;
  }
  if (values.website) {
    try {
      const url = new URL(
        /^[a-z][a-z\d+.-]*:/i.test(values.website)
          ? values.website
          : `https://${values.website}`,
      );
      if (
        !["https:", "http:"].includes(url.protocol) ||
        !url.hostname.includes(".") ||
        url.username ||
        url.password
      )
        throw new Error("Invalid website");
      values.website = url.href;
    } catch {
      errors.website = "Enter a website such as yourbrand.com.";
    }
  }
  if (values.budget && !budgetOptions.includes(values.budget))
    errors.budget = "Choose one of the budget ranges.";
  if (values.timeline && !timelineOptions.includes(values.timeline))
    errors.timeline = "Choose one of the timeline options.";
  if (values.timeline === "Specific launch date") {
    const date = new Date(`${values.launchDate}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(values.launchDate) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== values.launchDate
    )
      errors.launchDate = "Please enter your intended launch date.";
  } else values.launchDate = "";
  return { values, errors };
}

export function createInquiryDraft(inquiry: Inquiry) {
  const subject = `Project inquiry — ${inquiry.company || inquiry.name}`;
  const body = [
    "Hello Ayeb Creative,",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company / brand: ${inquiry.company || "Not specified"}`,
    `Website: ${inquiry.website || "Not specified"}`,
    `Services: ${inquiry.services.join(", ")}`,
    `Estimated project budget: ${inquiry.budget || "Not sure yet"}`,
    `Timeline: ${inquiry.timeline || "Not sure yet"}${inquiry.launchDate ? ` (${inquiry.launchDate})` : ""}`,
    "",
    "About the project:",
    inquiry.message,
    "",
    `How I heard about Ayeb Creative: ${inquiry.referral || "Not specified"}`,
  ].join("\n");
  return {
    body,
    href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
