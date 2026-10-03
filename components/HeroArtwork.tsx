import { BrandLogo } from "./BrandLogo";
// The board's AC monogram, framed using its clear-space guidance.
export function HeroArtwork() {
  return (
    <div className="hero-art" role="img" aria-label="Ayeb Creative AC monogram">
      <div className="signature-frame">
        <BrandLogo
          variant="monogram"
          size="lg"
          className="signature-mark"
          decorative
        />
      </div>
      <div className="signature-caption">
        <span>AYEB / CREATIVE</span>
        <span>DESIGN WITH INTENT.</span>
      </div>
    </div>
  );
}
