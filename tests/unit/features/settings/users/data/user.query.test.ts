import {
  useGetExternalUser,
  useGetInternalUser,
  useGetInternalUserByNipp,
  useListExternalUsers,
  useListInternalUsers,
  userQueryKeys,
} from "@/features/settings/users/data/user.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";

describe("userQueryKeys", () => {
  it("all returns base key array", () => {
    expect(userQueryKeys.all).toEqual(["users"]);
  });

  it("internal() returns internal key", () => {
    expect(userQueryKeys.internal()).toEqual(["users", "internal"]);
  });

  it("internalDetail(id) returns detail key", () => {
    expect(userQueryKeys.internalDetail(5)).toEqual(["users", "internal", 5]);
  });

  it("internalByNipp returns esa key", () => {
    expect(userQueryKeys.internalByNipp(12345)).toEqual([
      "users",
      "internal",
      "esa",
      12345,
    ]);
  });

  it("internalList(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(userQueryKeys.internalList(params)).toEqual([
      "users",
      "internal",
      "list",
      params,
    ]);
  });

  it("external() returns external key", () => {
    expect(userQueryKeys.external()).toEqual(["users", "external"]);
  });

  it("externalDetail(id) returns detail key", () => {
    expect(userQueryKeys.externalDetail(5)).toEqual(["users", "external", 5]);
  });

  it("externalList(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(userQueryKeys.externalList(params)).toEqual([
      "users",
      "external",
      "list",
      params,
    ]);
  });
});

describe("useGetInternalUser", () => {
  it("fetches internal user by ID", async () => {
    const { result } = renderHook(() => useGetInternalUser(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("John Doe");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/users/internal/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetInternalUser(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetInternalUserByNipp", () => {
  it("fetches internal user by NIPP", async () => {
    const { result } = renderHook(() => useGetInternalUserByNipp(12345));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data?.name).toBe("John Doe");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/users/internal/esa/:nipp`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetInternalUserByNipp(99999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useListInternalUsers", () => {
  it("fetches paginated internal users", async () => {
    const { result } = renderHook(() =>
      useListInternalUsers({ page: 1, size: 10 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("John Doe");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/users/internal`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListInternalUsers());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetExternalUser", () => {
  it("fetches external user by ID", async () => {
    const { result } = renderHook(() => useGetExternalUser(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Jane Doe");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/users/external/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetExternalUser(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useListExternalUsers", () => {
  it("fetches paginated external users", async () => {
    const { result } = renderHook(() =>
      useListExternalUsers({ page: 1, size: 10 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Jane Doe");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/users/external`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListExternalUsers());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
