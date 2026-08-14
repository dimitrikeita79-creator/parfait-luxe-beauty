import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

if (typeof document !== "undefined") {
  const safeAreaMeta = document.createElement("meta");
  safeAreaMeta.name = "viewport";
  safeAreaMeta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
  safeAreaMeta.setAttribute("data-safe-area", "true");
  if (document.head) {
    document.head.appendChild(safeAreaMeta);
  }
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
