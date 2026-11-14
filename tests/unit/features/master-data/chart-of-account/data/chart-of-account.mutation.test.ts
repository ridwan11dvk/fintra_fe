import {
  useCreateChartOfAccountMutation,
  useDeleteChartOfAccountMutation,
  useImportChartOfAccountsMutation,
  useUpdateChartOfAccountMutation,
} from "@/features/master-data/chart-of-account/data/chart-of-account.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("useCreateChartOfAccountMutation", () => {
  it("executes create mutation successfully", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCreateChartOfAccountMutation({ onSuccess }),
    );

    result.current.mutate({
      code: "11400",
      name: "Bank BCA",
      level: 2,
      description: "BCA account",
      active: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });

  it("handles create error", async () => {
    server.use(
      http.post(`${BASE}/master-data/chart-of-accounts`, () =>
        HttpResponse.json({ message: "Creation failed" }, { status: 400 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() =>
      useCreateChartOfAccountMutation({ onError }),
    );

    result.current.mutate({
      code: "11400",
      name: "Bank BCA",
      level: 2,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});

describe("useUpdateChartOfAccountMutation", () => {
  it("executes update mutation successfully", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdateChartOfAccountMutation({ onSuccess }),
    );

    result.current.mutate({
      id: 1,
      data: {
        code: "11100",
        name: "Cash Updated",
        level: 1,
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });

  it("handles update error", async () => {
    server.use(
      http.put(`${BASE}/master-data/chart-of-accounts/:id`, () =>
        HttpResponse.json({ message: "Update failed" }, { status: 500 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() =>
      useUpdateChartOfAccountMutation({ onError }),
    );

    result.current.mutate({
      id: 1,
      data: {
        code: "11100",
        name: "Cash",
        level: 1,
      },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});

describe("useDeleteChartOfAccountMutation", () => {
  it("executes delete mutation successfully", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useDeleteChartOfAccountMutation({ onSuccess }),
    );

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });

  it("handles delete error", async () => {
    server.use(
      http.delete(`${BASE}/master-data/chart-of-accounts/:id`, () =>
        HttpResponse.json({ message: "Delete failed" }, { status: 500 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() =>
      useDeleteChartOfAccountMutation({ onError }),
    );

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});

describe("useImportChartOfAccountsMutation", () => {
  it("executes import mutation successfully with object param", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useImportChartOfAccountsMutation({ onSuccess }),
    );

    const file = new File(["dummy content"], "coa.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    result.current.mutate({ file, dryRun: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });

  it("executes import mutation successfully with file only", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useImportChartOfAccountsMutation({ onSuccess }),
    );

    const file = new File(["dummy content"], "coa.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    result.current.mutate({ file });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });

  it("rejects non-Excel files with an error", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useImportChartOfAccountsMutation({ onError }),
    );

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({ file });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe(
      "Only Excel files (.xlsx, .xls) are allowed",
    );
  });
});
