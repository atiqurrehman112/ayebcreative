const productionOrigin = "https://ayebcreative.vercel.app";

/** One canonical origin for metadata, sitemap entries and robots.txt. */
export function resolveSiteUrl(configuredUrl?: string): string {
  const invalidOrigin = () =>
    new Error(
      "NEXT_PUBLIC_SITE_URL must be a public HTTPS origin, such as https://ayebcreative.vercel.app, without a path, query or fragment.",
    );

  let url: URL;
  try {
    url = new URL(configuredUrl?.trim() || productionOrigin);
  } catch {
    throw invalidOrigin();
  }

  if (
    url.protocol !== "https:" ||
    !url.hostname.includes(".") ||
    url.hostname.endsWith(".localhost") ||
    url.hostname === "0.0.0.0" ||
    url.hostname.startsWith("127.") ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw invalidOrigin();
  }

  // Normalize an optional trailing slash before paths are appended.
  return url.origin;
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
