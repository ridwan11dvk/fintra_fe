# Filter Data API Contract

## Overview

The Filter Data API provides endpoints for retrieving system reference data for use in dropdown filters, selectors, and option lists. The API exposes various master data entities in a simplified option item format suitable for UI dropdowns and selection controls. No authentication is required for these endpoints as they expose non-sensitive reference data.

---

## Base Information

- **Base URL**: `/api/data`
- **Authentication**: Not required
- **Content-Type**: `application/json`
- **Response Format**: All responses wrapped in `ApiResponse` envelope

---

## Common Response Structure

### Success Response

```json
{
  "message": "Operation successful",
  "status": "SUCCESS",
  "data": [],
  "errors": null
}
```

### Error Response

```json
{
  "message": "Error description",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

### Option Item Format

Each item in the response follows the `OptionItem` format:

```json
{
  "label": "Item Name or Code",
  "value": 1,
  "description": "Item Description"
}
```

---

## Endpoints

### 1. Get Presigned URL

Retrieves a presigned URL for file upload/preview.

**Endpoint**: `POST /presigned-url`  
**Authentication**: Not required

#### Request Body

```json
{
  "filePath": "path/to/file"
}
```

#### Response (200 OK)

```json
{
  "message": "Presigned URL retrieved successfully",
  "status": "SUCCESS",
  "data": "https://s3.example.com/bucket/path/to/file?...",
  "errors": null
}
```

#### Use Cases

- Generate presigned URLs for file uploads
- Generate preview URLs for file access
- Provide temporary access to stored files
- Enable secure file sharing without direct S3 access

#### Notes

- The presigned URL is temporary and expires after a set duration
- URL format and expiration depend on the storage service configuration
- Response data contains only the presigned URL string (not an OptionItem)

#### Error Responses

- **400 Bad Request**: Invalid or missing filePath
- **500 Internal Server Error**: Unexpected server error

---

### 2. Get All Roles

Retrieves a list of all roles for dropdown selection.

**Endpoint**: `GET /role`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Roles retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "Admin",
      "value": 1,
      "description": "Administrator role with full system access"
    },
    {
      "label": "User",
      "value": 2,
      "description": "Regular user role with limited access"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate role selection dropdowns in user management forms
- Display available roles for assignment during user creation/update
- Filter users by role in list views

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 3. Get All Modules

Retrieves a list of all system modules for dropdown selection.

**Endpoint**: `GET /module`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Modules retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "Master Data",
      "value": 1,
      "description": "Master data management module"
    },
    {
      "label": "Accounting",
      "value": 2,
      "description": "Accounting and finance module"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Display available modules in role permission assignment forms
- Show module selection options in module management interfaces
- Filter permissions by module

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 4. Get All Units of Measure

Retrieves a list of all active units of measure for dropdown selection.

**Endpoint**: `GET /uom`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Unit of measure retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "PCS",
      "value": 1,
      "description": "Pieces"
    },
    {
      "label": "KG",
      "value": 2,
      "description": "Kilogram"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate unit of measure selection in product/item forms
- Display available units in inventory management screens
- Select UOM for purchase orders and sales orders

#### Notes

- Only active units of measure are returned
- Sorted by code in ascending order

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 5. Get All Countries

Retrieves a list of all active countries for dropdown selection.

**Endpoint**: `GET /country`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Countries retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "ID",
      "value": 1,
      "description": "Indonesia"
    },
    {
      "label": "SG",
      "value": 2,
      "description": "Singapore"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate country selection in address forms
- Display available countries in company profile setup
- Select country for import/export documentation
- Filter by country in various master data screens

#### Notes

- Only active countries are returned
- Label format: ISO3 code (e.g., "ID", "SG")
- Description: Full country name
- Sorted by ID in ascending order

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 6. Get All Currencies

Retrieves a list of all active currencies for dropdown selection.

**Endpoint**: `GET /currency`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Currencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "IDR",
      "value": 1,
      "description": "Indonesian Rupiah"
    },
    {
      "label": "USD",
      "value": 2,
      "description": "US Dollar"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate currency selection in transaction forms
- Display available currencies in invoice/quotation entry
- Select currency for purchase orders and sales orders
- Select currency for bank account setup

#### Notes

- Only active currencies are returned
- Label format: Currency code (e.g., "IDR", "USD")
- Description: Full currency name
- Sorted by ID in ascending order

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 7. Get Currencies by Country

Retrieves a list of all active currencies used by a specific country for dropdown selection.

**Endpoint**: `GET /country/{countryId}/currency`  
**Authentication**: Not required

#### URL Parameters

- `countryId` (Long): Country ID (required)

#### Response (200 OK)

```json
{
  "message": "Currencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "IDR",
      "value": 1,
      "description": "Indonesian Rupiah"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate currency selection based on selected country
- Display country-specific currencies in transaction forms
- Auto-select currency when country is selected
- Reduce currency choices to relevant ones for the selected country

#### Notes

- Only active currencies for the specified country are returned
- Label format: Currency code
- Description: Full currency name
- Sorted by ID in ascending order

#### Error Responses

- **400 Bad Request**: Invalid countryId parameter
- **404 Not Found**: Country does not exist
- **500 Internal Server Error**: Unexpected server error

---

### 8. Get All Customs Offices

Retrieves a list of all active customs offices for dropdown selection.

**Endpoint**: `GET /customs-office`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Customs offices retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "CGKAIR",
      "value": 1,
      "description": "Jakarta Customs Office"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 9. Get All Ports

Retrieves a list of all active ports for dropdown selection.

**Endpoint**: `GET /port`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Ports retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "CGK",
      "value": 1,
      "description": "Jakarta Port"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 10. Get Ports by Customs Office

Retrieves a list of all active ports for a specific customs office.

**Endpoint**: `GET /customs-office/{customsOfficeId}/port`  
**Authentication**: Not required

#### URL Parameters

- `customsOfficeId` (Long): Customs Office ID (required)

#### Response (200 OK)

```json
{
  "message": "Ports retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "CGK",
      "value": 1,
      "description": "Jakarta Port"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 11. Get All Banks

Retrieves a list of all active banks for dropdown selection.

**Endpoint**: `GET /bank`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Banks retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "MANDIRI",
      "value": 1,
      "description": "PT Bank Mandiri"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 12. Get All House Banks

Retrieves a list of all active house banks (company bank accounts) for dropdown selection.

**Endpoint**: `GET /house-bank`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "House banks retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "1234567890",
      "value": 1,
      "description": "Company Main Account"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 13. Get All Business Areas

Retrieves a list of all active business areas for dropdown selection.

**Endpoint**: `GET /business-area`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Business areas retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "BA001",
      "value": 1,
      "description": "Main Business Area"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 14. Get All Companies

Retrieves a list of all active companies for dropdown selection.

**Endpoint**: `GET /company`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Companies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "PT001",
      "value": 1,
      "description": "PT Main Company"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 15. Get All Cost Centers

Retrieves a list of all active cost centers for dropdown selection.

**Endpoint**: `GET /cost-center`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Cost centers retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "CC001",
      "value": 1,
      "description": "Main Cost Center"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 16. Get All General Ledger Accounts

Retrieves a list of all active general ledger accounts for dropdown selection.

**Endpoint**: `GET /gl-account`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "General ledger accounts retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "1010",
      "value": 1,
      "description": "Cash Account"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 17. Get All Terms of Payment

Retrieves a list of all active payment terms for dropdown selection.

**Endpoint**: `GET /term-of-payment`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Terms of payment retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "NET30",
      "value": 1,
      "description": "Net 30 Days"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 18. Get All Taxable Items

Retrieves a list of all active taxable items for dropdown selection.

**Endpoint**: `GET /taxable-item`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Taxable items retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "TAX001",
      "value": 1,
      "description": "Taxable Item"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 19. Get All Tax Rates

Retrieves a list of all active/latest tax rates for dropdown selection. Returns tax rates that are currently active (within their effective date range).

**Endpoint**: `GET /tax-rate`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Tax rates retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "PPN10",
      "value": 1,
      "description": "PPN 10%"
    },
    {
      "label": "PPH15",
      "value": 2,
      "description": "PPH 15%"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate tax rate selection in invoice/quotation entry forms
- Display available tax rates for transaction processing
- Select tax rate for purchase orders and sales orders
- Apply correct tax calculation in financial transactions

#### Notes

- Only active tax rates (within their effective date range) are returned
- Tax rates are ordered by most recently created
- Label format: Tax rate code (e.g., "PPN10", "PPH15")
- Description: Full tax rate name
- Sorted by creation date in descending order

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 20. Get All Provinces

Retrieves a list of all active provinces for dropdown selection.

**Endpoint**: `GET /province`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Provinces retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "PROV001",
      "value": 1,
      "description": "Jakarta"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 21. Get All Regencies

Retrieves a list of all active regencies for dropdown selection.

**Endpoint**: `GET /regency`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Regencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "REG001",
      "value": 1,
      "description": "Central Jakarta"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 22. Get Regencies by Province

Retrieves a list of all active regencies for a specific province.

**Endpoint**: `GET /province/{provinceId}/regency`  
**Authentication**: Not required

#### URL Parameters

- `provinceId` (Long): Province ID (required)

#### Response (200 OK)

```json
{
  "message": "Regencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "REG001",
      "value": 1,
      "description": "Central Jakarta"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate regency selection based on selected province
- Display province-specific regencies in address forms
- Create dependent dropdown for administrative areas

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 23. Get All Districts

Retrieves a list of all active districts for dropdown selection.

**Endpoint**: `GET /district`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Districts retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "DIST001",
      "value": 1,
      "description": "Mampang Prapatan"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 24. Get Districts by Regency

Retrieves a list of all active districts for a specific regency.

**Endpoint**: `GET /regency/{regencyId}/district`  
**Authentication**: Not required

#### URL Parameters

- `regencyId` (Long): Regency ID (required)

#### Response (200 OK)

```json
{
  "message": "Districts retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "DIST001",
      "value": 1,
      "description": "Mampang Prapatan"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate district selection based on selected regency
- Display regency-specific districts in address forms
- Create dependent dropdown for administrative areas

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 25. Get All Villages

Retrieves a list of all active villages for dropdown selection.

**Endpoint**: `GET /village`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Villages retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "VIL001",
      "value": 1,
      "description": "Cideng"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 26. Get Villages by District

Retrieves a list of all active villages for a specific district.

**Endpoint**: `GET /district/{districtId}/village`  
**Authentication**: Not required

#### URL Parameters

- `districtId` (Long): District ID (required)

#### Response (200 OK)

```json
{
  "message": "Villages retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "VIL001",
      "value": 1,
      "description": "Cideng"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate village selection based on selected district
- Display district-specific villages in address forms
- Create dependent dropdown for administrative areas

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 27. Get All Partners

Retrieves a list of all active partners for dropdown selection.

**Endpoint**: `GET /partner`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Partners retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "PART001",
      "value": 1,
      "description": "Partner Name"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 28. Get All Partner Categories

Retrieves a list of all active partner categories for dropdown selection.

**Endpoint**: `GET /partner-category`  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Partner categories retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "SUPPLIER",
      "value": "1",
      "description": "Supplier Category"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 29. Get Partner Types by Category

Retrieves a list of all active partner types for a specific category (root-level types only).

**Endpoint**: `GET /partner-category/{categoryId}/partner-type`  
**Authentication**: Not required

#### URL Parameters

- `categoryId` (Long): Partner Category ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "SUPPLIER",
      "value": 1,
      "description": "Supplier Type"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate partner type selection based on selected category
- Display category-specific partner types in partner assignment forms
- Create dependent dropdown for partner categorization

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 30. Get Partner Sub-Types by Type

Retrieves a list of all active partner sub-types for a specific parent type.

**Endpoint**: `GET /partner-type/{typeId}/partner-sub-type`  
**Authentication**: Not required

#### URL Parameters

- `typeId` (Long): Parent Partner Type ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner sub-types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "label": "RAW_MATERIAL_SUPPLIER",
      "value": 2,
      "description": "Raw Material Supplier Sub-Type"
    },
    {
      "label": "COMPONENT_SUPPLIER",
      "value": 3,
      "description": "Component Supplier Sub-Type"
    }
  ],
  "errors": null
}
```

#### Use Cases

- Populate partner sub-type selection based on selected parent type
- Display hierarchical partner type options in partner forms
- Create cascading dropdown for detailed partner categorization
- Enable type-specific business logic based on sub-type selection

#### Notes

- Only active sub-types for the specified parent type are returned
- Parent type must have `isActive = true`
- Sub-types are sorted by ID in ascending order
- If parent type has no sub-types, empty array is returned

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

## Response Data Model

### OptionItem Structure

```typescript
interface OptionItem<T> {
  label: string; // Display text for the option
  value: T; // Unique identifier (typically Long/ID)
  description: string; // Additional descriptive information
}
```

---

## Data Type Reference

| Type   | Format  | Example |
| ------ | ------- | ------- |
| Long   | Integer | 1       |
| String | Text    | "IDR"   |

---

## Status Codes

| Code | Description                                     |
| ---- | ----------------------------------------------- |
| 200  | OK - Request successful                         |
| 400  | Bad Request - Invalid parameters                |
| 404  | Not Found - Resource does not exist             |
| 500  | Internal Server Error - Unexpected server error |

---

## Caching Considerations

These endpoints are ideal for client-side caching:

1. **API Response Caching**: Cache responses in the client application since reference data changes infrequently
2. **Local Storage**: Store option lists in browser local storage for faster UI rendering
3. **Cache Invalidation**: Re-fetch data when users login fresh or manually refresh the page
4. **Recommended TTL**: 1 hour to 24 hours depending on update frequency expectations

---

## Common Implementation Patterns

### Loading Dependent Dropdowns (Area Hierarchy)

```javascript
// When user selects a province, fetch regencies for that province
onProvinceSelect(provinceId) {
  const regencies = await fetch(`/api/data/province/${provinceId}/regency`);
  populateRegencyDropdown(regencies.data);
}

// When user selects a regency, fetch districts
onRegencySelect(regencyId) {
  const districts = await fetch(`/api/data/regency/${regencyId}/district`);
  populateDistrictDropdown(districts.data);
}

// When user selects a district, fetch villages
onDistrictSelect(districtId) {
  const villages = await fetch(`/api/data/district/${districtId}/village`);
  populateVillageDropdown(villages.data);
}
```

### Loading Dependent Dropdowns (Country-Currency)

```javascript
// When user selects a country, fetch currencies for that country
onCountrySelect(countryId) {
  const currencies = await fetch(`/api/data/country/${countryId}/currency`);
  populateCurrencyDropdown(currencies.data);
}
```

### Loading Dependent Dropdowns (Customs Office-Ports)

```javascript
// When user selects a customs office, fetch ports
onCustomsOfficeSelect(customsOfficeId) {
  const ports = await fetch(`/api/data/customs-office/${customsOfficeId}/port`);
  populatePortDropdown(ports.data);
}
```

### Loading Dependent Dropdowns (Partner Type Hierarchy)

```javascript
// When user selects a partner category, fetch root partner types
onPartnerCategorySelect(categoryId) {
  const partnerTypes = await fetch(`/api/data/partner-category/${categoryId}/partner-type`);
  populatePartnerTypeDropdown(partnerTypes.data);
}

// When user selects a partner type, fetch partner sub-types
onPartnerTypeSelect(typeId) {
  const subTypes = await fetch(`/api/data/partner-type/${typeId}/partner-sub-type`);
  populatePartnerSubTypeDropdown(subTypes.data);
}
```

### Preloading Static Reference Data

```javascript
// Load on application initialization
Promise.all([
  fetch("/api/data/role"),
  fetch("/api/data/module"),
  fetch("/api/data/uom"),
  fetch("/api/data/country"),
  fetch("/api/data/currency"),
  fetch("/api/data/bank"),
  fetch("/api/data/business-area"),
  fetch("/api/data/company"),
  fetch("/api/data/cost-center"),
  fetch("/api/data/gl-account"),
  fetch("/api/data/term-of-payment"),
  fetch("/api/data/taxable-item"),
  fetch("/api/data/province"),
  fetch("/api/data/partner"),
  fetch("/api/data/partner-category"),
  fetch("/api/data/partner-type"),
]).then((responses) => cacheAllReferenceData(responses));
```

---

## Notes

1. **Public Endpoints**: These endpoints do not require authentication as they expose non-sensitive, public reference data

2. **Alphabetical Ordering**: Most endpoints return data sorted by ID in ascending order

3. **Active Records Only**: Endpoints return only active records (where `isActive = true`)

4. **Performance**: These endpoints are optimized for performance and are suitable for high-frequency requests

5. **Standard Response Format**: All endpoints follow the standard `ApiResponse` wrapper with message, status, data, and errors fields

6. **Error Handling**: While authentication is not required, standard HTTP error codes are returned for invalid inputs or server errors

7. **Label-Value Pattern**: The `OptionItem` format follows standard UI dropdown patterns used across modern web applications

8. **Country-Currency Relationship**: The dedicated endpoint for currencies by country enables dependent dropdown implementations
