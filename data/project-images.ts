import manifest from "./project-images.json";

type ImageAsset = { src: string; width: number; height: number };
const assets: Record<string, Record<string, ImageAsset>> = manifest;

// Generated from the actual files before dev/build; no filesystem code in the client.
export function projectImage(slug: string, name: string): ImageAsset {
  const image = assets[slug]?.[name];
  if (!image) {
    throw new Error(
      `Missing portfolio image: public/projects/${slug}/${name}.jpg. Check the filename and run npm run images:sync.`,
    );
  }
  return image;
}
