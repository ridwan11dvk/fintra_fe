# Province Master Data API Contract

## Overview

The Province Master Data API provides endpoints for managing provinces within the system. The API supports CRUD operations and uses JWT authentication with permission-based access control. Provinces form the primary geographic hierarchy level and contain regencies as child entities.

---

## Base Information

- **Base URL**: `/api/master/province`
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
  "message": "Provinces retrieved successfully",
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

### 1. List All Provinces

Retrieves a paginated list of provinces with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:province:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code, name, or alternate code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Provinces retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
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
      {
        "id": 2,
        "code": "PROV002",
        "name": "East Java",
        "alias": "Jawa Timur",
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 34,
    "totalPages": 4,
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

### 2. Get Province by ID

Retrieves a specific province by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:province:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Province ID (required)

#### Response (200 OK)

```json
{
  "message": "Province retrieved successfully",
  "status": "SUCCESS",
  "data": {
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
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Province does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Province

Creates a new province.

**Endpoint**: `POST /`  
**Permission**: `master-data:province:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "PROV001",
  "name": "West Java"
}
```

#### Request Validations

- `code`: Optional, max 50 characters
- `name`: Required, max 100 characters, must be unique

#### Response (201 Created)

```json
{
  "message": "Province created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "PROV001",
    "name": "West Java",
    "alias": "Jawa Barat",
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
- **409 Conflict**: Duplicate province name
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Province

Updates an existing province.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:province:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Province ID (required)

#### Request

```json
{
  "code": "PROV001",
  "name": "West Java"
}
```

#### Response (200 OK)

```json
{
  "message": "Province updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "PROV001",
    "name": "West Java",
    "alias": "Jawa Barat",
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
- **404 Not Found**: Province does not exist
- **409 Conflict**: Duplicate province name for another province
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Province

Deletes a province by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:province:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Province ID (required)

#### Response (200 OK)

```json
{
  "message": "Province deleted successfully",
  "status": "SUCCESS",
  "data": "Province deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Province does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation       | Permission                   |
| --------------- | ---------------------------- |
| List Provinces  | `master-data:province:list`   |
| Read Province   | `master-data:province:read`   |
| Create Province | `master-data:province:create` |
| Update Province | `master-data:province:update` |
| Delete Province | `master-data:province:delete` |

---

## Data Type Reference

| Type    | Format     | Example   |
| ------- | ---------- | --------- |
| Long    | Integer    | 1         |
| String  | Text       | "PROV001" |
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

1. **Geographic Hierarchy**: Provinces are the top-level geographic division in the system
   - Each province can contain multiple regencies
   - Regencies contain districts, which contain villages

2. **Name Uniqueness**: Each province name must be unique across the entire system

3. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

4. **Active Status**: Controlled by system, defaults to true on creation

5. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

6. **Search Functionality**: The search parameter filters across code, name, and alternate code fields using case-insensitive matching
