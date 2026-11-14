# Term Of Payment API Contract

## Overview

The Term Of Payment API provides endpoints for managing payment terms in the Fintra system. This module handles the creation, retrieval, and management of different payment terms (Net, Cash on Delivery, etc.) with their payment conditions and due date calculations used for accounts payable and accounts receivable purposes.

## Base URL

```
/api/master/term-of-payment
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission              | Description                |
| ------------ | ----------------------- | -------------------------- |
| List/Read    | `master-data:top:list`   | View list of payment terms |
| Read Details | `master-data:top:read`   | View payment term details  |
| Create       | `master-data:top:create` | Create payment term        |
| Update       | `master-data:top:update` | Update payment term        |
| Delete       | `master-data:top:delete` | Delete payment term        |

## Data Models

### TermOfPaymentResponseDTO

```json
{
  "id": 1,
  "code": "NET_30",
  "name": "Net 30",
  "description": "Payment due within 30 days from invoice date",
  "numberOfDays": 30,
  "calculationType": "CALENDAR_DAYS",
  "discount": 0.0,
  "discountType": "PERCENTAGE",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

### TermOfPaymentCreateUpdateDTO

```json
{
  "code": "NET_30",
  "name": "Net 30",
  "description": "Payment due within 30 days from invoice date",
  "numberOfDays": 30,
  "calculationType": "CALENDAR_DAYS",
  "discount": null,
  "discountType": null,
  "isActive": true
}
```

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "code": "NET_30",
      "name": "Net 30",
      "description": "Payment due within 30 days from invoice date",
      "numberOfDays": 30,
      "calculationType": "CALENDAR_DAYS",
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

### 1. Get All Payment Terms (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/term-of-payment`

**Permission Required:** `master-data:top:list`

**Description:** Retrieves a paginated list of all payment terms in the system with optional search.

**Query Parameters:**

| Parameter | Type    | Required | Description                          | Example |
| --------- | ------- | -------- | ------------------------------------ | ------- |
| search    | String  | No       | Search by code, name, or description | NET     |
| page      | Integer | No       | Page number (0-indexed)              | 0       |
| size      | Integer | No       | Number of records per page           | 10      |
| sort      | String  | No       | Sort field and direction             | id,desc |

**Response (200 OK):**

```json
{
  "message": "Payment terms retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "NET_30",
        "name": "Net 30",
        "description": "Payment due within 30 days from invoice date",
        "numberOfDays": 30,
        "calculationType": "CALENDAR_DAYS",
        "discount": 0.0,
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

### 2. Get Payment Term by ID

**Method:** `GET`

**Endpoint:** `/api/master/term-of-payment/{id}`

**Permission Required:** `master-data:top:read`

**Description:** Retrieves a specific payment term by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| id        | Long | Yes      | Payment term ID |

**Response (200 OK):**

```json
{
  "message": "Payment term retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "NET_30",
    "name": "Net 30",
    "description": "Payment due within 30 days from invoice date",
    "numberOfDays": 30,
    "calculationType": "CALENDAR_DAYS",
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

- `404 Not Found` - Payment term with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 3. Create Payment Term

**Method:** `POST`

**Endpoint:** `/api/master/term-of-payment`

**Permission Required:** `master-data:top:create`

**Description:** Creates a new payment term in the system.

**Request Body:**

```json
{
  "code": "NET_30",
  "name": "Net 30",
  "description": "Payment due within 30 days from invoice date",
  "numberOfDays": 30,
  "calculationType": "CALENDAR_DAYS",
  "isActive": true
}
```

**Request Validation Rules:**

| Field           | Type    | Required | Constraints                                               |
| --------------- | ------- | -------- | --------------------------------------------------------- |
| code            | String  | Yes      | Not blank, Max 50 chars, Unique                           |
| name            | String  | Yes      | Not blank, Max 255 chars                                  |
| description     | String  | No       | Max 1000 chars                                            |
| numberOfDays    | Integer | Yes      | ≥ 0                                                       |
| calculationType | String  | Yes      | CALENDAR_DAYS or WORKING_DAYS (from CalculationType enum) |
| discount        | Decimal | No       | ≥ 0 (optional)                                            |
| discountType    | String  | No       | PERCENTAGE or VALUE (optional)                            |
| isActive        | Boolean | Yes      | true or false                                             |

**Response (201 Created):**

```json
{
  "message": "Payment term created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "NET_30",
    "name": "Net 30",
    "description": "Payment due within 30 days from invoice date",
    "numberOfDays": 30,
    "calculationType": "CALENDAR_DAYS",
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
        "field": "code",
        "message": "Payment term code cannot be blank"
      },
      {
        "field": "numberOfDays",
        "message": "Number of days must be greater than or equal to 0"
      }
    ]
  }
  ```
- `409 Conflict` - Payment term code already exists
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 4. Update Payment Term

**Method:** `PUT`

**Endpoint:** `/api/master/term-of-payment/{id}`

**Permission Required:** `master-data:top:update`

**Description:** Updates an existing payment term with new information.

**Path Parameters:**

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| id        | Long | Yes      | Payment term ID |

**Request Body:**

```json
{
  "code": "NET_30",
  "name": "Net 30 Days",
  "description": "Payment due within 30 days from invoice date (updated)",
  "numberOfDays": 30,
  "calculationType": "CALENDAR_DAYS",
  "isActive": true
}
```

**Request Validation Rules:**

| Field           | Type    | Required | Constraints                                               |
| --------------- | ------- | -------- | --------------------------------------------------------- |
| code            | String  | Yes      | Not blank, Max 50 chars, Unique (except current)          |
| name            | String  | Yes      | Not blank, Max 255 chars                                  |
| description     | String  | No       | Max 1000 chars                                            |
| numberOfDays    | Integer | Yes      | ≥ 0                                                       |
| calculationType | String  | Yes      | CALENDAR_DAYS or WORKING_DAYS (from CalculationType enum) |
| discount        | Decimal | No       | ≥ 0 (optional)                                            |
| discountType    | String  | No       | PERCENTAGE or VALUE (optional)                            |
| isActive        | Boolean | Yes      | true or false                                             |

**Response (200 OK):**

```json
{
  "message": "Payment term updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "NET_30",
    "name": "Net 30 Days",
    "description": "Payment due within 30 days from invoice date (updated)",
    "numberOfDays": 30,
    "calculationType": "CALENDAR_DAYS",
    "discount": 0.0,
    "discountType": "PERCENTAGE",
    "discountType": "PERCENTAGE",
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
- `404 Not Found` - Payment term with given ID not found
- `409 Conflict` - Payment term code already exists for another record
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Delete Payment Term

**Method:** `DELETE`

**Endpoint:** `/api/master/term-of-payment/{id}`

**Permission Required:** `master-data:top:delete`

**Description:** Deletes a payment term by ID.

**Path Parameters:**

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| id        | Long | Yes      | Payment term ID |

**Response (200 OK):**

```json
{
  "message": "Payment term deleted successfully",
  "status": "SUCCESS",
  "data": "Payment term deleted successfully",
  "errors": null
}
```

**Error Responses:**

- `404 Not Found` - Payment term with given ID not found
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

### Create a payment term

```bash
curl -X POST http://localhost:8080/api/master/term-of-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "NET_30",
    "name": "Net 30",
    "description": "Payment due within 30 days from invoice date",
    "numberOfDays": 30,
    "calculationType": "CALENDAR_DAYS",
    "isActive": true
  }'
```

### Get all payment terms with pagination and search

```bash
curl "http://localhost:8080/api/master/term-of-payment?search=NET&page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

### Get payment term by ID

```bash
curl "http://localhost:8080/api/master/term-of-payment/1" \
  -H "Authorization: Bearer {token}"
```

### Update a payment term

```bash
curl -X PUT http://localhost:8080/api/master/term-of-payment/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "NET_30",
    "name": "Net 30 Days",
    "description": "Payment due within 30 days from invoice date (updated)",
    "numberOfDays": 30,
    "calculationType": "CALENDAR_DAYS",
    "isActive": true
  }'
```

### Delete a payment term

```bash
curl -X DELETE http://localhost:8080/api/master/term-of-payment/1 \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=0, size=20
- The `createdBy` and `updatedBy` fields are automatically managed by the system
- Payment term codes must be unique and are case-sensitive
- Search functionality supports partial matching across code, name, and description fields
- `numberOfDays` specifies the number of days for payment term calculation
- `calculationType` determines how days are counted (CALENDAR_DAYS includes weekends/holidays, WORKING_DAYS excludes them)
- `discount` stores the discount amount or percentage based on `discountType`
- `discountType` specifies whether discount is PERCENTAGE (% of invoice) or VALUE (fixed amount)
- Payment terms with long-term applicability should be preserved for historical transaction tracking and audit purposes
- All operations are audited for compliance and tracking purposes
