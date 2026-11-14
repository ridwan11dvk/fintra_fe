import { faker } from "@faker-js/faker";

export function createBusinessAreaData(
  overrides: Partial<{
    companyCode: string;
    name: string;
    baCode: string;
    branchCode: string;
    email: string;
    taxEmail: string;
    nitku: string;
    npwp: string;
    clientId: string;
    clientSecret: string;
  }> = {},
) {
  const companyCode = faker.string.alphanumeric(6).toUpperCase();
  const businessAreaName = `BA ${faker.company.name()}`;
  const baCode = faker.string.alphanumeric(5).toUpperCase();

  return {
    companyCode,
    name: businessAreaName,
    baCode,
    branchCode: faker.string.alphanumeric(4).toUpperCase(),
    email: faker.internet.email(),
    taxEmail: faker.internet.email(),
    nitku: faker.string.alphanumeric(8),
    npwp: faker.string.numeric(15),
    clientId: faker.string.alphanumeric(20),
    clientSecret: faker.string.alphanumeric(32),
    ...overrides,
  };
}
