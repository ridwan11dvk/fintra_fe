# Partner Classification Management API Contract

## Overview

The Partner Classification API provides endpoints for managing partner classifications (classifications of business partners). The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/partner/classification`
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
  "message": "Partner classifications retrieved successfully",
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

### 1. Get All Partner Classifications

Retrieves a paginated list of all partner classifications with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:partner-classification:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by name or description
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction (e.g., "createdAt,desc", "name,asc")

#### Response (200 OK)

```json
{
  "message": "Partner classifications retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Distributor",
        "description": "Distributor classification",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "name": "Retailer",
        "description": "Retailer classification",
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

### 2. Get Partner Classification Options

Retrieves a list of active partner classifications for dropdown options.

**Endpoint**: `GET /options`  
**Permission**: None (Public)  
**Authentication**: Not required

#### Response (200 OK)

```json
{
  "message": "Partner classification options retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "label": "Distributor",
      "description": "Distributor classification"
    },
    {
      "id": 2,
      "label": "Retailer",
      "description": "Retailer classification"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **500 Internal Server Error**: Unexpected server error

---

### 3. Get Partner Classification by ID

Retrieves a specific partner classification by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:partner-classification:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Classification ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner classification retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Distributor",
    "description": "Distributor classification",
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

- **404 Not Found**: Partner classification not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create Partner Classification

Creates a new partner classification.

**Endpoint**: `POST /`  
**Permission**: `master-data:partner-classification:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "name": "Distributor",
  "description": "Distributor classification",
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
  "message": "Partner classification created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Distributor",
    "description": "Distributor classification",
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
- **409 Conflict**: Duplicate classification ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Partner Classification

Updates an existing partner classification.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:partner-classification:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Classification ID (required)

#### Request

```json
{
  "name": "Distributor Updated",
  "description": "Updated distributor classification",
  "isActive": false
}
```

#### Request Validations

Same as Create endpoint - all fields are updatable.

#### Response (200 OK)

```json
{
  "message": "Partner classification updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Distributor Updated",
    "description": "Updated distributor classification",
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
- **404 Not Found**: Partner classification not found
- **409 Conflict**: Duplicate classification ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Partner Classification

Deletes a partner classification by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:partner-classification:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Classification ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner classification deleted successfully",
  "status": "SUCCESS",
  "data": "Partner classification deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner classification not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation             | Permission                                 |
| --------------------- | ------------------------------------------ |
| List Classifications  | `master-data:partner-classification:list`   |
| Read Classification   | `master-data:partner-classification:read`   |
| Create Classification | `master-data:partner-classification:create` |
| Update Classification | `master-data:partner-classification:update` |
| Delete Classification | `master-data:partner-classification:delete` |

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
| Long          | Integer    | 1                     |
| String        | Text       | "Distributor"         |
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

1. **ID Format**: The classification ID is auto-generated by the database as a Long value.
2. **Pagination**: All list endpoints support pagination with configurable page size and sorting.
3. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.
4. **Active Status**: The `isActive` field determines whether the classification is available for use in the system.
5. **Search**: Search functionality filters by name or description fields.
6. **Options Endpoint**: The `/options` endpoint returns only active classifications without authentication requirements, suitable for dropdown lists in the UI.
