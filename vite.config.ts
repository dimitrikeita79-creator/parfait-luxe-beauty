import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const stripReactRefreshWrapper = {
  name: "strip-react-refresh-wrapper",
  enforce: "post",
  transform(code: string, id: string) {
    if (!/\.[tj]sx?$/.test(id)) return null;
    if (!code.includes("can't detect preamble")) return null;
    const idx = code.indexOf("$RefreshReg$(_c,");
    if (idx === -1) return null;
    return code.slice(0, idx);
  },
};

export default defineConfig({
  // @ts-ignore
  nitro: true,
  tanstackStart: {
    client: {
      entry: "entry.client",
    },
    server: {
      entry: "server",
    },
  },
  preview: {
    port: 4173,
  },
  resolve: {
    dedupe: ['@tanstack/react-store', '@tanstack/store'],
  },
  server: {
    hmr: false,
  },
  plugins: [stripReactRefreshWrapper],
});
