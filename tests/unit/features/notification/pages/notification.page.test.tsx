import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
      ),
      Card: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="card">{children}</div>
      ),
      CardContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="card-content">{children}</div>
      ),

      PageHeader: ({ title }: { title?: string }) => (
        <div data-testid="page-header">{title}</div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/scroll-area", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("@/features/notification/components/notification-content", () => ({
  NotificationContent: () => <div data-testid="notification-content" />,
}));

import { NotificationPage } from "@/features/notification/pages/notification.page";

describe("NotificationPage", () => {
  it("renders without crashing", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders page title in header", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Notifications",
    );
  });

  it("renders NotificationContent component", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("notification-content")).toBeInTheDocument();
  });
});
