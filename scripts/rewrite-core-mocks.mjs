import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const analysis = JSON.parse(
  fs.readFileSync(".output/tests/unit/required-subpaths.json", "utf8"),
);
const byRelTest = new Map(analysis.map((a) => [a.test, a.subpaths]));

function findCallEnd(text, openParenIndex) {
  let depth = 0;
  let inStr = null;
  let inTmpl = false;
  let inLine = false;
  let inBlock = false;
  for (let i = openParenIndex; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inLine) {
      if (c === "\n") inLine = false;
      continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (inTmpl) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === "`") inTmpl = false;
      continue;
    }
    if (c === "/" && n === "/") {
      inLine = true;
      i++;
      continue;
    }
    if (c === "/" && n === "*") {
      inBlock = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "`") {
      inTmpl = true;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function indent(block, pad) {
  return block
    .split("\n")
    .map((line) => (line.trim() === "" ? line : pad + line))
    .join("\n");
}

function transform(content, subpaths) {
  let count = 0;
  let out = "";
  let searchFrom = 0;
  const NEEDLE = 'vi.mock("@railfinance/core"';
  let changes = 0;
  while (true) {
    const start = content.indexOf(NEEDLE, searchFrom);
    if (start === -1) break;
    const paren = content.indexOf("(", start);
    const end = findCallEnd(content, paren);
    if (end === -1) {
      out += content.slice(searchFrom, start + NEEDLE.length);
      searchFrom = start + NEEDLE.length;
      continue;
    }
    let callEnd = end + 1;
    if (content[callEnd] === ";") callEnd++;

    const inner = content.slice(paren + 1, end);
    const originalCall = content.slice(start, callEnd);
    const m = inner.match(/^\s*"@railfinance\/core"\s*,\s*([\s\S]*)$/);
    const factoryText = m ? m[1].trim() : "";

    const arrowMatch = factoryText.match(
      /^async\s*\(\s*importOriginal\s*\)\s*=>\s*\{([\s\S]*)\}$/,
    );

    let replacement;
    const fnName = count === 0 ? "__railfinanceCoreMock" : `__railfinanceCoreMock${count + 1}`;
    const baseIndent = "  ";
    if (arrowMatch) {
      let body = arrowMatch[1];
      body = body
        .replace(
          /importOriginal<typeof import\("@railfinance\/core"\)>\(\)/g,
          "importOriginal()",
        )
        .replace(
          /importOriginal<typeof import\('@railfinance\/core'\)>\(\)/g,
          "importOriginal()",
        );
      const bodyTrimmed = body.replace(/^\n/, "").replace(/\s+$/, "");
      const decl =
        `async function ${fnName}(\n` +
        `${baseIndent}importOriginal: () => Promise<Record<string, unknown>>,\n` +
        `) {\n` +
        indent(bodyTrimmed, baseIndent) +
        `\n}`;
      const mocks = [
        `vi.mock("@railfinance/core", ${fnName});`,
        ...subpaths.map((s) => `vi.mock("${s}", ${fnName});`),
      ].join("\n");
      replacement = `${decl}\n${mocks}`;
    } else {
      // Non importOriginal factory: duplicate the exact call for each subpath.
      const mocks = subpaths
        .map((s) => originalCall.replace('"@railfinance/core"', `"${s}"`))
        .join("\n");
      replacement = `${originalCall}${mocks ? "\n" + mocks : ""}`;
    }

    out += content.slice(searchFrom, start) + replacement;
    searchFrom = callEnd;
    count++;
    changes++;
  }
  out += content.slice(searchFrom);
  return { content: out, changes };
}

const targetFiles = process.argv.slice(2);
const list =
  targetFiles.length > 0
    ? targetFiles
    : analysis.map((a) => path.join(ROOT, a.test));

let modified = 0;
for (const abs of list) {
  const rel = path.relative(ROOT, abs);
  const subpaths = byRelTest.get(rel);
  if (!subpaths) {
    console.warn("skip (no analysis):", rel);
    continue;
  }
  const content = fs.readFileSync(abs, "utf8");
  const { content: next, changes } = transform(content, subpaths);
  if (changes === 0) {
    console.warn("no barrel mock found:", rel);
    continue;
  }
  fs.writeFileSync(abs, next);
  modified++;
}
console.log(`modified ${modified} file(s)`);
