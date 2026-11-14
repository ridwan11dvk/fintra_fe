import {
  useSaveComplianceFsscMutation,
  useSaveFinancialControlValidationMutation,
} from "@/features/settings/setup-configuration/data/setup-configuration.mutation";
import { saveStoredComplianceFssc } from "@/features/settings/setup-configuration/data/setup-configuration.mock";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it } from "vitest";

describe("useSaveComplianceFsscMutation", () => {
  beforeEach(() => {
    localStorage.clear();
    saveStoredComplianceFssc([]);
  });

  it("[FSSC-COMP-011] saves compliance checklist items through the service", async () => {
    const items = [{ id: "fssc-1", name: "Checklist", description: "Desc" }];
    const { result } = renderHook(() => useSaveComplianceFsscMutation());

    result.current.mutate({ items });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual(items);
  });
});

describe("useSaveFinancialControlValidationMutation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("[FSSC-FCV-011] saves financial control validation items through the service", async () => {
    const items = [{ id: "fcv-1", title: "Title", subTitle: "Sub" }];
    const { result } = renderHook(() =>
      useSaveFinancialControlValidationMutation(),
    );

    result.current.mutate({ items });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual(items);
  });
});
