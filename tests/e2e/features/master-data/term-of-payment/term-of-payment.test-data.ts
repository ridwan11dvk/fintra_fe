import { faker } from "@faker-js/faker";

export function createTermOfPaymentData(
  overrides: Partial<{
    code: string;
    name: string;
    description: string;
    numberOfDays: number;
    isActive: boolean;
  }> = {},
) {
  return {
    code: faker.string.alphanumeric(3).toUpperCase(),
    name: `Payment Terms ${faker.number.int({ min: 10, max: 90 })} Days`,
    description: faker.lorem.sentence(),
    numberOfDays: faker.number.int({ min: 10, max: 90 }),
    isActive: true,
    ...overrides,
  };
}
