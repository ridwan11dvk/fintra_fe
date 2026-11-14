import { faker } from "@faker-js/faker";

export function createVillageData(
  overrides: Partial<{
    code: string;
    name: string;
    postalCode: string;
    provinceId: number;
    regencyId: number;
    districtId: number;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.location.city(),
    postalCode: faker.location.zipCode(),
    provinceId: 1,
    regencyId: 1,
    districtId: 1,
    isActive: true,
    ...overrides,
  };
}
