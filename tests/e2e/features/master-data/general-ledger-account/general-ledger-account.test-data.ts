import { faker } from "@faker-js/faker";

export function createGeneralLedgerAccountData(
  overrides: Partial<{
    companyCode: string;
    baCode: string;
    account: string;
    description: string;
    isActive: boolean;
  }> = {},
) {
  return {
    companyCode: faker.string.alphanumeric(3).toUpperCase(),
    baCode: faker.string.alphanumeric(3).toUpperCase(),
    account: faker.string.numeric(8),
    description: faker.lorem.sentence(),
    isActive: true,
    ...overrides,
  };
}
