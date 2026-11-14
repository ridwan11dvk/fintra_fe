# Taxable Item Master Data API Contract

## Overview

The Taxable Item Master Data API provides endpoints for managing items subject to taxation within the system. The API supports a 4-level hierarchical classification of taxable items through parent-child relationships and uses JWT authentication with permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/taxable-item`
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

### Validation Error Response

```json
{
  "message": "Validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "Taxable item name cannot be blank"
    },
    {
      "field": "code",
      "message": "Taxable item code cannot exceed 50 characters"
    }
  ]
}
```

### Paginated Response

```json
{
  "message": "Taxable items retrieved successfully",
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

### 1. List All Taxable Items (Paginated)

Retrieves a paginated list of taxable items with optional search and ID filtering. Each item includes its parent and module details.

**Endpoint**: `GET /`  
**Permission**: `master-data:taxable-item:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter | Type   | Required | Description                                                 |
| --------- | ------ | -------- | ----------------------------------------------------------- |
| `search`  | string | No       | Search keyword to filter by code, alternative code, or name |
| `ids`     | string | No       | Comma-separated list of taxable item IDs to filter by       |
| `page`    | int    | No       | Page number, 0-indexed (default: 0)                         |
| `size`    | int    | No       | Items per page (default: 10)                                |
| `sort`    | string | No       | Sort criteria, default: `createdAt,desc`                    |

#### Response (200 OK)

```json
{
  "message": "Taxable items retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "01",
        "fullCode": "01",
        "altCode": "A01",
        "fullAltCode": "A01",
        "name": "Barang Kena Pajak",
        "level": 1,
        "parentId": null,
        "parent": null,
        "type": "GOODS",
        "moduleId": null,
        "module": null,
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
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

### 2. Get Taxable Items as Flat Rows (Hierarchy Table UI)

Retrieves paginated level-4 leaf items as flat rows, each containing the full 4-level ancestor chain. Designed for the 4-column hierarchy table UI. Search matches name/code across all ancestor levels.

**Endpoint**: `GET /rows`  
**Permission**: `master-data:taxable-item:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter | Type   | Required | Description                                                                       |
| --------- | ------ | -------- | --------------------------------------------------------------------------------- |
| `search`  | string | No       | Search keyword matched against name/code of any ancestor level (case-insensitive) |
| `page`    | int    | No       | Page number, 0-indexed (default: 0)                                               |
| `size`    | int    | No       | Items per page (default: 10)                                                      |
| `sort`    | string | No       | Sort criteria, default: `createdAt,desc`                                          |

#### Response (200 OK)

```json
{
  "message": "Taxable item rows retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "level1": {
          "id": 1,
          "code": "01",
          "fullCode": "01",
          "altCode": "A01",
          "fullAltCode": "A01",
          "name": "Barang Kena Pajak",
          "level": 1,
          "parentId": null,
          "type": "GOODS",
          "moduleId": null,
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "level2": {
          "id": 2,
          "code": "01.01",
          "fullCode": "01.01",
          "altCode": null,
          "fullAltCode": null,
          "name": "Elektronik",
          "level": 2,
          "parentId": 1,
          "type": "GOODS",
          "moduleId": null,
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "level3": {
          "id": 3,
          "code": "01.01.01",
          "fullCode": "01.01.01",
          "altCode": null,
          "fullAltCode": null,
          "name": "Telepon Genggam",
          "level": 3,
          "parentId": 2,
          "type": "GOODS",
          "moduleId": null,
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "level4": {
          "id": 4,
          "code": "01.01.01.01",
          "fullCode": "01.01.01.01",
          "altCode": null,
          "fullAltCode": null,
          "name": "Smartphone",
          "level": 4,
          "parentId": 3,
          "type": "GOODS",
          "moduleId": null,
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        }
      }
    ],
    "totalElements": 20,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

> **Note**: `level1`, `level2`, and `level3` fields may be `null` if the item does not have a complete ancestor chain.

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Taxable Item Tree

Retrieves all taxable items as a hierarchical tree structure.

**Endpoint**: `GET /tree`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Taxable item tree retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "01",
      "fullCode": "01",
      "altCode": "A01",
      "fullAltCode": "A01",
      "name": "Barang Kena Pajak",
      "level": 1,
      "parentId": null,
      "type": "GOODS",
      "moduleId": null,
      "children": [
        {
          "id": 2,
          "code": "01.01",
          "fullCode": "01.01",
          "altCode": null,
          "fullAltCode": null,
          "name": "Elektronik",
          "level": 2,
          "parentId": 1,
          "type": "GOODS",
          "moduleId": null,
          "children": []
        }
      ]
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get All Taxable Items Without Pagination

Retrieves a complete unpaginated list of all taxable items with optional search.

**Endpoint**: `GET /parent/list`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| `search`  | string | No       | Search keyword to filter by code, alt code, or name |

#### Response (200 OK)

```json
{
  "message": "All taxable items retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "01",
      "fullCode": "01",
      "altCode": "A01",
      "fullAltCode": "A01",
      "name": "Barang Kena Pajak",
      "level": 1,
      "parentId": null,
      "type": "GOODS",
      "moduleId": null,
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

---

### 5. Get Taxable Items by IDs

Retrieves multiple taxable items by a comma-separated list of IDs.

**Endpoint**: `GET /ids`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `ids`     | string | Yes      | Comma-separated list of item IDs |

#### Response (200 OK)

```json
{
  "message": "Taxable items retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "code": "01",
      "fullCode": "01",
      "altCode": "A01",
      "fullAltCode": "A01",
      "name": "Barang Kena Pajak",
      "level": 1,
      "parentId": null,
      "type": "GOODS",
      "moduleId": null,
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

---

### 6. Get Taxable Items by Parent

Retrieves all active child taxable items for a specific parent.

**Endpoint**: `GET /parent/{parentId}`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `parentId` (Long): Parent Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Child taxable items retrieved successfully for parent: 1",
  "status": "SUCCESS",
  "data": [
    {
      "id": 2,
      "code": "01.01",
      "fullCode": "01.01",
      "altCode": null,
      "fullAltCode": null,
      "name": "Elektronik",
      "level": 2,
      "parentId": 1,
      "type": "GOODS",
      "moduleId": null,
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

---

### 7. Get Level 2 Items by Parent

Retrieves level-2 child items for a given level-1 parent, with skip-level handling.

**Endpoint**: `GET /parent/{parentId}/level2`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `parentId` (Long): Level-1 parent Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Level 2 items retrieved successfully for parent: 1",
  "status": "SUCCESS",
  "data": [
    {
      "id": 2,
      "code": "01.01",
      "fullCode": "01.01",
      "altCode": null,
      "fullAltCode": null,
      "name": "Elektronik",
      "level": 2,
      "parentId": 1,
      "type": "GOODS",
      "moduleId": null,
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

---

### 8. Get Level 3 Items by Parent

Retrieves level-3 child items for a given level-2 parent, with skip-level handling.

**Endpoint**: `GET /parent/{parentId}/level3`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `parentId` (Long): Level-2 parent Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Level 3 items retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 3,
      "code": "01.01.01",
      "fullCode": "01.01.01",
      "altCode": null,
      "fullAltCode": null,
      "name": "Telepon Genggam",
      "level": 3,
      "parentId": 2,
      "type": "GOODS",
      "moduleId": null,
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

---

### 9. Get Level 4 Items by Parent

Retrieves level-4 leaf items for a given level-3 parent.

**Endpoint**: `GET /parent/{parentId}/level4`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `parentId` (Long): Level-3 parent Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Level 4 items retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 4,
      "code": "01.01.01.01",
      "fullCode": "01.01.01.01",
      "altCode": null,
      "fullAltCode": null,
      "name": "Smartphone",
      "level": 4,
      "parentId": 3,
      "type": "GOODS",
      "moduleId": null,
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

---

### 10. Get Taxable Item by ID

Retrieves a specific taxable item by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:taxable-item:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Taxable item retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "01",
    "fullCode": "01",
    "altCode": "A01",
    "fullAltCode": "A01",
    "name": "Barang Kena Pajak",
    "level": 1,
    "parentId": null,
    "type": "GOODS",
    "moduleId": null,
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

- **404 Not Found**: Taxable item does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 11. Create Taxable Item

Creates a new taxable item.

**Endpoint**: `POST /`  
**Permission**: `master-data:taxable-item:create`  
**Authentication**: Required (Bearer Token)

#### Request Body

```json
{
  "code": "01",
  "altCode": "A01",
  "fullCode": "01",
  "fullAltCode": "A01",
  "name": "Barang Kena Pajak",
  "level": 1,
  "parentId": null,
  "type": "GOODS",
  "moduleId": null,
  "isActive": true
}
```

#### Request Field Validations

| Field         | Type    | Required | Constraints                         |
| ------------- | ------- | -------- | ----------------------------------- |
| `code`        | string  | No       | Max 50 characters                   |
| `altCode`     | string  | No       | Max 50 characters                   |
| `fullCode`    | string  | No       | Max 100 characters                  |
| `fullAltCode` | string  | No       | Max 100 characters                  |
| `name`        | string  | **Yes**  | Max 100 characters, cannot be blank |
| `level`       | short   | No       | Hierarchical depth (1–4)            |
| `parentId`    | long    | No       | Must reference an existing item     |
| `type`        | enum    | No       | `GOODS` or `SERVICE`                |
| `moduleId`    | long    | No       | Must reference an existing module   |
| `isActive`    | boolean | No       | Defaults to `true`                  |

#### Response (201 Created)

```json
{
  "message": "Taxable item created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "01",
    "fullCode": "01",
    "altCode": "A01",
    "fullAltCode": "A01",
    "name": "Barang Kena Pajak",
    "level": 1,
    "parentId": null,
    "type": "GOODS",
    "moduleId": null,
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

- **400 Bad Request**: Validation errors (blank name, field length exceeded)
- **404 Not Found**: Parent taxable item not found (when `parentId` is provided)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 12. Update Taxable Item

Updates an existing taxable item.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:taxable-item:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Taxable Item ID (required)

#### Request Body

```json
{
  "code": "01",
  "altCode": "A01",
  "fullCode": "01",
  "fullAltCode": "A01",
  "name": "Barang Kena Pajak Updated",
  "level": 1,
  "parentId": null,
  "type": "GOODS",
  "moduleId": null,
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Taxable item updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "01",
    "fullCode": "01",
    "altCode": "A01",
    "fullAltCode": "A01",
    "name": "Barang Kena Pajak Updated",
    "level": 1,
    "parentId": null,
    "type": "GOODS",
    "moduleId": null,
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
- **404 Not Found**: Taxable item does not exist or parent taxable item not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 13. Delete Taxable Item

Deletes a taxable item by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:taxable-item:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Taxable Item ID (required)

#### Response (200 OK)

```json
{
  "message": "Taxable item deleted successfully",
  "status": "SUCCESS",
  "data": "Taxable item deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Taxable item does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                       | Permission                       |
| ------------------------------- | -------------------------------- |
| List Taxable Items (paginated)  | `master-data:taxable-item:list`   |
| List Taxable Items as flat rows | `master-data:taxable-item:list`   |
| Read Taxable Item (tree/by ID)  | `master-data:taxable-item:read`   |
| Read by parent / level          | `master-data:taxable-item:read`   |
| Read by IDs / unpaginated list  | `master-data:taxable-item:read`   |
| Create Taxable Item             | `master-data:taxable-item:create` |
| Update Taxable Item             | `master-data:taxable-item:update` |
| Delete Taxable Item             | `master-data:taxable-item:delete` |

---

## Data Type Reference

| Type            | Format            | Example                 |
| --------------- | ----------------- | ----------------------- |
| Long            | Integer           | 1                       |
| String          | Text              | `"01"`                  |
| Short           | Integer           | 1                       |
| Boolean         | true/false        | true                    |
| TaxableItemType | Enum string       | `"GOODS"`, `"SERVICE"`  |
| LocalDateTime   | ISO-8601 datetime | `"2026-02-01T10:00:00"` |

---

## Status Codes

| Code | Description                                     |
| ---- | ----------------------------------------------- |
| 200  | OK - Request successful                         |
| 201  | Created - Resource created successfully         |
| 400  | Bad Request - Validation errors                 |
| 401  | Unauthorized - Missing/invalid authentication   |
| 403  | Forbidden - Insufficient permissions            |
| 404  | Not Found - Resource does not exist             |
| 500  | Internal Server Error - Unexpected server error |

---

## Notes

1. **4-Level Hierarchy**: Taxable items support a fixed 4-level parent-child hierarchy.
   - Level 1 = Root category
   - Level 2 = Sub-category
   - Level 3 = Group
   - Level 4 = Leaf item (used in transactions)
   - Root items have `parentId = null`

2. **Flat Row Endpoint**: `GET /rows` is designed for the 4-column hierarchy table UI. It returns only level-4 leaf items, each with its full ancestor chain (`level1`–`level4`). Ancestors may be `null` if the item's hierarchy is incomplete. Search applies across all 4 levels' `name` and `code`.

3. **Type Field**: Indicates whether the item is `GOODS` or `SERVICE`. Used for tax categorization.

4. **Full Code Fields**: `fullCode` and `fullAltCode` represent the complete hierarchical code path (e.g., `"01.01.01.01"`) and are typically computed from the ancestor chain.

5. **Parent Validation**: When creating or updating with a `parentId`, the parent must exist in the system.

6. **Code Fields**: Both `code` and `altCode` are optional and not required to be unique. `fullCode` and `fullAltCode` capture the full path codes.

7. **Search Functionality**: The `search` parameter on `GET /` filters across `code`, `altCode`, and `name` fields (case-insensitive). On `GET /rows`, search also spans all ancestor levels.

8. **Active Status**: Defaults to `true` on creation. Only active items are returned by the `/parent/{parentId}` and level-specific endpoints.

9. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy`.

10. **Default Sorting**: Results are sorted by `createdAt` descending by default.

11. **Validation Error Handling**: All validation errors are handled centrally and returned with HTTP 400. The response includes field-level errors in the `errors` array.
