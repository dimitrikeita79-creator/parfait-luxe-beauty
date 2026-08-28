import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassButton } from "@/components/GlassButton";
import { Toaster } from "@/components/Toaster";
import { CartProvider, useCart } from "@/context/CartContext";
import { AppShell } from "@/components/AppShell";
import { useBackButton } from "@/hooks/useBackButton";
import { RenderProvider } from "@/context/RenderContext";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import desmohairLogo from "../assets/DESMOHAIR.jpg";
import { ThemeProvider } from "@/context/ThemeContext";
import { supabase } from "@/backend/client";
import { localNotificationService } from "@/backend/services/local-notification.service";
import { pushNotificationService } from "@/backend/services/push-notification.service";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <GlassButton as={Link} to="/" variant="light" size="sm">
            Go home
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <GlassButton
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="gold"
            size="sm"
          >
            Try again
          </GlassButton>
          <GlassButton as="a" href="/" variant="light" size="sm">
            Go home
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#ffffff" },
      { name: "description", content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires." },
      { name: "author", content: "Desmohair" },
      { property: "og:title", content: "Desmohair — Salon Beauté Luxe Ouagadougou" },
      { property: "og:description", content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Desmohair — Salon Beauté Luxe Ouagadougou" },
      { name: "twitter:description", content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ff8fae22-db07-4bb9-bb26-615856da7f1a/id-preview-4134b9d1--478a0d4f-6199-4829-908b-4deecbe41996.lovable.app-1781518277219.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ff8fae22-db07-4bb9-bb26-615856da7f1a/id-preview-4134b9d1--478a0d4f-6199-4829-908b-4deecbe41996.lovable.app-1781518277219.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: desmohairLogo },
      { rel: "apple-touch-icon", href: desmohairLogo },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  loader: async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 2,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
        },
      },
    });
    return { queryClient };
  },
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <HeadContent />
      {children}
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | undefined>(undefined);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [showSplash, setShowSplash] = React.useState(true);
  const [splashPhase, setSplashPhase] = useState<"loading" | "welcome">("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useBackButton(() => {
    try {
      const history = (router as any).history;
      if (history && typeof history.canGoBack === "function" && history.canGoBack()) {
        history.back();
        return true;
      }
      if (typeof window !== "undefined" && window.location && window.location.pathname !== "/") {
        router.navigate({ to: "/" });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id);
      } catch {
        setUserId(undefined);
      } finally {
        setAuthLoading(false);
      }
    };
    void getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        void getUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void localNotificationService.ensurePermission();
    void pushNotificationService.register();
  }, []);

  useEffect(() => {
    setShowSplash(true);
    setSplashPhase("loading");
    let authUnsubscribe: (() => void) | undefined;

    const phase1 = setTimeout(() => {
      setSplashPhase("welcome");
    }, 1200);

    const hideWhenReady = () => {
      setTimeout(() => {
        setShowSplash(false);
      }, 800);
    };

    const minSplash = setTimeout(() => {
      if (!authLoading) {
        hideWhenReady();
      }
    }, 2200);

    const maxSplash = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    const waitForAuth = async () => {
      if (!authLoading) {
        return;
      }
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        if (!authLoading) {
          hideWhenReady();
        }
      });
      authUnsubscribe = () => subscription.unsubscribe();
    };

    void waitForAuth();

    return () => {
      clearTimeout(phase1);
      clearTimeout(minSplash);
      clearTimeout(maxSplash);
      if (authUnsubscribe) authUnsubscribe();
    };
  }, [authLoading, mounted]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white gpu-accelerated"
          >
            {splashPhase === "loading" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-[36px] shadow-luxe overflow-hidden">
                  <img src={desmohairLogo} alt="Desmohair" className="h-full w-full object-contain p-2" />
                </div>
                <h1 className="font-display mt-5 text-2xl font-semibold leading-tight">Desmohair</h1>
                <p className="mt-2 text-xs italic text-muted-foreground">{"Votre beauté, notre passion"}</p>
                <div className="mx-auto mt-6 flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: "0.12s" }} />
                  <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: "0.24s" }} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-center px-6"
              >
                <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-[36px] shadow-luxe overflow-hidden">
                  <img src={desmohairLogo} alt="Desmohair" className="h-full w-full object-contain p-2" />
                </div>
                <h2 className="font-display text-2xl font-semibold leading-tight">Bienvenue chez Desmohair</h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Laissez-nous révéler votre élégance naturelle.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!authLoading && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RenderProvider>
              <CartProvider userId={userId}>
                <AppShell>
                  <Outlet />
                </AppShell>
                <Toaster />
              </CartProvider>
            </RenderProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
