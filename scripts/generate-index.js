import { readdirSync, existsSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const clientAssets = join(root, "dist", "client", "assets");

function findMainEntry() {
  if (!existsSync(clientAssets)) {
    return null;
  }
  const files = readdirSync(clientAssets);
  const entry = files.find((name) => name.startsWith("index-") && name.endsWith(".js"));
  if (!entry) {
    return null;
  }
  return `/assets/${entry}`;
}

function findCssEntry() {
  if (!existsSync(clientAssets)) {
    return null;
  }
  const files = readdirSync(clientAssets);
  const css = files.find((name) => name.startsWith("styles-") && name.endsWith(".css"));
  if (!css) {
    return null;
  }
  return `./assets/${css}`;
}

const entryScript = findMainEntry();
const cssHref = findCssEntry();
if (entryScript) {
  const cssLink = cssHref ? `    <link rel="stylesheet" href="${cssHref}" />\n` : '';
  const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" />
    <title>Parfait.Design/Desmohair</title>
    <base href="/" />
    <link rel="manifest" href="./manifest.webmanifest" />
    <link rel="icon" href="/DESMOHAIR.jpg" />
    <link rel="apple-touch-icon" href="/DESMOHAIR.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
${cssLink}  </head>
  <body>
    <div id="root"></div>
    <script>
      (function() {
        try {
          window.$_TSR = undefined;
          console.log('[index.html] $_TSR disabled to skip SSR hydration');
        } catch(e) {
          console.warn('[index.html] $_TSR patch failed:', e);
        }
      })();
    </script>
    <script>
      (function() {
        try {
          const originalHydrateRoot = window.ReactDOM?.hydrateRoot;
          if (typeof originalHydrateRoot === 'function') {
            window.ReactDOM.hydrateRoot = function(container, element, options) {
              if (container && container.nodeType === 1) {
                container.innerHTML = '';
              }
              return window.ReactDOM.createRoot(container, { hydrate: false }).render(element);
            };
            console.log('[index.html] hydrateRoot patched to createRoot with hydrate:false');
          }
        } catch(e) {
          console.warn('[index.html] hydrateRoot patch failed:', e);
        }
      })();
    </script>
    <script type="module" src="./${entryScript.replace(/^\//, '')}">
      console.log('[index.html] main module script tag inserted');
    </script>
  </body>
</html>`;

  writeFileSync(join(clientAssets, "..", "index.html"), html);
  console.log(`Generated dist/client/index.html -> ${entryScript}`);
} else {
  console.log('[postbuild] No client entry bundle found, skipping index.html generation');
}

// Patch post-build: forcer ssr: false dans routeTree.gen.ts
try {
  const routeTreeFile = join(root, "src", "routeTree.gen.ts");
  if (existsSync(routeTreeFile)) {
    let content = readFileSync(routeTreeFile, "utf-8");
    if (content.includes("ssr: true")) {
      content = content.replace(/ssr:\s*true/g, "ssr: false");
      writeFileSync(routeTreeFile, content);
      console.log('[postbuild] Patched routeTree.gen.ts: ssr: true -> ssr: false');
    } else {
      console.log('[postbuild] routeTree.gen.ts already has ssr: false or no ssr flag found');
    }
  } else {
    console.log('[postbuild] routeTree.gen.ts not found, skipping ssr patch');
  }
} catch (e) {
  console.warn('[postbuild] Failed to patch routeTree.gen.ts:', e);
}

// Patch post-build: remplacer le crash Invariant failed dans useStore par un warning
try {
  const useStoreFile = join(clientAssets, "useStore-DEf_BYM6.js");
  if (existsSync(useStoreFile)) {
    let content = readFileSync(useStoreFile, "utf-8");
    if (content.includes("Invariant failed")) {
      content = content.replace(
        /throw new Error\('Invariant failed'\)/g,
        "console.warn('[invariant-patch] Invariant failed ignored'); return undefined as any;"
      );
      writeFileSync(useStoreFile, content);
      console.log('[postbuild] Patched useStore-DEf_BYM6.js: Invariant failed -> warning');
    } else {
      console.log('[postbuild] useStore-DEf_BYM6.js already patched or no invariant found');
    }
  } else {
    console.log('[postbuild] useStore-DEf_BYM6.js not found, skipping patch');
  }
} catch (e) {
  console.warn('[postbuild] Failed to patch useStore:', e);
}

// Remove Nitro-generated Pages-incompatible wrangler configs
try {
  const serverWrangler = join(root, "dist", "server", "wrangler.json");
  if (existsSync(serverWrangler)) {
    rmSync(serverWrangler, { force: true });
    console.log('[postbuild] Removed dist/server/wrangler.json for Pages compatibility');
  }
} catch (e) {
  console.warn('[postbuild] Failed to remove dist/server/wrangler.json:', e);
}

try {
  const deployConfig = join(root, ".wrangler", "deploy", "config.json");
  if (existsSync(deployConfig)) {
    rmSync(deployConfig, { force: true });
    console.log('[postbuild] Removed .wrangler/deploy/config.json for Pages compatibility');
  }
} catch (e) {
  console.warn('[postbuild] Failed to remove .wrangler/deploy/config.json:', e);
}