# Partner Category Management API Contract

## Overview

The Partner Category API provides endpoints for managing partner categories (classifications of business partners). The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/partner/category`
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
  "message": "Partner categories retrieved successfully",
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

### 1. Get All Partner Categories

Retrieves a paginated list of all partner categories with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:partner-category:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by ID, name, or description
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "id,asc"): Sort field and direction (e.g., "id,asc", "name,desc")

#### Response (200 OK)

```json
{
  "message": "Partner categories retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Supplier",
        "description": "Supplier partner category",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "name": "Customer",
        "description": "Customer partner category",
        "isActive": true,
        "createdAt": "2026-01-27T11:00:00",
        "updatedAt": "2026-01-27T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 2,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": false,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid pagination or sort parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Partner Category by ID

Retrieves a specific partner category by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:partner-category:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (String): Partner Category ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner category retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Supplier",
    "description": "Supplier partner category",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner category not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Partner Category

Creates a new partner category.

**Endpoint**: `POST /`  
**Permission**: `master-data:partner-category:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "name": "Supplier",
  "description": "Supplier partner category",
  "isActive": true
}
```

#### Request Validations

- `name`: Required, non-blank, maximum 255 characters
- `description`: Optional, maximum 16000 characters
- `isActive`: Optional, defaults to null

#### Response (201 Created)

```json
{
  "message": "Partner category created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Supplier",
    "description": "Supplier partner category",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (missing required fields, exceeding max length)
- **409 Conflict**: Duplicate category ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Partner Category

Updates an existing partner category.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:partner-category:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (String): Partner Category ID (required)

#### Request

```json
{
  "name": "Supplier Updated",
  "description": "Updated supplier partner category",
  "isActive": false
}
```

#### Request Validations

Same as Create endpoint - all fields are updatable.

#### Response (200 OK)

```json
{
  "message": "Partner category updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Supplier Updated",
    "description": "Updated supplier partner category",
    "isActive": false,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T15:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Partner category not found
- **409 Conflict**: Duplicate category ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Partner Category

Deletes a partner category by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:partner-category:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (String): Partner Category ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner category deleted successfully",
  "status": "SUCCESS",
  "data": "Partner category deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner category not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation       | Permission                           |
| --------------- | ------------------------------------ |
| List Categories | `master-data:partner-category:list`   |
| Read Category   | `master-data:partner-category:read`   |
| Create Category | `master-data:partner-category:create` |
| Update Category | `master-data:partner-category:update` |
| Delete Category | `master-data:partner-category:delete` |

---

## Authentication

### Bearer Token Format

```
Authorization: Bearer {jwt_token}
```

---

## Data Type Reference

| Type          | Format     | Example               |
| ------------- | ---------- | --------------------- |
| String        | Text       | "SUPP"                |
| Boolean       | true/false | true                  |
| LocalDateTime | ISO 8601   | "2026-01-27T10:30:00" |

---

## Status Codes

| Code | Description                                                 |
| ---- | ----------------------------------------------------------- |
| 200  | OK - Request successful                                     |
| 201  | Created - Resource created successfully                     |
| 400  | Bad Request - Validation errors                             |
| 401  | Unauthorized - Missing/invalid authentication               |
| 403  | Forbidden - Insufficient permissions                        |
| 404  | Not Found - Resource does not exist                         |
| 409  | Conflict - Duplicate resource (unique constraint violation) |
| 500  | Internal Server Error - Unexpected server error             |

---

## Notes

1. **ID Format**: The category ID is auto-generated by the database as a Long value.
2. **Pagination**: All list endpoints support pagination with configurable page size and sorting.
3. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.
4. **Active Status**: The `isActive` field determines whether the category is available for use in the system.
5. **Search**: Search functionality filters by ID, name, or description fields.
