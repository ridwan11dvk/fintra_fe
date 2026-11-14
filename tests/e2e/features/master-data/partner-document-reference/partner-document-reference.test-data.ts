import { faker } from "@faker-js/faker";

export function createPartnerDocumentReferenceData(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    countryId: 1,
    companyId: 1,
    categoryId: 1,
    typeId: 1,
    subTypeId: 1,
    documentNumber: faker.string.numeric(12),
    ...overrides,
  };
}
