import { faker } from "@faker-js/faker";

export function createCountryData(
  overrides: Partial<{
    name: string;
    iso2Code: string;
    iso3Code: string;
    dialCode: string;
    isActive: boolean;
  }> = {},
) {
  return {
    name: faker.location.country(),
    iso2Code: faker.string.alpha({ length: 2, casing: "upper" }),
    iso3Code: faker.string.alpha({ length: 3, casing: "upper" }),
    dialCode: `+${faker.string.numeric(2)}`,
    isActive: true,
    ...overrides,
  };
}
