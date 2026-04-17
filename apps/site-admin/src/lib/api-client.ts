/**
 * Thin fetch wrapper that, in static-export mode, redirects GET /api/*
 * reads to pre-baked JSON snapshots under /data/*.json (written by
 * scripts/build-cms-data.mjs). Writes (POST/PUT/DELETE) still go through
 * but the admin store uses localStorage fallback in static mode.
 */

export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Map `/api/*` GET endpoints to their static-snapshot JSON files. */
function rewriteToSnapshot(url: string): string | null {
  const [pathname] = url.split("?");

  // Whole-collection reads → snapshot file
  const map: Record<string, string> = {
    "/api/pages": "/data/pages.json",
    "/api/experts": "/data/experts.json",
    "/api/testimonials": "/data/testimonials.json",
    "/api/partnerships": "/data/partnerships.json",
    "/api/partner-logos": "/data/partner-logos.json",
  };
  if (pathname in map) return BASE_PATH + map[pathname];

  // Single-item reads: we serve them by filtering the collection snapshot on
  // the client, so any single-item URL here returns null and the caller can
  // decide (currently no client code GETs a single item — all reads use list).
  return null;
}

/** Build a stub Response for disabled write operations in static mode. */
function staticStub(): Response {
  return new Response(
    JSON.stringify({ ok: false, demo: true, message: "Demo mode — changes are not persisted" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

/** Drop-in replacement for fetch() against /api/*. Static-mode aware. */
export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  if (!IS_STATIC) return fetch(url, init);

  const method = (init?.method || "GET").toUpperCase();
  if (method === "GET") {
    const snap = rewriteToSnapshot(url);
    if (snap) return fetch(snap, init);
    // Unknown GET endpoint → empty
    return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // Writes are no-ops in demo mode (the store handles local optimistic state).
  return staticStub();
}
