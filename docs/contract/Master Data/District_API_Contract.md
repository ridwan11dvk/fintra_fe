# District Master Data API Contract

## Overview

The District Master Data API provides endpoints for managing districts within the system. The API supports hierarchical organization where districts belong to regencies, and supports CRUD operations with JWT authentication and permission-based access control. Districts form the tertiary geographic hierarchy level and contain villages as child entities.

---

## Base Information

- **Base URL**: `/api/master/district`
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
  "message": "Districts retrieved successfully",
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

### 1. List All Districts

Retrieves a paginated list of districts with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:district:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Districts retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "DIST001",
        "name": "Bandung City",
        "regencyId": 1,
        "regency": {
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
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "code": "DIST002",
        "name": "Bandung District",
        "regencyId": 1,
        "regency": {
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
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 500,
    "totalPages": 50,
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

### 2. Get District by ID

Retrieves a specific district by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:district:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): District ID (required)

#### Response (200 OK)

```json
{
  "message": "District retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "DIST001",
    "name": "Bandung City",
    "regencyId": 1,
    "regency": {
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

- **404 Not Found**: District does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Districts by Regency

Retrieves all active districts associated with a specific regency.

**Endpoint**: `GET /regency/{regencyId}`  
**Permission**: `master-data:district:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `regencyId` (Long): Regency ID (required)

#### Response (200 OK)

```json
{
  "message": "Districts retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "DIST001",
      "name": "Bandung City",
      "regencyId": 1,
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "code": "DIST002",
      "name": "Bandung District",
      "regencyId": 1,
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

- **404 Not Found**: Regency does not exist (optional, returns empty list if regency has no districts)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create District

Creates a new district.

**Endpoint**: `POST /`  
**Permission**: `master-data:district:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "DIST001",
  "name": "Bandung City",
  "regencyId": 1
}
```

#### Request Validations

- `code`: Optional, max 50 characters
- `name`: Required, max 100 characters, must be unique
- `regencyId`: Optional, must reference an existing regency if provided

#### Response (201 Created)

```json
{
  "message": "District created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "DIST001",
    "name": "Bandung City",
    "regencyId": 1,
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
- **404 Not Found**: Regency not found (when regencyId is provided)
- **409 Conflict**: Duplicate district name
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update District

Updates an existing district.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:district:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): District ID (required)

#### Request

```json
{
  "code": "DIST001",
  "name": "Bandung City",
  "regencyId": 1
}
```

#### Response (200 OK)

```json
{
  "message": "District updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "DIST001",
    "name": "Bandung City",
    "regencyId": 1,
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
- **404 Not Found**: District does not exist or regency not found
- **409 Conflict**: Duplicate district name for another district
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete District

Deletes a district by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:district:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): District ID (required)

#### Response (200 OK)

```json
{
  "message": "District deleted successfully",
  "status": "SUCCESS",
  "data": "District deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: District does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation       | Permission                   |
| --------------- | ---------------------------- |
| List Districts  | `master-data:district:list`   |
| Read District   | `master-data:district:read`   |
| Create District | `master-data:district:create` |
| Update District | `master-data:district:update` |
| Delete District | `master-data:district:delete` |

---

## Data Type Reference

| Type    | Format     | Example        |
| ------- | ---------- | -------------- |
| Long    | Integer    | 1              |
| String  | Text       | "Bandung City" |
| Boolean | true/false | true           |

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

1. **Geographic Hierarchy**: Districts belong to regencies forming the tertiary geographic level
   - Province hierarchy: Province > Regency > District > Village
   - Each district must be associated with a regency

2. **Name Uniqueness**: Each district name must be unique across the entire system

3. **Regency Relationship**: When creating or updating with a regencyId, the regency must exist in the system

4. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

5. **Active Status**: Controlled by system, defaults to true on creation
   - Only active districts are returned by the regency hierarchy endpoint (`/regency/{regencyId}`)
   - Inactive districts may be retained in the system for audit purposes

6. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

7. **Search Functionality**: The search parameter filters across code and name fields using case-insensitive matching

8. **Child Query**: The `/regency/{regencyId}` endpoint only returns active districts. Use the general list endpoint with search/filter for inactive items
