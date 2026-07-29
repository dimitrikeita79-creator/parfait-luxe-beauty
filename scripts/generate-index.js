import { readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const clientAssets = join(root, "dist", "client", "assets");
const distRoot = join(root, "dist");

function findMainEntry() {
  if (!existsSync(clientAssets)) {
    throw new Error(`Client assets folder not found: ${clientAssets}`);
  }
  const files = readdirSync(clientAssets);
  const entry = files.find((name) => name.startsWith("index-") && name.endsWith(".js"));
  if (!entry) {
    throw new Error("Main client entry bundle not found in dist/client/assets");
  }
  return `/assets/${entry}`;
}

const entryScript = findMainEntry();
const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" />
    <title>Parfait.Design/Desmohair</title>
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/logo.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entryScript}"></script>
  </body>
</html>`;

import { writeFileSync } from "node:fs";
writeFileSync(join(distRoot, "index.html"), html);
console.log(`Generated dist/index.html -> ${entryScript}`);
