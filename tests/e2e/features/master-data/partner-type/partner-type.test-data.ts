import { faker } from "@faker-js/faker";

export function createPartnerTypeData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.company.department(),
    partnerLegalityId: 1,
    description: faker.lorem.sentence(),
    isActive: true,
    ...overrides,
  };
}
