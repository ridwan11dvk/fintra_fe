import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import {
  useStationSummaryList,
  useStationSummaryTotal,
  useClosureDetailList,
  useTransactionDetail,
} from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("useStationSummaryList", () => {
  it("should fetch station summary list", async () => {
    const { result } = renderHook(() => useStationSummaryList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(2);
    expect(result.current.data?.data.content[0].stationName).toBe("Station A");
  });

  it("should accept pagination params", async () => {
    const { result } = renderHook(() =>
      useStationSummaryList({ page: 0, size: 10 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useStationSummaryTotal", () => {
  it("should fetch total summary", async () => {
    const { result } = renderHook(() => useStationSummaryTotal());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.totalAllClosureAmount).toBe(80000000);
    expect(result.current.data?.data.totalAllDepositAmount).toBe(73000000);
  });
});

describe("useClosureDetailList", () => {
  it("should fetch closure detail list for a station", async () => {
    const { result } = renderHook(() => useClosureDetailList("Station A"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(2);
  });

  it("should be disabled when stationName is empty", async () => {
    const { result } = renderHook(() => useClosureDetailList(""));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useTransactionDetail", () => {
  it("should fetch transaction detail by id", async () => {
    const { result } = renderHook(() => useTransactionDetail(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.stationName).toBe("Station A");
    expect(result.current.data?.data.depositDetails).toHaveLength(2);
  });

  it("should be disabled when id is 0", async () => {
    const { result } = renderHook(() => useTransactionDetail(0));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should be disabled when id is falsy", async () => {
    const { result } = renderHook(() => useTransactionDetail(0 as unknown as number));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
  });
});
