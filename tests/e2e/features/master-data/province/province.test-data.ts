import { faker } from "@faker-js/faker";

export function createProvinceData(
  overrides: Partial<{
    code: string;
    name: string;
    alias: string;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.location.state(),
    alias: faker.company.department(),
    isActive: true,
    ...overrides,
  };
}
