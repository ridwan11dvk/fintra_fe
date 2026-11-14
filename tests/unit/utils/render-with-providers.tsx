import * as UI from "@railfinance/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { MemoryRouter } from "react-router";

/** Creates a fresh QueryClient per test — disables retries to avoid hanging */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

/**
 * AppConfig used across tests. apiUrl matches the MSW handlers (BASE).
 */
export const testAppConfig: UI.AppConfig = {
  appName: "RailFinance",
  apiUrl: "http://localhost:3000",
  esaUrl: "https://esa-beta.kai.id",
  vapidKey: "",
  defaultPageType: "base",
};

/**
 * Some test files mock "(@railfinance)/ui" with partial factories, which removes
 * provider exports like AuthProvider/SidebarProvider/TooltipProvider. Fall back
 * to a passthrough component so the wrapper keeps working in both cases.
 */
function Passthrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const AuthProvider =
  "AuthProvider" in UI && typeof UI.AuthProvider === "function"
    ? UI.AuthProvider
    : Passthrough;
const SidebarProvider =
  "SidebarProvider" in UI && typeof UI.SidebarProvider === "function"
    ? UI.SidebarProvider
    : Passthrough;
const TooltipProvider =
  "TooltipProvider" in UI && typeof UI.TooltipProvider === "function"
    ? UI.TooltipProvider
    : Passthrough;
const AppConfigProvider =
  "AppConfigProvider" in UI && typeof UI.AppConfigProvider === "function"
    ? UI.AppConfigProvider
    : Passthrough;

type WrapperProps = {
  children: ReactNode;
  initialEntries?: string[];
};

const AuthContext =
  "AuthContext" in UI && UI.AuthContext ? UI.AuthContext : null;

/**
 * Permissive auth context value so library components (e.g. ActionButton with
 * a `permission` prop) render in tests. Many tests mock `useAuth` directly,
 * but library components read the context internally.
 */
const AuthContextValue: UI.AuthContextType = {
  user: {} as UI.AuthContextType["user"],
  token: null,
  roles: [],
  roleNames: [],
  permissions: [],
  isSuperAdmin: true,
  isAuthenticated: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  logout: async () => undefined,
  can: () => true,
  hasResource: () => true,
  hasModule: () => true,
  scheduleTokenRefresh: () => undefined,
  clearAuthState: () => undefined,
};

function AllProviders({
  children,
  initialEntries = ["/"],
}: Readonly<WrapperProps>) {
  const queryClient = useRef(createTestQueryClient()).current;

  let content: ReactNode = children;
  if (AuthContext && AuthContextValue) {
    content = (
      <AuthContext.Provider value={AuthContextValue}>
        {content}
      </AuthContext.Provider>
    );
  }

  return (
    <AppConfigProvider config={testAppConfig}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider>
            <TooltipProvider>
              <SidebarProvider>{content}</SidebarProvider>
            </TooltipProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </AppConfigProvider>
  );
}

/** Custom render with QueryClientProvider + MemoryRouter + AuthProvider pre-wired */
function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { initialEntries?: string[] },
) {
  const { initialEntries, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

/** Custom renderHook with QueryClientProvider + MemoryRouter pre-wired */
function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper"> & {
    initialEntries?: string[];
  },
) {
  const { initialEntries, ...hookOptions } = options ?? {};
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...hookOptions,
  });
}

export * from "@testing-library/react";
export { renderWithProviders as render, renderHookWithProviders as renderHook };
