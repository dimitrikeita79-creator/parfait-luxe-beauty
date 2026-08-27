import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const clientIndex = join(root, "dist", "client", "index.html");
const projectRoot = process.cwd();
const rootIndex = join(projectRoot, "index.html");

const SHELL_FALLBACK = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" />
    <title>Parfait.Design/Desmohair</title>
    <link rel="manifest" href="./manifest.webmanifest" />
    <link rel="icon" href="./logo.ico" />
  </head>
  <body style="margin:0;padding:0;background:#ffffff;">
    <div id="root"></div>
  </body>
</html>`;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      if (existsSync(rootIndex)) {
        let html = readFileSync(rootIndex, "utf-8");
        if (!html.includes("window.$_TSR = undefined")) {
          html = html.replace(
            "<script type=\"module\"",
            "<script>\n      window.$_TSR = undefined;\n      console.log('[server.ts] $_TSR disabled to skip SSR hydration');\n    </script>\n    <script type=\"module\""
          );
        }
        if (!html.includes("injectIntoGlobalHook")) {
          html = html.replace(
            "<script type=\"module\"",
            "<script type=\"module\" src=\"/@react-refresh\"></script>\n    <script>\n      window.$RefreshReg$ = () => {};\n      window.$RefreshSig$ = () => (type) => type;\n    </script>\n    <script type=\"module\""
          );
        }
        
        const cacheAge = url.searchParams.has("dev") ? "no-cache" : "max-age=60, s-maxage=300, stale-while-revalidate=60";
        
        return new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": cacheAge,
            "x-edge-cache": "HIT",
          },
        });
      }

      return new Response(SHELL_FALLBACK, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "max-age=60, s-maxage=300, stale-while-revalidate=60",
        },
      });
    }

    return new Response(renderErrorPage(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
