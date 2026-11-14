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

import {
  notificationQueryKeys,
  useGetCategories,
  useGetNotificationById,
  useGetUnreadCount,
  useListNotifications,
} from "@/features/notification/data/notification.query";

describe("notificationQueryKeys", () => {
  it("all returns base key", () => {
    expect(notificationQueryKeys.all).toEqual(["notifications"]);
  });

  it("lists returns all + list", () => {
    expect(notificationQueryKeys.lists()).toEqual(["notifications", "list"]);
  });

  it("list returns lists + params", () => {
    const params = { page: 0, size: 10 };
    expect(notificationQueryKeys.list(params)).toEqual([
      "notifications",
      "list",
      params,
    ]);
  });

  it("list returns lists + undefined when no params", () => {
    expect(notificationQueryKeys.list()).toEqual([
      "notifications",
      "list",
      undefined,
    ]);
  });

  it("details returns all + detail", () => {
    expect(notificationQueryKeys.details()).toEqual([
      "notifications",
      "detail",
    ]);
  });

  it("detail returns details + id", () => {
    expect(notificationQueryKeys.detail(1)).toEqual([
      "notifications",
      "detail",
      1,
    ]);
  });

  it("unreadCount returns all + unread-count", () => {
    expect(notificationQueryKeys.unreadCount()).toEqual([
      "notifications",
      "unread-count",
    ]);
  });

  it("categories returns all + categories", () => {
    expect(notificationQueryKeys.categories()).toEqual([
      "notifications",
      "categories",
    ]);
  });
});

describe("useListNotifications", () => {
  it("fetches and returns paged data when enabled (default)", async () => {
    const { result } = renderHook(() => useListNotifications());

    expect(result.current.isFetching || result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toBeInstanceOf(Array);
  });

  it("does not fetch when enabled option is false", async () => {
    const { result } = renderHook(() =>
      useListNotifications(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/notification`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListNotifications());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

describe("useGetNotificationById", () => {
  it("fetches and returns a notification when enabled", async () => {
    const { result } = renderHook(() => useGetNotificationById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when query is disabled", async () => {
    const { result } = renderHook(() =>
      useGetNotificationById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/notification/:id`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetNotificationById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

describe("useGetUnreadCount", () => {
  it("fetches and returns unread count", async () => {
    const { result } = renderHook(() => useGetUnreadCount());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
    expect(typeof result.current.data?.data).toBe("number");
  });

  it("does not fetch when disabled", async () => {
    const { result } = renderHook(() => useGetUnreadCount({ enabled: false }));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state on server error", async () => {
    server.use(
      http.get(`${BASE}/notification/unread/count`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetUnreadCount());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetCategories", () => {
  it("fetches and returns categories", async () => {
    const { result } = renderHook(() => useGetCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toBeInstanceOf(Array);
  });

  it("does not fetch when disabled", async () => {
    const { result } = renderHook(() => useGetCategories({ enabled: false }));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state on server error", async () => {
    server.use(
      http.get(`${BASE}/notification-categories`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetCategories());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
