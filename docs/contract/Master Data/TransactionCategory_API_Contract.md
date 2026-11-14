# Transaction Category API Contract

## Overview

The Transaction Category API provides endpoints for managing transaction categories in the Fintra system. This module handles the creation, retrieval, and management of different transaction categories used for classifying and organizing financial transactions within the system.

## Base URL

```
/api/master/transaction-category
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission                               | Description             |
| ------------ | ---------------------------------------- | ----------------------- |
| List/Read    | `master-data:transaction-category:list`   | View list of categories |
| Read Details | `master-data:transaction-category:read`   | View category details   |
| Create       | `master-data:transaction-category:create` | Create new category     |
| Update       | `master-data:transaction-category:update` | Update category         |
| Delete       | `master-data:transaction-category:delete` | Delete category         |

## Data Models

### TransactionCategoryResponseDTO

```json
{
  "id": 1,
  "name": "Sales",
  "description": "Sales transaction category",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

### TransactionCategoryCreateUpdateDTO

```json
{
  "name": "Sales",
  "description": "Sales transaction category",
  "isActive": true
}
```

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "name": "Sales",
      "description": "Sales transaction category",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1,
  "isFirst": true,
  "isLast": true
}
```

### ApiResponse

```json
{
  "message": "Operation successful",
  "status": "SUCCESS",
  "data": {},
  "errors": null
}
```

## Endpoints

### 1. Get All Transaction Categories (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/transaction-category`

**Permission Required:** `master-data:transaction-category:list`

**Description:** Retrieves a paginated list of all transaction categories in the system.

**Query Parameters:**

| Parameter | Type    | Required | Description                | Example |
| --------- | ------- | -------- | -------------------------- | ------- |
| page      | Integer | No       | Page number (0-indexed)    | 0       |
| size      | Integer | No       | Number of records per page | 10      |
| sort      | String  | No       | Sort field and direction   | id,desc |

**Response (200 OK):**

```json
{
  "message": "Transaction categories retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Sales",
        "description": "Sales transaction category",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "createdBy": "system",
        "updatedBy": "system"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "isFirst": true,
    "isLast": true
  },
  "errors": null
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 2. Get Transaction Category by ID

**Method:** `GET`

**Endpoint:** `/api/master/transaction-category/{id}`

**Permission Required:** `master-data:transaction-category:read`

**Description:** Retrieves a specific transaction category by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description             |
| --------- | ---- | -------- | ----------------------- |
| id        | Long | Yes      | Transaction category ID |

**Response (200 OK):**

```json
{
  "message": "Transaction category retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Sales",
    "description": "Sales transaction category",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "errors": null
}
```

**Error Responses:**

- `404 Not Found` - Transaction category with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 3. Get Transaction Category by Name

**Method:** `GET`

**Endpoint:** `/api/master/transaction-category/name/{name}`

**Permission Required:** `master-data:transaction-category:read`

**Description:** Retrieves a specific transaction category by its name.

**Path Parameters:**

| Parameter | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| name      | String | Yes      | Transaction category name |

**Response (200 OK):**

```json
{
  "message": "Transaction category retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Sales",
    "description": "Sales transaction category",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "errors": null
}
```

**Error Responses:**

- `404 Not Found` - Transaction category with given name not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 4. Create Transaction Category

**Method:** `POST`

**Endpoint:** `/api/master/transaction-category`

**Permission Required:** `master-data:transaction-category:create`

**Description:** Creates a new transaction category in the system.

**Request Body:**

```json
{
  "name": "Sales",
  "description": "Sales transaction category",
  "isActive": true
}
```

**Request Validation Rules:**

| Field       | Type    | Required | Constraints       |
| ----------- | ------- | -------- | ----------------- |
| name        | String  | Yes      | Not blank, Unique |
| description | String  | No       | Max 65535 chars   |
| isActive    | Boolean | Yes      | true or false     |

**Response (201 Created):**

```json
{
  "message": "Transaction category created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Sales",
    "description": "Sales transaction category",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "errors": null
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
  ```json
  {
    "message": "Validation failed",
    "status": "ERROR",
    "data": null,
    "errors": [
      {
        "field": "name",
        "message": "Transaction category name cannot be blank"
      }
    ]
  }
  ```
- `409 Conflict` - Transaction category name already exists
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Update Transaction Category

**Method:** `PUT`

**Endpoint:** `/api/master/transaction-category/{id}`

**Permission Required:** `master-data:transaction-category:update`

**Description:** Updates an existing transaction category with new information.

**Path Parameters:**

| Parameter | Type | Required | Description             |
| --------- | ---- | -------- | ----------------------- |
| id        | Long | Yes      | Transaction category ID |

**Request Body:**

```json
{
  "name": "Sales - Updated",
  "description": "Updated sales transaction category",
  "isActive": true
}
```

**Request Validation Rules:**

| Field       | Type    | Required | Constraints       |
| ----------- | ------- | -------- | ----------------- |
| name        | String  | Yes      | Not blank, Unique |
| description | String  | No       | Max 65535 chars   |
| isActive    | Boolean | Yes      | true or false     |

**Response (200 OK):**

```json
{
  "message": "Transaction category updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Sales - Updated",
    "description": "Updated sales transaction category",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": "system",
    "updatedBy": "admin"
  },
  "errors": null
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
- `404 Not Found` - Transaction category with given ID not found
- `409 Conflict` - Transaction category name already exists for another record
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 6. Delete Transaction Category

**Method:** `DELETE`

**Endpoint:** `/api/master/transaction-category/{id}`

**Permission Required:** `master-data:transaction-category:delete`

**Description:** Deletes a transaction category by ID.

**Path Parameters:**

| Parameter | Type | Required | Description             |
| --------- | ---- | -------- | ----------------------- |
| id        | Long | Yes      | Transaction category ID |

**Response (200 OK):**

```json
{
  "message": "Transaction category deleted successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

- `404 Not Found` - Transaction category with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

## Common HTTP Status Codes

| Status Code | Description                                      |
| ----------- | ------------------------------------------------ |
| 200         | OK - Request succeeded                           |
| 201         | Created - Resource successfully created          |
| 400         | Bad Request - Invalid input or malformed request |
| 401         | Unauthorized - Missing or invalid authentication |
| 403         | Forbidden - User lacks required permissions      |
| 404         | Not Found - Resource not found                   |
| 409         | Conflict - Duplicate name or reference conflict  |
| 500         | Internal Server Error - Server-side error        |

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

## Request/Response Headers

### Required Headers

```
Content-Type: application/json
Authorization: Bearer {access_token}
```

### Response Headers

```
Content-Type: application/json
X-Total-Count: {total_records}
X-Page-Number: {current_page}
X-Page-Size: {page_size}
```

## Example Usage

### Create a transaction category

```bash
curl -X POST http://localhost:8080/api/master/transaction-category \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Sales",
    "description": "Sales transaction category",
    "isActive": true
  }'
```

### Get all transaction categories with pagination

```bash
curl "http://localhost:8080/api/master/transaction-category?page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

### Get transaction category by ID

```bash
curl "http://localhost:8080/api/master/transaction-category/1" \
  -H "Authorization: Bearer {token}"
```

### Get transaction category by name

```bash
curl "http://localhost:8080/api/master/transaction-category/name/Sales" \
  -H "Authorization: Bearer {token}"
```

### Update a transaction category

```bash
curl -X PUT http://localhost:8080/api/master/transaction-category/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Sales - Updated",
    "description": "Updated sales transaction category",
    "isActive": true
  }'
```

### Delete a transaction category

```bash
curl -X DELETE http://localhost:8080/api/master/transaction-category/1 \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=0, size=20
- The `createdBy` and `updatedBy` fields are automatically managed by the system
- Transaction category names must be unique and are case-sensitive
- Categories with long-term applicability should be preserved for historical transaction tracking and audit purposes
- All operations are audited for compliance and tracking purposes
