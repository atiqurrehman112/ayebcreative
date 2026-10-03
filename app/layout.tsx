import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { siteUrl } from "@/lib/content";
import "./globals.css";
import "./portfolio.css";
import "./inquiry.css";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});
const description =
  "Ayeb Creative creates distinctive visual identities, branding systems and creative design for ambitious brands.";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ayeb Creative — Visual Identity & Creative Design Studio",
    template: "%s — Ayeb Creative",
  },
  description,
  applicationName: "Ayeb Creative",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ayeb Creative",
    title: "Ayeb Creative — Visual Identity & Creative Design Studio",
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ayeb Creative. We build brands people remember.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayeb Creative — Visual Identity & Creative Design Studio",
    description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#0F172A" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body id="top">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
