# Ayeb Creative

A responsive creative studio website built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide React.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production checks

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Browser checks: run `npx playwright install chromium` once, then `npm test`. The 40 checks cover all eleven pages at seven viewport widths (320, 375, 390, 768, 1024, 1280 and 1440px), filters, featured work, project navigation, legacy redirects, image loading, metadata, keyboard navigation, reduced motion and accessibility. Inquiry checks cover service preselection, multiple selections, budget and timeline preferences, required-field validation, draft contents, submitting/success/error states and the delivery adapter. Success and delivery failures are mocked; the suite sends no external inquiries. Run it with `INQUIRY_ENDPOINT` unset. Screenshots are saved in `artifacts/` for visual review.

## Content and design

- `data/projects.ts`: typed project catalog, portfolio categories, display order and featured-project selection.
- `data/services.ts`: service descriptions, deliverables, Services process and FAQ. `lib/content.ts` re-exports the same service catalog for the homepage and keeps navigation, homepage process and contact details.
- `public/projects/{slug}/`: supplied project JPGs. Next Image handles responsive raster optimization; original files remain unchanged.
- `components/`: reusable sections, navigation, motion, identity and contact form.
- `app/globals.css`: shared design tokens, editorial layouts and responsive styles, with Tailwind available for utilities. `app/portfolio.css` contains portfolio and case-study styles; `app/inquiry.css` is scoped to the Services and Contact experience.
- Space Grotesk and Inter variable fonts are served locally through Next Font. No font CDN requests are required.
- The actual `public/brand-board.png` now guides the identity. See [BRAND.md](BRAND.md) for the board analysis, asset provenance and replacement instructions. `components/BrandLogo.tsx` centralizes all on-page logo variants.
- All six current portfolio entries are explicitly labeled concept explorations, with no client performance claims.

## Portfolio and case studies

`/work` filters the shared catalog by All, Brand Identity, Logo Design, Social Media and Creative Design. `filterCategory` controls the filter; `category` is the more specific label displayed on the project. `order` determines the portfolio and previous/next sequence, which wraps at either end. The homepage retains its existing layout and displays records with `featured: true`.

Every `/work/[slug]` page uses `components/ProjectCaseStudy.tsx` and the shared `Project*` components. There is no project-specific page markup. Each route receives its own title, description, canonical URL and Open Graph/Twitter image. The sitemap and static routes are generated from the catalog.

### Replace imagery

The active image folders are:

```text
public/projects/nova/
public/projects/vanta/
public/projects/orbit/
public/projects/form/
public/projects/kova/
public/projects/nexa/
```

Standard image roles (filenames may retain their supplied spelling):

```text
cover.jpg              Portfolio and homepage thumbnail
hero.jpg               Large case-study opening visual
identity.jpg           Primary/inverse logo presentation
application-01.jpg     First application
application-02.jpg     Second application
detail-01.jpg          Close-up visual
detail-02.jpg          Typographic/detail visual
social.jpg             Sharing image
```

Replace files in the relevant folder, then run `npm run images:sync` (also runs automatically before `npm run dev` and `npm run build`). This reads the images without modifying them and updates `data/project-images.json` with exact, URL-encoded filenames, actual dimensions and content-hashed URLs. Hashes change when file contents change, preventing reuse of old optimized images. Restart development or run the sync command after replacing files during an active session; rebuild/redeploy a published site.

JPG/JPEG (including uppercase extensions), PNG, WebP and AVIF are supported. Spaces and underscores are normalized to hyphens only in lookup keys: the supplied NOVA files `application 01.jpg`, `application 02.jpg`, `detail 01.jpg` and `detail 02.jpg` remain unchanged on disk. Keep one file per role; ambiguous duplicates cause a clear error. Project slugs must match their folder names exactly. Do not edit the generated JSON by hand.

`data/projects.ts` uses `projectImage(slug, role)` through the existing `visual()` helper. Keep descriptive `alt` text and captions there. `fit` and `position` support deliberate thumbnail cropping; `fit: "contain"` with a matching `background` preserves the entire composition inside the established card shape. Case-study images use their actual proportions. Explicit custom `ProjectVisual` objects remain supported: paths start with `/projects/`, without `public`, and must include correct dimensions and a fresh URL when the image changes.

`scripts/generate-project-artwork.mjs` is the legacy placeholder authoring tool, not part of the replacement workflow. Do not run it against supplied assets: it writes image files. The site uses the current JPGs and does not require old SVG source artwork.

### Add or replace a project

1. Add an image folder under `public/projects/<slug>/`.
2. Add or replace one record in `data/projects.ts`. The exported `Project` type documents every field. Required fields are `id`, `slug`, `title`, `category`, `filterCategory`, `year`, `shortDescription`, `description`, `coverImage` and `isConcept`.
3. Set `order` and optionally `featured: true`. Use a unique ID and URL-safe slug. Four featured entries match the current homepage composition.
4. Add optional `heroImage`, `gallery`, `services`, `client`, `location`, `tags`, `colors`, `typography`, `challenge`, `approach`, `solution`, `deliverables`, `result` and `socialImage`. The hero falls back to the cover; empty optional sections are omitted. Gallery `role` values are `identity`, `application` and `detail` (an omitted role defaults to application). Typeface `style` selects the existing display or body font; self-host any new client typeface before referencing it.
5. Keep `isConcept: true` for fictional/self-initiated work. For an approved real project, set it to `false`, replace the copy and client details with factual information, and remove concept language from its image captions and sharing artwork. Concept notices elsewhere update from the data automatically. Do not add business results without evidence.
6. Run the production checks above. If a published slug changes, add its old-to-new redirect in `next.config.ts`. Rebuild to generate the new route and sitemap entry.

The `visual()` and `gallery()` helpers are conveniences for the existing placeholders. A real project can use explicit `ProjectVisual` objects with any number of images instead; the page architecture stays the same.

## Visual refinement

The refinement preserves the existing routes, sections, project content, SEO, and contact workflow. It applies the board's wordmark and AC, a typography-led hero, an asymmetric portfolio grid, a responsive process timeline, a manifesto-style studio section, and a blue closing invitation. The navbar reduces its height subtly on scroll. Mobile type, controls, and section spacing have a dedicated scale.

The palette is defined as four source tokens in `app/globals.css`. Neutral rules and accessible secondary text are derived from those tokens. The supplied SVG drafts differ from the board's recommended identity, so the temporary production assets are vector contours traced directly from the actual board. Originals are preserved. Replace the mapped assets in `lib/brand.ts` when matching vector masters become available.

## Before deployment

Copy `.env.example` to `.env.local` and set the verified production origin. The `ayebcreative.com` fallback is a placeholder; domain ownership has not been verified. This origin controls canonical URLs, Open Graph metadata, structured data and the sitemap. Set the three verified social profile URLs to activate those footer links; unconfigured profiles render as plain labels.

The inquiry form currently prepares an email draft addressed to AyebCreative@gmail.com. It does not deliver email, persist inquiries or claim receipt. Visitors explicitly open the draft and send it themselves, or copy the inquiry into webmail. See the integration instructions below before enabling online submission.

### Production environment variables

| Variable                    | When required                                    | Purpose                                                                                                                                              |
| --------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Before production build                          | Verified HTTPS origin, without a trailing slash; used for canonical URLs, sharing metadata, robots and sitemap. The example domain is a placeholder. |
| `INQUIRY_ENDPOINT`          | For online inquiry delivery                      | HTTPS endpoint implementing the acknowledgment contract below. Leave empty to keep the honest email-draft fallback.                                  |
| `INQUIRY_API_KEY`           | If the selected endpoint requires authentication | Server-only bearer token; store it in the hosting provider's secret settings.                                                                        |
| `NEXT_PUBLIC_LINKEDIN_URL`  | To activate LinkedIn links                       | Verified studio profile URL.                                                                                                                         |
| `NEXT_PUBLIC_INSTAGRAM_URL` | To activate Instagram links                      | Verified studio profile URL.                                                                                                                         |
| `NEXT_PUBLIC_FACEBOOK_URL`  | To activate Facebook links                       | Verified studio profile URL.                                                                                                                         |

`.gitignore` excludes `.env*` and permits only `.env.example`. Keep real values in `.env.local` or the host's environment settings. Public variables are embedded at build time; rebuild when changing them. Never put real credentials in source, examples or documentation.

### Launch checklist

1. Configure the environment variables above in the production host.
2. Connect and validate the inquiry provider; configure its spam protection and rate limits. Until then, keep `INQUIRY_ENDPOINT` empty so visitors receive drafts, not false delivery confirmations.
3. Replace concept imagery in `public/projects/{nova,vanta,orbit,form,kova,nexa}/` with approved project assets, including sharing images.
4. Replace concept copy in `data/projects.ts` with factual, approved details. Keep `isConcept: true` for any concepts retained on the public site. Follow “Add or replace a project” above for new entries.
5. Add verified social profile URLs; leave unknown profiles unconfigured.
6. Configure the verified domain, HTTPS and `NEXT_PUBLIC_SITE_URL` consistently.
7. Run lint, type checking, build and the browser suite, then deploy. Run browser tests with delivery unconfigured; their success/error responses are mocked.
8. Verify the deployed contact form end to end with an authorized real inquiry. Check actual receipt, validation, failure messaging and the email fallback.
9. Verify the live `robots.txt` and `sitemap.xml`, then submit the sitemap to search engines.

## Services and project inquiries

`/services` uses `ServiceList`, `ServiceItem`, `ProcessSteps` and `FAQ`. Service links pass the existing `?service=` query parameter to `/contact` and preselect the matching checkbox. The homepage retains its original service summaries and appearance.

`/contact` uses `ProjectInquiryForm`, `FormField` and `ContactDetails`. Required fields are name, email, at least one service and project description. An intended launch date is also required when “Specific launch date” is selected. Website, brand, budget, timeline and referral are otherwise optional. Budget ranges are estimates supplied by the visitor, not studio prices; timeline choices are preferences, not delivery promises.

The implementation is split into:

- `lib/inquiry.ts`: field types, options, shared validation and email-draft formatting.
- `lib/useProjectInquiry.ts`: submission state, field errors, focus management and draft fallback. Entries stay in the form after errors; there is no local-storage persistence.
- `app/api/inquiry/route.ts`: validates and bounds JSON requests, checks the request origin against its host, then calls the server-side adapter. Inquiry content and credentials are not logged.
- `lib/inquiry-delivery.ts`: the isolated provider integration. It currently returns `draft` when no endpoint is configured.

### Connect a delivery provider

Leave both variables empty to keep the current email-draft flow:

```dotenv
INQUIRY_ENDPOINT=
INQUIRY_API_KEY=
```

To enable online submission, connect an HTTPS endpoint under your control or adapt `lib/inquiry-delivery.ts` to the selected provider. These are **server-only** environment variables; never prefix credentials with `NEXT_PUBLIC_`. Restart the server after changing them.

The generic adapter sends a JSON `Inquiry` object with `name`, `email`, `company`, `website`, `services[]`, `budget`, `timeline`, `launchDate`, `message` and `referral`. If `INQUIRY_API_KEY` is set, it is sent as an `Authorization: Bearer` header. The endpoint must return a successful HTTP status and exactly acknowledge acceptance with `{ "received": true }`. A successful HTTP status alone is insufficient. Other responses, redirects and timeouts produce an error with the entered details retained and an email-draft alternative.

Provider APIs such as Resend, Formspree or Web3Forms may use different request and response formats. Map those in the server adapter; do not assume their raw URLs satisfy this contract. Acknowledge only after the provider has accepted the inquiry. This confirms receipt, not inbox delivery. Use the selected provider or gateway's rate limiting and spam controls before enabling a public endpoint, and verify an actual inquiry reaches the studio. No provider credentials, account or production integration is included here.

The UI supports `idle`, `submitting`, `success`, `error` and the current `draft` fallback. The “THANK YOU. Your project inquiry has been received.” screen appears only for an acknowledged response. Drafts explicitly state that nothing has been sent. Both direct email and copy-inquiry options remain available when delivery fails.

Social URLs use the existing `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_INSTAGRAM_URL` and `NEXT_PUBLIC_FACEBOOK_URL` values. Unconfigured profiles remain plain labels, with no invented links.

## Routes

`/`, `/work`, `/work/nova`, `/work/vanta`, `/work/orbit`, `/work/form`, `/work/kova`, `/work/nexa`, `/services`, `/about`, `/contact`.

Legacy project URLs redirect: `/work/forma` → `/work/form`, `/work/morrow` → `/work/orbit`, and `/work/common-ground` → `/work/kova`.

The process section is linked at `/#process`. The site includes an accessible mobile menu, skip link, visible focus indicators, reduced-motion support, a branded 404, generated Open Graph image, favicon, robots.txt and sitemap.xml.
