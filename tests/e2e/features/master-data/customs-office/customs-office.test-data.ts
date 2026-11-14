import { faker } from "@faker-js/faker";

export function createCustomsOfficeData(
  overrides: Partial<{
    code: string;
    name: string;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(6).toUpperCase(),
    name: faker.company.name(),
    isActive: true,
    ...overrides,
  };
}
