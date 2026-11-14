import { faker } from "@faker-js/faker";

export function createTaxRateData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.commerce.department(),
    rate: faker.number.float({ min: 0, max: 30, precision: 2 }),
    startDate: new Date().toISOString().split("T")[0],
    isActive: true,
    ...overrides,
  };
}
