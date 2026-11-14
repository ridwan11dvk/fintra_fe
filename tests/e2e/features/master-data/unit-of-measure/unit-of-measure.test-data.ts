import { faker } from "@faker-js/faker";

export function createUnitOfMeasureData(
  overrides: Partial<{
    code: string;
    unit: string;
    unitEn: string;
    unitAlias: string;
    isActive: boolean;
  }> = {},
) {
  const units = ["kg", "g", "l", "ml", "piece", "m", "cm", "box"];
  return {
    code: `UM.${faker.string.alphanumeric(4).toUpperCase()}`,
    unit: faker.helpers.arrayElement(units),
    unitEn: faker.helpers.arrayElement(units),
    unitAlias: faker.string
      .alphanumeric({ length: { min: 2, max: 4 } })
      .toUpperCase(),
    isActive: true,
    ...overrides,
  };
}
