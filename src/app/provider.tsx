import {
  AppConfigProvider,
  AuthProvider,
  I18nextProvider,
  LayoutProvider,
  PageProvider,
  QueryProvider,
  ThemeProvider,
  resolveApiUrl,
  type AppConfig,
} from "@railfinance/core";
import { SidebarProvider } from "@railfinance/core/ui/sidebar";
import { TooltipProvider } from "@railfinance/core/ui/tooltip";

import { guestNavLinks } from "./nav-items";

const defaultApiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

const customApiUrls: AppConfig["customApiUrls"] = [
  {
    key: "base",
    url: defaultApiUrl,
  },
  {
    key: "tax",
    url:
      import.meta.env.VITE_TAX_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
  {
    key: "payable",
    url:
      import.meta.env.VITE_PAYABLE_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
  {
    key: "receivable",
    url:
      import.meta.env.VITE_RECEIVABLE_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
  {
    key: "treasury",
    url:
      import.meta.env.VITE_TREASURY_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
  {
    key: "reporting",
    url:
      import.meta.env.VITE_REPORTING_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
  {
    key: "monitoring",
    url:
      import.meta.env.VITE_MONITORING_API_BASE_URL ??
      import.meta.env.VITE_API_BASE_URL ??
      null,
  },
];

const appConfig: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || "RailFinance",
  // Resolve the module API from the URL the app was opened with, so a direct
  // page load (e.g. /payable/...) starts on the right API instead of the
  // default one.
  apiUrl:
    resolveApiUrl(
      globalThis.location?.pathname ?? "",
      customApiUrls,
      defaultApiUrl,
    ) ?? defaultApiUrl,
  defaultApiUrl,
  customApiUrls,
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  esaUrl: import.meta.env.VITE_ESA_URL || "https://esa-beta.kai.id",
  vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || "",
  defaultPageType: "base",
  onLoginSuccess: () => (globalThis.location.href = "/select-module"),
};

export function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <I18nextProvider>
      <AppConfigProvider config={appConfig}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="light">
              <LayoutProvider
                guestHeaderNavItem={guestNavLinks}
                guestFooterNavItem={guestNavLinks}
                // mainNavItems={mainNavItems}
                // navItems={navItems}
              >
                <PageProvider>
                  <SidebarProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                  </SidebarProvider>
                </PageProvider>
              </LayoutProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </AppConfigProvider>
    </I18nextProvider>
  );
}

export default Provider;
