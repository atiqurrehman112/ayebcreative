# Ayeb Creative: applied brand system

## Source of truth

`public/brand-board.png` is the supplied 1536 × 1024 board. Its lower-right **RECOMMENDED / FINAL MAIN LOGO** is the primary direction: the custom AYEB wordmark over widely spaced CREATIVE, a fine vertical rule, then the two-line studio descriptor. The header follows this arrangement. On smaller screens it uses the compact wordmark with generous clear space.

## What the board establishes

- **Primary wordmark:** heavy geometric AYEB, an open custom A with a blue triangular inset, and a much lighter, tracked CREATIVE underneath.
- **AC monogram:** the open chevron A overlaps a substantial curved C. Its blue inset is integral to the identity. It appears in the hero, studio section and app icons.
- **Alternates:** primary color, dark monochrome with a gray inset, white inverse, compact dark/light circle treatments, and a wordmark without the subtitle. The minimal spaced wordmark is a separate concept, not the recommended primary.
- **Dark / light:** charcoal marks on off-white, or off-white marks on charcoal or electric blue. The inverse wordmark is monochrome; the inverse AC retains the blue inset.
- **Profile / icon:** the AC is centered inside a charcoal or blue square with restrained rounded corners. The favicon and Apple icon follow the charcoal version.
- **Proportions:** the board's wordmark is approximately 2.7:1 including the subtitle; the AC is approximately 1.8:1. Assets retain their sampled proportions. They are never stretched.
- **Spacing:** generous clear space, widely tracked small labels, precise alignment and fine dividing rules. The site uses these traits in its lockup, typography, portfolio metadata and section rhythm.
- **Personality:** modern, creative, professional, confident and approachable. Copy stays direct and collaborative; large type and restrained motion supply the confidence.

## Asset provenance and replacement

The four supplied `public/logo-*.svg` files were inspected and preserved unchanged. Their contents are alternate drafts: `logo-primary.svg` is a circular AC; `logo-white.svg` and `logo-dark.svg` contain title-case lockups, backgrounds and version captions; `logo-monogram.svg` is actually an AYEB wordmark with thinner, different letterforms. They do not match the board's recommended artwork.

The temporary production SVGs in `public/brand/` are traced directly from the board's wordmark and AC, rather than retyped using a substitute font. The large wordmark sample is at x48/y202, 294 × 117; the AC sample is at x484/y193, 170 × 99. Separate ink/inset contours were traced with Potrace, with transparent backgrounds and fills normalized to the supplied palette. These are board-derived working assets, not original vector masters. The board's slight contour irregularities remain visible at very large sizes.

`components/BrandLogo.tsx` is the single on-page logo component. It supports `variant="primary" | "white" | "dark" | "monogram"` and `size="sm" | "md" | "lg"`, plus optional descriptor, monogram tone and decorative-image handling. Asset paths are centralized in `lib/brand.ts`. Replace those mapped SVGs with approved masters while preserving their aspect ratio; update intrinsic dimensions in BrandLogo if the master view boxes differ. The social preview reads the same white asset. Regenerate the app icons from the replacement AC when updating masters.

## Color and type

| Role          | Value     |
| ------------- | --------- |
| Charcoal      | `#0F172A` |
| Electric Blue | `#2563EB` |
| Off White     | `#F8F9FA` |
| Gray          | `#94A3B8` |

Site neutrals and borders derive from these four tokens. Secondary text on off-white uses a darker palette mix for contrast. Portfolio concept artwork keeps each fictional project's own palette.

Space Grotesk is used for headlines, major navigation and the lockup descriptor. Inter is used for body copy, forms, buttons and metadata. Both are locally hosted. The social preview uses locally stored, licensed WOFF versions of the same families.

## Review

The existing routes, contact draft workflow, concept portfolio, SEO and motion system are preserved. The browser suite includes all six requested widths (1440, 1280, 1024, 768, 390 and 375), plus 320px. It also covers accessibility, keyboard navigation, reduced motion, forms and metadata. Review screenshots are in `artifacts/`.
