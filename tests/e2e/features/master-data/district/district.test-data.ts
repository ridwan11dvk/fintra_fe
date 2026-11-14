import { faker } from "@faker-js/faker";

export function createDistrictData(
  overrides: Partial<{
    code: string;
    name: string;
    provinceId: number;
    regencyId: number;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.location.city(),
    provinceId: 1,
    regencyId: 1,
    isActive: true,
    ...overrides,
  };
}
