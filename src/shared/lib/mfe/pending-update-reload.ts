import { isRemoteLoadFailure } from "./remote-load-failure";

// Tracks automatic reloads so a stale remote entry (host page loaded before a
// remote was redeployed / old remoteEntry.js still cached) heals by reloading
// into the latest host bundle, without ever looping: at most
// MAX_AUTO_RELOADS per session, rate-limited by RELOAD_COOLDOWN_MS so a remote
// that is genuinely down never bounces the user around. Manual reloads from
// the fallback count toward the same counter, and once the last attempt is
// older than RELOAD_DECAY_WINDOW_MS the counter resets, so a tab that failed
// long ago can recover automatically again instead of being stuck exhausted.
const RELOAD_STATE_KEY = "fintra.mf.updateReload";
const MAX_AUTO_RELOADS = 2;
const RELOAD_COOLDOWN_MS = 30_000;
const RELOAD_BANNER_DELAY_MS = 1_200;
const RELOAD_DECAY_WINDOW_MS = 5 * 60_000;

const UPDATE_BANNER_ID = "fintra-mf-update-banner";

function defaultReloadPage(): void {
  globalThis.location.reload();
}

let reloadPage = defaultReloadPage;

// Test seam: swap the reload action out instead of stubbing jsdom
// `location.reload` (its property is non-configurable).
export function setReloadPage(impl: () => void): void {
  reloadPage = impl;
}

export function resetReloadPage(): void {
  reloadPage = defaultReloadPage;
}

interface ReloadState {
  count: number;
  at: number;
}

function readReloadState(): ReloadState {
  try {
    const raw = sessionStorage.getItem(RELOAD_STATE_KEY);
    if (!raw) return { count: 0, at: 0 };
    const parsed = JSON.parse(raw) as Partial<ReloadState> | null;
    return {
      count: typeof parsed?.count === "number" ? parsed.count : 0,
      at: typeof parsed?.at === "number" ? parsed.at : 0,
    };
  } catch {
    return { count: 0, at: 0 };
  }
}

function writeReloadState(state: ReloadState): void {
  try {
    sessionStorage.setItem(RELOAD_STATE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable (Safari private mode); reload simply
    // proceeds ungated — the guard is only there to prevent reload loops.
  }
}

function showUpdateBanner(): void {
  if (document.getElementById(UPDATE_BANNER_ID)) return;
  const banner = document.createElement("div");
  banner.id = UPDATE_BANNER_ID;
  banner.textContent =
    "A new version of Railfinance is available. Reloading automatically…";
  Object.assign(banner.style, {
    position: "fixed",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "99999",
    maxWidth: "24rem",
    padding: "0.6rem 1.1rem",
    borderRadius: "0.75rem",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontFamily:
      "'Inter Variable', ui-sans-serif, system-ui, sans-serif, sans-serif",
    fontSize: "0.8125rem",
    lineHeight: "1.4",
    textAlign: "center",
    boxShadow: "0 10px 30px rgb(15 23 42 / 0.3)",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(banner);
}

function resolveAttemptState(now: number): ReloadState {
  const state = readReloadState();
  if (state.count > 0 && now - state.at >= RELOAD_DECAY_WINDOW_MS) {
    return { count: 0, at: 0 };
  }
  return state;
}

export interface RemoteUpdateReloadStatus {
  attempts: number;
  exhausted: boolean;
}

// Read-only view for callers (e.g. the fallback UI) to explain the situation
// to the user instead of promising another automatic reload.
export function readRemoteUpdateReloadStatus(): RemoteUpdateReloadStatus {
  const state = resolveAttemptState(Date.now());
  return {
    attempts: state.count,
    exhausted: state.count >= MAX_AUTO_RELOADS,
  };
}

// Records a user-initiated reload (the manual button in the fallback), so
// repeated manual attempts also count toward the exhausted state.
export function recordRemoteUpdateManualReload(): void {
  const now = Date.now();
  const state = resolveAttemptState(now);
  writeReloadState({ count: state.count + 1, at: now });
}

export function requestRemoteUpdateReload(): boolean {
  const now = Date.now();
  const state = resolveAttemptState(now);
  if (state.count >= MAX_AUTO_RELOADS) return false;
  if (state.count > 0 && now - state.at < RELOAD_COOLDOWN_MS) return false;

  writeReloadState({ count: state.count + 1, at: now });
  showUpdateBanner();
  globalThis.setTimeout(() => {
    reloadPage();
  }, RELOAD_BANNER_DELAY_MS);
  return true;
}

export function installRemoteLoadFailureRecovery(): () => void {
  const onUnhandledRejection = (event: PromiseRejectionEvent): void => {
    if (isRemoteLoadFailure(event.reason)) {
      requestRemoteUpdateReload();
    }
  };
  const onError = (event: ErrorEvent): void => {
    if (isRemoteLoadFailure(event.message)) {
      requestRemoteUpdateReload();
    }
  };
  globalThis.window.addEventListener(
    "unhandledrejection",
    onUnhandledRejection,
  );
  globalThis.window.addEventListener("error", onError);
  return () => {
    globalThis.window.removeEventListener(
      "unhandledrejection",
      onUnhandledRejection,
    );
    globalThis.window.removeEventListener("error", onError);
  };
}
