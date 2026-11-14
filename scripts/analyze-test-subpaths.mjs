import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const failed = JSON.parse(
  fs.readFileSync(".output/tests/unit/failed-tests.json", "utf8"),
);
const testFiles = [...new Set(failed.map((t) => t.testFile))];

const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx"];

function resolveModule(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const e of exts) {
    const p = base + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

const IMPORT_RE =
  /(?:from\s+|import\s*\(\s*|import\s+|require\s*\(\s*)["']([^"']+)["']/g;

function coreSubpathsForEntry(entry) {
  const seen = new Set();
  const subpaths = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of content.matchAll(IMPORT_RE)) {
      const spec = m[1];
      if (spec.startsWith("@railfinance/core/")) {
        subpaths.add(spec);
      } else if (spec.startsWith("@/") || spec.startsWith(".")) {
        const r = resolveModule(spec, file);
        if (r) stack.push(r);
      }
    }
  }
  return subpaths;
}

const out = [];
for (const tf of testFiles) {
  const content = fs.readFileSync(tf, "utf8");
  const entries = [];
  for (const m of content.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith("@/")) {
      const r = resolveModule(spec, tf);
      if (r) entries.push(r);
    }
  }
  const subs = new Set();
  for (const e of entries) for (const s of coreSubpathsForEntry(e)) subs.add(s);
  out.push({
    test: path.relative(ROOT, tf),
    entries: entries.map((e) => path.relative(ROOT, e)),
    subpaths: [...subs].sort(),
  });
}

fs.writeFileSync(
  ".output/tests/unit/required-subpaths.json",
  JSON.stringify(out, null, 2),
);

const sizes = out.map((o) => o.subpaths.length);
const total = sizes.reduce((a, b) => a + b, 0);
const all = new Set(out.flatMap((o) => o.subpaths));
console.log("test files:", out.length);
console.log("avg subpaths/file:", (total / out.length).toFixed(1));
console.log("max:", Math.max(...sizes), "min:", Math.min(...sizes));
console.log("union of needed subpaths:", all.size);
console.log([...all].sort().join("\n"));
console.log("\n--- files with 0 subpaths (need manual look) ---");
out.filter((o) => o.subpaths.length === 0).forEach((o) => console.log(o.test, "entries:", o.entries.join(", ")));
