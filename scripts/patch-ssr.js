import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const routeTreeFile = join(root, "src", "routeTree.gen.ts");

if (!existsSync(routeTreeFile)) {
  console.log("[prebuild] routeTree.gen.ts not found, skipping ssr patch");
  process.exit(0);
}

try {
  let content = readFileSync(routeTreeFile, "utf-8");
  if (content.includes("ssr: true")) {
    content = content.replace(/ssr:\s*true/g, "ssr: false");
    writeFileSync(routeTreeFile, content);
    console.log("[prebuild] Patched routeTree.gen.ts: ssr: true -> ssr: false");
  } else {
    console.log("[prebuild] routeTree.gen.ts already has ssr: false or no ssr flag found");
  }
} catch (e) {
  console.warn("[prebuild] Failed to patch routeTree.gen.ts:", e);
  process.exit(0);
}
