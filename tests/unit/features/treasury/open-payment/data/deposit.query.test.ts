import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import {
  useListDeposits,
  useGetDepositById,
  useGetDepositSummary,
  useGetDepositCountByStatus,
} from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("useListDeposits", () => {
  it("should fetch deposit list", async () => {
    const { result } = renderHook(() => useListDeposits());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(2);
  });

  it("should accept pagination params", async () => {
    const { result } = renderHook(() =>
      useListDeposits({ page: 0, size: 10 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useGetDepositById", () => {
  it("should fetch deposit by id", async () => {
    const { result } = renderHook(() => useGetDepositById(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.agentCode).toBe("AGT001");
  });
});

describe("useGetDepositSummary", () => {
  it("should fetch deposit summary", async () => {
    const { result } = renderHook(() => useGetDepositSummary());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.totalDeposits).toBe(2);
    expect(result.current.data?.data.totalAmount).toBe(3000000);
  });
});

describe("useGetDepositCountByStatus", () => {
  it("should fetch count by status", async () => {
    const { result } = renderHook(() => useGetDepositCountByStatus());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.notSent).toBe(1);
    expect(result.current.data?.data.sent).toBe(1);
  });
});
