import { faker } from "@faker-js/faker";

export function createBankData(
  overrides: Partial<{
    name: string;
    code: string;
    color: string;
    rtgsCode: string;
    onlineCode: string;
    bifastCode: string;
    sknCode: string;
  }> = {},
) {
  const bankName = `Bank ${faker.company.name()}`;
  const bankCode = faker.string.alpha({ length: 4, casing: "upper" });
  return {
    name: bankName,
    code: bankCode,
    color: faker.color.rgb(),
    rtgsCode: faker.string.alphanumeric(8).toUpperCase(),
    onlineCode: faker.string.numeric(3),
    bifastCode: faker.string.numeric(3),
    sknCode: faker.string.numeric(3),
    ...overrides,
  };
}
