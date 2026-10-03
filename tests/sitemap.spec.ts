import { test, expect } from "@playwright/test";
import { orderedProjects } from "../data/projects";
import { resolveSiteUrl, siteUrl } from "../lib/site-url";

const paths = [
  "/",
  "/work",
  "/services",
  "/about",
  "/contact",
  ...orderedProjects.map((project) => `/work/${project.slug}`),
];

test("canonical origin defaults to the live site and rejects malformed configuration", () => {
  expect(resolveSiteUrl()).toBe("https://ayebcreative.vercel.app");
  expect(resolveSiteUrl("  ")).toBe("https://ayebcreative.vercel.app");
  expect(resolveSiteUrl(" https://ayebcreative.vercel.app/ ")).toBe(
    "https://ayebcreative.vercel.app",
  );
  expect(resolveSiteUrl("https://verified-studio.example/")).toBe(
    "https://verified-studio.example",
  );

  for (const value of [
    "not a URL",
    "http://ayebcreative.vercel.app",
    "https://localhost:3000",
    "https://dev.localhost",
    "https://127.0.0.1:3000",
    "https://0.0.0.0",
    "https://[::1]",
    "https://ayebcreative.vercel.app/work",
    "https://ayebcreative.vercel.app/?preview=true",
    "https://ayebcreative.vercel.app/#top",
    "https://username:password@ayebcreative.vercel.app",
    "mailto:studio@example.com",
  ]) {
    expect(() => resolveSiteUrl(value)).toThrow("NEXT_PUBLIC_SITE_URL");
  }
});

test("sitemap is valid public XML and every entry resolves to its canonical page", async ({
  request,
  page,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(
    /^(application|text)\/xml(?:;|$)/,
  );
  expect(response.headers()["x-robots-tag"] || "").not.toMatch(/noindex/i);
  const xml = await response.text();
  const sitemap = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, "application/xml");
    return {
      parseError: document.querySelector("parsererror")?.textContent,
      root: document.documentElement.localName,
      namespace: document.documentElement.namespaceURI,
      entries: Array.from(
        document.querySelectorAll("urlset > url"),
        (entry) => ({
          locations: Array.from(
            entry.querySelectorAll("loc"),
            (loc) => loc.textContent,
          ),
          frequency: entry.querySelector("changefreq")?.textContent,
          priority: Number(entry.querySelector("priority")?.textContent),
        }),
      ),
    };
  }, xml);

  expect(sitemap.parseError).toBeUndefined();
  expect(sitemap.root).toBe("urlset");
  expect(sitemap.namespace).toBe("http://www.sitemaps.org/schemas/sitemap/0.9");
  expect(sitemap.entries).toHaveLength(paths.length);
  const locations = sitemap.entries.map((entry) => {
    expect(entry.locations).toHaveLength(1);
    expect(entry.frequency).toBe("monthly");
    expect(entry.priority).toBeGreaterThanOrEqual(0);
    expect(entry.priority).toBeLessThanOrEqual(1);
    return entry.locations[0]!;
  });
  expect(new Set(locations).size).toBe(paths.length);
  expect(locations.map((location) => new URL(location).href).sort()).toEqual(
    paths.map((path) => new URL(path, siteUrl).href).sort(),
  );

  for (const location of locations) {
    const url = new URL(location);
    expect(url.origin).toBe(siteUrl);
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
    const route = await request.get(url.pathname, { maxRedirects: 0 });
    expect(route.status(), url.pathname).toBe(200);
    const html = await route.text();
    const canonical = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, "text/html");
      return Array.from(
        document.querySelectorAll('link[rel="canonical"]'),
        (link) => link.getAttribute("href"),
      );
    }, html);
    expect(canonical, url.pathname).toHaveLength(1);
    expect(new URL(canonical[0]!).href, url.pathname).toBe(url.href);
  }

  // This catches user-agent-specific application responses, not IP-based bot rules.
  const crawlerResponse = await request.get("/sitemap.xml", {
    headers: { "User-Agent": "Googlebot" },
  });
  expect(crawlerResponse.status()).toBe(200);
  expect(await crawlerResponse.text()).toBe(xml);
});

test("robots allows crawling and advertises the canonical sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain(?:;|$)/);
  const robots = await response.text();
  expect(robots).toMatch(/^User-Agent: \*$/m);
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:\s*\S+/m);
  expect(robots.match(/^Sitemap: .+$/gm)).toEqual([
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ]);
});
