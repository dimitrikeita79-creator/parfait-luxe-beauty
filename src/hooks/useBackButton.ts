import { useEffect, useCallback } from "react";
import { App } from "@capacitor/app";

export function useBackButton(handler: () => boolean | void) {
  const safeHandler = useCallback(() => {
    try {
      const result = handler();
      return result;
    } catch (e) {
      console.error("[useBackButton] handler error:", e);
      return false;
    }
  }, [handler]);

  useEffect(() => {
    let listenerPromise: Promise<{ remove: () => void }> | null = null;

    const setup = async () => {
      try {
        if (typeof App === "undefined" || typeof App.addListener !== "function") {
          console.warn("[useBackButton] App plugin not available");
          return;
        }
        listenerPromise = App.addListener("backButton", async () => {
          try {
            const anyApp = App as any;
            let handled = false;
            if (typeof anyApp.canGoBack === "function") {
              try {
                handled = await anyApp.canGoBack();
              } catch {
                handled = false;
              }
            }
            if (!handled) {
              try {
                await App.exitApp?.();
              } catch {
                // ignore
              }
              return;
            }
          } catch {
            // ignore
          }
          safeHandler();
        });
      } catch (e) {
        console.error("[useBackButton] setup error:", e);
      }
    };

    void setup();

    return () => {
      if (listenerPromise) {
        listenerPromise.then((l) => l.remove()).catch(() => {});
      }
    };
  }, [safeHandler]);
}
