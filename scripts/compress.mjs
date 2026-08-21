import { readdir, readFile, writeFile, stat, unlink, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { minify as minifyJS } from "terser";
import { transform as transformCSS } from "lightningcss";
import { minify as minifyHTML } from "html-minifier-terser";
import { optimize as optimizeSVG } from "svgo";

const MODE = process.argv[2] ?? "compress";
const OUT_DIR = process.argv[3] ?? "dist";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const MAGICK = join(SCRIPT_DIR, "../bin/magick");

const EXTRA_SCRIPTS = [
  { label: "article images webp conversion", file: "reduce_img_article.sh" },
  { label: "chanel images webp conversion", file: "reduce_img_chanel.sh" },
  { label: "article image-extension replace", file: "replace_img_ext_md.sh" },
  { label: "chanel image-extension replace", file: "replace_img_ext_json.sh" },
];

const HTML_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
};

function runExtraScripts() {
  for (const { label, file } of EXTRA_SCRIPTS) {
    const scriptPath = join(SCRIPT_DIR, file);
    if (!existsSync(scriptPath)) {
      console.warn(`Skipped ${label}: ${scriptPath} not found`);
      continue;
    }

    console.log(`Running ${label}...`);

    const result = spawnSync("sh", [scriptPath], { stdio: "inherit" });

    if (result.error) {
      console.warn(`  ! ${label} failed to start: ${result.error.message}`);
    } else if (result.status !== 0) {
      console.warn(`  ! ${label} exited with code ${result.status}`);
    }
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }

  return files;
}

async function compressWebP(file, totals) {
  if (!existsSync(MAGICK)) {
    console.warn(`  ! ImageMagick binary not found: ${MAGICK}`);
    return;
  }

  const originalSize = (await stat(file)).size;
  const tempFile = `${file}.compress.tmp.webp`;

  try {
    const result = spawnSync(
      MAGICK,
      [
        file,
        "-quality",
        "90",
        tempFile,
      ],
      { stdio: "ignore" }
    );

    if (
      result.error ||
      result.status !== 0 ||
      !existsSync(tempFile)
    ) {
      console.warn(`  ! skipped ${file}: ImageMagick failed`);
      return;
    }

    const compressedSize = (await stat(tempFile)).size;

    // Only replace the WebP if compression actually made it smaller.
    if (compressedSize < originalSize) {
      await rename(tempFile, file);

      totals.before += originalSize;
      totals.after += compressedSize;
      totals.count += 1;

      console.log(
        `  ▶ ${file} (before: ${Math.round(originalSize / 1024)}kB, after: ${Math.round(compressedSize / 1024)}kB)`
      );
    } else {
      await unlink(tempFile);

      console.log(
        `  ─ ${file} kept (before: ${Math.round(originalSize / 1024)}kB, candidate: ${Math.round(compressedSize / 1024)}kB)`
      );
    }
  } catch (err) {
    console.warn(`  ! skipped ${file}: ${err.message}`);

    if (existsSync(tempFile)) {
      await unlink(tempFile).catch(() => {});
    }
  }
}


async function compressFile(file, totals) {
  const ext = extname(file).toLowerCase();

  // WebP is handled separately.
  if (ext === ".webp") {
    await compressWebP(file, totals);
    return;
  }

  if (![".js", ".mjs", ".css", ".html", ".svg"].includes(ext)) return;

  const original = await readFile(file, "utf8");
  let output = original;

  try {
    if (ext === ".js" || ext === ".mjs") {
      const result = await minifyJS(original, {
        module: ext === ".mjs",
      });

      if (result.code) output = result.code;
    } else if (ext === ".css") {
      const { code } = transformCSS({
        filename: file,
        code: Buffer.from(original),
        minify: true,
      });

      output = code.toString();
    } else if (ext === ".html") {
      output = await minifyHTML(original, HTML_OPTIONS);
    } else if (ext === ".svg") {
      const result = optimizeSVG(original, { path: file });

      if (result.data) output = result.data;
    }
  } catch (err) {
    console.warn(`  ! skipped ${file}: ${err.message}`);
    return;
  }

  if (output.length < original.length) {
    await writeFile(file, output, "utf8");

    totals.before += original.length;
    totals.after += output.length;
    totals.count += 1;
  }
}

async function main() {
  if (MODE === "prepare") {
    runExtraScripts();
    return;
  }

  if (MODE !== "compress") {
    console.error(`Unknown mode: ${MODE}`);
    process.exit(1);
  }

  let files;

  try {
    files = await walk(OUT_DIR);
  } catch {
    console.error(`Could not read "${OUT_DIR}" — did the build run first?`);
    process.exit(1);
  }

  const totals = {
    before: 0,
    after: 0,
    count: 0,
  };

  for (const file of files) {
    await compressFile(file, totals);
  }

  const savedKB = ((totals.before - totals.after) / 1024).toFixed(1);

  const pct = totals.before
    ? (100 * (1 - totals.after / totals.before)).toFixed(1)
    : "0";

  console.log(
    `Compressed ${totals.count} files — saved ${savedKB} KB (${pct}%)`
  );
}

main();
