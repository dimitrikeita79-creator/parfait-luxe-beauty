import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

let router: any = null;

export const getRouter = () => {
  if (!router) {
    router = createAppRouter();
  }
  return router;
};

export const createAppRouter = () => {
  try {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 1000 * 60,
        },
      },
    });
    const router = createRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultPreload: "intent",
      defaultPreloadStaleTime: 1000 * 60,
      basepath: "/",
    });
    return router;
  } catch (e) {
    console.error('[router.tsx] createAppRouter failed:', e);
    throw e;
  }
};
