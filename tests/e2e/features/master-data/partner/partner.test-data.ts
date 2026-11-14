import { faker } from "@faker-js/faker";

export function createPartnerData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    code: faker.string.alphanumeric(6).toUpperCase(),
    name: faker.company.name(),
    aliasName: faker.company.buzzPhrase(),
    categoryId: 1,
    typeId: 1,
    countryId: 1,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    ...overrides,
  };
}
