# Country Master Data API Contract

## Overview

The Country Master Data API provides endpoints for managing country information within the system. The API supports comprehensive country data including ISO codes and dial codes for international identification. The API uses JWT authentication with permission-based access control for secure country management.

---

## Base Information

- **Base URL**: `/api/master/country`
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
  "message": "Countries retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [],
    "totalElements": 240,
    "totalPages": 24,
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

### 1. List All Countries

Retrieves a paginated list of countries with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:country:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by name, ISO codes, or dial code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Countries retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
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
      {
        "id": 2,
        "name": "Singapore",
        "iso2Code": "SG",
        "iso3Code": "SGP",
        "dialCode": "+65",
        "region": "Asia",
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 240,
    "totalPages": 24,
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

### 2. Get Country by ID

Retrieves a specific country by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:country:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Country ID (required)

#### Response (200 OK)

```json
{
  "message": "Country retrieved successfully",
  "status": "SUCCESS",
  "data": {
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
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Country does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Country

Creates a new country.

**Endpoint**: `POST /`  
**Permission**: `master-data:country:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "name": "Indonesia",
  "iso2Code": "ID",
  "iso3Code": "IDN",
  "dialCode": "+62",
  "region": "Asia"
}
```

#### Request Validations

- `name`: Required, max 100 characters, must be unique
- `iso2Code`: Required, exactly 2 characters, must be unique
- `iso3Code`: Required, exactly 3 characters, must be unique
- `dialCode`: Required, max 20 characters
- `region`: Optional, max 100 characters

#### Response (201 Created)

```json
{
  "message": "Country created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Indonesia",
    "iso2Code": "ID",
    "iso3Code": "IDN",
    "dialCode": "+62",
    "region": "Asia",
    "isActive": true,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T10:00:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank name/codes, invalid format)
- **409 Conflict**: Duplicate country name, ISO2 code, or ISO3 code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Country

Updates an existing country.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:country:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Country ID (required)

#### Request

```json
{
  "name": "Indonesia",
  "iso2Code": "ID",
  "iso3Code": "IDN",
  "dialCode": "+62",
  "region": "Asia",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Country updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Indonesia",
    "iso2Code": "ID",
    "iso3Code": "IDN",
    "dialCode": "+62",
    "region": "Asia",
    "isActive": true,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T15:30:00",
    "createdBy": "admin",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank name/codes, invalid format)
- **404 Not Found**: Country does not exist
- **409 Conflict**: Duplicate country name, ISO2 code, or ISO3 code for another country
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Country

Deletes a country by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:country:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Country ID (required)

#### Response (200 OK)

```json
{
  "message": "Country deleted successfully",
  "status": "SUCCESS",
  "data": "Country deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Country does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation      | Permission                  |
| -------------- | --------------------------- |
| List Countries | `master-data:country:list`   |
| Read Country   | `master-data:country:read`   |
| Create Country | `master-data:country:create` |
| Update Country | `master-data:country:update` |
| Delete Country | `master-data:country:delete` |

---

## Data Type Reference

| Type    | Format     | Example     |
| ------- | ---------- | ----------- |
| Long    | Integer    | 1           |
| String  | Text       | "Indonesia" |
| Boolean | true/false | true        |

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

1. **Unique Constraints**: Country name, ISO2 code, and ISO3 code must be unique
   - Attempting to create or update with duplicate values will return 409 Conflict

2. **ISO Code Standards**:
   - `iso2Code`: Two-letter country code as per ISO 3166-1 alpha-2 standard
   - `iso3Code`: Three-letter country code as per ISO 3166-1 alpha-3 standard
   - Example: Indonesia (ID, IDN), Singapore (SG, SGP)

3. **Dial Code**: International telephone dialing code
   - Format: Plus sign (+) followed by numeric country code
   - Example: "+62" for Indonesia, "+65" for Singapore

4. **Region Field**: Geographic region for classification
   - Used to organize and group countries by geography
   - Example: Asia, Europe, Africa, Americas, Oceania

5. **Active Status**: Controlled by system, defaults to true on creation
   - Inactive countries may be retained for historical and audit purposes

6. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

7. **Search Functionality**: The search parameter filters across name, ISO codes (iso2Code, iso3Code), and dial code using case-insensitive matching

8. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

9. **Used by Other Entities**: Country records are referenced by other master data entities
   - Cannot delete a country that is actively referenced by other entities (data integrity)

10. **Pagination**: Default page size is 10 items, maximum configurable per system settings
