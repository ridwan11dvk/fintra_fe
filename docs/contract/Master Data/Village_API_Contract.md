# Village Master Data API Contract

## Overview

The Village Master Data API provides endpoints for managing villages within the system. The API supports hierarchical organization where villages belong to districts, and supports CRUD operations with JWT authentication and permission-based access control. Villages form the lowest level geographic hierarchy and contain postal codes and address information for residents and locations.

---

## Base Information

- **Base URL**: `/api/master/village`
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
  "message": "Villages retrieved successfully",
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

### 1. List All Villages

Retrieves a paginated list of villages with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:village:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by name, code, or postal code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Villages retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "VIL001",
        "name": "Cihampelas",
        "postalCode": "40141",
        "districtId": 1,
        "district": {
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
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "code": "VIL002",
        "name": "Cibereum",
        "postalCode": "40142",
        "districtId": 1,
        "district": {
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
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 8500,
    "totalPages": 850,
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

### 2. Get Village by ID

Retrieves a specific village by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:village:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Village ID (required)

#### Response (200 OK)

```json
{
  "message": "Village retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "VIL001",
    "name": "Cihampelas",
    "postalCode": "40141",
    "districtId": 1,
    "district": {
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

- **404 Not Found**: Village does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Villages by District

Retrieves all active villages associated with a specific district.

**Endpoint**: `GET /district/{districtId}`  
**Permission**: `master-data:village:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `districtId` (Long): District ID (required)

#### Response (200 OK)

```json
{
  "message": "Villages retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "VIL001",
      "name": "Cihampelas",
      "postalCode": "40141",
      "districtId": 1,
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "code": "VIL002",
      "name": "Cibereum",
      "postalCode": "40142",
      "districtId": 1,
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

- **404 Not Found**: District does not exist (optional, returns empty list if district has no villages)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create Village

Creates a new village.

**Endpoint**: `POST /`  
**Permission**: `master-data:village:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "VIL001",
  "name": "Cihampelas",
  "postalCode": "40141",
  "districtId": 1
}
```

#### Request Validations

- `code`: Optional, max 50 characters
- `name`: Required, max 100 characters, must be unique
- `postalCode`: Optional, max 20 characters
- `districtId`: Optional, must reference an existing district if provided

#### Response (201 Created)

```json
{
  "message": "Village created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "VIL001",
    "name": "Cihampelas",
    "postalCode": "40141",
    "districtId": 1,
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
- **404 Not Found**: District not found (when districtId is provided)
- **409 Conflict**: Duplicate village name
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Village

Updates an existing village.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:village:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Village ID (required)

#### Request

```json
{
  "code": "VIL001",
  "name": "Cihampelas",
  "postalCode": "40141",
  "districtId": 1
}
```

#### Response (200 OK)

```json
{
  "message": "Village updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "VIL001",
    "name": "Cihampelas",
    "postalCode": "40141",
    "districtId": 1,
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
- **404 Not Found**: Village does not exist or district not found
- **409 Conflict**: Duplicate village name for another village
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Village

Deletes a village by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:village:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Village ID (required)

#### Response (200 OK)

```json
{
  "message": "Village deleted successfully",
  "status": "SUCCESS",
  "data": "Village deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Village does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation      | Permission                  |
| -------------- | --------------------------- |
| List Villages  | `master-data:village:list`   |
| Read Village   | `master-data:village:read`   |
| Create Village | `master-data:village:create` |
| Update Village | `master-data:village:update` |
| Delete Village | `master-data:village:delete` |

---

## Data Type Reference

| Type    | Format     | Example      |
| ------- | ---------- | ------------ |
| Long    | Integer    | 1            |
| String  | Text       | "Cihampelas" |
| Boolean | true/false | true         |

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

1. **Geographic Hierarchy**: Villages belong to districts forming the lowest level geographic division
   - Province hierarchy: Province > Regency > District > Village
   - Each village must be associated with a district

2. **Name Uniqueness**: Each village name must be unique across the entire system

3. **District Relationship**: When creating or updating with a districtId, the district must exist in the system

4. **Postal Code**: Optional field used for address identification and delivery purposes
   - Can be null
   - No uniqueness constraint
   - Max 20 characters

5. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

6. **Active Status**: Controlled by system, defaults to true on creation
   - Only active villages are returned by the district hierarchy endpoint (`/district/{districtId}`)
   - Inactive villages may be retained in the system for audit purposes

7. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

8. **Search Functionality**: The search parameter filters across code, name, and postal code fields using case-insensitive matching

9. **Child Query**: The `/district/{districtId}` endpoint only returns active villages. Use the general list endpoint with search/filter for inactive items

10. **Volume**: Villages are the most numerous geographic entity with potentially thousands of records per country, so pagination is recommended
