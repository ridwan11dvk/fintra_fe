import { faker } from "@faker-js/faker";

export function createHouseBankData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    bankCode: faker.string.alphanumeric(4).toUpperCase(),
    companyCode: faker.string.alphanumeric(3).toUpperCase(),
    currencyCode: "USD",
    accountNumber: faker.string.numeric(12),
    accountName: faker.company.name(),
    isActive: true,
    ...overrides,
  };
}
