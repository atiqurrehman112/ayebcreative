// Editable, code-native concept artwork. Run with Node 24+: node scripts/generate-project-artwork.mjs
// This is an authoring tool only; production serves the generated local images.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { projects } from "../data/projects.ts";

const ink = "#0F172A",
  blue = "#2563EB",
  paper = "#F8F9FA",
  gray = "#94A3B8";
const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const rect = (x, y, w, h, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const text = (value, x, y, size = 28, color = ink, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Space Grotesk, sans-serif" font-size="${size}" font-weight="500" fill="${color}" ${extra}>${esc(value)}</text>`;
const label = (value, x, y, color = ink, size = 18) =>
  text(value, x, y, size, color, 'letter-spacing="3"').replace(
    'font-family="Space Grotesk, sans-serif"',
    'font-family="Inter, sans-serif"',
  );
const line = (x1, y1, x2, y2, color = gray, opacity = 1) =>
  `<path d="M${x1} ${y1}H${x2}" stroke="${color}" opacity="${opacity}"/>`.replace(
    `H${x2}`,
    `L${x2} ${y2}`,
  );
const marks = {
  nova: '<path d="M0 200V0h44l112 128V0h44v200h-44L44 72v128Z"/>',
  vanta: '<path d="m0 0 40 0 60 126L160 0h40L100 200Zm53 0h32l31 66-16 33Z"/>',
  orbit:
    '<g fill="none" stroke="currentColor" stroke-width="12"><circle cx="100" cy="100" r="82"/><ellipse cx="100" cy="100" rx="38" ry="82" transform="rotate(35 100 100)"/><path d="M20 100h160"/></g>',
  form: '<path d="M0 0h200v45H45v42h119v45H45v68H0Z"/>',
  kova: '<path d="M0 0h46v77L133 0h67l-109 100L200 200h-67l-87-77v77H0Z"/>',
  nexa: '<path d="M0 200 63 0h45L45 200Zm92 0L155 0h45l-63 200Z"/>',
};
const mark = (slug, x, y, size, color) =>
  `<g transform="translate(${x} ${y}) scale(${size / 200})" fill="${color}" color="${color}">${marks[slug]}</g>`;
const grid = (color = gray) =>
  `<g stroke="${color}" stroke-width="1" opacity=".2">${Array.from({ length: 21 }, (_, i) => `<path d="M${i * 80} 0v2000M0 ${i * 80}h1600"/>`).join("")}</g>`;
const chair = (x, y, scale = 1, color = ink) =>
  `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="5"><path d="M40 200 40 20 270 20 270 200M20 200h270v25H20Zm20 25v210m230-210v210M40 75h230M40 140h230M40 330h230"/><path d="M310 200h120v25H310Zm0-180v415m120-210v210M310 20l120 180"/></g>`;
const plan = (x, y, scale = 1, color = blue) =>
  `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="3"><path d="M0 0h560v340H0ZM210 0v145H0m210 195V195h155V0M365 160h195M60 0v340M0 280h560"/><path d="M230 145a50 50 0 0 1 50 50m-50-50v50m175-35a50 50 0 0 1 50 50m-50-50v50" stroke-width="1"/></g>`;
const paperSheet = (x, y, w, h, fill, rotation, body) =>
  `<g transform="translate(${x} ${y}) rotate(${rotation} ${w / 2} ${h / 2})"><g filter="url(#shadow)">${rect(0, 0, w, h, fill)}</g>${body}</g>`;
const bag = (x, y, scale, color, foreground, number) =>
  `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M30 0h390l-14 48 17 550-30 70H20l-20-70L42 48Z" fill="${color}"/><path d="M30 15h388M40 42h367M24 585h390M22 617h384" stroke="${foreground}" opacity=".3"/>${text("KOVA", 47, 182, 99, foreground, 'letter-spacing="-7"')}${mark("kova", 154, 235, 120, foreground)}${line(45, 397, 375, 397, foreground, 0.5)}${label("DAILY RITUAL", 45, 434, foreground, 16)}${text(number, 45, 505, 55, foreground)}${text("COFFEE / 250 G", 45, 550, 17, foreground)}${text("A CONCEPT IN GOOD COMPANY.", 45, 580, 10, foreground)}</g>`;

function socialTile(x, y, w, h, variant) {
  const bg = [blue, paper, ink][variant % 3],
    fg = variant % 3 === 1 ? ink : paper;
  return `<g transform="translate(${x} ${y})">${rect(0, 0, w, h, bg)}${label("ORBIT / CULTURE NOTES", 32, 50, fg, 13)}${
    variant % 2 === 0
      ? `${mark("orbit", w * 0.35, h * 0.24, w * 0.47, fg)}${text("IN GOOD", 32, h - 115, w * 0.085, fg)}${text("COMPANY.", 32, h - 60, w * 0.085, fg)}`
      : `${text("A NEW", 32, h * 0.36, w * 0.11, fg)}${text("POINT", 32, h * 0.51, w * 0.11, fg)}${text("OF VIEW.", 32, h * 0.66, w * 0.11, fg)}<circle cx="${w - 62}" cy="${h - 67}" r="24" fill="${blue}"/>`
  }${line(32, h - 36, w - 32, h - 36, fg, 0.4)}${label("ART / IDEAS / CONVERSATION", 32, h - 15, fg, 9)}</g>`;
}

function cover(project, height) {
  const { slug } = project;
  if (slug === "nova")
    return (
      rect(0, 0, 1600, 1200, blue) +
      grid(paper) +
      paperSheet(
        165,
        155,
        820,
        870,
        paper,
        -8,
        label("ARCHITECTURE / PRACTICE", 62, 72, ink, 16) +
          text("NOVA", 54, 320, 217, ink, 'letter-spacing="-13"') +
          plan(62, 410, 1.1) +
          label("SPACE FOR WHAT'S NEXT.", 62, 830, ink, 15),
      ) +
      paperSheet(
        1010,
        480,
        410,
        520,
        ink,
        9,
        mark(slug, 86, 100, 240, paper) +
          label("NOVA / 2026", 52, 461, paper, 14),
      )
    );
  if (slug === "vanta")
    return (
      rect(0, 0, 1600, height, ink) +
      mark(slug, 350, 330, 900, paper) +
      text("VANTA", 175, 1540, 310, paper, 'letter-spacing="-12"') +
      label("INDEPENDENT SOUND STUDIO", 185, 1630, gray, 23) +
      line(185, 1370, 1415, 1370, gray, 0.5) +
      label("SOUND, GIVEN FORM.", 185, 140, paper, 23) +
      rect(185, 1720, 150, 9, blue)
    );
  if (slug === "orbit")
    return (
      rect(0, 0, 1600, height, gray) +
      socialTile(80, 80, 705, 705, 0) +
      socialTile(815, 80, 705, 705, 1) +
      socialTile(80, 815, 705, 705, 2) +
      socialTile(815, 815, 705, 705, 3)
    );
  if (slug === "form")
    return (
      rect(0, 0, 1600, 1200, paper) +
      paperSheet(
        100,
        240,
        700,
        740,
        ink,
        -6,
        label("FORM / OBJECTS FOR LIVING", 50, 65, paper, 15) +
          mark(slug, 170, 200, 330, paper) +
          label("COLLECTION 01", 50, 680, paper, 16),
      ) +
      paperSheet(
        755,
        160,
        700,
        870,
        paper,
        5,
        text("FORM", 50, 175, 142, ink, 'letter-spacing="-8"') +
          chair(90, 285, 1.1) +
          label("USEFUL. CONSIDERED. EVERYDAY.", 50, 812, ink, 13),
      )
    );
  if (slug === "kova")
    return (
      rect(0, 0, 1600, 1200, paper) +
      rect(0, 1000, 1600, 200, gray, 'opacity=".18"') +
      `<g transform="rotate(-7 530 650)">${bag(255, 250, 1.16, blue, paper, "01")}</g><g transform="rotate(8 1020 670)">${bag(845, 185, 1.25, ink, paper, "02")}</g>` +
      label("A BETTER DAILY RITUAL.", 96, 1115, ink, 20)
    );
  return (
    rect(0, 0, 1600, height, blue) +
    paperSheet(
      150,
      160,
      1300,
      1660,
      paper,
      -4,
      label("NEXA / A DESIGN FORUM", 70, 100, ink, 23) +
        text("LOOK", 58, 490, 315, ink, 'letter-spacing="-18"') +
        text("AGAIN.", 58, 800, 315, ink, 'letter-spacing="-18"') +
        mark(slug, 760, 1000, 380, blue) +
        line(70, 1460, 1230, 1460, ink) +
        label("NEW IDEAS. SHARED SPACE.", 70, 1550, ink, 23),
    )
  );
}

function hero(project) {
  const { slug, title } = project;
  if (slug === "kova")
    return (
      rect(0, 0, 1600, 1000, paper) +
      bag(190, 185, 1, blue, paper, "01") +
      bag(610, 115, 1.12, ink, paper, "02") +
      bag(1070, 200, 0.97, blue, paper, "03") +
      label("KOVA / THE DAILY RITUAL", 75, 70, ink) +
      label("PACKAGING STUDY / 2026", 1150, 940, ink, 14)
    );
  if (slug === "nexa")
    return (
      rect(0, 0, 1600, 1000, ink) +
      mark(slug, 1020, 90, 540, blue) +
      text("NEW", 70, 320, 230, paper, 'letter-spacing="-12"') +
      text("PERSPECTIVES.", 70, 540, 188, paper, 'letter-spacing="-12"') +
      label("NEXA / A DESIGN FORUM", 85, 805, paper, 28) +
      line(85, 880, 1515, 880, gray) +
      label("LOOK AGAIN. THINK AHEAD.", 85, 940, paper, 16)
    );
  const bg = slug === "form" ? paper : slug === "vanta" ? ink : blue;
  const fg = slug === "form" ? ink : paper;
  return (
    rect(0, 0, 1600, 1000, bg) +
    (slug === "nova" ? grid(paper) : "") +
    label(`${title} / ${project.category.toUpperCase()}`, 80, 80, fg, 18) +
    (slug === "form"
      ? chair(1060, 270, 1.05, ink)
      : mark(slug, 990, 240, 435, fg)) +
    text(
      title,
      70,
      620,
      title.length > 4 ? 218 : 266,
      fg,
      'letter-spacing="-15"',
    ) +
    text(project.shortDescription, 85, 715, 30, fg) +
    line(85, 885, 1515, 885, fg, 0.4) +
    label("INDEPENDENT CONCEPT / AYEB CREATIVE", 85, 940, fg, 15)
  );
}

function application(project) {
  const { slug, title } = project;
  if (slug === "orbit")
    return (
      rect(0, 0, 1600, 1200, paper) +
      Array.from({ length: 6 }, (_, i) =>
        socialTile(
          55 + (i % 3) * 505,
          72 + Math.floor(i / 3) * 535,
          475,
          500,
          i,
        ),
      ).join("")
    );
  if (slug === "kova")
    return (
      rect(0, 0, 1600, 1200, gray) +
      bag(210, 230, 1.15, paper, ink, "01") +
      bag(915, 230, 1.15, blue, paper, "02") +
      label("KOVA / ONE SYSTEM. DIFFERENT BLENDS.", 95, 1125, ink, 20)
    );
  if (slug === "form")
    return (
      rect(0, 0, 1600, 1200, gray) +
      paperSheet(
        135,
        155,
        1310,
        875,
        paper,
        -4,
        text("FORM", 65, 148, 108, ink, 'letter-spacing="-6"') +
          label("OBJECT 01 / THE EVERYDAY CHAIR", 690, 90, ink, 15) +
          chair(165, 280, 1.05) +
          line(655, 35, 655, 840, gray) +
          text("Simple parts.", 690, 240, 62) +
          text("Lasting purpose.", 690, 315, 62) +
          plan(700, 420, 0.94, gray) +
          label("A STUDY IN PROPORTION.", 690, 805, ink, 14),
      )
    );
  if (slug === "vanta")
    return (
      rect(0, 0, 1600, 1200, paper) +
      paperSheet(
        160,
        150,
        850,
        850,
        ink,
        -6,
        mark(slug, 190, 120, 410, paper) +
          text(title, 65, 740, 145, paper, 'letter-spacing="-7"'),
      ) +
      `<circle cx="1190" cy="580" r="310" fill="${ink}"/><circle cx="1190" cy="580" r="235" fill="none" stroke="${gray}" opacity=".3"/><circle cx="1190" cy="580" r="155" fill="none" stroke="${gray}" opacity=".3"/><circle cx="1190" cy="580" r="83" fill="${blue}"/><circle cx="1190" cy="580" r="12" fill="${paper}"/>` +
      label("VANTA / LISTENING SESSION 01", 180, 1120, ink, 20)
    );
  if (slug === "nexa")
    return (
      rect(0, 0, 1600, 1200, gray) +
      paperSheet(
        120,
        100,
        630,
        970,
        blue,
        -5,
        label("NEXA", 45, 70, paper, 24) +
          text("LOOK", 35, 305, 132, paper, 'letter-spacing="-8"') +
          text("AGAIN.", 35, 440, 132, paper, 'letter-spacing="-8"') +
          mark(slug, 170, 520, 330, paper) +
          label("A DESIGN FORUM", 45, 920, paper, 16),
      ) +
      paperSheet(
        825,
        115,
        630,
        970,
        ink,
        4,
        label("NEXA", 45, 70, paper, 24) +
          mark(slug, 130, 170, 370, blue) +
          text("THINK", 35, 695, 132, paper, 'letter-spacing="-8"') +
          text("AHEAD.", 35, 830, 132, paper, 'letter-spacing="-8"') +
          label("IDEAS IN GOOD COMPANY", 45, 920, paper, 16),
      )
    );
  return (
    rect(0, 0, 1600, 1200, gray) +
    paperSheet(
      100,
      105,
      795,
      975,
      paper,
      -5,
      label("NOVA / PROJECT NOTES", 55, 65, ink, 18) +
        text("NOVA", 55, 220, 168, ink, 'letter-spacing="-9"') +
        plan(65, 380, 1.16, blue) +
        label("CLARITY IN EVERY DIMENSION.", 55, 890, ink, 17),
    ) +
    paperSheet(
      940,
      350,
      500,
      650,
      blue,
      8,
      mark(slug, 130, 100, 250, paper) +
        text("NOVA", 50, 510, 110, paper, 'letter-spacing="-6"') +
        label("IDENTITY MANUAL", 50, 585, paper, 14),
    )
  );
}

function portrait(project) {
  const { slug, title } = project;
  if (slug === "kova")
    return (
      rect(0, 0, 1600, 1867, paper) +
      label("KOVA / THE DAILY RITUAL", 100, 100, ink, 24) +
      `<path d="M390 465h820l-100 870H490Z" fill="${ink}"/>` +
      rect(350, 430, 900, 75, blue) +
      rect(375, 402, 850, 36, ink) +
      text("KOVA", 492, 825, 235, paper, 'letter-spacing="-12"') +
      mark(slug, 674, 950, 220, paper) +
      paperSheet(
        105,
        1480,
        1390,
        210,
        blue,
        -3,
        text("KOVA", 55, 140, 115, paper, 'letter-spacing="-6"') +
          label("A BETTER DAILY RITUAL.", 615, 92, paper, 20) +
          label("COFFEE / IN GOOD COMPANY", 615, 145, paper, 16),
      )
    );
  const bg = ["vanta", "nexa"].includes(slug) ? ink : blue;
  const phrases = {
    nova: ["SPACE FOR", "WHAT'S NEXT."],
    vanta: ["LISTEN", "CLOSER."],
    orbit: ["CULTURE IN", "CIRCULATION."],
    form: ["MADE FOR", "EVERYDAY."],
    kova: ["A BETTER", "DAILY RITUAL."],
    nexa: ["NEW IDEAS.", "SHARED SPACE."],
  };
  return (
    rect(0, 0, 1600, 1867, paper) +
    paperSheet(
      195,
      120,
      1210,
      1610,
      bg,
      3,
      label(`${title} / CONCEPT APPLICATION`, 85, 90, paper, 21) +
        mark(slug, 580, 255, 485, paper) +
        text(phrases[slug][0], 75, 1000, 152, paper, 'letter-spacing="-7"') +
        text(phrases[slug][1], 75, 1160, 145, paper, 'letter-spacing="-7"') +
        line(85, 1340, 1125, 1340, paper, 0.4) +
        label("DESIGN WITH A CLEAR POINT OF VIEW.", 85, 1430, paper, 19) +
        label("01 / 2026", 85, 1515, paper, 16),
    )
  );
}

function artwork(project, name, height) {
  if (name === "cover") return cover(project, height);
  if (name === "hero") return hero(project);
  if (name === "application-01") return application(project);
  if (name === "application-02") return portrait(project);
  if (name === "identity")
    return (
      rect(0, 0, 1000, 900, ink) +
      rect(1000, 0, 600, 900, paper) +
      mark(project.slug, 85, 105, 300, paper) +
      text(project.title, 70, 705, 202, paper, 'letter-spacing="-10"') +
      mark(project.slug, 1135, 260, 325, ink) +
      label("PRIMARY / INVERSE", 1080, 785, ink, 17)
    );
  if (name === "detail-01")
    return (
      rect(0, 0, 1600, height, blue) +
      grid(paper) +
      mark(project.slug, 130, -20, 1320, paper) +
      label("01 / FORM & COUNTERFORM", 70, height - 60, paper, 22)
    );
  return (
    rect(0, 0, 1600, height, paper) +
    text(project.title, -40, 460, 570, ink, 'letter-spacing="-35"') +
    line(80, 605, 1520, 605, blue) +
    label(project.category.toUpperCase(), 80, 690, ink, 30) +
    text("A clear point", 80, 865, 116, ink, 'letter-spacing="-5"') +
    text("of view.", 80, 990, 116, ink, 'letter-spacing="-5"') +
    label("TYPE / SPACE / PROPORTION", 80, height - 80, ink, 22)
  );
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const font = await readFile(
    "node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  );
  const bodyFont = await readFile(
    "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  );
  const fontCSS = `@font-face{font-family:'Space Grotesk';src:url(data:font/woff2;base64,${font.toString("base64")});font-weight:300 700}@font-face{font-family:Inter;src:url(data:font/woff2;base64,${bodyFont.toString("base64")});font-weight:100 900}body{margin:0}svg{display:block}`;
  for (const project of projects) {
    const directory = `public/projects/${project.slug}`;
    await mkdir(directory, { recursive: true });
    const visuals = [project.coverImage, project.heroImage, ...project.gallery];
    for (const image of visuals) {
      const name = image.src.split("/").pop().replace(".jpg", "");
      const height = Math.round((1600 * image.height) / image.width);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${image.width}" height="${image.height}" viewBox="0 0 1600 ${height}"><defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="${ink}" flood-opacity=".13"/></filter></defs>${artwork(project, name, height)}</svg>`;
      await writeFile(`${directory}/${name}.svg`, svg);
      await page.setViewportSize({ width: image.width, height: image.height });
      await page.setContent(`<style>${fontCSS}</style>${svg}`);
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator("svg")
        .screenshot({ path: `public${image.src}`, type: "jpeg", quality: 90 });
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${rect(0, 0, 1200, 630, ink)}${label("AYEB CREATIVE / SELECTED WORK", 64, 62, paper, 14)}${mark(project.slug, 880, 190, 220, blue)}${text(project.title, 55, 350, 166, paper, 'letter-spacing="-8"')}${text(project.category, 65, 410, 27, paper)}${line(65, 510, 1135, 510, gray, 0.5)}${label("INDEPENDENT CONCEPT / 2026", 65, 563, paper, 14)}</svg>`;
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.setContent(`<style>${fontCSS}</style>${svg}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("svg").screenshot({
      path: `${directory}/social.jpg`,
      type: "jpeg",
      quality: 90,
    });
    console.log(
      `Prepared ${project.title}: seven editable compositions and social preview.`,
    );
  }
} finally {
  await browser.close();
}
