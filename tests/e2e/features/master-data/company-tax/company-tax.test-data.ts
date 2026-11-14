import { faker } from "@faker-js/faker";

export function createCompanyTaxData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    companyCode: faker.string.alphanumeric(3).toUpperCase(),
    taxRateId: 1,
    glAccount: faker.string.numeric(8),
    startDate: new Date().toISOString().split("T")[0],
    ...overrides,
  };
}
