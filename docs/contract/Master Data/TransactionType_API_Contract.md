# Transaction Type API Contract

## Overview

The Transaction Type API provides endpoints for managing transaction types in the Fintra system. This module handles the creation, retrieval, and management of different transaction types used for classifying and organizing financial transactions by company, module, and transaction code within the system.

## Base URL

```
/api/master/transaction-type
```

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

## Permissions

| Operation    | Permission                           | Description        |
| ------------ | ------------------------------------ | ------------------ |
| List/Read    | `master-data:transaction-type:list`   | View list of types |
| Read Details | `master-data:transaction-type:read`   | View type details  |
| Create       | `master-data:transaction-type:create` | Create new type    |
| Update       | `master-data:transaction-type:update` | Update type        |
| Delete       | `master-data:transaction-type:delete` | Delete type        |

## Data Models

### TransactionTypeResponseDTO

```json
{
  "id": 1,
  "companyCode": "COMP001",
  "code": "SI",
  "tcode": "FB70",
  "name": "Sales Invoice",
  "description": "Sales invoice transaction type",
  "moduleId": 1,
  "module": {
    "id": 1,
    "name": "Accounts Receivable",
    "description": "AR module for managing accounts receivable"
  },
  "docType": "F5",
  "docBase": "Sales",
  "formType": "Invoice",
  "type": "revenue",
  "customerCode": "CUST001",
  "taxableItemCode": "TAX001",
  "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
  "isVatUsed": true,
  "hasVirtualPenalty": true,
  "isRevenueRecorded": true,
  "isAutoBilling": true,
  "glRevenue": 1001,
  "glPrepaid": 1002,
  "glFreight": 1003,
  "wwprd": "PROD001",
  "wwrvc": "SVC001",
  "vaSource": "VA_SOURCE_A",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

### TransactionTypeCreateUpdateDTO

```json
{
  "companyCode": "COMP001",
  "code": "SI",
  "tcode": "FB70",
  "name": "Sales Invoice",
  "description": "Sales invoice transaction type",
  "moduleId": 1,
  "docType": "F5",
  "docBase": "Sales",
  "formType": "Invoice",
  "type": "revenue",
  "customerCode": "CUST001",
  "taxableItemCode": "TAX001",
  "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
  "isVatUsed": true,
  "hasVirtualPenalty": true,
  "isRevenueRecorded": true,
  "isAutoBilling": true,
  "glRevenue": 1001,
  "glPrepaid": 1002,
  "glFreight": 1003,
  "wwprd": "PROD001",
  "wwrvc": "SVC001",
  "vaSource": "VA_SOURCE_A",
  "isActive": true
}
```

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "companyCode": "COMP001",
      "tcode": "SI",
      "name": "Sales Invoice",
      "description": "Sales invoice transaction type",
      "moduleId": "AR",
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

### 1. Get All Transaction Types (Paginated)

**Method:** `GET`

**Endpoint:** `/api/master/transaction-type`

**Permission Required:** `master-data:transaction-type:list`

**Description:** Retrieves a paginated list of all transaction types in the system.

**Query Parameters:**

| Parameter | Type    | Required | Description                | Example |
| --------- | ------- | -------- | -------------------------- | ------- |
| page      | Integer | No       | Page number (0-indexed)    | 0       |
| size      | Integer | No       | Number of records per page | 10      |
| sort      | String  | No       | Sort field and direction   | id,desc |
| search    | String  | No       | Search keyword             | invoice |

**Response (200 OK):**

```json
{
  "message": "Transaction types retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "companyCode": "COMP001",
        "code": "SI",
        "tcode": "FB70",
        "name": "Sales Invoice",
        "description": "Sales invoice transaction type",
        "moduleId": 1,
        "module": {
          "id": 1,
          "name": "Accounts Receivable",
          "description": "AR module"
        },
        "docType": "F5",
        "docBase": "Sales",
        "formType": "Invoice",
        "type": "revenue",
        "customerCode": "CUST001",
        "taxableItemCode": "TAX001",
        "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
        "isVatUsed": true,
        "hasVirtualPenalty": true,
        "isRevenueRecorded": true,
        "isAutoBilling": true,
        "glRevenue": 1001,
        "glPrepaid": 1002,
        "glFreight": 1003,
        "wwprd": "PROD001",
        "wwrvc": "SVC001",
        "vaSource": "VA_SOURCE_A",
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

### 2. Get Transaction Type by ID

**Method:** `GET`

**Endpoint:** `/api/master/transaction-type/{id}`

**Permission Required:** `master-data:transaction-type:read`

**Description:** Retrieves a specific transaction type by its ID.

**Path Parameters:**

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| id        | Long | Yes      | Transaction type ID |

**Response (200 OK):**

```json
{
  "message": "Transaction type retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice",
    "description": "Sales invoice transaction type",
    "moduleId": 1,
    "module": {
      "id": 1,
      "name": "Accounts Receivable"
    },
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
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

- `404 Not Found` - Transaction type with given ID not found
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 3. Get Transaction Types by Company Code

**Method:** `GET`

**Endpoint:** `/api/master/transaction-type/company/{companyCode}`

**Permission Required:** `master-data:transaction-type:read`

**Description:** Retrieves all transaction types for a specific company.

**Path Parameters:**

| Parameter   | Type   | Required | Description  |
| ----------- | ------ | -------- | ------------ |
| companyCode | String | Yes      | Company code |

**Response (200 OK):**

```json
{
  "message": "Transaction types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "COMP001",
      "code": "SI",
      "tcode": "FB70",
      "name": "Sales Invoice",
      "description": "Sales invoice transaction type",
      "moduleId": 1,
      "module": {
        "id": 1,
        "name": "Accounts Receivable"
      },
      "docType": "F5",
      "docBase": "Sales",
      "formType": "Invoice",
      "type": "revenue",
      "customerCode": "CUST001",
      "taxableItemCode": "TAX001",
      "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
      "isVatUsed": true,
      "hasVirtualPenalty": true,
      "isRevenueRecorded": true,
      "isAutoBilling": true,
      "glRevenue": 1001,
      "glPrepaid": 1002,
      "glFreight": 1003,
      "wwprd": "PROD001",
      "wwrvc": "SVC001",
      "vaSource": "VA_SOURCE_A",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "errors": null
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 4. Get Transaction Type by Company Code and Transaction Code

**Method:** `GET`

**Endpoint:** `/api/master/transaction-type/company/{companyCode}/tcode/{tcode}`

**Permission Required:** `master-data:transaction-type:read`

**Description:** Retrieves a specific transaction type by company code and transaction code.

**Path Parameters:**

| Parameter   | Type   | Required | Description      |
| ----------- | ------ | -------- | ---------------- |
| companyCode | String | Yes      | Company code     |
| tcode       | String | Yes      | Transaction code |

**Response (200 OK):**

```json
{
  "message": "Transaction type retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice",
    "description": "Sales invoice transaction type",
    "moduleId": 1,
    "module": {
      "id": 1,
      "name": "Accounts Receivable"
    },
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
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

- `404 Not Found` - Transaction type not found with given company code and tcode
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 5. Get Transaction Types by Module ID

**Method:** `GET`

**Endpoint:** `/api/master/transaction-type/module/{moduleId}`

**Permission Required:** `master-data:transaction-type:read`

**Description:** Retrieves all transaction types for a specific module.

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| moduleId  | Long | Yes      | Module ID   |

**Response (200 OK):**

```json
{
  "message": "Transaction types retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "COMP001",
      "code": "SI",
      "tcode": "FB70",
      "name": "Sales Invoice",
      "description": "Sales invoice transaction type",
      "moduleId": 1,
      "module": {
        "id": 1,
        "name": "Accounts Receivable"
      },
      "docType": "F5",
      "docBase": "Sales",
      "formType": "Invoice",
      "type": "revenue",
      "customerCode": "CUST001",
      "taxableItemCode": "TAX001",
      "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
      "isVatUsed": true,
      "hasVirtualPenalty": true,
      "isRevenueRecorded": true,
      "isAutoBilling": true,
      "glRevenue": 1001,
      "glPrepaid": 1002,
      "glFreight": 1003,
      "wwprd": "PROD001",
      "wwrvc": "SVC001",
      "vaSource": "VA_SOURCE_A",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "errors": null
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 6. Create Transaction Type

**Method:** `POST`

**Endpoint:** `/api/master/transaction-type`

**Permission Required:** `master-data:transaction-type:create`

**Description:** Creates a new transaction type in the system.

**Request Body:**

```json
{
  "companyCode": "COMP001",
  "tcode": "FB70",
  "code": "SI",
  "name": "Sales Invoice",
  "description": "Sales invoice transaction type",
  "moduleId": 1,
  "docType": "F5",
  "docBase": "Sales",
  "formType": "Invoice",
  "type": "revenue",
  "customerCode": "CUST001",
  "taxableItemCode": "TAX001",
  "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
  "isVatUsed": true,
  "hasVirtualPenalty": true,
  "isRevenueRecorded": true,
  "isAutoBilling": true,
  "glRevenue": 1001,
  "glPrepaid": 1002,
  "glFreight": 1003,
  "wwprd": "PROD001",
  "wwrvc": "SVC001",
  "vaSource": "VA_SOURCE_A",
  "isActive": true
}
```

**Request Validation Rules:**

| Field             | Type    | Required | Constraints                                          |
| ----------------- | ------- | -------- | ---------------------------------------------------- |
| companyCode       | String  | Yes      | Not blank, Valid company code                        |
| code              | String  | Yes      | Not blank, Unique with company code                  |
| tcode             | String  | No       | SAP Transaction Code (e.g., FB70), Max 50 characters |
| name              | String  | Yes      | Not blank, Max 255 characters                        |
| description       | String  | No       | Max 65535 chars                                      |
| moduleId          | Long    | No       | Valid Module ID (optional)                           |
| docType           | String  | No       | SAP Document Type (e.g., F5), Max 50 characters      |
| docBase           | String  | No       | Max 255 characters                                   |
| formType          | String  | No       | Max 255 characters                                   |
| type              | String  | No       | prepaid, freight, or revenue                         |
| customerCode      | String  | No       | Max 255 characters                                   |
| taxableItemCode   | String  | No       | Max 255 characters                                   |
| invoiceCode       | String  | No       | Max 255 characters (pattern format allowed)          |
| isVatUsed         | Boolean | No       | true or false                                        |
| hasVirtualPenalty | Boolean | No       | true or false                                        |
| isRevenueRecorded | Boolean | No       | true or false (AR module only)                       |
| isAutoBilling     | Boolean | No       | true or false (AR module only)                       |
| glRevenue         | Long    | No       | Valid GL Account (revenue recognition)               |
| glPrepaid         | Long    | No       | Valid GL Account (prepaid amounts)                   |
| glFreight         | Long    | No       | Valid GL Account (freight charges)                   |
| wwprd             | String  | No       | Max 255 characters                                   |
| wwrvc             | String  | No       | Max 255 characters                                   |
| vaSource          | String  | No       | Max 255 characters                                   |
| isActive          | Boolean | Yes      | true or false                                        |

**Response (201 Created):**

```json
{
  "message": "Transaction type created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice",
    "description": "Sales invoice transaction type",
    "moduleId": 1,
    "module": {
      "id": 1,
      "name": "Accounts Receivable",
      "description": "AR module"
    },
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
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
        "field": "companyCode",
        "message": "Company code cannot be blank"
      },
      {
        "field": "code",
        "message": "Transaction code cannot be blank"
      }
    ]
  }
  ```
- `409 Conflict` - Transaction type with same company code and code already exists
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 7. Update Transaction Type

**Method:** `PUT`

**Endpoint:** `/api/master/transaction-type/{id}`

**Permission Required:** `master-data:transaction-type:update`

**Description:** Updates an existing transaction type with new information.

**Path Parameters:**

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| id        | Long | Yes      | Transaction type ID |

**Request Body:**

```json
{
  "companyCode": "COMP001",
  "code": "SI",
  "tcode": "FB70",
  "name": "Sales Invoice - Updated",
  "description": "Updated sales invoice transaction type",
  "moduleId": 1,
  "docType": "F5",
  "docBase": "Sales",
  "formType": "Invoice",
  "type": "revenue",
  "customerCode": "CUST001",
  "taxableItemCode": "TAX001",
  "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
  "isVatUsed": true,
  "hasVirtualPenalty": true,
  "isRevenueRecorded": true,
  "isAutoBilling": true,
  "glRevenue": 1001,
  "glPrepaid": 1002,
  "glFreight": 1003,
  "wwprd": "PROD001",
  "wwrvc": "SVC001",
  "vaSource": "VA_SOURCE_A",
  "isActive": true
}
```

**Request Validation Rules:**

| Field             | Type    | Required | Constraints                                          |
| ----------------- | ------- | -------- | ---------------------------------------------------- |
| companyCode       | String  | Yes      | Not blank, Valid company code                        |
| code              | String  | Yes      | Not blank, Unique with company code (except self)    |
| tcode             | String  | No       | SAP Transaction Code (e.g., FB70), Max 50 characters |
| name              | String  | Yes      | Not blank, Max 255 characters                        |
| description       | String  | No       | Max 65535 chars                                      |
| moduleId          | Long    | No       | Valid Module ID (optional)                           |
| docType           | String  | No       | SAP Document Type (e.g., F5), Max 50 characters      |
| docBase           | String  | No       | Max 255 characters                                   |
| formType          | String  | No       | Max 255 characters                                   |
| type              | String  | No       | prepaid, freight, or revenue                         |
| customerCode      | String  | No       | Max 255 characters                                   |
| taxableItemCode   | String  | No       | Max 255 characters                                   |
| invoiceCode       | String  | No       | Max 255 characters (pattern format allowed)          |
| isVatUsed         | Boolean | No       | true or false                                        |
| hasVirtualPenalty | Boolean | No       | true or false                                        |
| isRevenueRecorded | Boolean | No       | true or false (AR module only)                       |
| isAutoBilling     | Boolean | No       | true or false (AR module only)                       |
| glRevenue         | Long    | No       | Valid GL Account (revenue recognition)               |
| glPrepaid         | Long    | No       | Valid GL Account (prepaid amounts)                   |
| glFreight         | Long    | No       | Valid GL Account (freight charges)                   |
| wwprd             | String  | No       | Max 255 characters                                   |
| wwrvc             | String  | No       | Max 255 characters                                   |
| vaSource          | String  | No       | Max 255 characters                                   |
| isActive          | Boolean | Yes      | true or false                                        |

**Response (200 OK):**

```json
{
  "message": "Transaction type updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice - Updated",
    "description": "Updated sales invoice transaction type",
    "moduleId": 1,
    "module": {
      "id": 1,
      "name": "Accounts Receivable",
      "description": "AR module"
    },
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
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
- `404 Not Found` - Transaction type with given ID not found
- `409 Conflict` - Transaction type with same company code and code already exists for another record
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permission

---

### 8. Delete Transaction Type

**Method:** `DELETE`

**Endpoint:** `/api/master/transaction-type/{id}`

**Permission Required:** `master-data:transaction-type:delete`

**Description:** Deletes a transaction type by ID.

**Path Parameters:**

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| id        | Long | Yes      | Transaction type ID |

**Response (200 OK):**

```json
{
  "message": "Transaction type deleted successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

- `404 Not Found` - Transaction type with given ID not found
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

### Create a transaction type

```bash
curl -X POST http://localhost:8080/api/master/transaction-type \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice",
    "description": "Sales invoice transaction type",
    "moduleId": 1,
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
    "isActive": true
  }'
```

### Get all transaction types with pagination

```bash
curl "http://localhost:8080/api/master/transaction-type?page=0&size=10&search=invoice" \
  -H "Authorization: Bearer {token}"
```

### Get transaction type by ID

```bash
curl "http://localhost:8080/api/master/transaction-type/1" \
  -H "Authorization: Bearer {token}"
```

### Get transaction types by company code

```bash
curl "http://localhost:8080/api/master/transaction-type/company/COMP001" \
  -H "Authorization: Bearer {token}"
```

### Get transaction type by company code and transaction code

```bash
curl "http://localhost:8080/api/master/transaction-type/company/COMP001/tcode/SI" \
  -H "Authorization: Bearer {token}"
```

### Get transaction types by module ID

```bash
curl "http://localhost:8080/api/master/transaction-type/module/1" \
  -H "Authorization: Bearer {token}"
```

### Update a transaction type

```bash
curl -X PUT http://localhost:8080/api/master/transaction-type/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "companyCode": "COMP001",
    "code": "SI",
    "tcode": "FB70",
    "name": "Sales Invoice - Updated",
    "description": "Updated sales invoice transaction type",
    "moduleId": 1,
    "docType": "F5",
    "docBase": "Sales",
    "formType": "Invoice",
    "type": "revenue",
    "customerCode": "CUST001",
    "taxableItemCode": "TAX001",
    "invoiceCode": "INV-{YYYY}-{MM}-{NNNN}",
    "isVatUsed": true,
    "hasVirtualPenalty": true,
    "isRevenueRecorded": true,
    "isAutoBilling": true,
    "glRevenue": 1001,
    "glPrepaid": 1002,
    "glFreight": 1003,
    "wwprd": "PROD001",
    "wwrvc": "SVC001",
    "vaSource": "VA_SOURCE_A",
    "isActive": true
  }'
```

### Delete a transaction type

```bash
curl -X DELETE http://localhost:8080/api/master/transaction-type/1 \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=0, size=20
- The `createdBy` and `updatedBy` fields are automatically managed by the system
- **Unique Constraint**: Transaction type code is unique per company code (not per tcode for legacy support)
- **SAP Integration Fields**:
  - `tcode` (SAP Transaction Code): SAP transaction module and code (e.g., FB70 for Accounts Payable Invoice). Used for SAP document mapping and integration.
  - `docType` (SAP Document Type): SAP document classification code (e.g., F5 for Invoice Type). Essential for SAP field determination and posting rules.
- The `code` field is the primary Fintra transaction type identifier within each company
- Module ID must correspond to valid modules in the system (e.g., AR, AP, GL)
- Each transaction type must have a valid company code reference
- **Transaction Type Field**: Can be set to 'revenue', 'prepaid', or 'freight' to classify transaction nature
- **Receivable-Specific Fields**: `isRevenueRecorded`, `isAutoBilling`, `invoiceCode`, and GL account fields (glRevenue, glPrepaid, glFreight) are primarily used for AR (Accounts Receivable) transactions
- **Virtual Penalty**: The `hasVirtualPenalty` flag indicates whether virtual payment penalties apply
- GL Account IDs (glRevenue, glPrepaid, glFreight) must reference valid General Ledger Accounts if provided
- Transaction types with long-term applicability should be preserved for historical transaction tracking and audit purposes
- All operations are audited for compliance and tracking purposes
