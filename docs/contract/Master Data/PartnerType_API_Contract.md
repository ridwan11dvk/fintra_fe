# Partner Type Management API Contract

## Overview

The Partner Type API provides endpoints for managing partner types with hierarchical support. Partners can have multiple types, and types can be organized in a parent-child hierarchy. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/partner/type`
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
  "message": "Partner types retrieved successfully",
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

### 1. Get All Partner Types

Retrieves a paginated list of all partner types with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:partner-type:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by ID, code, or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "id,asc"): Sort field and direction (e.g., "id,asc", "name,desc")

#### Response (200 OK)

```json
{
  "message": "Partner types retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "SUPP_DOM",
        "partnerCategoryId": 1,
        "parentId": null,
        "name": "Domestic Supplier",
        "description": "Local supplier within the country",
        "isActive": true,
        "integratedToErp": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "code": "SUPP_INT",
        "partnerCategoryId": 1,
        "parentId": null,
        "name": "International Supplier",
        "description": "Foreign supplier from outside the country",
        "isActive": true,
        "integratedToErp": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
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

### 2. Get Partner Type by ID

Retrieves a specific partner type by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:partner-type:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (String): Partner Type ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner type retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "SUPP_DOM",
    "partnerCategoryId": 1,
    "parentId": null,
    "name": "Domestic Supplier",
    "description": "Local supplier within the country",
    "isActive": true,
    "integratedToErp": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner type not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Root Partner Types by Category

Retrieves all root-level (non-hierarchical) partner types for a specific category.

**Endpoint**: `GET /category/{categoryId}/root`  
**Permission**: `master-data:partner-type:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `categoryId` (Long): Partner Category ID (required)

#### Response (200 OK)

```json
{
  "message": "Root partner types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "SUPP_DOM",
      "partnerCategoryId": 1,
      "parentId": null,
      "name": "Domestic Supplier",
      "description": "Local supplier within the country",
      "isActive": true,
      "integratedToErp": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "code": "SUPP_INT",
      "partnerCategoryId": 1,
      "parentId": null,
      "name": "International Supplier",
      "description": "Foreign supplier from outside the country",
      "isActive": true,
      "integratedToErp": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner category not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get Sub-Types of a Partner Type

Retrieves all sub-types (child) of a specific partner type in the hierarchy.

**Endpoint**: `GET /{parentId}/subtypes`  
**Permission**: `master-data:partner-type:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `parentId` (Long): Parent Partner Type ID (required)

#### Response (200 OK)

```json
{
  "message": "Sub-types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "SUPP_DOM",
      "partnerCategoryId": 1,
      "parentId": null,
      "name": "Domestic Manufacturer",
      "description": "Local manufacturing supplier",
      "isActive": true,
      "integratedToErp": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "code": "SUPP_DOM_DST",
      "partnerCategoryId": 1,
      "parentId": 1,
      "name": "Domestic Distributor",
      "description": "Local distribution supplier",
      "isActive": true,
      "integratedToErp": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Parent partner type not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Create Partner Type

Creates a new partner type.

**Endpoint**: `POST /`  
**Permission**: `master-data:partner-type:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "SUPP_DOM",
  "partnerCategoryId": 1,
  "parentId": null,
  "name": "Domestic Supplier",
  "description": "Local supplier within the country",
  "isActive": true,
  "integratedToErp": true
}
```

#### Request Validations

- `code`: Required, non-blank, maximum 50 characters
- `partnerCategoryId`: Required, must reference existing category
- `parentId`: Optional (must reference existing partner type if provided)
- `name`: Required, non-blank, maximum 255 characters
- `description`: Optional, maximum 16000 characters
- `isActive`: Required, boolean
- `integratedToErp`: Required, boolean

#### Response (201 Created)

```json
{
  "message": "Partner type created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "SUPP_DOM",
    "partnerCategoryId": 1,
    "parentId": null,
    "name": "Domestic Supplier",
    "description": "Local supplier within the country",
    "isActive": true,
    "integratedToErp": true,
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
- **409 Conflict**: Duplicate type ID or code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Update Partner Type

Updates an existing partner type.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:partner-type:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (String): Partner Type ID (required)

#### Request

```json
{
  "code": "SUPP_DOM_UPDATED",
  "partnerCategoryId": 1,
  "parentId": null,
  "name": "Domestic Supplier Updated",
  "description": "Updated local supplier within the country",
  "isActive": false,
  "integratedToErp": true
}
```

#### Request Validations

Same as Create endpoint - all fields are updatable.

#### Response (200 OK)

```json
{
  "message": "Partner type updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "SUPP_DOM_UPDATED",
    "partnerCategoryId": 1,
    "parentId": null,
    "name": "Domestic Supplier Updated",
    "description": "Updated local supplier within the country",
    "isActive": false,
    "integratedToErp": true,
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
- **404 Not Found**: Partner type not found
- **409 Conflict**: Duplicate type ID or code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Delete Partner Type

Deletes a partner type by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:partner-type:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Type ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner type deleted successfully",
  "status": "SUCCESS",
  "data": "Partner type deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner type not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation   | Permission                       |
| ----------- | -------------------------------- |
| List Types  | `master-data:partner-type:list`   |
| Read Type   | `master-data:partner-type:read`   |
| Create Type | `master-data:partner-type:create` |
| Update Type | `master-data:partner-type:update` |
| Delete Type | `master-data:partner-type:delete` |

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
| String        | Text       | "SUPP_DOMESTIC"       |
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

1. **Hierarchical Support**: Partner types can be organized hierarchically using the `parentId` field. Root-level types have `parentId` as null.
2. **ERP Integration**: The `integratedToErp` flag indicates whether this type is integrated with your ERP system.
3. **Pagination**: All list endpoints support pagination with configurable page size and sorting.
4. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.
5. **Active Status**: The `isActive` field determines whether the type is available for use in the system.
6. **Search**: Search functionality filters by ID, code, or name fields.
7. **Category Reference**: Each partner type must belong to a category via `partnerCategoryId`. Ensure the category exists before creating a type.
