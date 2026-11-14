import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
  useGetAccessRequestById,
  useListAccessRequests,
} from "@/features/access-request/data/access-request.query";

const BASE = "http://localhost:3000";

describe("useListAccessRequests", () => {
  it("fetches and returns paged access request data", async () => {
    const { result } = renderHook(() => useListAccessRequests());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const { result } = renderHook(() =>
      useListAccessRequests({ pageSize: 25, pageNumber: 2 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListAccessRequests(undefined, { enabled: false }),
    );

    expect(result.current.isPending).toBe(true);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/access-request`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListAccessRequests());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useGetAccessRequestById", () => {
  it("fetches and returns a single access request with details", async () => {
    const { result } = renderHook(() => useGetAccessRequestById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe(1);
    expect(result.current.data?.modules).toBeDefined();
  });

  it("does not fetch when id is null", async () => {
    const { result } = renderHook(() => useGetAccessRequestById(null));

    expect(result.current.isPending).toBe(true);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/access-request/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetAccessRequestById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
