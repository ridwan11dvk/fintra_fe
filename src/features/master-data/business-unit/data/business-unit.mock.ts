import type { PagedApiResponse, PaginationParams } from "@railfinance/core";
import type {
  BusinessUnitRequest,
  BusinessUnitResponse,
} from "./business-unit.types";

export const initialBusinessUnits: BusinessUnitResponse[] = [
  {
    id: "bu-1",
    code: "BU-001",
    name: "Corporate Finance",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    companyCode: "1000",
    segment: "Finance",
    region: "Asia Pacific",
    status: "Active",
    effectiveDate: "Jan 01, 2025",
    endDate: "Dec 31, 2025",
    createdBy: "Admin",
    createdDate: "Jan 01, 2025",
    lastUpdatedBy: "Admin",
    lastUpdatedDate: "Sep 15, 2026",
    description: "Oversees corporate financial management and budgeting.",
    isLinked: false,
    isActive: true,
  },
  {
    id: "bu-2",
    code: "BU-001",
    name: "Digital Marketing",
    parentBusinessUnit: "PT Reska Multi Usaha",
    businessUnitType: "Department",
    description: "Drives online marketing and multi-channel campaigns.",
    isLinked: false,
    isActive: true,
  },
  {
    id: "bu-3",
    code: "BU-002",
    name: "Human Resources",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Division",
    description: "Manages employee recruitment, benefits, and development.",
    isLinked: false,
    isActive: true,
  },
  {
    id: "bu-4",
    code: "BU-002",
    name: "Supply Chain",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Coordinates logistics, procurement, and inventory.",
    isLinked: false,
    isActive: true,
  },
  {
    id: "bu-5",
    code: "BU-003",
    name: "Information Technology",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Maintains infrastructure, systems, and enterprise tools.",
    isLinked: false,
    isActive: true,
  },
  {
    id: "bu-6",
    code: "BU-003",
    name: "Research & Development",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Conducts technological innovations and R&D testing.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-7",
    code: "BU-004",
    name: "Customer Success",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Ensures client satisfaction and high customer retention.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-8",
    code: "BU-005",
    name: "Procurement & Asset Management",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Handles vendor relationships and strategic purchasing.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-9",
    code: "BU-006",
    name: "Legal & Corporate Compliance",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Division",
    description:
      "Ensures compliance with national regulations and internal governance.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-10",
    code: "BU-007",
    name: "Internal Audit",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description:
      "Conducts systematic audits of operational and financial units.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-11",
    code: "BU-008",
    name: "Rolling Stock Maintenance",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Oversees locomotive and railcar preventive maintenance.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-12",
    code: "BU-009",
    name: "Track & Civil Infrastructure",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Maintains railway tracks, bridges, and civil facilities.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-13",
    code: "BU-010",
    name: "Signaling & Telecommunications",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Maintains railway signaling and communication systems.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-14",
    code: "BU-011",
    name: "Passenger Service Operations",
    parentBusinessUnit: "PT Railink",
    businessUnitType: "Division",
    description: "Manages airport rail link passenger operations.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-15",
    code: "BU-012",
    name: "Freight & Logistics Services",
    parentBusinessUnit: "PT Kereta Api Logistik",
    businessUnitType: "Division",
    description: "Manages container and bulk rail cargo logistics.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-16",
    code: "BU-013",
    name: "Property Management & Commercial",
    parentBusinessUnit: "PT Kereta Api Properti",
    businessUnitType: "Division",
    description: "Commercializes railway assets and station commercial spaces.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-17",
    code: "BU-014",
    name: "Station Catering & Services",
    parentBusinessUnit: "PT Reska Multi Usaha",
    businessUnitType: "Division",
    description: "Provides on-board dining and station catering services.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-18",
    code: "BU-015",
    name: "Tourism & Charter Services",
    parentBusinessUnit: "PT Kereta Api Pariwisata",
    businessUnitType: "Division",
    description: "Provides priority and tourist rail passenger services.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-19",
    code: "BU-016",
    name: "Treasury Management",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description:
      "Controls liquidity, fund allocations, and bank relationships.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-20",
    code: "BU-017",
    name: "Tax & Financial Reporting",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description: "Handles tax compliance and statutory financial reporting.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-21",
    code: "BU-018",
    name: "Risk Management",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description: "Identifies and mitigates operational and strategic risks.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-22",
    code: "BU-019",
    name: "Public Relations & Media",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description: "Handles public communications and media inquiries.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-23",
    code: "BU-020",
    name: "Quality Assurance & Safety",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Enforces safety protocols and operational quality standards.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-24",
    code: "BU-021",
    name: "Ticketing & Fare Collection",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Manages automatic fare collection and ticketing systems.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-25",
    code: "BU-022",
    name: "Data Analytics & BI",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Delivers business intelligence and passenger data insights.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-26",
    code: "BU-023",
    name: "Cybersecurity & Governance",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Protects enterprise systems against cyber threats.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-27",
    code: "BU-024",
    name: "Training & Education Center",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Division",
    description: "Develops railway workforce competence and certifications.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-28",
    code: "BU-025",
    name: "Environmental Sustainability",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description:
      "Manages carbon reduction initiatives and environmental compliance.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-29",
    code: "BU-026",
    name: "Regional Operations DAOP 1 Jakarta",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages regional railway operations in Greater Jakarta area.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-30",
    code: "BU-027",
    name: "Regional Operations DAOP 2 Bandung",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages regional railway operations in West Java.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-31",
    code: "BU-028",
    name: "Regional Operations DAOP 3 Cirebon",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description:
      "Manages regional railway operations in Cirebon and surrounding.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-32",
    code: "BU-029",
    name: "Regional Operations DAOP 4 Semarang",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages regional railway operations in Central Java North.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-33",
    code: "BU-030",
    name: "Regional Operations DAOP 5 Purwokerto",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description:
      "Manages regional railway operations in Purwokerto and surrounding.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-34",
    code: "BU-031",
    name: "Regional Operations DAOP 6 Yogyakarta",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages regional railway operations in Yogyakarta and Solo.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-35",
    code: "BU-032",
    name: "Regional Operations DAOP 7 Madiun",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description:
      "Manages regional railway operations in Madiun and surrounding.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-36",
    code: "BU-033",
    name: "Regional Operations DAOP 8 Surabaya",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages regional railway operations in East Java.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-37",
    code: "BU-034",
    name: "Regional Operations DAOP 9 Jember",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description:
      "Manages regional railway operations in Jember and Banyuwangi.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-38",
    code: "BU-035",
    name: "Regional Divisi DIVRE 1 Medan",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages railway network operations in North Sumatra.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-39",
    code: "BU-036",
    name: "Regional Divisi DIVRE 2 Padang",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages railway network operations in West Sumatra.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-40",
    code: "BU-037",
    name: "Regional Divisi DIVRE 3 Palembang",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages railway network operations in South Sumatra.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-41",
    code: "BU-038",
    name: "Regional Divisi DIVRE 4 Tanjungkarang",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Manages railway freight operations in Lampung.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-42",
    code: "BU-039",
    name: "Electrical Power Substation Unit",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Monitors and operates railway electrical catenary lines.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-43",
    code: "BU-040",
    name: "Rolling Stock Depot Manggarai",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Main maintenance depot for Jakarta commuter train sets.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-44",
    code: "BU-041",
    name: "Locomotive Depot Yogyakarta",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Main locomotive overhauling and heavy maintenance depot.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-45",
    code: "BU-042",
    name: "Fuel & Lubricant Management",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Department",
    description: "Monitors diesel distribution and locomotive fueling.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-46",
    code: "BU-043",
    name: "Health & Occupational Safety",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Department",
    description: "Protects employee health, hygiene, and safe workplace.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-47",
    code: "BU-044",
    name: "Customer Contact Center",
    parentBusinessUnit: "PT Kereta Api Pariwisata",
    businessUnitType: "Department",
    description: "Handles customer 121 hotline and social inquiries.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-48",
    code: "BU-045",
    name: "Digital Transformation Office",
    parentBusinessUnit: "Technology Division",
    businessUnitType: "Department",
    description: "Leads modernization of railway enterprise workflows.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-49",
    code: "BU-046",
    name: "Strategic Planning & Investment",
    parentBusinessUnit: "Corporate Group",
    businessUnitType: "Division",
    description: "Formulates long-term railway expansion and investment.",
    isLinked: true,
    isActive: true,
  },
  {
    id: "bu-50",
    code: "BU-047",
    name: "Security & Asset Protection",
    parentBusinessUnit: "Operations Division",
    businessUnitType: "Division",
    description: "Safeguards passenger safety and railway perimeter assets.",
    isLinked: true,
    isActive: true,
  },
];

const defaultItemValues: Partial<BusinessUnitResponse> = {
  companyCode: "1000",
  businessUnitType: "Department",
  segment: "Finance",
  region: "Asia Pacific",
  effectiveDate: "Jan 01, 2025",
  endDate: "Dec 31, 2025",
  createdBy: "Admin",
  createdDate: "Jan 01, 2025",
  lastUpdatedBy: "Admin",
  lastUpdatedDate: "Sep 15, 2026",
  status: "Active",
};

let mockStore: BusinessUnitResponse[] = initialBusinessUnits.map((item) => ({
  ...defaultItemValues,
  ...item,
}));

export function resetBusinessUnitMockStore() {
  mockStore = initialBusinessUnits.map((item) => ({
    ...defaultItemValues,
    ...item,
  }));
}

export function getMockBusinessUnits(
  params?: PaginationParams,
): PagedApiResponse<BusinessUnitResponse> {
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 5;
  const search = (params?.search || "").toLowerCase().trim();

  let filtered = [...mockStore];
  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        item.parentBusinessUnit?.toLowerCase().includes(search) ||
        item.businessUnitType?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search),
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    status: "SUCCESS",
    message: "Business units retrieved successfully",
    data: {
      content: pagedItems,
      pagination: {
        total,
        pageSize,
        pageNumber: page,
        totalPages,
        currentPage: page,
        from: startIndex + 1,
        to: Math.min(startIndex + pageSize, total),
      },
    },
  };
}

export function getMockBusinessUnitById(
  id: string | number,
): BusinessUnitResponse | undefined {
  return mockStore.find((item) => String(item.id) === String(id));
}

export function createMockBusinessUnit(
  data: BusinessUnitRequest,
): BusinessUnitResponse {
  const newItem: BusinessUnitResponse = {
    id: `bu-${Date.now()}`,
    ...data,
    isActive: data.isActive ?? true,
    isLinked: data.isLinked ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockStore.unshift(newItem);
  return newItem;
}

export function updateMockBusinessUnit(
  id: string | number,
  data: Partial<BusinessUnitRequest>,
): BusinessUnitResponse | undefined {
  const index = mockStore.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return undefined;

  mockStore[index] = {
    ...mockStore[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return mockStore[index];
}

export function toggleMockBusinessUnit(
  id: string | number,
): BusinessUnitResponse | undefined {
  const index = mockStore.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return undefined;

  mockStore[index] = {
    ...mockStore[index],
    isLinked: !mockStore[index].isLinked,
    updatedAt: new Date().toISOString(),
  };
  return mockStore[index];
}

export function deleteMockBusinessUnit(id: string | number): boolean {
  const initialLength = mockStore.length;
  mockStore = mockStore.filter((item) => String(item.id) !== String(id));
  return mockStore.length < initialLength;
}
