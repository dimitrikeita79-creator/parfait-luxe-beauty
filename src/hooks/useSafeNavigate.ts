import { useCallback } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

export { Link, useRouterState };

export function useSafeNavigate() {
  const navigate = useNavigate();
  const routerState = useRouterState();

  return useCallback(
    (opts: Parameters<typeof navigate>[0]) => {
      if (!routerState) return;
      navigate(opts);
    },
    [navigate, routerState],
  );
}
