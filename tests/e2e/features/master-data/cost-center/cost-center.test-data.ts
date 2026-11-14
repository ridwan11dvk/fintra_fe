import { faker } from "@faker-js/faker";

export function createCostCenterData(
  overrides: Partial<{
    companyCode: string;
    baCode: string;
    costCenterCode: string;
    costCenterName: string;
    isActive: boolean;
  }> = {},
) {
  return {
    companyCode: faker.string.alphanumeric(3).toUpperCase(),
    baCode: faker.string.alphanumeric(3).toUpperCase(),
    costCenterCode: faker.string.alphanumeric(4).toUpperCase(),
    costCenterName: faker.company.department(),
    isActive: true,
    ...overrides,
  };
}
