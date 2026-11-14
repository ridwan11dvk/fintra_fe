import { faker } from "@faker-js/faker";

export function createPartnerCategoryData(
  overrides: Partial<{
    name: string;
    description: string;
    isActive: boolean;
  }> = {},
) {
  return {
    name: faker.company.department(),
    description: faker.lorem.sentence(),
    isActive: true,
    ...overrides,
  };
}
