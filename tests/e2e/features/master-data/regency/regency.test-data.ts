import { faker } from "@faker-js/faker";

export function createRegencyData(
  overrides: Partial<{
    code: string;
    name: string;
    provinceId: number;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.location.city(),
    provinceId: 1,
    isActive: true,
    ...overrides,
  };
}
