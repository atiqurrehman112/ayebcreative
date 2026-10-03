import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Read-only for public assets. Keep exact filenames; normalize only lookup keys.
const root = new URL("../public/projects/", import.meta.url);
const output = new URL("../data/project-images.json", import.meta.url);
const manifest = {};
let count = 0;
for (const directory of (await readdir(root, { withFileTypes: true })).sort(
  (a, b) => a.name.localeCompare(b.name),
)) {
  if (!directory.isDirectory()) continue;
  const folder = new URL(`${encodeURIComponent(directory.name)}/`, root);
  const images = {};
  for (const filename of (await readdir(folder)).sort()) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(filename)) continue;
    const key = filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[ _]+/g, "-");
    if (images[key]) {
      throw new Error(
        `Ambiguous image role: ${directory.name}/${key}. Keep one source file for this role.`,
      );
    }
    const bytes = await readFile(new URL(encodeURIComponent(filename), folder));
    const metadata = await sharp(bytes).metadata();
    const dimensions = metadata.autoOrient ?? metadata;
    if (!dimensions.width || !dimensions.height) {
      throw new Error(
        `Cannot read image dimensions: ${directory.name}/${filename}`,
      );
    }
    const revision = createHash("sha256")
      .update(bytes)
      .digest("hex")
      .slice(0, 12);
    images[key] = {
      src: `/projects/${encodeURIComponent(directory.name)}/${encodeURIComponent(filename)}?v=${revision}`,
      width: dimensions.width,
      height: dimensions.height,
    };
    count++;
  }
  if (Object.keys(images).length) manifest[directory.name] = images;
}
const json = `${JSON.stringify(manifest, null, 2)}\n`;
const previous = await readFile(output, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
if (json !== previous) await writeFile(output, json);
console.log(
  `Indexed ${count} project images in ${fileURLToPath(output)}. Source files unchanged.`,
);
