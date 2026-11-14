import { toDataTableResponse } from "@/features/master-data/shared/to-data-table-response";
import { describe, expect, it } from "vitest";

describe("toDataTableResponse", () => {
  it("maps feature list pagination into the shared DataTable response", () => {
    const response = toDataTableResponse({
      items: [{ id: "department-6" }],
      page: 2,
      pageSize: 5,
      totalItems: 11,
      totalPages: 3,
    });

    expect(response).toEqual({
      status: "SUCCESS",
      message: "Data loaded successfully",
      data: {
        content: [{ id: "department-6" }],
        pagination: {
          total: 11,
          pageSize: 5,
          pageNumber: 2,
          currentPage: 2,
          totalPages: 3,
          from: 6,
          to: 10,
        },
      },
    });
  });

  it("represents an empty result without a from/to row range", () => {
    const response = toDataTableResponse({
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });

    expect(response.data.pagination).toMatchObject({ total: 0, from: 0, to: 0 });
  });
});
