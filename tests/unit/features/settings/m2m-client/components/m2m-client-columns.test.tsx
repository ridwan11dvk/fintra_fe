import { createM2mClientColumns } from "@/features/settings/m2m-client/components/m2m-client-columns";
import type { M2mClient } from "@/features/settings/m2m-client/data/m2m-client.types";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: () => true,
        hasResource: () => true,
        permissions: [],
        roles: [],
        user: {},
        token: null,
        isSuperAdmin: false,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
        logout: vi.fn(),
        scheduleTokenRefresh: vi.fn(),
      }),
      ActionButton: ({
        variant,
        onClick,
      }: {
        variant: string;
        onClick?: () => void;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),
      Badge: ({ children }: { children: React.ReactNode }) => (
        <span data-testid="badge">{children}</span>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);

const mockClient: M2mClient = {
  id: 1,
  name: "Test Client",
  description: "Test description",
  status: "ACTIVE",
  permissions: [{ id: 1, name: "p1" } as never],
  expiresAt: "2025-06-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const onView = vi.fn();
const getColumns = () => createM2mClientColumns({ onView });

describe("createM2mClientColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 7 columns", () => {
    expect(getColumns()).toHaveLength(7);
  });

  it("renders name cell", () => {
    const cell = getColumns()[0].cell as any;
    const { container } = render(
      cell({
        row: { original: mockClient, getValue: () => mockClient.name },
      }),
    );
    expect(container).toHaveTextContent("Test Client");
  });

  it("renders description or dash", () => {
    const cell = getColumns()[1].cell as any;

    const { container: withDesc } = render(
      cell({
        row: {
          original: mockClient,
          getValue: () => mockClient.description,
        },
      }),
    );
    expect(withDesc).toHaveTextContent("Test description");

    const { container: withoutDesc } = render(
      cell({
        row: {
          original: { ...mockClient, description: undefined },
          getValue: () => undefined,
        },
      }),
    );
    expect(withoutDesc).toHaveTextContent("-");
  });

  it("renders status badge", () => {
    const cell = getColumns()[2].cell as any;
    render(
      cell({
        row: { original: mockClient, getValue: () => mockClient.status },
      }),
    );
    expect(screen.getByTestId("badge")).toHaveTextContent("ACTIVE");
  });

  it("renders expiry date or Unlimited", () => {
    const cell = getColumns()[3].cell as any;

    const { container: withExpiry } = render(
      cell({
        row: { original: mockClient, getValue: () => mockClient.expiresAt },
      }),
    );
    expect(withExpiry).toHaveTextContent("2025");

    const { container: unlimited } = render(
      cell({
        row: {
          original: { ...mockClient, expiresAt: null },
          getValue: () => null,
        },
      }),
    );
    expect(unlimited).toHaveTextContent("Unlimited");
  });

  it("renders permission count", () => {
    const cell = getColumns()[4].cell as any;
    const { container } = render(
      cell({
        row: { original: mockClient, getValue: () => mockClient.permissions },
      }),
    );
    expect(container).toHaveTextContent("1 permission");
  });

  it("renders created date", () => {
    const cell = getColumns()[5].cell as any;
    const { container } = render(
      cell({
        row: { original: mockClient, getValue: () => mockClient.createdAt },
      }),
    );
    expect(container).toHaveTextContent("2024");
  });

  it("actions cell calls onView", async () => {
    const cell = getColumns()[6].cell as any;
    render(
      cell({
        row: { original: mockClient, getValue: () => undefined },
      }),
    );

    const user = (await import("@testing-library/user-event")).default.setup();
    await user.click(screen.getByTestId("action-btn-show"));

    expect(onView).toHaveBeenCalledWith(mockClient);
  });
});
