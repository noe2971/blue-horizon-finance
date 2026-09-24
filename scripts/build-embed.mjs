// Builds a single self-contained HTML fragment (inline CSS + JS) for hosts that
// only accept one file, such as a claude.ai artifact. Output: dist-embed/subslayer.html
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const out = "dist-embed";
execSync(`npx vite build --base ./ --outDir ${out} --emptyOutDir`, {
  stdio: "inherit",
  env: { ...process.env, VITE_ROUTER: "memory" },
});

const assets = path.join(out, "assets");
const read = (ext) =>
  fs.readdirSync(assets).filter((f) => f.endsWith(ext)).map((f) => fs.readFileSync(path.join(assets, f), "utf8"));
// Escape "</script" so inlined code can't terminate its own tag.
const js = read(".js").join("\n").replace(/<\/script/gi, "<\\/script");
const css = read(".css").join("\n");

const html = `<title>SubSlayer</title>
<meta name="description" content="Find every subscription you're paying for and how to cancel it.">
<style>
:root { color-scheme: dark; }
html, body { background: #020617; color: #f1f5f9; }
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
fs.writeFileSync(path.join(out, "subslayer.html"), html);
console.log(`Wrote ${out}/subslayer.html (${(html.length / 1024).toFixed(0)} KB)`);
