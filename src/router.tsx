import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  console.log('[router.tsx] getRouter() called');
  return createAppRouter();
};

export const createAppRouter = () => {
  console.log('[router.tsx] createAppRouter() called');
  try {
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultPreload: false,
      defaultPreloadStaleTime: 0,
      basepath: "/",
    });
    console.log('[router.tsx] createAppRouter success');
    return router;
  } catch (e) {
    console.error('[router.tsx] createAppRouter failed:', e);
    throw e;
  }
};
