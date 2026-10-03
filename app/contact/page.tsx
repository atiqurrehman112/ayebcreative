import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";
import { ContactDetails } from "@/components/ContactDetails";
const title = "Start a Project — Ayeb Creative";
const description =
  "Tell Ayeb Creative about your next branding or creative design project.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title,
    description,
    url: "/contact",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await searchParams;
  return (
    <div className="inquiry-page">
      <PageIntro
        label="AYEB CREATIVE / START A PROJECT"
        title={
          <>
            LET&apos;S BUILD
            <br />
            SOMETHING DISTINCTIVE<span className="blue">.</span>
          </>
        }
        description="Have a project in mind? Tell us a little about it and we'll get back to you."
      />
      <div className="contact-layout container">
        <ProjectInquiryForm
          key={typeof service === "string" ? service : ""}
          initialService={typeof service === "string" ? service : ""}
          deliveryEnabled={Boolean(process.env.INQUIRY_ENDPOINT)}
        />
        <ContactDetails />
      </div>
    </div>
  );
}
