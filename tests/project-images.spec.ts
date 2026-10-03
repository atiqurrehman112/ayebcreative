import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { orderedProjects } from "../data/projects";
import { projectImage } from "../data/project-images";

const roles = [
  "cover",
  "hero",
  "identity",
  "application-01",
  "application-02",
  "detail-01",
  "detail-02",
  "social",
];

for (const project of orderedProjects) {
  test(`${project.title}: all eight current image files and optimized versions load`, async ({
    request,
  }) => {
    const folder = `public/projects/${project.slug}`;
    const filenames = await readdir(folder);
    for (const role of roles) {
      const image = projectImage(project.slug, role);
      const url = new URL(image.src, "http://localhost");
      const filename = decodeURIComponent(url.pathname.split("/").pop()!);
      // readdir comparison also catches casing mismatches on Windows.
      expect(filenames).toContain(filename);
      const source = await readFile(`${folder}/${filename}`);
      const revision = createHash("sha256")
        .update(source)
        .digest("hex")
        .slice(0, 12);
      expect(url.searchParams.get("v")).toBe(revision);
      const metadata = await sharp(source).metadata();
      expect(image.width).toBe(metadata.autoOrient.width);
      expect(image.height).toBe(metadata.autoOrient.height);
      const raw = await request.get(image.src);
      expect(raw.status(), image.src).toBe(200);
      expect(await raw.body()).toEqual(source);
      const optimized = await request.get(
        `/_next/image?url=${encodeURIComponent(image.src)}&w=640&q=75`,
      );
      expect(optimized.status(), `optimized ${image.src}`).toBe(200);
      const decoded = await sharp(await optimized.body())
        .raw()
        .toBuffer({ resolveWithObject: true });
      expect(decoded.info.width).toBe(640);
      expect(
        Math.abs(decoded.info.height - (640 * image.height) / image.width),
      ).toBeLessThanOrEqual(1);
    }
  });
}

for (const width of [375, 1440]) {
  test(`portfolio images decode and preserve compositions at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of [
      "/",
      "/work",
      ...orderedProjects.map((p) => `/work/${p.slug}`),
    ]) {
      expect((await page.goto(route))?.status()).toBe(200);
      const images = page.locator(".project-image img");
      await expect(images).toHaveCount(route === "/" ? 4 : 6);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        const result = await image.evaluate(async (node: HTMLImageElement) => {
          await node.decode();
          const box = node.getBoundingClientRect();
          return {
            width: box.width,
            height: box.height,
            ratio: box.width / box.height,
            naturalRatio: node.naturalWidth / node.naturalHeight,
            fit: getComputedStyle(node).objectFit,
          };
        });
        expect(result.width).toBeGreaterThan(0);
        expect(result.height).toBeGreaterThan(0);
        expect(Math.abs(result.ratio - result.naturalRatio)).toBeLessThan(0.01);
        if (!route.startsWith("/work/")) {
          expect(result.fit).toBe("contain");
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
