import { faker } from "@faker-js/faker";

export function createCurrencyRateData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    currencyCode: "USD",
    rateType: "BUY",
    rate: faker.number.float({ min: 10000, max: 20000, precision: 2 }),
    startDate: new Date().toISOString().split("T")[0],
    ...overrides,
  };
}
