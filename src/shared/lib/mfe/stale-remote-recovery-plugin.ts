import type { ModuleFederationRuntimePlugin } from "@module-federation/runtime";
import { requestRemoteUpdateReload } from "./pending-update-reload";
import { isRemoteLoadFailure } from "./remote-load-failure";
import { recordFailedRemoteModule } from "./remote-modules";

// Registered on the host via `runtimePlugins` in vite.config.ts. It watches
// every failed remote load (remote entry, exposed module, or a remote's own
// chunk — exactly what happens when a remote was redeployed and the host still
// holds the old version) and asks the recovery manager for a one-shot auto
// reload. The failing remote name is recorded for the exhausted fallback's
// "go to module app" escape hatch. Returning `undefined` keeps the original
// error flowing to the route ErrorBoundary, which renders the update-aware
// fallback UI.
export default function staleRemoteRecoveryPlugin(): ModuleFederationRuntimePlugin {
  return {
    name: "stale-remote-recovery-plugin",
    async errorLoadRemote(args) {
      if (isRemoteLoadFailure(args.error)) {
        recordFailedRemoteModule(String(args.remote?.name ?? args.id ?? ""));
        requestRemoteUpdateReload();
      }
    },
  };
}
