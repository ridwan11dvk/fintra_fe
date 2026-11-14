# Internal User API Contract

## Overview

The Internal User API provides endpoints for managing internal users within the Fintra system. Internal users represent company staff with NIPP (employee ID) validation against the ESA system.

## Base URL

```
/api/users/internal
```

## Authentication

All endpoints require Bearer token authentication.

**Header:** `Authorization: Bearer <token>`

## Request/Response Models

### InternalUserResponseDTO

```json
{
  "id": 1,
  "nipp": "12345678",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "phoneNumber": "08123456789",
  "companyCode": "C001",
  "companyName": "PT KAI",
  "directorateCode": "D001",
  "directorateName": "Directorate",
  "directorateNomenclature": "DIR",
  "personalAreaCode": "PA001",
  "personalAreaName": "Personal Area",
  "organizationCode": "O001",
  "organizationName": "Organization",
  "organizationNomenclature": "ORG",
  "jobCode": "J001",
  "jobName": "Staff",
  "jobFamilyCode": "JF001",
  "jobFamilyName": "Job Family",
  "subJobFamilyCode": "SJF001",
  "subJobFamilyName": "Sub Job Family",
  "grade": "5A",
  "workerGroupCode": "WG001",
  "workerGroupName": "Worker Group",
  "subWorkerGroupCode": "SWG001",
  "subWorkerGroupName": "Sub Worker Group",
  "tempSupervisorNipp": "11111111",
  "tempSupervisorName": "Supervisor",
  "positionCode": "P001",
  "positionName": "Staff Position",
  "positionNomenclature": "POS",
  "costCenterCode": "CC001",
  "costCenterName": "Cost Center",
  "corsaCode": "CR001",
  "corsaName": "Corsa",
  "corsaNomenclature": "CRS",
  "businessAreaCode": "BA001",
  "businessAreaName": "Business Area",
  "supervisorLevelOneNipp": "22222222",
  "supervisorLevelOneName": "Supervisor One",
  "supervisorLevelOnePosition": "Manager",
  "supervisorLevelOnePositionName": "Manager Position",
  "supervisorLevelOneDetail": null,
  "supervisorLevelTwoNipp": "33333333",
  "supervisorLevelTwoName": "Supervisor Two",
  "supervisorLevelTwoPosition": "General Manager",
  "supervisorLevelTwoPositionName": "GM Position",
  "supervisorLevelTwoDetail": null,
  "photo": null,
  "rkipInputPeriodUntil": "2026-12-31",
  "employmentStartDate": "2024-01-01",
  "mutationDate": null,
  "genderCode": "M",
  "genderName": "Male",
  "beginningDate": "2024-01-01",
  "endingDate": null,
  "recordingDate": "2024-01-01T00:00:00",
  "stat2": "A",
  "psCode": "PS001",
  "psText": "Position Text",
  "psGroup": "PSG",
  "twoFactorEnabled": false,
  "twoFactorConfirmedAt": null,
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "code": "ADMIN"
    }
  ],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin",
  "updatedBy": "admin"
}
```

### InternalUserCreateRequestDTO (ESA-based)

```json
{
  "nipp": "12345678",
  "roles": [1, 2]
}
```

**Validation Rules:**

- `nipp`: Required, must exist in ESA system
- `roles`: Required, non-empty array of valid role IDs

### InternalUserUpdateRequestDTO (ESA-based, roles only)

```json
{
  "roles": [1, 3]
}
```

**Validation Rules:**

- `roles`: Required, non-empty array of valid role IDs

### InternalUserDirectCreateRequestDTO

```json
{
  "nipp": "87654321",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "phoneNumber": "08123456789",
  "companyCode": "C001",
  "companyName": "PT KAI",
  "directorateCode": "D001",
  "directorateName": "Directorate",
  "directorateNomenclature": "DIR",
  "personalAreaCode": "PA001",
  "personalAreaName": "Personal Area",
  "organizationCode": "O001",
  "organizationName": "Organization",
  "organizationNomenclature": "ORG",
  "jobCode": "J001",
  "jobName": "Staff",
  "jobFamilyCode": "JF001",
  "jobFamilyName": "Job Family",
  "subJobFamilyCode": "SJF001",
  "subJobFamilyName": "Sub Job Family",
  "grade": "5A",
  "workerGroupCode": "WG001",
  "workerGroupName": "Worker Group",
  "subWorkerGroupCode": "SWG001",
  "subWorkerGroupName": "Sub Worker Group",
  "tempSupervisorNipp": "11111111",
  "tempSupervisorName": "Supervisor",
  "positionCode": "P001",
  "positionName": "Staff Position",
  "positionNomenclature": "POS",
  "costCenterCode": "CC001",
  "costCenterName": "Cost Center",
  "corsaCode": "CR001",
  "corsaName": "Corsa",
  "corsaNomenclature": "CRS",
  "businessAreaCode": "BA001",
  "businessAreaName": "Business Area",
  "supervisorLevelOneNipp": "22222222",
  "supervisorLevelOneName": "Supervisor One",
  "supervisorLevelTwoNipp": "33333333",
  "supervisorLevelTwoName": "Supervisor Two",
  "supervisorLevelOnePosition": "Manager",
  "supervisorLevelTwoPosition": "General Manager",
  "photo": null,
  "employmentStartDate": "2024-01-01",
  "mutationDate": null,
  "genderCode": "M",
  "genderName": "Male",
  "beginningDate": "2024-01-01",
  "endingDate": null,
  "recordingDate": "2024-01-01T00:00:00",
  "stat2": "A",
  "psCode": "PS001",
  "psText": "Position Text",
  "psGroup": "PSG",
  "roles": [1, 2]
}
```

**Validation Rules:**

- `nipp`: Required, non-blank
- `name`: Required, non-blank
- `email`: Required, must be valid email format
- `password`: Required, minimum 8 characters
- `companyCode`: Required, non-blank
- `companyName`: Required, non-blank
- `organizationCode`: Required, non-blank
- `organizationName`: Required, non-blank
- `jobCode`: Required, non-blank
- `jobName`: Required, non-blank
- `positionCode`: Required, non-blank
- `positionName`: Required, non-blank
- `costCenterCode`: Required, non-blank
- `costCenterName`: Required, non-blank
- `businessAreaCode`: Required, non-blank
- `businessAreaName`: Required, non-blank
- `supervisorLevelOnePosition`: Required, non-blank
- `supervisorLevelTwoPosition`: Required, non-blank
- `roles`: Required, non-empty array of valid role IDs
- All other fields: Optional

### InternalUserDirectUpdateRequestDTO

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@company.com",
  "phoneNumber": "08987654321",
  "roles": [1, 2, 3]
}
```

**Validation Rules:**

- All fields are optional (PATCH semantics)
- Only non-null fields are applied to the existing record

### AdminChangePasswordRequestDTO

```json
{
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Validation Rules:**

- `newPassword`: Required, minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, and one number
- `confirmPassword`: Required, must match `newPassword`

### RKIPDateLimitUpdateDTO

```json
{
  "dateLimit": "2026-12-31"
}
```

**Validation Rules:**

- `dateLimit`: Required, must be a valid date in ISO format

### BulkRKIPDateLimitUpdateDTO

```json
{
  "roleIds": [1, 2, 3],
  "dateLimit": "2026-12-31"
}
```

**Validation Rules:**

- `roleIds`: Required, non-empty array of role IDs
- `dateLimit`: Required, must be a valid date in ISO format

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "nipp": "12345678",
      "email": "john.doe@company.com",
      "name": "John Doe",
      "status": "ACTIVE",
      "roles": [],
      "rkipDateLimit": "2026-12-31",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

### ApiResponse

All endpoints return responses wrapped in an ApiResponse object:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

## Endpoints

### 1. Get All Internal Users

Retrieve a paginated list of internal users with optional filtering.

**Endpoint:** `GET /api/users/internal`

**Permission Required:** `setting:user:list`

**Query Parameters:**

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| search    | string | No       | Search keyword (name, NIPP, or email)   |
| roleId    | long   | No       | Filter by role ID                       |
| page      | int    | No       | Page number (default: 0)                |
| size      | int    | No       | Page size (default: 10)                 |
| sort      | string | No       | Sort criteria (default: updatedAt,desc) |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with PaginationResponse<InternalUserResponseDTO>

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/users/internal?search=john&roleId=1&page=0&size=10" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "nipp": "12345678",
        "email": "john.doe@company.com",
        "name": "John Doe",
        "status": "ACTIVE",
        "roles": [
          {
            "id": 1,
            "name": "Admin",
            "code": "ADMIN"
          }
        ],
        "rkipDateLimit": "2026-12-31",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": false,
    "hasPrevious": false
  },
  "message": "Users retrieved successfully"
}
```

---

### 2. Get Internal User by ID

Retrieve a specific internal user by their ID.

**Endpoint:** `GET /api/users/internal/{id}`

**Permission Required:** `setting:user:read`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/users/internal/1" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nipp": "12345678",
    "email": "john.doe@company.com",
    "name": "John Doe",
    "status": "ACTIVE",
    "roles": [],
    "rkipDateLimit": "2026-12-31",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  },
  "message": "User retrieved successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 3. Get ESA User by NIPP

Retrieve an internal user by their NIPP from the ESA system.

**Endpoint:** `GET /api/users/internal/esa/{nipp}`

**Permission Required:** `setting:user:read`

**Path Parameters:**

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| nipp      | string | Yes      | Employee NIPP |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/users/internal/esa/12345678" \
  -H "Authorization: Bearer <token>"
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found in ESA"

- **Status:** 500 Internal Server Error
- **Message:** "Failed to communicate with ESA service"

---

### 4. Create Internal User from ESA

Create a new internal user by validating NIPP against ESA.

**Endpoint:** `POST /api/users/internal/esa`

**Permission Required:** `setting:user:create`

**Request Body:** InternalUserCreateRequestDTO

```json
{
  "nipp": "12345678",
  "roles": [1, 2]
}
```

**Response:**

- **Status:** 201 Created
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/internal/esa" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nipp": "12345678",
    "roles": [1, 2]
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nipp": "12345678",
    "email": "john.doe@company.com",
    "name": "John Doe",
    "status": "ACTIVE",
    "roles": [
      {
        "id": 1,
        "name": "Admin",
        "code": "ADMIN"
      },
      {
        "id": 2,
        "name": "Viewer",
        "code": "VIEWER"
      }
    ],
    "rkipDateLimit": null,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  },
  "message": "Internal user created from ESA successfully"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

- **Status:** 404 Not Found
- **Message:** "Employee not found in ESA with NIPP: {nipp}"

- **Status:** 500 Internal Server Error
- **Message:** "ESA service call failed"

---

### 5. Update Internal User Roles from ESA

Update an existing internal user's role assignments (ESA-based, roles only).

**Endpoint:** `PUT /api/users/internal/esa/{id}`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Request Body:** InternalUserUpdateRequestDTO

```json
{
  "roles": [1, 3]
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X PUT "http://localhost:8080/api/users/internal/esa/1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roles": [1, 3]
  }'
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 6. Create Internal User (Direct Input)

Create a new internal user with complete data input. No ESA validation.

**Endpoint:** `POST /api/users/internal`

**Permission Required:** `setting:user:create`

**Request Body:** InternalUserDirectCreateRequestDTO

```json
{
  "nipp": "87654321",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "phoneNumber": "08123456789",
  "companyCode": "C001",
  "companyName": "PT KAI",
  "directorateCode": "D001",
  "directorateName": "Directorate",
  "directorateNomenclature": "DIR",
  "personalAreaCode": "PA001",
  "personalAreaName": "Personal Area",
  "organizationCode": "O001",
  "organizationName": "Organization",
  "organizationNomenclature": "ORG",
  "jobCode": "J001",
  "jobName": "Staff",
  "jobFamilyCode": "JF001",
  "jobFamilyName": "Job Family",
  "subJobFamilyCode": "SJF001",
  "subJobFamilyName": "Sub Job Family",
  "grade": "5A",
  "workerGroupCode": "WG001",
  "workerGroupName": "Worker Group",
  "subWorkerGroupCode": "SWG001",
  "subWorkerGroupName": "Sub Worker Group",
  "tempSupervisorNipp": "11111111",
  "tempSupervisorName": "Supervisor",
  "positionCode": "P001",
  "positionName": "Staff Position",
  "positionNomenclature": "POS",
  "costCenterCode": "CC001",
  "costCenterName": "Cost Center",
  "corsaCode": "CR001",
  "corsaName": "Corsa",
  "corsaNomenclature": "CRS",
  "businessAreaCode": "BA001",
  "businessAreaName": "Business Area",
  "supervisorLevelOneNipp": "22222222",
  "supervisorLevelOneName": "Supervisor One",
  "supervisorLevelTwoNipp": "33333333",
  "supervisorLevelTwoName": "Supervisor Two",
  "supervisorLevelOnePosition": "Manager",
  "supervisorLevelTwoPosition": "General Manager",
  "photo": null,
  "employmentStartDate": "2024-01-01",
  "mutationDate": null,
  "genderCode": "M",
  "genderName": "Male",
  "beginningDate": "2024-01-01",
  "endingDate": null,
  "recordingDate": "2024-01-01T00:00:00",
  "stat2": "A",
  "psCode": "PS001",
  "psText": "Position Text",
  "psGroup": "PSG",
  "roles": [1, 2]
}
```

**Response:**

- **Status:** 201 Created
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/internal" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nipp": "87654321",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "password": "SecurePassword123!",
    "companyCode": "C001",
    "companyName": "PT KAI",
    "organizationCode": "O001",
    "organizationName": "Organization",
    "jobCode": "J001",
    "jobName": "Staff",
    "positionCode": "P001",
    "positionName": "Staff Position",
    "costCenterCode": "CC001",
    "costCenterName": "Cost Center",
    "businessAreaCode": "BA001",
    "businessAreaName": "Business Area",
    "supervisorLevelOnePosition": "Manager",
    "supervisorLevelTwoPosition": "General Manager",
    "roles": [1, 2]
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nipp": "87654321",
    "email": "john.doe@company.com",
    "name": "John Doe",
    "status": "ACTIVE",
    "roles": [
      {
        "id": 1,
        "name": "Admin",
        "code": "ADMIN"
      },
      {
        "id": 2,
        "name": "Viewer",
        "code": "VIEWER"
      }
    ],
    "rkipDateLimit": null,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  },
  "message": "Internal user created successfully"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details or "NIPP already exists"

---

### 7. Update Internal User (Direct Input, PATCH Semantics)

Update an existing internal user. Only provided fields will be updated.

**Endpoint:** `PATCH /api/users/internal/{id}`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Request Body:** InternalUserDirectUpdateRequestDTO

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@company.com",
  "phoneNumber": "08987654321",
  "roles": [1, 2, 3]
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X PATCH "http://localhost:8080/api/users/internal/1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@company.com",
    "roles": [1, 2, 3]
  }'
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details or "NIPP already exists"

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 8. Admin Change Internal User Password

Change an internal user's password without requiring the current password. This is an admin-level operation.

**Endpoint:** `POST /api/users/internal/{id}/change-password`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Request Body:** AdminChangePasswordRequestDTO

```json
{
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with null data

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/internal/1/change-password" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "NewSecurePassword123",
    "confirmPassword": "NewSecurePassword123"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** "Password confirmation does not match" or validation error details

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 9. Delete Internal User

Delete an internal user and all their role assignments.

**Endpoint:** `DELETE /api/users/internal/{id}`

**Permission Required:** `setting:user:delete`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with message

**Example Request:**

```bash
curl -X DELETE "http://localhost:8080/api/users/internal/1" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": "User deleted successfully",
  "message": "Internal user deleted successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 10. Delete User Role Assignment

Delete a single role assignment from an internal user.

**Endpoint:** `DELETE /api/users/internal/{id}/roles/{roleId}`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description       |
| --------- | ---- | -------- | ----------------- |
| id        | long | Yes      | User ID           |
| roleId    | long | Yes      | Role ID to remove |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with message

**Example Request:**

```bash
curl -X DELETE "http://localhost:8080/api/users/internal/1/roles/2" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": "Role removed successfully",
  "message": "Internal user role removed successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found" or "Role assignment not found"

---

### 11. Update Internal User RKIP Date Limit

Update an internal user's RKIP date limit.

**Endpoint:** `POST /api/users/internal/{id}/rkip-date-limit`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Request Body:** RKIPDateLimitUpdateDTO

```json
{
  "dateLimit": "2026-12-31"
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/internal/1/rkip-date-limit" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dateLimit": "2026-12-31"
  }'
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 12. Delete Internal User RKIP Date Limit

Delete an internal user's RKIP date limit (set to null).

**Endpoint:** `DELETE /api/users/internal/{id}/rkip-date-limit`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with InternalUserResponseDTO

**Example Request:**

```bash
curl -X DELETE "http://localhost:8080/api/users/internal/1/rkip-date-limit" \
  -H "Authorization: Bearer <token>"
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 13. Bulk Update RKIP Date Limit by Role IDs

Update RKIP date limit for all users with specified role IDs.

**Endpoint:** `POST /api/users/internal/rkip-date-limit/bulk`

**Permission Required:** `setting:user:update`

**Request Body:** BulkRKIPDateLimitUpdateDTO

```json
{
  "roleIds": [1, 2, 3],
  "dateLimit": "2026-12-31"
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with integer (number of updated users)

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/internal/rkip-date-limit/bulk" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roleIds": [1, 2, 3],
    "dateLimit": "2026-12-31"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": 15,
  "message": "RKIP date limit updated for 15 users"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

---

### 14. Update All Internal Users RKIP Date Limit

Update RKIP date limit for all internal users, optionally filtered by the module of their assigned roles.

**Endpoint:** `POST /api/users/internal/rkip-date-limit/all`

**Permission Required:** `setting:user:update`

**Query Parameters:**

| Parameter | Type | Required | Description                                      |
| --------- | ---- | -------- | ------------------------------------------------ |
| moduleId  | long | No       | Filter by role module ID (only users with roles in this module) |

**Request Body:** RKIPDateLimitUpdateDTO

```json
{
  "dateLimit": "2026-12-31"
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with integer (number of updated users)

**Example Request (all users):**

```bash
curl -X POST "http://localhost:8080/api/users/internal/rkip-date-limit/all" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dateLimit": "2026-12-31"
  }'
```

**Example Request (filtered by module):**

```bash
curl -X POST "http://localhost:8080/api/users/internal/rkip-date-limit/all?moduleId=1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dateLimit": "2026-12-31"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": 50,
  "message": "RKIP date limit updated for all 50 users"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

---

## HTTP Status Codes

| Status Code | Description                                      |
| ----------- | ------------------------------------------------ |
| 200         | OK - Request successful                          |
| 201         | Created - Resource created successfully          |
| 400         | Bad Request - Invalid input or validation error  |
| 401         | Unauthorized - Missing or invalid authentication |
| 403         | Forbidden - Insufficient permissions             |
| 404         | Not Found - Resource not found                   |
| 500         | Internal Server Error - Server-side error        |

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

## Authentication & Authorization

- **Authentication:** Bearer token in Authorization header
- **Authorization:** Role-based access control using permissions
  - `setting:user:list` - List users
  - `setting:user:read` - Read user details
  - `setting:user:create` - Create new users
  - `setting:user:update` - Update users and their roles
  - `setting:user:delete` - Delete users

## Special Notes

1. **ESA vs Direct Creation:**
   - **ESA-based** (`POST /esa`): Creates user by NIPP, data is fetched and enriched from the ESA system. Only NIPP and roles are provided.
   - **Direct Input** (`POST /`): Creates user with full data payload. No ESA validation is performed.

2. **ESA vs Direct Update:**
   - **ESA-based** (`PUT /esa/{id}`): Updates only role assignments. Uses ESA data for enrichment.
   - **Direct Input** (`PATCH /{id}`): Partial update with PATCH semantics. Only provided fields are modified. Roles field is optional; if omitted, existing roles are preserved.

3. **NIPP Uniqueness:** NIPP must be unique across the system, regardless of creation method.

4. **Role Management:** Users can have multiple roles assigned. Roles are managed through role IDs.

5. **RKIP Date Limit:** RKIP (Reksam Keahlian Investigatif Pajak) date limit can be set per user, by role IDs, or globally for all users. The field name in the request body is `dateLimit`.

6. **Pagination:** All list endpoints support pagination with default page size of 10 and sorting by updatedAt in descending order.

7. **Two-Factor Authentication:** The response includes `twoFactorEnabled` and `twoFactorConfirmedAt` fields indicating the user's 2FA status.

8. **Supervisor Details:** The response includes nested supervisor detail objects (`supervisorLevelOneDetail`, `supervisorLevelTwoDetail`) when the supervisor is also an internal user in the system.

---

## Version History

| Version | Date       | Changes              |
| ------- | ---------- | -------------------- |
| 1.0     | 2024-01-01 | Initial API contract |
| 1.1     | 2026-06-09 | Added bulk and all-user RKIP date endpoints |
| 1.2     | 2026-07-08 | Split ESA and direct endpoints. ESA moved to `/esa` and `/esa/{id}`, direct create at `POST /`, direct update at `PATCH /{id}`. Updated DTO field names (`roles` not `roleIds`, `dateLimit` not `rkipDateLimit`). Added direct create/update DTOs and full user response fields. |
| 1.3     | 2026-07-08 | Added `password` field to direct create DTO. Password is encoded before persistence. Only `nipp`, `name`, `email`, `password`, `roles` are required on direct create; all other fields optional. |
| 1.4     | 2026-07-09 | Added admin change password endpoint (`POST /{id}/change-password`). Added `AdminChangePasswordRequestDTO`. |
