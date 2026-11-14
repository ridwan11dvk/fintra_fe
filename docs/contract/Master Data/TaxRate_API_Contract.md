# Tax Rate API Contract

## Overview

The Tax Rate API provides endpoints for managing tax rates in the Fintra system. This module handles the creation, retrieval, and management of different tax rates (PPN, PPh, etc.) with their calculation parameters and effective dates used for tax accounting purposes.

## Base URL

```
/api/master/tax-rates
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission                   | Description            |
| ------------ | ---------------------------- | ---------------------- |
| List/Read    | `master-data:tax-rate:list`   | View list of tax rates |
| Read Details | `master-data:tax-rate:read`   | View tax rate details  |
| Create       | `master-data:tax-rate:create` | Create tax rate        |
| Update       | `master-data:tax-rate:update` | Update tax rate        |
| Delete       | `master-data:tax-rate:delete` | Delete tax rate        |

## Data Models

### TaxRateResponseDTO

```json
{
  "id": 1,
  "code": "PPN_17",
  "name": "PPN 17%",
  "description": "Value Added Tax at 17% rate",
  "taxType": "PPN",
  "ratePercent": 17.0,
  "coefficientNumerator": 17.0,
  "coefficientDenominator": 100.0,
  "glPayment": "2102",
  "glInvoice": "1102",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

### TaxRateCreateUpdateDTO

```json
{
  "code": "PPN_17",
  "name": "PPN 17%",
  "description": "Value Added Tax at 17% rate",
  "taxType": "PPN",
  "ratePercent": 17.0,
  "coefficientNumerator": 17.0,
  "coefficientDenominator": 100.0,
  "glPayment": "2102",
  "glInvoice": "1102",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": null
}
```

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "code": "PPN_17",
      "name": "PPN 17%",
      "description": "Value Added Tax at 17% rate",
      "taxType": "PPN",
      "ratePercent": 17.0,
      "coefficientNumerator": 17.0,
      "coefficientDenominator": 100.0,
      "glPayment": "2102",
      "glInvoice": "1102",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
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
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Endpoints

### 1. Get All Tax Rates (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/tax-rates`

**Permission Required:** `master-data:tax-rate:list`

**Description:** Retrieves a paginated list of all tax rates in the system with optional search.

**Query Parameters:**

| Parameter | Type    | Required | Description                      | Example |
| --------- | ------- | -------- | -------------------------------- | ------- |
| search    | String  | No       | Search by code, name, or taxType | PPN     |
| page      | Integer | No       | Page number (0-indexed)          | 0       |
| size      | Integer | No       | Number of records per page       | 10      |
| sort      | String  | No       | Sort field and direction         | id,desc |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "code": "PPN_17",
        "name": "PPN 17%",
        "description": "Value Added Tax at 17% rate",
        "taxType": "PPN",
        "ratePercent": 17.0,
        "coefficientNumerator": 17.0,
        "coefficientDenominator": 100.0,
        "glPayment": "2102",
        "glInvoice": "1102",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": null,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "createdBy": "system",
        "updatedBy": "system"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "isFirst": true,
    "isLast": true
  },
  "message": "Tax rates retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 2. Get Tax Rate by ID

**Method:** `GET`

**Endpoint:** `/api/master/tax-rates/{id}`

**Permission Required:** `master-data:tax-rate:read`

**Description:** Retrieves a specific tax rate by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | Long | Yes      | Tax rate ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PPN_17",
    "name": "PPN 17%",
    "description": "Value Added Tax at 17% rate",
    "taxType": "PPN",
    "ratePercent": 17.0,
    "coefficientNumerator": 17.0,
    "coefficientDenominator": 100.0,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Tax rate retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Tax rate with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 3. Get Tax Rate by Code

**Method:** `GET`

**Endpoint:** `/api/master/tax-rates/code/{code}`

**Permission Required:** `master-data:tax-rate:read`

**Description:** Retrieves a specific tax rate by its code.

**Path Parameters:**

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| code      | String | Yes      | Tax rate code |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PPN_17",
    "name": "PPN 17%",
    "description": "Value Added Tax at 17% rate",
    "taxType": "PPN",
    "ratePercent": 17.0,
    "coefficientNumerator": 17.0,
    "coefficientDenominator": 100.0,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Tax rate retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Tax rate with given code not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 4. Create Tax Rate

**Method:** `POST`

**Endpoint:** `/api/master/tax-rates`

**Permission Required:** `master-data:tax-rate:create`

**Description:** Creates a new tax rate in the system.

**Request Body:**

```json
{
  "code": "PPN_17",
  "name": "PPN 17%",
  "description": "Value Added Tax at 17% rate",
  "taxType": "PPN",
  "ratePercent": 17.0,
  "coefficientNumerator": 17.0,
  "coefficientDenominator": 100.0,
  "glPayment": "2102",
  "glInvoice": "1102",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": null
}
```

**Request Validation Rules:**

| Field                  | Type          | Required | Constraints                                      |
| ---------------------- | ------------- | -------- | ------------------------------------------------ |
| code                   | String        | Yes      | Not blank, Max 50 chars, Unique                  |
| name                   | String        | Yes      | Not blank, Max 255 chars                         |
| description            | String        | No       | Max 1000 chars                                   |
| taxType                | String        | Yes      | Not blank, Max 20 chars                          |
| ratePercent            | Decimal(5,2)  | Yes      | 0.0 ≤ value ≤ 100.00                             |
| coefficientNumerator   | Decimal(10,2) | Yes      | > 0.0 (typically 1 for standard use)             |
| coefficientDenominator | Decimal(10,2) | Yes      | > 0.0 (typically 1 for standard use, never zero) |
| glPayment              | String        | No       | Max 50 chars                                     |
| glInvoice              | String        | No       | Max 50 chars                                     |
| startDate              | LocalDateTime | Yes      | Date when tax rate becomes effective             |
| endDate                | LocalDateTime | No       | Date when tax rate expires (null for indefinite) |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PPN_17",
    "name": "PPN 17%",
    "description": "Value Added Tax at 17% rate",
    "taxType": "PPN",
    "ratePercent": 17.0,
    "coefficientNumerator": 17.0,
    "coefficientDenominator": 100.0,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Tax rate created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "code": "Tax rate code cannot be blank",
      "ratePercent": "Rate percent must be less than or equal to 100"
    }
  }
  ```
- `409 Conflict` - Tax rate code already exists
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Update Tax Rate

**Method:** `PUT`

**Endpoint:** `/api/master/tax-rates/{id}`

**Permission Required:** `master-data:tax-rate:update`

**Description:** Updates an existing tax rate with new information.

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | Long | Yes      | Tax rate ID |

**Request Body:**

```json
{
  "code": "PPN_17",
  "name": "PPN 17% Updated",
  "description": "Value Added Tax at 17% rate (updated)",
  "taxType": "PPN",
  "ratePercent": 17.0,
  "coefficientNumerator": 17.0,
  "coefficientDenominator": 100.0,
  "glPayment": "2102",
  "glInvoice": "1102",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": null
}
```

**Request Validation Rules:**

| Field                  | Type          | Required | Constraints                                      |
| ---------------------- | ------------- | -------- | ------------------------------------------------ |
| code                   | String        | Yes      | Not blank, Max 50 chars, Unique (except current) |
| name                   | String        | Yes      | Not blank, Max 255 chars                         |
| description            | String        | No       | Max 1000 chars                                   |
| taxType                | String        | Yes      | Not blank, Max 20 chars                          |
| ratePercent            | Decimal(5,2)  | Yes      | 0.0 ≤ value ≤ 100.00                             |
| coefficientNumerator   | Decimal(10,2) | Yes      | > 0.0                                            |
| coefficientDenominator | Decimal(10,2) | Yes      | > 0.0 (never zero)                               |
| glPayment              | String        | No       | Max 50 chars                                     |
| glInvoice              | String        | No       | Max 50 chars                                     |
| startDate              | LocalDateTime | Yes      | Date when tax rate becomes effective             |
| endDate                | LocalDateTime | No       | Date when tax rate expires                       |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PPN_17",
    "name": "PPN 17% Updated",
    "description": "Value Added Tax at 17% rate (updated)",
    "taxType": "PPN",
    "ratePercent": 17.0,
    "coefficientNumerator": 17.0,
    "coefficientDenominator": 100.0,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": "system",
    "updatedBy": "admin"
  },
  "message": "Tax rate updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
- `404 Not Found` - Tax rate with given ID not found
- `409 Conflict` - Tax rate code already exists for another record
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 6. Delete Tax Rate

**Method:** `DELETE`

**Endpoint:** `/api/master/tax-rates/{id}`

**Permission Required:** `master-data:tax-rate:delete`

**Description:** Deletes a tax rate by ID.

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | Long | Yes      | Tax rate ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": "Tax rate deleted successfully",
  "message": "Tax rate deleted successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Tax rate with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

## Common HTTP Status Codes

| Status Code | Description                                      |
| ----------- | ------------------------------------------------ |
| 200         | OK - Request succeeded                           |
| 201         | Created - Resource successfully created          |
| 400         | Bad Request - Invalid input or malformed request |
| 401         | Unauthorized - Missing or invalid authentication |
| 403         | Forbidden - User lacks required permissions      |
| 404         | Not Found - Resource not found                   |
| 409         | Conflict - Duplicate code or reference conflict  |
| 500         | Internal Server Error - Server-side error        |

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-15T11:00:00Z",
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

## Request/Response Headers

### Required Headers

```
Content-Type: application/json
Authorization: Bearer {access_token}
```

### Response Headers

```
Content-Type: application/json
X-Total-Count: {total_records}
X-Page-Number: {current_page}
X-Page-Size: {page_size}
```

## Example Usage

### Create a tax rate

```bash
curl -X POST http://localhost:8080/api/master/tax-rates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "PPN_17",
    "name": "PPN 17%",
    "description": "Value Added Tax at 17% rate",
    "taxType": "PPN",
    "ratePercent": 17.00,
    "coefficientNumerator": 17.00,
    "coefficientDenominator": 100.00,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null
  }'
```

### Get all tax rates with pagination and search

```bash
curl "http://localhost:8080/api/master/tax-rates?search=PPN&page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

### Update a tax rate

```bash
curl -X PUT http://localhost:8080/api/master/tax-rates/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "PPN_17",
    "name": "PPN 17% Updated",
    "description": "Value Added Tax at 17% rate (updated)",
    "taxType": "PPN",
    "ratePercent": 17.00,
    "coefficientNumerator": 17.00,
    "coefficientDenominator": 100.00,
    "glPayment": "2102",
    "glInvoice": "1102",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null
  }'
```

### Delete a tax rate

```bash
curl -X DELETE http://localhost:8080/api/master/tax-rates/1 \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=0, size=20
- The `createdBy` and `updatedBy` fields are automatically managed by the system
- Tax rate codes must be unique and are case-sensitive
- Tax rates with past `endDate` should be retained for historical transaction tracking and audit purposes (never delete)
- The coefficient denominator must never be zero to prevent division by zero errors
- Search functionality supports partial matching across code, name, and tax type fields
- For date range queries to find applicable tax rates: `transaction_date BETWEEN start_date AND COALESCE(end_date, CURRENT_TIMESTAMP)`
- All operations are audited for compliance and tracking purposes
