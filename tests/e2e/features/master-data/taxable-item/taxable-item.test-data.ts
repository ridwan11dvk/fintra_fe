import { faker } from "@faker-js/faker";

export function createTaxableItemData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    code: faker.string.alphanumeric(6).toUpperCase(),
    description: faker.commerce.productName(),
    parentId: null,
    isActive: true,
    ...overrides,
  };
}
