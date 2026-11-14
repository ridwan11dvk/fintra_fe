import { faker } from "@faker-js/faker";

export function createCompanyData(
  overrides: Partial<{
    code: string;
    name: string;
    address: string;
    isActive: boolean;
  }> = {},
) {
  const companyName = faker.company.name();
  const companyCode = faker.string.alphanumeric(6).toUpperCase();
  const address = faker.location.streetAddress();

  return {
    code: companyCode,
    name: companyName,
    address: address,
    isActive: true,
    ...overrides,
  };
}
