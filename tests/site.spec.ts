import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { orderedProjects, featuredProjects } from "../data/projects";

const routes = [
  "/",
  "/work",
  "/services",
  "/about",
  "/contact",
  ...orderedProjects.map((project) => `/work/${project.slug}`),
];

for (const width of [320, 375, 390, 768, 1024, 1280, 1440]) {
  test(`all pages render without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() =>
        [...document.querySelectorAll("main *, header *, footer *")]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            if (
              el.closest(".hero-art, .work-image, .project-cover") ||
              style.position === "absolute" ||
              style.position === "fixed" ||
              style.visibility === "hidden"
            )
              return false;
            return (
              rect.width > 0 &&
              (rect.right > window.innerWidth + 1 || rect.left < -1)
            );
          })
          .map((el) => `${el.tagName}.${el.className}`),
      );
      expect(overflow, `${route} overflows at ${width}px`).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

for (const route of ["/", "/contact", "/work", "/work/nova"]) {
  test(`accessible structure and contrast on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test("mobile navigation opens, closes with Escape, and follows links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Open navigation" });
  await button.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Work" })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await page.locator(".nav-cta").click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("portfolio and service inquiry links work", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore NOVA, Brand Identity concept" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("NOVA");
  await page.getByRole("link", { name: "Next Project: VANTA" }).click();
  await expect(page).toHaveURL(/\/work\/vanta$/);
  await page.goto("/services");
  await page.getByRole("link", { name: /03 Social Media Design/ }).click();
  await expect(
    page.getByRole("checkbox", { name: "Social Media Design" }),
  ).toBeChecked();
});

test("contact validates inputs and prepares an email draft honestly", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".inquiry-feedback[role=alert]")).toContainText(
    "check the highlighted fields",
  );
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Website QA");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("qa@example.com");
  await page.getByLabel("Company / Brand").fill("Test project");
  await page
    .getByRole("checkbox", { name: "Brand Identity", exact: true })
    .check();
  await page
    .getByLabel("Tell us about your project")
    .fill("Local form validation only. No message is sent.");
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing has been sent yet",
  );
});

test("skip link, reduced motion, metadata and 404 are present", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page).toHaveTitle(
    "Ayeb Creative — Visual Identity & Creative Design Studio",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /distinctive visual identities/,
  );
  await page.goto("/work");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "way back",
  );
});

test("capture desktop and mobile layouts for visual review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "artifacts/home-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  await page.screenshot({
    path: "artifacts/hero-desktop.png",
    caret: "initial",
  });
  await page.locator("#work").screenshot({
    path: "artifacts/work-desktop.png",
    style: ".site-header,.skip-link{visibility:hidden!important}",
    caret: "initial",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "artifacts/home-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  await page.screenshot({
    path: "artifacts/hero-mobile.png",
    caret: "initial",
  });
  await page.goto("/contact");
  await page.screenshot({
    path: "artifacts/contact-mobile.png",
    fullPage: true,
    caret: "initial",
  });
});

test("mobile navigation and form have accessible structure and contrast", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menuResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(menuResults.violations.map((v) => v.id)).toEqual([]);
  await page.goto("/contact");
  const formResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(formResults.violations.map((v) => v.id)).toEqual([]);
});

test("standard motion loads without hydration errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole("link", { name: "View Our Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await page
    .getByRole("link", { name: "Explore ORBIT, Social Identity concept" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ORBIT");
  expect(errors).toEqual([]);
});

test("portfolio filters are keyboard accessible and retain a clear active state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work");
  const filters = page.getByRole("group", { name: "Filter work by category" });
  const results = page.locator("#portfolio-results");
  await expect(results.locator("article")).toHaveCount(6);
  for (const [category, titles] of [
    ["Brand Identity", ["NOVA", "FORM"]],
    ["Logo Design", ["VANTA"]],
    ["Social Media", ["ORBIT"]],
    ["Creative Design", ["KOVA", "NEXA"]],
  ] as const) {
    const button = filters.getByRole("button", { name: category, exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(results.getByRole("heading", { level: 3 })).toHaveText([
      ...titles,
    ]);
    await expect(page.locator(".portfolio-count")).toContainText(
      String(titles.length).padStart(2, "0"),
    );
  }
  await filters.getByRole("button", { name: "All", exact: true }).click();
  await expect(results.locator("article")).toHaveCount(6);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations.map((item) => item.id)).toEqual([]);
});

test("case studies expose complete stories, local imagery and project-specific metadata", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const project of orderedProjects) {
    await page.goto(`/work/${project.slug}`);
    await expect(page).toHaveTitle(
      `${project.title} — ${project.category} | Ayeb Creative`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/work/${project.slug}$`),
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(
        `${project.socialImage!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      ),
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      new RegExp(
        `${project.socialImage!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      ),
    );
    await expect(page.locator(".case-concept-note")).toContainText(
      "not commissioned client work",
    );
    for (const heading of [
      "THE BRIEF",
      "THE CHALLENGE",
      "THE APPROACH",
      "THE SOLUTION",
      "LOGO / IDENTITY",
      "COLOR SYSTEM",
      "TYPOGRAPHY",
      "APPLICATIONS",
      "SELECTED DETAILS",
      "THE RESULT",
    ]) {
      await expect(
        page.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
    }
    for (const image of await page
      .locator(".case-study .project-image img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((node) => (node as HTMLImageElement).decode());
    }
    expect(await page.locator(".case-study .project-image img").count()).toBe(
      6,
    );
    expect((await page.request.get(project.socialImage!)).status()).toBe(200);
  }
  expect(errors).toEqual([]);
});

test("featured work, adjacent projects, back links and legacy URLs remain connected", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#work article h3")).toHaveText(
    featuredProjects.map((project) => project.title),
  );
  await page.getByRole("link", { name: "View All Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page
    .getByRole("link", { name: "Explore NOVA, Brand Identity concept" })
    .click();
  await page.getByRole("link", { name: "Previous Project: NEXA" }).click();
  await expect(page).toHaveURL(/\/work\/nexa$/);
  await page.getByRole("link", { name: "Next Project: NOVA" }).click();
  await expect(page).toHaveURL(/\/work\/nova$/);
  await page
    .getByRole("navigation", { name: "Project navigation" })
    .getByRole("link", { name: "Back to Work" })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  for (const [oldSlug, newSlug] of [
    ["forma", "form"],
    ["morrow", "orbit"],
    ["common-ground", "kova"],
  ]) {
    await page.goto(`/work/${oldSlug}`);
    await expect(page).toHaveURL(new RegExp(`/work/${newSlug}$`));
  }
  const response = await page.goto("/work/unknown-project");
  expect(response?.status()).toBe(404);
});

test("mobile case study remains accessible and the inquiry CTA works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/work/vanta");
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations.map((item) => item.id)).toEqual([]);
  await page
    .locator(".case-cta")
    .getByRole("link", { name: "START A PROJECT" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
});
