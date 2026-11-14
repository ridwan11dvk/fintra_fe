import { DASHBOARD_URL } from "@/features/dashboard/data/dashboard.utils";
import {
  readRemoteUpdateReloadStatus,
  recordRemoteUpdateManualReload,
  requestRemoteUpdateReload,
} from "@/shared/lib/mfe/pending-update-reload";
import { isRemoteLoadFailure } from "@/shared/lib/mfe/remote-load-failure";
import { resolveFailedRemoteModuleApp } from "@/shared/lib/mfe/remote-modules";
import { Button } from "@railfinance/core/ui/button";
import { AlertTriangleIcon, RefreshCwIcon, ServerOffIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Component } from "react";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: Readonly<ErrorFallbackProps>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangleIcon className="h-16 w-16 text-red-600" />
      <h2 className="text-2xl font-semibold text-gray-900">
        Something went wrong
      </h2>
      <p className="max-w-md text-gray-600">
        An unexpected error happened while loading this page. Please try again.
      </p>
      <pre className="max-w-md text-left text-sm bg-gray-100 p-3 rounded text-gray-800 wrap-break-word overflow-auto">
        {error.message}
      </pre>
      <div className="flex gap-2">
        <Button onClick={resetErrorBoundary} variant="default">
          Try again
        </Button>
        <Button
          onClick={() => globalThis.location.assign(DASHBOARD_URL)}
          variant="outline"
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

// Shown when a remote module / remote chunk failed to load — usually because
// the host session predates a remote redeploy. The stale-remote recovery is
// already scheduled (auto reload from the MF runtime plugin or the global
// listener); this fallback explains what is happening. "Reload application"
// covers the rare case where the automatic reload was skipped (cooldown spent),
// and counts the attempt so repeated manual retries are also tracked. When the
// attempts are exhausted (the message keeps coming back after several
// reloads), the remote server is likely down or unreachable, so the copy
// switches to an "update server unreachable" explanation instead of promising
// another automatic reload. In that state the user can also open the failing
// module's standalone app directly (origin resolved from the module's
// VITE_..._ENTRY_URL env var) when the module can be identified.
function RemoteUpdateFallback({
  resetErrorBoundary,
  error,
}: Readonly<{
  resetErrorBoundary: () => void;
  error: Error;
}>) {
  const exhausted = readRemoteUpdateReloadStatus().exhausted;
  const moduleApp = exhausted ? resolveFailedRemoteModuleApp(error) : null;
  const UpdateStatusIcon = exhausted ? ServerOffIcon : RefreshCwIcon;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <UpdateStatusIcon
        className={
          exhausted ? "h-16 w-16 text-red-600" : "h-16 w-16 text-blue-600"
        }
      />
      <h2 className="text-2xl font-semibold text-gray-900">
        {exhausted ? "Trouble loading the update" : "New version available"}
      </h2>
      <p className="max-w-md text-gray-600">
        {exhausted
          ? "The application reloaded several times but still could not load the latest version. The update server may be down or unreachable. Please try again in a few minutes."
          : "The application was updated in the background. Reloading automatically to get the latest version… If this message stays, reload manually below."}
      </p>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            recordRemoteUpdateManualReload();
            resetErrorBoundary();
          }}
          variant="default"
        >
          Reload application
        </Button>
        {moduleApp && (
          <Button
            onClick={() => globalThis.location.assign(moduleApp.appOrigin)}
            variant="outline"
          >
            Go to {moduleApp.module} app
          </Button>
        )}
        <Button
          onClick={() => globalThis.location.assign(DASHBOARD_URL)}
          variant="outline"
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, info: { componentStack?: string }) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack?: string } | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    this.setState((prev) => ({ ...prev, errorInfo: errorInfo }));
    if (isRemoteLoadFailure(error)) {
      requestRemoteUpdateReload();
    }
    this.props.onError?.(error, errorInfo);
  }

  private readonly handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error!;
      if (isRemoteLoadFailure(error)) {
        return (
          <RemoteUpdateFallback
            resetErrorBoundary={this.handleReset}
            error={error}
          />
        );
      }
      const Fallback = this.props.fallback ?? ErrorFallback;
      return <Fallback error={error} resetErrorBoundary={this.handleReset} />;
    }

    return this.props.children;
  }
}
