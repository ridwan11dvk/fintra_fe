# Unit of Measure API Contract

## Overview

The Unit of Measure (UOM) API provides endpoints for managing units of measure in the Fintra system. This module handles the creation, retrieval, and management of different units used for measuring quantities in transactions and master data.

## Base URL

```
/api/master/uom
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission                          | Description                   |
| ------------ | ----------------------------------- | ----------------------------- |
| List/Read    | `master-data:unit-of-measure:list`   | View list of units of measure |
| Read Details | `master-data:unit-of-measure:read`   | View unit of measure details  |
| Create       | `master-data:unit-of-measure:create` | Create unit of measure        |
| Update       | `master-data:unit-of-measure:update` | Update unit of measure        |
| Delete       | `master-data:unit-of-measure:delete` | Delete unit of measure        |
| Export       | `master-data:unit-of-measure:export` | Export unit of measure data   |

## Data Models

### UomResponseDTO

```json
{
  "id": 1,
  "code": "KG",
  "name": "Kilogram",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

### UomCreateUpdateDTO

```json
{
  "code": "KG",
  "name": "Kilogram",
  "isActive": true
}
```

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "code": "KG",
      "name": "Kilogram",
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
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Endpoints

### 1. Get All Units of Measure (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/uom`

**Permission Required:** `master-data:unit-of-measure:list`

**Description:** Retrieves a paginated list of all units of measure in the system.

**Query Parameters:**

| Parameter | Type    | Required | Description                | Example |
| --------- | ------- | -------- | -------------------------- | ------- |
| page      | Integer | No       | Page number (0-indexed)    | 0       |
| size      | Integer | No       | Number of records per page | 10      |
| sort      | String  | No       | Sort field and direction   | id,desc |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "code": "KG",
        "name": "Kilogram",
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
  "message": "Units of measure retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 2. Get Active Units of Measure

**Method:** `GET`

**Endpoint:** `/api/master/uom/active`

**Permission Required:** None (public endpoint)

**Description:** Retrieves a list of all active units of measure without pagination.

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "KG",
      "name": "Kilogram",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    },
    {
      "id": 2,
      "code": "LTR",
      "name": "Liter",
      "isActive": true,
      "createdAt": "2024-01-15T10:35:00Z",
      "updatedAt": "2024-01-15T10:35:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "message": "Active units of measure retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 3. Get Unit of Measure by ID

**Method:** `GET`

**Endpoint:** `/api/master/uom/{id}`

**Permission Required:** `master-data:unit-of-measure:read`

**Description:** Retrieves a specific unit of measure by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description        |
| --------- | ---- | -------- | ------------------ |
| id        | Long | Yes      | Unit of measure ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "KG",
    "name": "Kilogram",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Unit of measure retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Unit of measure with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 4. Get Unit of Measure by Code

**Method:** `GET`

**Endpoint:** `/api/master/uom/code/{code}`

**Permission Required:** `master-data:unit-of-measure:read`

**Description:** Retrieves a specific unit of measure by its code.

**Path Parameters:**

| Parameter | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| code      | String | Yes      | Unit code (e.g., KG, LTR) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "KG",
    "name": "Kilogram",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Unit of measure retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Unit of measure with given code not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Create Unit of Measure

**Method:** `POST`

**Endpoint:** `/api/master/uom`

**Permission Required:** `master-data:unit-of-measure:create`

**Description:** Creates a new unit of measure in the system.

**Request Body:**

```json
{
  "code": "KG",
  "name": "Kilogram",
  "isActive": true
}
```

**Request Validation Rules:**

| Field    | Type    | Required | Constraints       |
| -------- | ------- | -------- | ----------------- |
| code     | String  | Yes      | Not blank, Unique |
| name     | String  | Yes      | Not blank         |
| isActive | Boolean | Yes      | Default: true     |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "KG",
    "name": "Kilogram",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "system",
    "updatedBy": "system"
  },
  "message": "Unit of measure created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "code": "Code is required"
    }
  }
  ```
- `409 Conflict` - Unit code already exists
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 6. Update Unit of Measure

**Method:** `PUT`

**Endpoint:** `/api/master/uom/{id}`

**Permission Required:** `master-data:unit-of-measure:update`

**Description:** Updates an existing unit of measure with new information.

**Path Parameters:**

| Parameter | Type | Required | Description        |
| --------- | ---- | -------- | ------------------ |
| id        | Long | Yes      | Unit of measure ID |

**Request Body:**

```json
{
  "code": "KG",
  "name": "Kilogram",
  "isActive": true
}
```

**Request Validation Rules:**

| Field    | Type    | Required | Constraints                                  |
| -------- | ------- | -------- | -------------------------------------------- |
| code     | String  | Yes      | Not blank, Unique (excluding current record) |
| name     | String  | Yes      | Not blank                                    |
| isActive | Boolean | Yes      | Default: true                                |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "KG",
    "name": "Kilogram Updated",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": "system",
    "updatedBy": "admin"
  },
  "message": "Unit of measure updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or validation failed
- `404 Not Found` - Unit of measure with given ID not found
- `409 Conflict` - Unit code already exists for another record
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 7. Delete Unit of Measure

**Method:** `DELETE`

**Endpoint:** `/api/master/uom/{id}`

**Permission Required:** `master-data:unit-of-measure:delete`

**Description:** Deletes a unit of measure by ID.

**Path Parameters:**

| Parameter | Type | Required | Description        |
| --------- | ---- | -------- | ------------------ |
| id        | Long | Yes      | Unit of measure ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": "Unit of measure deleted successfully",
  "message": "Unit of measure deleted successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Unit of measure with given ID not found
- `409 Conflict` - Cannot delete unit of measure due to active references
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
| 409         | Conflict - Duplicate code or reference conflict  |
| 500         | Internal Server Error - Server-side error        |

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-15T11:00:00Z",
  "errors": {
    "fieldName": "Field-specific error message"
  }
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

### Create a unit of measure

```bash
curl -X POST http://localhost:8080/api/master/uom \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "KG",
    "name": "Kilogram",
    "isActive": true
  }'
```

### Get all units with pagination

```bash
curl http://localhost:8080/api/master/uom?page=0&size=10 \
  -H "Authorization: Bearer {token}"
```

### Update a unit of measure

```bash
curl -X PUT http://localhost:8080/api/master/uom/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "KG",
    "name": "Kilogram Updated",
    "isActive": true
  }'
```

### Delete a unit of measure

```bash
curl -X DELETE http://localhost:8080/api/master/uom/1 \
  -H "Authorization: Bearer {token}"
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=0, size=20
- The `createdBy` and `updatedBy` fields are automatically managed by the system
- Unit codes should be unique and are case-sensitive
- Inactive units cannot be used for new transactions but historical records remain intact
- All operations are audited for compliance and tracking purposes
