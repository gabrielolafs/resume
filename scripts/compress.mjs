

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { minify as minifyJS } from "terser";
import { transform as transformCSS } from "lightningcss";
import { minify as minifyHTML } from "html-minifier-terser";
import { optimize as optimizeSVG } from "svgo";

const OUT_DIR = process.argv[2] ?? "dist";

const HTML_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
};

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

async function compressFile(file, totals) {
  const ext = extname(file).toLowerCase();
  if (![".js", ".mjs", ".css", ".html", ".svg"].includes(ext)) return;

  const original = await readFile(file, "utf8");
  let output = original;

  try {
    if (ext === ".js" || ext === ".mjs") {
      const result = await minifyJS(original, { module: ext === ".mjs" });
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
  let files;
  try {
    files = await walk(OUT_DIR);
  } catch {
    console.error(`Could not read "${OUT_DIR}" — did the build run first?`);
    process.exit(1);
  }

  const totals = { before: 0, after: 0, count: 0 };
  for (const file of files) {
    await compressFile(file, totals);
  }

  const savedKB = ((totals.before - totals.after) / 1024).toFixed(1);
  const pct = totals.before
    ? (100 * (1 - totals.after / totals.before)).toFixed(1)
    : "0";
  console.log(`✓ Compressed ${totals.count} files — saved ${savedKB} KB (${pct}%)`);
}

main();
