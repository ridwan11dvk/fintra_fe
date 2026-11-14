# Currency Rate Master Data API Contract

## Overview

The Currency Rate Master Data API provides endpoints for managing currency exchange rates with effective dating. The API supports multiple rate sources (KMK/Ministry of Finance and BI/Bank Indonesia). Uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/currency-rate`
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
  "message": "Currency rates retrieved successfully",
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

## Data Models

### Currency Rate Response DTO

```json
{
  "id": 1,
  "currencyCode": "IDR",
  "rateType": "KMK",
  "rate": 15500.5,
  "description": "Official rate for import duties",
  "startDate": "2026-02-01T00:00:00",
  "endDate": null,
  "createdAt": "2026-02-01T10:00:00",
  "updatedAt": "2026-02-01T10:00:00",
  "createdBy": "admin",
  "updatedBy": "admin"
}
```

**Field Descriptions:**

- `id`: Unique identifier
- `currencyCode`: Currency code (e.g., "IDR", "USD")
- `rateType`: Rate source type - "KMK" (Ministry of Finance) or "BI" (Bank Indonesia)
- `rate`: Exchange rate value (format: NUMERIC(15,6))
- `description`: Optional notes about the rate
- `startDate`: Date when rate becomes effective
- `endDate`: Date when rate expires (null = ongoing)
- `createdAt`: Audit field - creation timestamp
- `updatedAt`: Audit field - last update timestamp
- `createdBy`: Audit field - created by user
- `updatedBy`: Audit field - updated by user

### Create/Update Request DTO

```json
{
  "currencyCode": "IDR",
  "rateType": "KMK",
  "rate": 15500.5,
  "description": "Official rate for import duties",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

---

## Endpoints

### 1. List All Currency Rates

Retrieves a paginated list of currency rates with optional filters.

**Endpoint**: `GET /`  
**Permission**: `master-data:currency-rate:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword (searches rate type, description, and currency code)
- `currencyCode` (string, optional): Filter by currency code (e.g., "IDR", "USD")
- `rateType` (string, optional): Filter by rate type - "KMK" or "BI"
- `dateFrom` (datetime, optional): Filter rates with timestamps (ISO 8601: YYYY-MM-DDTHH:MM:SS)
- `dateTo` (datetime, optional): Filter rates with timestamps (ISO 8601: YYYY-MM-DDTHH:MM:SS)
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Currency rates retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "currencyCode": "IDR",
        "rateType": "KMK",
        "rate": 15500.5,
        "description": "Official rate for import duties",
        "startDate": "2026-02-01T00:00:00",
        "endDate": null,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 250,
    "totalPages": 25,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid query parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Currency Rate by ID

Retrieves a specific currency rate by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:currency-rate:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency Rate ID (required)

#### Response (200 OK)

```json
{
  "message": "Currency rate retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "currencyCode": "IDR",
    "rateType": "KMK",
    "rate": 15500.5,
    "description": "Official rate for import duties",
    "startDate": "2026-02-01T00:00:00",
    "endDate": null,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Currency rate does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Currency Rates by Currency Code

Retrieves all rates for a specific currency code.

**Endpoint**: `GET /currency/{currencyCode}`  
**Permission**: `master-data:currency-rate:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `currencyCode` (string): Currency code, e.g., "IDR", "USD" (required)

#### Response (200 OK)

```json
{
  "message": "Currency rates retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "currencyCode": "IDR",
      "rateType": "KMK",
      "rate": 15500.5,
      "description": "Official rate for import duties",
      "startDate": "2026-02-01T00:00:00",
      "endDate": null,
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

### 4. Get Currency Rates by Currency Code and Rate Type

Retrieves all rates for a specific currency code and rate type combination.

**Endpoint**: `GET /currency/{currencyCode}/rate-type/{rateType}`  
**Permission**: `master-data:currency-rate:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `currencyCode` (string): Currency code, e.g., "IDR", "USD" (required)
- `rateType` (string): Rate type - "KMK" or "BI" (required)

#### Response (200 OK)

Same structure as Get Currency Rates by Currency (returns a list, not paginated).

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Get Rate at Specific Date

Retrieves the active rate for a currency code and type at a specific date.

**Endpoint**: `GET /currency/{currencyCode}/rate-type/{rateType}/at-date`  
**Permission**: `master-data:currency-rate:read`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `date` (date): Target date in ISO 8601 format (YYYY-MM-DD, will be converted to start of day) (required)

#### URL Parameters

- `currencyCode` (string): Currency code, e.g., "IDR", "USD" (required)
- `rateType` (string): Rate type - "KMK" or "BI" (required)

#### Response (200 OK)

```json
{
  "message": "Currency rate retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "currencyCode": "IDR",
    "rateType": "KMK",
    "rate": 15500.5,
    "description": "Official rate for import duties",
    "startDate": "2026-02-01T00:00:00",
    "endDate": null,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: No active rate found for specified currency code and rate type at date
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Get Latest Rate

Retrieves the most recent active rate for a currency code and type.

**Endpoint**: `GET /currency/{currencyCode}/rate-type/{rateType}/latest`  
**Permission**: `master-data:currency-rate:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `currencyCode` (string): Currency code, e.g., "IDR", "USD" (required)
- `rateType` (string): Rate type - "KMK" or "BI" (required)

#### Response (200 OK)

Same structure as Get Rate at Specific Date.

#### Error Responses

- **404 Not Found**: No rate found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Create Currency Rate

Creates a new currency rate.

**Endpoint**: `POST /`  
**Permission**: `master-data:currency-rate:update`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "currencyCode": "IDR",
  "rateType": "KMK",
  "rate": 15500.5,
  "description": "Official rate for import duties",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

#### Request Validations

- `currencyCode`: Required, cannot be blank, valid currency code (e.g., "IDR", "USD")
- `rateType`: Required, cannot be blank, must be a valid rate type
- `rate`: Required, must be greater than 0 (minimum value 0.000001), BigDecimal with up to 6 decimal places
- `description`: Optional
- `startDate`: Required, ISO 8601 format (YYYY-MM-DD)
- `endDate`: Optional, ISO 8601 format (YYYY-MM-DD), must be after startDate if provided

#### Response (201 Created)

```json
{
  "message": "Currency rate created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "currencyCode": "IDR",
    "rateType": "KMK",
    "rate": 15500.5,
    "description": "Official rate for import duties",
    "startDate": "2026-02-01T00:00:00",
    "endDate": "2026-02-28T00:00:00",
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (invalid rate value, missing required fields, invalid date format)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Update Currency Rate

Updates an existing currency rate.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:currency-rate:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency Rate ID (required)

#### Request

```json
{
  "currencyCode": "IDR",
  "rateType": "KMK",
  "rate": 15600.0,
  "description": "Updated official rate",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

#### Response (200 OK)

```json
{
  "message": "Currency rate updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "currencyCode": "IDR",
    "rateType": "KMK",
    "rate": 15600.0,
    "description": "Updated official rate",
    "startDate": "2026-02-01T00:00:00",
    "endDate": "2026-02-28T00:00:00",
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T15:30:00",
    "createdBy": "admin",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (invalid rate value, missing required fields, invalid date format)
- **404 Not Found**: Currency rate does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 9. Delete Currency Rate

Deletes a currency rate by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:currency-rate:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Currency Rate ID (required)

#### Response (200 OK)

```json
{
  "message": "Currency rate deleted successfully",
  "status": "SUCCESS",
  "data": "Currency rate deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Currency rate does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation            | Permission                        |
| -------------------- | --------------------------------- |
| List Currency Rates  | `master-data:currency-rate:list`   |
| Read Currency Rate   | `master-data:currency-rate:read`   |
| Create Currency Rate | `master-data:currency-rate:update` |
| Update Currency Rate | `master-data:currency-rate:update` |
| Delete Currency Rate | `master-data:currency-rate:update` |

---

## Rate Types

| Type | Description                                |
| ---- | ------------------------------------------ |
| KMK  | Ministry of Finance (Kementerian Keuangan) |
| BI   | Bank Indonesia (Bank Indonesia)            |

---

## Effective Dating Rules

1. **Ongoing Rates**: If `endDate` is null, the rate is considered ongoing/indefinite
2. **Date Ranges**: `startDate` must always be before `endDate` (if endDate is provided)
3. **Date Format**: Input dates use ISO 8601 format (YYYY-MM-DD) and are converted to LocalDate
4. **Start of Day**: When retrieved, dates are stored as LocalDateTime (start of day)

---

## Data Type Reference

| Type          | Format        | Example               |
| ------------- | ------------- | --------------------- | --------------------------- | ------------------- | ------------------- |
| currency_code | rate_type     | rate                  | description                 | start_date          | end_date            |
| ------------- | ---------     | ---------             | --------------------------- | ------------------- | ------------------- |
| IDR           | BI            | 16500.5               | BI exchange rate IDR/USD    | 2026-02-01 00:00:00 | NULL                |
| USD           | KMK           | 0.0000606             | KMK conversion rate USD/IDR | 2026-02-01 00:00:00 | NULL                |
| BigDecimal    | Numeric(15,6) | 15500.500000          |
| LocalDate     | ISO 8601      | "2026-02-01"          |
| LocalDateTime | ISO 8601      | "2026-02-01T00:00:00" |

---

## Status Codes

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 200  | OK - Request successful                          |
| 201  | Created - Resource created successfully          |
| 400  | Bad Request - Validation errors or invalid dates |
| 401  | Unauthorized - Missing/invalid authentication    |
| 403  | Forbidden - Insufficient permissions             |
| 404  | Not Found - Resource does not exist              |
| 409  | Conflict - Overlapping rate or unique constraint |
| 500  | Internal Server Error - Unexpected server error  |

---

## Notes

1. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes
2. **Rate Precision**: Rates are stored and returned as BigDecimal with precision of 6 decimal places
3. **Null End Date**: Represents an ongoing rate with no expiration date
4. **Sorting**: Default sort is by ID in ascending order
5. **Date Format**: Input dates should be in ISO 8601 format (YYYY-MM-DD). Retrieved dates are in ISO 8601 format with timestamps (YYYY-MM-DDTHH:MM:SS)
6. **Rate Validation**: Rate values must be greater than 0 and cannot be negative or zero
7. **Endpoints 3 & 4**: These endpoints return a list of rates, not a paginated response (no pagination metadata)
