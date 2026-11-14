# Currency Master Data API Contract

## Overview

The Currency Master Data API provides endpoints for managing currencies in the system. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/currency`
- **Authentication**: Bearer JWT Token
- **Content-Type**: `application/json`
- **Response Format**: All responses wrapped in `ApiResponse` envelope

---

## Common Response Structure

### Success Response

```json
{
  "message": "Operation successful",
  "status": "SUCCESS",
  "data": {},
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

### Paginated Response

```json
{
  "message": "Currencies retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

---

## Endpoints

### 1. List All Currencies

Retrieves a paginated list of currencies with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:currency:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code, name, or symbol
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Currencies retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "countryId": 1,
        "code": "IDR",
        "name": "Indonesian Rupiah",
        "symbol": "Rp",
        "isPrimary": true,
        "isActive": true,
        "country": {
          "id": 1,
          "name": "Indonesia",
          "iso2Code": "ID",
          "iso3Code": "IDN",
          "dialCode": "+62",
          "region": "Asia",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 150,
    "totalPages": 15,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid pagination parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Currency by ID

Retrieves a specific currency by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:currency:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency ID (required)

#### Response (200 OK)

```json
{
  "message": "Currency retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 1,
    "code": "IDR",
    "name": "Indonesian Rupiah",
    "symbol": "Rp",
    "isPrimary": true,
    "isActive": true,
    "country": {
      "id": 1,
      "name": "Indonesia",
      "iso2Code": "ID",
      "iso3Code": "IDN",
      "dialCode": "+62",
      "region": "Asia",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Currency does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Currencies by Country

Retrieves all currencies associated with a specific country.

**Endpoint**: `GET /country/{countryId}`  
**Permission**: `master-data:currency:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `countryId` (Long): Country ID (required)

#### Response (200 OK)

```json
{
  "message": "Currencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "countryId": 1,
      "code": "IDR",
      "name": "Indonesian Rupiah",
      "symbol": "Rp",
      "isPrimary": true,
      "isActive": true,
      "country": {
        "id": 1,
        "name": "Indonesia",
        "iso2Code": "ID",
        "iso3Code": "IDN",
        "dialCode": "+62",
        "region": "Asia",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get Active Currencies by Country

Retrieves all active currencies for a specific country.

**Endpoint**: `GET /country/{countryId}/active`  
**Permission**: `master-data:currency:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `countryId` (Long): Country ID (required)

#### Response (200 OK)

Same structure as Get Currencies by Country endpoint.

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Create Currency

Creates a new currency.

**Endpoint**: `POST /`  
**Permission**: `master-data:currency:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "countryId": 1,
  "code": "IDR",
  "name": "Indonesian Rupiah",
  "symbol": "Rp",
  "lowestValue": 1.0,
  "isPrimary": true,
  "isActive": true
}
```

#### Request Validations

- `countryId`: Required, must reference valid country
- `code`: Required, exactly 3 characters, must be unique
- `name`: Optional, max 100 characters
- `symbol`: Optional, max 10 characters
- `lowestValue`: Optional, minimum currency value for transactions
- `isPrimary`: Optional, defaults to false
- `isActive`: Optional, defaults to true

#### Response (201 Created)

```json
{
  "message": "Currency created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 1,
    "code": "IDR",
    "name": "Indonesian Rupiah",
    "symbol": "Rp",
    "isPrimary": true,
    "isActive": true,
    "country": {
      "id": 1,
      "name": "Indonesia",
      "iso2Code": "ID",
      "iso3Code": "IDN",
      "dialCode": "+62",
      "region": "Asia",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **409 Conflict**: Duplicate currency code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Update Currency

Updates an existing currency.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:currency:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency ID (required)

#### Request

```json
{
  "countryId": 1,
  "code": "IDR",
  "name": "Indonesian Rupiah",
  "symbol": "Rp",
  "lowestValue": 1.0,
  "isPrimary": true,
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Currency updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 1,
    "code": "IDR",
    "name": "Indonesian Rupiah",
    "symbol": "Rp",
    "isPrimary": true,
    "isActive": true,
    "country": {
      "id": 1,
      "name": "Indonesia",
      "iso2Code": "ID",
      "iso3Code": "IDN",
      "dialCode": "+62",
      "region": "Asia",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T15:30:00",
    "createdBy": "admin",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Currency does not exist
- **409 Conflict**: Duplicate currency code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Delete Currency

Deletes a currency by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:currency:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency ID (required)

#### Response (200 OK)

```json
{
  "message": "Currency deleted successfully",
  "status": "SUCCESS",
  "data": "Currency deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Currency does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation       | Permission                   |
| --------------- | ---------------------------- |
| List Currencies | `master-data:currency:list`   |
| Read Currency   | `master-data:currency:read`   |
| Create Currency | `master-data:currency:create` |
| Update Currency | `master-data:currency:update` |
| Delete Currency | `master-data:currency:delete` |

---

## Data Type Reference

| Type    | Format     | Example |
| ------- | ---------- | ------- |
| Long    | Integer    | 1       |
| String  | Text       | "IDR"   |
| Boolean | true/false | true    |

---

## Status Codes

| Code | Description                                       |
| ---- | ------------------------------------------------- |
| 200  | OK - Request successful                           |
| 201  | Created - Resource created successfully           |
| 400  | Bad Request - Validation errors                   |
| 401  | Unauthorized - Missing/invalid authentication     |
| 403  | Forbidden - Insufficient permissions              |
| 404  | Not Found - Resource does not exist               |
| 409  | Conflict - Duplicate resource (unique constraint) |
| 500  | Internal Server Error - Unexpected server error   |

---

## Notes

1. **Currency Code**: ISO 4217 standard 3-letter currency codes (e.g., IDR, USD, EUR)
2. **Primary Currency**: Each country should have exactly one primary currency
3. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes
4. **Active Status**: Controlled by system, defaults to true on creation
5. **Sorting**: Default sort is by ID in ascending order
