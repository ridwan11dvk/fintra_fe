import { faker } from "@faker-js/faker";

export function createTransactionTypeData(
  overrides: Partial<{
    code: string;
    name: string;
    description: string;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    ...overrides,
  };
}
