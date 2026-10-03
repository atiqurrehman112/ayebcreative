/* eslint-disable @next/next/no-img-element -- ImageResponse renders an image, not browser HTML. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brandAssets } from "@/lib/brand";

export const alt = "Ayeb Creative — We build brands people remember.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [logo, displayFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), "public", brandAssets.wordmark.white)),
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Medium.woff")),
    readFile(join(process.cwd(), "assets/fonts/Inter-Regular.woff")),
  ]);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "62px 72px",
        background: "#0F172A",
        color: "#F8F9FA",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <img
          src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
          width={190}
          height={76}
          alt="Ayeb Creative"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid #94A3B8",
            paddingLeft: 30,
            fontSize: 12,
            letterSpacing: 2,
            lineHeight: 1.8,
          }}
        >
          <span>VISUAL IDENTITIES &</span>
          <span>CREATIVE DESIGN STUDIO</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Space Grotesk",
          fontSize: 91,
          fontWeight: 500,
          lineHeight: 1.03,
          letterSpacing: -5,
        }}
      >
        <span>WE BUILD BRANDS</span>
        <span>PEOPLE REMEMBER.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #2563EB",
          paddingTop: 24,
          fontSize: 14,
          color: "#94A3B8",
          letterSpacing: 1,
        }}
      >
        <span>CLARITY IN THINKING. CHARACTER IN DESIGN.</span>
        <span>AYEB CREATIVE</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: displayFont,
          weight: 500,
          style: "normal",
        },
        { name: "Inter", data: bodyFont, weight: 400, style: "normal" },
      ],
    },
  );
}
