import { faker } from "@faker-js/faker";

export function createCurrencyData(
  overrides: Partial<{
    code: string;
    name: string;
    symbol: string;
    countryId: number;
    isActive: boolean;
  }> = {},
) {
  const currencyCodes = ["USD", "EUR", "GBP", "JPY", "IDR"];
  const code = faker.helpers.arrayElement(currencyCodes);
  return {
    code: code,
    name: `${code} Currency`,
    symbol: code.substring(0, 1),
    countryId: 1,
    isActive: true,
    ...overrides,
  };
}
