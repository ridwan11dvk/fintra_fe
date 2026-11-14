import {
  useCreateExternalUserMutation,
  useCreateInternalUserFromEsaMutation,
  useDeleteExternalUserMutation,
  useDeleteInternalUserMutation,
  useDeleteInternalUserRkipDateLimitMutation,
  useGetInternalUserByNippMutation,
  usePatchInternalUserMutation,
  useUpdateExternalUserMutation,
  useUpdateInternalUserRkipDateLimitMutation,
} from "@/features/settings/users/data/user.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    const { buildUiResponseMock } =
      await import("@tests/unit/mocks/ui-response-mock");
    return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("@/shared/lib/api.utils", () => ({
  useHandleMutationResponse: vi.fn(),
}));

const BASE = "http://localhost:3000";

describe("useCreateInternalUserFromEsaMutation", () => {
  it("creates an internal user from ESA", async () => {
    const { result } = renderHook(() => useCreateInternalUserFromEsaMutation());

    result.current.mutate({ nipp: "12345", roles: [1] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles error", async () => {
    server.use(
      http.post(`${BASE}/users/internal/esa`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateInternalUserFromEsaMutation());

    result.current.mutate({ nipp: "12345", roles: [1] });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePatchInternalUserMutation", () => {
  it("patches an internal user", async () => {
    const { result } = renderHook(() => usePatchInternalUserMutation());

    result.current.mutate({ id: 1, data: { nipp: "12345", roles: [1] } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("returns success message on patch", async () => {
    const { result } = renderHook(() => usePatchInternalUserMutation());

    result.current.mutate({ id: 1, data: { nipp: "12345", roles: [1] } });

    await waitFor(() => {
      expect(result.current.data?.status).toBe("SUCCESS");
    });
  });

  it("handles error", async () => {
    server.use(
      http.patch(`${BASE}/users/internal/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => usePatchInternalUserMutation());

    result.current.mutate({ id: 999, data: { nipp: "00000", roles: [1] } });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeleteInternalUserMutation", () => {
  it("deletes an internal user", async () => {
    const { result } = renderHook(() => useDeleteInternalUserMutation());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateInternalUserRkipDateLimitMutation", () => {
  it("updates RKIP date limit", async () => {
    const { result } = renderHook(() =>
      useUpdateInternalUserRkipDateLimitMutation(),
    );

    result.current.mutate({ id: 1, dateLimit: "2024-12-31" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteInternalUserRkipDateLimitMutation", () => {
  it("deletes RKIP date limit", async () => {
    const { result } = renderHook(() =>
      useDeleteInternalUserRkipDateLimitMutation(),
    );

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useGetInternalUserByNippMutation", () => {
  it("fetches internal user by NIPP via mutation", async () => {
    const { result } = renderHook(() => useGetInternalUserByNippMutation());

    result.current.mutate(12345);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useCreateExternalUserMutation", () => {
  it("creates an external user", async () => {
    const { result } = renderHook(() => useCreateExternalUserMutation());

    result.current.mutate({
      userType: "PERSONAL",
      name: "Jane Doe",
      email: "jane@example.com",
      username: "jane_doe",
      password: "password123",
      roles: [2],
      twoFactorEnabled: false,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateExternalUserMutation", () => {
  it("updates an external user", async () => {
    const { result } = renderHook(() => useUpdateExternalUserMutation());

    result.current.mutate({
      id: 1,
      data: {
        userType: "PERSONAL",
        name: "Jane Doe",
        email: "jane@example.com",
        username: "jane_doe",
        roles: [2],
        twoFactorEnabled: false,
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteExternalUserMutation", () => {
  it("deletes an external user", async () => {
    const { result } = renderHook(() => useDeleteExternalUserMutation());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
