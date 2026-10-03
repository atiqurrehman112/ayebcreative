import Image from "next/image";
import { brandAssets } from "@/lib/brand";

type BrandLogoProps = {
  variant?: "primary" | "white" | "dark" | "monogram";
  size?: "sm" | "md" | "lg";
  withDescriptor?: boolean;
  monogramTone?: "dark" | "white";
  decorative?: boolean;
  className?: string;
};

// Board-derived temporary vectors, not typeset substitutes. Replace these
// files with approved masters; every visible logo uses this component.
export function BrandLogo({
  variant = "primary",
  size = "md",
  withDescriptor = true,
  monogramTone = "dark",
  decorative = false,
  className = "",
}: BrandLogoProps) {
  const monogram = variant === "monogram";
  return (
    <span
      className={`brand-logo brand-logo--${variant} brand-logo--${size} ${className}`}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={
          monogram
            ? brandAssets.monogram[monogramTone]
            : brandAssets.wordmark[variant]
        }
        alt={
          decorative
            ? ""
            : monogram
              ? "Ayeb Creative AC monogram"
              : "Ayeb Creative"
        }
        width={monogram ? 170 : 294}
        height={monogram ? 99 : 117}
        className="brand-logo-art"
        loading="eager"
      />
      {!monogram && withDescriptor && (
        <span className="brand-logo-descriptor">
          VISUAL IDENTITIES &<br />
          CREATIVE DESIGN STUDIO
        </span>
      )}
    </span>
  );
}
