import { faker } from "@faker-js/faker";

export function createPortData(
  overrides: Partial<{
    code: string;
    name: string;
    customsOfficeId: number;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(4).toUpperCase(),
    name: faker.location.city(),
    customsOfficeId: 1,
    isActive: true,
    ...overrides,
  };
}
