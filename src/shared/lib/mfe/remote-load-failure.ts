// Markers of a failed Module Federation remote entry / remote chunk load:
// Vite surfaces a stale or unreachable dynamic import as
// `TypeError: Failed to fetch dynamically imported module: <url>`, while the
// MF runtime wraps the same failure as ScriptNetworkError / RUNTIME-00x before
// rethrowing it to our ErrorBoundary.
const REMOTE_LOAD_FAILURE_RE =
  /failed to fetch dynamically imported module|chunkloaderror|scriptnetworkerror|scriptexecutionerror|failed to fetch remote entry|remote entry load failed|\bruntime-\d{3,4}\b/i;

export function isRemoteLoadFailure(error: unknown): boolean {
  if (error instanceof Error) return REMOTE_LOAD_FAILURE_RE.test(error.message);
  if (typeof error === "string") return REMOTE_LOAD_FAILURE_RE.test(error);
  return false;
}
