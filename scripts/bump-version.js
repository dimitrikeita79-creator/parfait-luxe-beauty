import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const buildGradlePath = join(root, "android", "app", "build.gradle");

function bumpVersionCode() {
  const content = readFileSync(buildGradlePath, "utf-8");
  const match = content.match(/versionCode\s+(\d+)/);
  if (!match) {
    console.log("[bump-version] No versionCode found in build.gradle");
    return;
  }
  const current = Number(match[1]);
  const next = current + 1;
  const updated = content.replace(/versionCode\s+\d+/, `versionCode ${next}`);
  writeFileSync(buildGradlePath, updated);
  console.log(`[bump-version] versionCode ${current} -> ${next}`);
}

bumpVersionCode();
