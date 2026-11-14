# Regency Master Data API Contract

## Overview

The Regency Master Data API provides endpoints for managing regencies within the system. The API supports hierarchical organization where regencies belong to provinces, and supports CRUD operations with JWT authentication and permission-based access control. Regencies form the secondary geographic hierarchy level and contain districts as child entities.

---

## Base Information

- **Base URL**: `/api/master/regency`
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
  "message": "Regencies retrieved successfully",
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

### 1. List All Regencies

Retrieves a paginated list of regencies with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:regency:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Regencies retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "REG001",
        "name": "Bandung",
        "provinceId": 1,
        "province": {
          "id": 1,
          "code": "PROV001",
          "name": "West Java",
          "alias": "Jawa Barat",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "code": "REG002",
        "name": "Sukabumi",
        "provinceId": 1,
        "province": {
          "id": 1,
          "code": "PROV001",
          "name": "West Java",
          "alias": "Jawa Barat",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 125,
    "totalPages": 13,
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

### 2. Get Regency by ID

Retrieves a specific regency by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:regency:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Regency ID (required)

#### Response (200 OK)

```json
{
  "message": "Regency retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "REG001",
    "name": "Bandung",
    "provinceId": 1,
    "province": {
      "id": 1,
      "code": "PROV001",
      "name": "West Java",
      "alias": "Jawa Barat",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
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

- **404 Not Found**: Regency does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Regencies by Province

Retrieves all active regencies associated with a specific province.

**Endpoint**: `GET /province/{provinceId}`  
**Permission**: `master-data:regency:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `provinceId` (Long): Province ID (required)

#### Response (200 OK)

```json
{
  "message": "Regencies retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "REG001",
      "name": "Bandung",
      "provinceId": 1,
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "code": "REG002",
      "name": "Sukabumi",
      "provinceId": 1,
      "isActive": true,
      "createdAt": "2026-02-01T11:00:00",
      "updatedAt": "2026-02-01T11:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Province does not exist (optional, returns empty list if province has no regencies)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create Regency

Creates a new regency.

**Endpoint**: `POST /`  
**Permission**: `master-data:regency:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "REG001",
  "name": "Bandung",
  "provinceId": 1
}
```

#### Request Validations

- `code`: Optional, max 50 characters
- `name`: Required, max 100 characters, must be unique
- `provinceId`: Optional, must reference an existing province if provided

#### Response (201 Created)

```json
{
  "message": "Regency created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "REG001",
    "name": "Bandung",
    "provinceId": 1,
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

- **400 Bad Request**: Validation errors (blank name, invalid field values)
- **404 Not Found**: Province not found (when provinceId is provided)
- **409 Conflict**: Duplicate regency name
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Regency

Updates an existing regency.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:regency:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Regency ID (required)

#### Request

```json
{
  "code": "REG001",
  "name": "Bandung",
  "provinceId": 1
}
```

#### Response (200 OK)

```json
{
  "message": "Regency updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "REG001",
    "name": "Bandung",
    "provinceId": 1,
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

- **400 Bad Request**: Validation errors (blank name, invalid field values)
- **404 Not Found**: Regency does not exist or province not found
- **409 Conflict**: Duplicate regency name for another regency
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Regency

Deletes a regency by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:regency:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Regency ID (required)

#### Response (200 OK)

```json
{
  "message": "Regency deleted successfully",
  "status": "SUCCESS",
  "data": "Regency deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Regency does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation      | Permission                  |
| -------------- | --------------------------- |
| List Regencies | `master-data:regency:list`   |
| Read Regency   | `master-data:regency:read`   |
| Create Regency | `master-data:regency:create` |
| Update Regency | `master-data:regency:update` |
| Delete Regency | `master-data:regency:delete` |

---

## Data Type Reference

| Type    | Format     | Example   |
| ------- | ---------- | --------- |
| Long    | Integer    | 1         |
| String  | Text       | "Bandung" |
| Boolean | true/false | true      |

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

1. **Geographic Hierarchy**: Regencies belong to provinces forming the secondary geographic level
   - Province hierarchy: Province > Regency > District > Village
   - Each regency must be associated with a province

2. **Name Uniqueness**: Each regency name must be unique across the entire system

3. **Province Relationship**: When creating or updating with a provinceId, the province must exist in the system

4. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

5. **Active Status**: Controlled by system, defaults to true on creation
   - Only active regencies are returned by the province hierarchy endpoint (`/province/{provinceId}`)
   - Inactive regencies may be retained in the system for audit purposes

6. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

7. **Search Functionality**: The search parameter filters across code and name fields using case-insensitive matching

8. **Child Query**: The `/province/{provinceId}` endpoint only returns active regencies. Use the general list endpoint with search/filter for inactive items
