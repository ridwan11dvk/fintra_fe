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
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

import {
  useCreateBulkNotificationsMutation,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/features/notification/data/notification.mutation";

describe("useCreateNotificationMutation", () => {
  it("successfully creates and calls onSuccess callback", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateNotificationMutation());

    result.current.mutate({
      categoryId: 1,
      title: "Test",
      message: "Message",
      channel: "IN_APP",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles server errors (500)", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/notification`, () =>
        HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => useCreateNotificationMutation());

    result.current.mutate({
      categoryId: 1,
      title: "Test",
      message: "Message",
      channel: "IN_APP",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useCreateBulkNotificationsMutation", () => {
  it("successfully creates bulk notifications and calls onSuccess callback", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateBulkNotificationsMutation());

    result.current.mutate({
      categoryId: 1,
      title: "Bulk",
      message: "Bulk message",
      channels: ["IN_APP"],
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles server errors (500)", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/notification/bulk`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateBulkNotificationsMutation());

    result.current.mutate({
      categoryId: 1,
      title: "Bulk",
      message: "Bulk message",
      channels: ["IN_APP"],
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useMarkAsReadMutation", () => {
  it("successfully marks notification as read", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useMarkAsReadMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles server errors", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/notification/:id/read`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useMarkAsReadMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useMarkAllAsReadMutation", () => {
  it("successfully marks all as read", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useMarkAllAsReadMutation());

    result.current.mutate();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles server errors", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/notification/read-all`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useMarkAllAsReadMutation());

    result.current.mutate();

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteNotificationMutation", () => {
  it("successfully deletes", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteNotificationMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles server errors", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/notification/:id`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useDeleteNotificationMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
