import type { ViewId } from "./types";

export const VIEW_PATHS: Record<ViewId, string> = {
  showcase: "/showcase",
  mine: "/mine",
  queue: "/queue",
  analytics: "/analytics",
  admin: "/admin",
};

export function pathToView(pathname: string): ViewId | null {
  const entry = Object.entries(VIEW_PATHS).find(
    ([, path]) => path === pathname,
  );
  return entry ? (entry[0] as ViewId) : null;
}
