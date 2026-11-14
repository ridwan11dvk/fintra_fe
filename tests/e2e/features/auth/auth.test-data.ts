import { faker } from "@faker-js/faker";

export function createLoginCredentials(
  overrides: Partial<{ emailOrUsername: string; password: string }> = {},
) {
  return {
    emailOrUsername: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    ...overrides,
  };
}

export function createUser(
  overrides: Partial<{
    id: number;
    name: string;
    email: string;
    nipp: string;
  }> = {},
) {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    nipp: faker.string.numeric(8),
    ...overrides,
  };
}
