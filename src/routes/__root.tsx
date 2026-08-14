import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassButton } from "@/components/GlassButton";
import { Toaster } from "@/components/Toaster";
import { CartProvider, useCart } from "@/context/CartContext";
import { AppShell } from "@/components/AppShell";

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
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="theme-light" suppressHydrationWarning>
      <head>
        <HeadContent />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="color-scheme" content="light" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [userId, setUserId] = React.useState<string | undefined>(undefined);
  const [authLoading, setAuthLoading] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(false);
  const [splashPhase, setSplashPhase] = useState<"loading" | "welcome">("loading");

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
  }, []);

  useEffect(() => {
    setShowSplash(true);
    const t1 = setTimeout(() => {
      setSplashPhase("welcome");
      const t2 = setTimeout(() => setShowSplash(false), 2600);
      return () => clearTimeout(t2);
    }, 2400);
    return () => clearTimeout(t1);
  }, []);

  return (
    <>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white gpu-accelerated"
        >
          <AnimatePresence mode="wait">
            {splashPhase === "loading" ? (
              <motion.div
                key="splash-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center gpu-accelerated"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                  className="mx-auto grid h-32 w-32 place-items-center rounded-[40px] shadow-luxe overflow-hidden"
                >
                  <img src={desmohairLogo} alt="Desmohair" className="h-full w-full object-contain p-2" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="font-display mt-6 text-3xl font-semibold leading-tight"
                >
                  Desmohair
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="mt-3 text-sm italic text-muted-foreground"
                >
                  {"Votre beauté, notre passion"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mx-auto mt-8 flex items-center justify-center gap-1"
                >
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="h-2 w-2 rounded-full bg-[var(--gold)]"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
                    className="h-2 w-2 rounded-full bg-[var(--gold)]"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                    className="h-2 w-2 rounded-full bg-[var(--gold)]"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="splash-welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center px-6 gpu-accelerated"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
                  className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft ring-1 ring-black/5 md:h-24 md:w-24"
                >
                  <img src={desmohairLogo} alt="Desmohair" className="h-full w-full object-contain p-0.5" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="font-display text-3xl font-semibold leading-tight"
                >
                  Bienvenue chez Desmohair
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-3 text-sm text-muted-foreground leading-relaxed"
                >
                  Laissez-nous révéler votre élégance naturelle.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {!authLoading && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <CartProvider userId={userId}>
              <AppShell>
                <Outlet />
              </AppShell>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
