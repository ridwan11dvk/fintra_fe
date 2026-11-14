import { faker } from "@faker-js/faker";

export function createTransactionCategoryData(
  overrides: Partial<{
    name: string;
    description: string;
    isActive: boolean;
  }> = {},
) {
  return {
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
    isActive: true,
    ...overrides,
  };
}
