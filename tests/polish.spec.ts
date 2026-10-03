import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { orderedProjects } from "../data/projects";

test("navigation keeps Work active in case studies and resets the mobile menu on resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const project of orderedProjects) {
    await page.goto(`/work/${project.slug}`);
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Work", exact: true }),
    ).toHaveAttribute("aria-current", "location");
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    menu.getByRole("link", { name: "Work", exact: false }),
  ).toHaveAttribute("aria-current", "location");
  await menu.getByRole("link", { name: "Services", exact: false }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/services$/);
  await toggle.click();
  await expect(
    menu.getByRole("link", { name: "Services", exact: false }),
  ).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).not.toBeVisible();
  await page.getByRole("link", { name: "Ayeb Creative home" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/about");
  await page.getByRole("link", { name: "Inside the studio" }).click();
  await expect(page).toHaveURL(/\/about#values$/);
  await expect(page.locator("#values")).toBeInViewport();
});

test("every page has accessible headings, names, controls and contrast on desktop and mobile", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const routes = [
    "/",
    "/work",
    "/services",
    "/contact",
    "/about",
    ...orderedProjects.map((p) => `/work/${p.slug}`),
  ];
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const hierarchy = await page
        .locator("main h1,main h2,main h3")
        .evaluateAll((nodes) =>
          nodes.map((node) => Number(node.tagName.slice(1))),
        );
      expect(hierarchy[0], `${route} starts with h1`).toBe(1);
      for (let index = 1; index < hierarchy.length; index++) {
        expect(
          hierarchy[index] - hierarchy[index - 1],
          `${route} heading levels`,
        ).toBeLessThanOrEqual(1);
      }
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
        `${route} at ${width}px`,
      ).toEqual([]);
    }
  }
});
