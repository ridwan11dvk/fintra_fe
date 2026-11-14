# Company Tax API Contract

## Overview

The Company Tax API provides endpoints for managing company tax rate assignments in the Fintra system. This module handles the assignment of tax rates to companies, including GL account mappings and effective date ranges.

## Base URL

```
/api/master/company-tax
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission                      | Description                        |
| ------------ | ------------------------------- | ---------------------------------- |
| List         | `master-data:company-tax:list`   | View paginated list of assignments |
| Read Details | `master-data:company-tax:read`   | View a single assignment by ID     |
| Create       | `master-data:company-tax:create` | Create a new tax assignment        |
| Update       | `master-data:company-tax:update` | Update an existing tax assignment  |
| Delete       | `master-data:company-tax:delete` | Delete a tax assignment            |

## Data Models

### CompanyTaxResponseDTO

```json
{
  "id": 1,
  "companyCode": "COMP001",
  "taxRateId": 3,
  "taxRate": {
    "id": 3,
    "code": "PPN_11",
    "name": "PPN 11%",
    "description": "Value Added Tax at 11% rate",
    "taxType": "PPN",
    "ratePercent": 11.0,
    "coefficientNumerator": 11.0,
    "coefficientDenominator": 100.0,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2022-04-01T00:00:00",
    "endDate": null,
    "createdAt": "2024-01-10T08:00:00",
    "updatedAt": "2024-01-10T08:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "glAccount": "2103",
  "startDate": "2024-01-01T00:00:00",
  "endDate": null,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "createdBy": "admin",
  "updatedBy": "admin"
}
```

### CompanyTaxRequestDTO

```json
{
  "companyCode": "COMP001",
  "taxRateId": 3,
  "glAccount": "2103",
  "startDate": "2024-01-01T00:00:00",
  "endDate": null
}
```

### PaginationResponse

```json
{
  "content": [],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1,
  "isFirst": true,
  "isLast": true
}
```

### ApiResponse

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Endpoints

### 1. Get All Company Tax Assignments (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/company-tax`

**Permission Required:** `master-data:company-tax:list`

**Description:** Retrieves a paginated list of company tax assignments with optional search and filters.

**Query Parameters:**

| Parameter    | Type          | Required | Description                                               | Example             |
| ------------ | ------------- | -------- | --------------------------------------------------------- | ------------------- |
| search       | String        | No       | Search by company code, GL account, or tax rate code/name | COMP001             |
| companyCode  | String        | No       | Filter by company code                                    | COMP001             |
| taxRateId    | Long          | No       | Filter by tax rate ID                                     | 3                   |
| activeOnDate | LocalDateTime | No       | Filter assignments active on this date (ISO date-time)    | 2024-06-01T00:00:00 |
| page         | Integer       | No       | Page number (0-indexed), default: 0                       | 0                   |
| size         | Integer       | No       | Number of records per page, default: 20                   | 10                  |
| sort         | String        | No       | Sort field and direction, default: createdAt,desc         | createdAt,desc      |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "companyCode": "COMP001",
        "taxRateId": 3,
        "taxRate": {
          "id": 3,
          "code": "PPN_11",
          "name": "PPN 11%",
          "description": "Value Added Tax at 11% rate",
          "taxType": "PPN",
          "ratePercent": 11.0,
          "coefficientNumerator": 11.0,
          "coefficientDenominator": 100.0,
          "glPayment": "2102",
          "glInvoice": "1102",
          "startDate": "2022-04-01T00:00:00",
          "endDate": null,
          "createdAt": "2024-01-10T08:00:00",
          "updatedAt": "2024-01-10T08:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "glAccount": "2103",
        "startDate": "2024-01-01T00:00:00",
        "endDate": null,
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "isFirst": true,
    "isLast": true
  },
  "message": "Company tax assignments retrieved successfully",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 2. Get Company Tax Assignment by ID

**Method:** `GET`

**Endpoint:** `/api/master/company-tax/{id}`

**Permission Required:** `master-data:company-tax:read`

**Description:** Retrieves a specific company tax assignment by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description               |
| --------- | ---- | -------- | ------------------------- |
| id        | Long | Yes      | Company tax assignment ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "taxRateId": 3,
    "taxRate": {
      "id": 3,
      "code": "PPN_11",
      "name": "PPN 11%",
      "description": "Value Added Tax at 11% rate",
      "taxType": "PPN",
      "ratePercent": 11.0,
      "coefficientNumerator": 11.0,
      "coefficientDenominator": 100.0,
      "glPayment": "2102",
      "glInvoice": "1102",
      "startDate": "2022-04-01T00:00:00",
      "endDate": null,
      "createdAt": "2024-01-10T08:00:00",
      "updatedAt": "2024-01-10T08:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "glAccount": "2103",
    "startDate": "2024-01-01T00:00:00",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "message": "Company tax assignment retrieved successfully",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Error Responses:**

- `404 Not Found` - Assignment with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 3. Create Company Tax Assignment

**Method:** `POST`

**Endpoint:** `/api/master/company-tax`

**Permission Required:** `master-data:company-tax:create`

**Description:** Creates a new company tax rate assignment.

**Request Body:**

```json
{
  "companyCode": "COMP001",
  "taxRateId": 3,
  "glAccount": "2103",
  "startDate": "2024-01-01T00:00:00",
  "endDate": null
}
```

**Request Validations:**

| Field       | Type          | Required | Constraints                   |
| ----------- | ------------- | -------- | ----------------------------- |
| companyCode | String        | Yes      | Non-blank, max 50 characters  |
| taxRateId   | Long          | Yes      | Not null                      |
| glAccount   | String        | No       | Max 50 characters             |
| startDate   | LocalDateTime | Yes      | Not null (ISO 8601 date-time) |
| endDate     | LocalDateTime | No       | ISO 8601 date-time, nullable  |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "taxRateId": 3,
    "taxRate": {
      "id": 3,
      "code": "PPN_11",
      "name": "PPN 11%",
      "description": "Value Added Tax at 11% rate",
      "taxType": "PPN",
      "ratePercent": 11.0,
      "coefficientNumerator": 11.0,
      "coefficientDenominator": 100.0,
      "glPayment": "2102",
      "glInvoice": "1102",
      "startDate": "2022-04-01T00:00:00",
      "endDate": null,
      "createdAt": "2024-01-10T08:00:00",
      "updatedAt": "2024-01-10T08:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "glAccount": "2103",
    "startDate": "2024-01-01T00:00:00",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "message": "Company tax assignment created successfully",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Error Responses:**

- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission
- `404 Not Found` - Referenced tax rate not found

---

### 4. Update Company Tax Assignment

**Method:** `PUT`

**Endpoint:** `/api/master/company-tax/{id}`

**Permission Required:** `master-data:company-tax:update`

**Description:** Updates an existing company tax rate assignment.

**Path Parameters:**

| Parameter | Type | Required | Description               |
| --------- | ---- | -------- | ------------------------- |
| id        | Long | Yes      | Company tax assignment ID |

**Request Body:**

Same structure as the Create endpoint.

**Response (200 OK):**

Same structure as the Get by ID response.

**Error Responses:**

- `400 Bad Request` - Validation errors
- `404 Not Found` - Assignment with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Delete Company Tax Assignment

**Method:** `DELETE`

**Endpoint:** `/api/master/company-tax/{id}`

**Permission Required:** `master-data:company-tax:delete`

**Description:** Deletes a company tax rate assignment by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description               |
| --------- | ---- | -------- | ------------------------- |
| id        | Long | Yes      | Company tax assignment ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": "Company tax assignment deleted successfully",
  "message": "Company tax assignment deleted successfully",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Error Responses:**

- `404 Not Found` - Assignment with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

## Status Codes

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 200  | OK - Request successful                          |
| 201  | Created - Resource created successfully          |
| 400  | Bad Request - Validation errors                  |
| 401  | Unauthorized - Missing or invalid authentication |
| 403  | Forbidden - Insufficient permissions             |
| 404  | Not Found - Resource does not exist              |
| 500  | Internal Server Error - Unexpected server error  |

## Notes

1. **Effective Dates**: `startDate` is required; `endDate` is optional and `null` indicates an open-ended assignment.
2. **Active Date Filter**: The `activeOnDate` query parameter filters assignments where `startDate <= activeOnDate` and (`endDate` is null or `endDate >= activeOnDate`).
3. **Embedded Tax Rate**: The response includes the full `TaxRateResponseDTO` for the assigned tax rate alongside the `taxRateId` reference.
4. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.
