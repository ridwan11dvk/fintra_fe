import { faker } from "@faker-js/faker";

export function createClosePayment(
  overrides: Partial<{
    id: number;
    documentNumber: string;
    amount: number;
    currency: string;
    paymentStatus: number;
    postingA8Status: number;
  }> = {},
) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    documentNumber: faker.string.alphanumeric(10).toUpperCase(),
    amount: faker.number.float({ min: 100, max: 1_000_000, fractionDigits: 2 }),
    currency: "IDR",
    paymentStatus: 0,
    postingA8Status: 0,
    ...overrides,
  };
}

/** Create a standard paginated API response wrapper. */
export function createPaginatedResponse<T>(
  data: T[],
  overrides: Partial<{
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }> = {},
) {
  const page = overrides.page ?? 1;
  const size = overrides.size ?? 10;
  const totalElements = overrides.totalElements ?? data.length;
  const totalPages = overrides.totalPages ?? Math.ceil(totalElements / size);

  return {
    status: "SUCCESS",
    message: "Data retrieved successfully",
    data: {
      content: data,
      page,
      size,
      totalElements,
      totalPages,
    },
  };
}
