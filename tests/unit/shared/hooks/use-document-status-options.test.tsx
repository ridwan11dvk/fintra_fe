import { useDocumentStatusOptions } from "@/shared/hooks/use-document-status-options";
import { renderHook } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockCan = vi.hoisted(() => vi.fn());

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: mockCan,
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
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);

const PERMISSION = "tax:procurement:import:create";

describe("useDocumentStatusOptions", () => {
  it("returns all statuses (including DRAFT) when user has create permission", () => {
    mockCan.mockReturnValue(true);

    const { result } = renderHook(() =>
      useDocumentStatusOptions({ permission: PERMISSION }),
    );

    const values = result.current.map((opt) => opt.value);
    expect(values).toContain("DRAFT");
    expect(result.current.length).toBeGreaterThan(1);
  });

  it("filters out DRAFT when user lacks create permission", () => {
    mockCan.mockReturnValue(false);

    const { result } = renderHook(() =>
      useDocumentStatusOptions({ permission: PERMISSION }),
    );

    const values = result.current.map((opt) => opt.value);
    expect(values).not.toContain("DRAFT");
    expect(values).toContain("ACTIVE");
  });
});
