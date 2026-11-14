# External User API Contract

## Overview

The External User API provides endpoints for managing external users within the Fintra system. External users represent partner institutions, third-party organizations, and other external stakeholders with email-based authentication.

## Base URL

```
/api/users/external
```

## Authentication

All endpoints require Bearer token authentication.

**Header:** `Authorization: Bearer <token>`

## Request/Response Models

### ExternalUserResponseDTO

```json
{
  "id": 1,
  "userType": "COMPANY",
  "name": "Partner Contact",
  "email": "contact@partner.com",
  "username": "partner_user",
  "phoneNumber": "021-12345678",
  "photo": null,
  "nik": "1234567890123456",
  "npwp": "99.999.999.9-999.999",
  "ktpFile": "ktp_123.pdf",
  "npwpFile": "npwp_123.pdf",
  "address": "Jl. Contoh No. 123",
  "companyCode": "PARTNER01",
  "responsibleName": "John Doe",
  "responsibleEmail": "john@partner.com",
  "responsibleNik": "9876543210987654",
  "responsibleAddress": "Jl. Responsible No. 1",
  "purpose": "Vendor registration",
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "twoFactorEnabled": false,
  "twoFactorConfirmedAt": null,
  "roles": [
    {
      "id": 1,
      "name": "Partner Admin",
      "code": "PARTNER_ADMIN"
    }
  ],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin",
  "updatedBy": "admin"
}
```

### ExternalUserCreateRequestDTO

```json
{
  "userType": "COMPANY",
  "name": "Partner Contact",
  "email": "contact@partner.com",
  "username": "partner_user",
  "password": "SecurePassword123!",
  "roles": [1, 2],
  "nik": "1234567890123456",
  "npwp": "99.999.999.9-999.999",
  "phoneNumber": "021-12345678",
  "photo": null,
  "ktpFile": null,
  "npwpFile": null,
  "address": "Jl. Contoh No. 123",
  "companyCode": "PARTNER01",
  "responsibleName": "John Doe",
  "responsibleEmail": "john@partner.com",
  "responsibleNik": "9876543210987654",
  "responsibleAddress": "Jl. Responsible No. 1",
  "purpose": "Vendor registration",
  "startDate": "2024-01-01",
  "endDate": "2025-01-01"
}
```

**Validation Rules:**

- `userType`: Required, must be one of `PERSONAL`, `COMPANY`, or `OTHER`
- `name`: Required, 2-255 characters
- `email`: Required, unique, valid email format
- `username`: Required, unique, 4-100 characters
- `password`: Required, minimum 8 characters
- `roles`: Required, non-empty array of valid role IDs
- `nik`: Optional, max 50 characters
- `npwp`: Optional, max 50 characters
- All other fields: Optional

### ExternalUserUpdateRequestDTO

```json
{
  "userType": "COMPANY",
  "name": "Partner Contact Updated",
  "email": "contact.new@partner.com",
  "username": "partner_user_new",
  "password": "NewSecurePassword123!",
  "roles": [1],
  "nik": "1234567890123456",
  "npwp": "99.999.999.9-999.999",
  "phoneNumber": "021-87654321",
  "photo": null,
  "ktpFile": null,
  "npwpFile": null,
  "address": "Jl. Baru No. 456",
  "companyCode": "PARTNER02",
  "responsibleName": "Jane Doe",
  "responsibleEmail": "jane@partner.com",
  "responsibleNik": "9876543210987654",
  "responsibleAddress": "Jl. Responsible No. 2",
  "purpose": "Updated purpose",
  "startDate": "2024-06-01",
  "endDate": "2025-06-01"
}
```

**Validation Rules:**

- `userType`: Optional, must be `PERSONAL`, `COMPANY`, or `OTHER` if provided
- `name`: Optional, 2-255 characters
- `email`: Optional, must be valid email format and unique if provided
- `username`: Optional, 4-100 characters
- `password`: Optional, minimum 8 characters
- `roles`: Required, non-empty array of valid role IDs
- `nik`: Optional, max 50 characters
- `npwp`: Optional, max 50 characters
- All other fields: Optional

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

### PaginationResponse

```json
{
  "content": [
    {
      "id": 1,
      "userType": "COMPANY",
      "name": "Partner Contact",
      "email": "contact@partner.com",
      "username": "partner_user",
      "phoneNumber": "021-12345678",
      "roles": [],
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
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

### 1. Get All External Users

Retrieve a paginated list of external users with optional filtering.

**Endpoint:** `GET /api/users/external`

**Permission Required:** `setting:user:list`

**Query Parameters:**

| Parameter | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| search    | string | No       | Search keyword (name, username, or email)      |
| roleId    | long   | No       | Filter by role ID                              |
| page      | int    | No       | Page number (default: 0)                       |
| size      | int    | No       | Page size (default: 10)                        |
| sort      | string | No       | Sort criteria (default: updatedAt,desc)        |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with PaginationResponse<ExternalUserResponseDTO>

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/users/external?search=partner&roleId=1&page=0&size=10" \
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
        "userType": "COMPANY",
        "name": "Partner Contact",
        "email": "contact@partner.com",
        "username": "partner_user",
        "phoneNumber": "021-12345678",
        "roles": [
          {
            "id": 1,
            "name": "Partner Admin",
            "code": "PARTNER_ADMIN"
          }
        ],
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

### 2. Get External User by ID

Retrieve a specific external user by their ID.

**Endpoint:** `GET /api/users/external/{id}`

**Permission Required:** `setting:user:read`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with ExternalUserResponseDTO

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/users/external/1" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userType": "COMPANY",
    "name": "Partner Contact",
    "email": "contact@partner.com",
    "username": "partner_user",
    "phoneNumber": "021-12345678",
    "photo": null,
    "nik": "1234567890123456",
    "npwp": "99.999.999.9-999.999",
    "ktpFile": null,
    "npwpFile": null,
    "address": "Jl. Contoh No. 123",
    "companyCode": "PARTNER01",
    "responsibleName": "John Doe",
    "responsibleEmail": "john@partner.com",
    "responsibleNik": "9876543210987654",
    "responsibleAddress": "Jl. Responsible No. 1",
    "purpose": "Vendor registration",
    "startDate": "2024-01-01",
    "endDate": "2025-01-01",
    "twoFactorEnabled": false,
    "twoFactorConfirmedAt": null,
    "roles": [],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "message": "User retrieved successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 3. Create External User

Create a new external user from a partner institution.

**Endpoint:** `POST /api/users/external`

**Permission Required:** `setting:user:create`

**Request Body:** ExternalUserCreateRequestDTO

```json
{
  "userType": "COMPANY",
  "name": "Partner Contact",
  "email": "contact@partner.com",
  "username": "partner_user",
  "password": "SecurePassword123!",
  "roles": [1, 2],
  "nik": "1234567890123456",
  "npwp": "99.999.999.9-999.999",
  "phoneNumber": "021-12345678",
  "companyCode": "PARTNER01",
  "address": "Jl. Contoh No. 123",
  "purpose": "Vendor registration"
}
```

**Response:**

- **Status:** 201 Created
- **Body:** ApiResponse with ExternalUserResponseDTO

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/users/external" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "COMPANY",
    "name": "Partner Contact",
    "email": "contact@partner.com",
    "username": "partner_user",
    "password": "SecurePassword123!",
    "roles": [1, 2],
    "companyCode": "PARTNER01",
    "purpose": "Vendor registration"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userType": "COMPANY",
    "name": "Partner Contact",
    "email": "contact@partner.com",
    "username": "partner_user",
    "phoneNumber": null,
    "photo": null,
    "nik": null,
    "npwp": null,
    "ktpFile": null,
    "npwpFile": null,
    "address": null,
    "companyCode": "PARTNER01",
    "responsibleName": null,
    "responsibleEmail": null,
    "responsibleNik": null,
    "responsibleAddress": null,
    "purpose": "Vendor registration",
    "startDate": null,
    "endDate": null,
    "twoFactorEnabled": false,
    "twoFactorConfirmedAt": null,
    "roles": [
      {
        "id": 1,
        "name": "Partner Admin",
        "code": "PARTNER_ADMIN"
      },
      {
        "id": 2,
        "name": "Partner User",
        "code": "PARTNER_USER"
      }
    ],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "message": "External user created successfully"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details (e.g., "Username already exists", "Email already exists", "Password does not meet requirements")

- **Status:** 409 Conflict
- **Message:** "Username or email already in use"

---

### 4. Update External User

Update an existing external user's information.

**Endpoint:** `PUT /api/users/external/{id}`

**Permission Required:** `setting:user:update`

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | long | Yes      | User ID     |

**Request Body:** ExternalUserUpdateRequestDTO

```json
{
  "userType": "COMPANY",
  "name": "Partner Contact Updated",
  "email": "contact.new@partner.com",
  "username": "partner_user",
  "roles": [1],
  "companyCode": "PARTNER02",
  "purpose": "Updated purpose"
}
```

**Response:**

- **Status:** 200 OK
- **Body:** ApiResponse with ExternalUserResponseDTO

**Example Request:**

```bash
curl -X PUT "http://localhost:8080/api/users/external/1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "COMPANY",
    "name": "Partner Contact Updated",
    "email": "contact.new@partner.com",
    "username": "partner_user",
    "roles": [1],
    "companyCode": "PARTNER02",
    "purpose": "Updated purpose"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userType": "COMPANY",
    "name": "Partner Contact Updated",
    "email": "contact.new@partner.com",
    "username": "partner_user",
    "phoneNumber": null,
    "photo": null,
    "nik": null,
    "npwp": null,
    "ktpFile": null,
    "npwpFile": null,
    "address": null,
    "companyCode": "PARTNER02",
    "responsibleName": null,
    "responsibleEmail": null,
    "responsibleNik": null,
    "responsibleAddress": null,
    "purpose": "Updated purpose",
    "startDate": null,
    "endDate": null,
    "twoFactorEnabled": false,
    "twoFactorConfirmedAt": null,
    "roles": [
      {
        "id": 1,
        "name": "Partner Admin",
        "code": "PARTNER_ADMIN"
      }
    ],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "message": "User updated successfully"
}
```

**Error Responses:**

- **Status:** 400 Bad Request
- **Message:** Validation error details

- **Status:** 404 Not Found
- **Message:** "User not found"

- **Status:** 409 Conflict
- **Message:** "Email already in use by another user"

---

### 5. Admin Change External User Password

Change an external user's password without requiring the current password. This is an admin-level operation.

**Endpoint:** `POST /api/users/external/{id}/change-password`

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
curl -X POST "http://localhost:8080/api/users/external/1/change-password" \
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

### 6. Delete External User

Delete an external user and all their role assignments.

**Endpoint:** `DELETE /api/users/external/{id}`

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
curl -X DELETE "http://localhost:8080/api/users/external/1" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": "User deleted successfully",
  "message": "External user deleted successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found"

---

### 7. Delete User Role Assignment

Delete a single role assignment from an external user.

**Endpoint:** `DELETE /api/users/external/{id}/roles/{roleId}`

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
curl -X DELETE "http://localhost:8080/api/users/external/1/roles/2" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**

```json
{
  "success": true,
  "data": "Role removed successfully",
  "message": "External user role removed successfully"
}
```

**Error Responses:**

- **Status:** 404 Not Found
- **Message:** "User not found" or "Role assignment not found"

---

## HTTP Status Codes

| Status Code | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| 200         | OK - Request successful                                             |
| 201         | Created - Resource created successfully                             |
| 400         | Bad Request - Invalid input or validation error                     |
| 401         | Unauthorized - Missing or invalid authentication                    |
| 403         | Forbidden - Insufficient permissions                                |
| 404         | Not Found - Resource not found                                      |
| 409         | Conflict - Resource already exists (e.g., duplicate email/username) |
| 500         | Internal Server Error - Server-side error                           |

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
  - `setting:user:list` - List external users
  - `setting:user:read` - Read external user details
  - `setting:user:create` - Create new external users
  - `setting:user:update` - Update external users and their roles
  - `setting:user:delete` - Delete external users

## Password Requirements

External user passwords must meet the following criteria:

- **Minimum Length:** 8 characters
- **Character Types:** Must contain at least one of each:
  - Uppercase letter (A-Z)
  - Lowercase letter (a-z)
  - Number (0-9)
  - Special character (!@#$%^&\*()\_+-=[]{}|;:,.<>?)

## Username Requirements

- **Length:** 4-100 characters
- **Uniqueness:** Must be unique across the system

## Special Notes

1. **User Types:** External users can be one of three types:
   - `PERSONAL` - Individual external user
   - `COMPANY` - Company/partner institution
   - `OTHER` - Other type

2. **Email Uniqueness:** Email addresses must be unique across both internal and external users.

3. **Role Management:** Users can have multiple roles assigned. Roles are managed through role IDs.

4. **Status Management:** External users' status is derived from system state:
   - `ACTIVE` - User can log in and access features
   - `INACTIVE` - User cannot log in
   - `SUSPENDED` - User is temporarily blocked

5. **Password Security:** Passwords are securely hashed and cannot be retrieved. Password reset must be initiated through a separate endpoint.

6. **Pagination:** All list endpoints support pagination with default page size of 10 and sorting by updatedAt in descending order.

7. **Audit Tracking:** All user actions are logged with timestamps (createdAt, updatedAt, createdBy, updatedBy).

8. **Two-Factor Authentication:** The response includes `twoFactorEnabled` and `twoFactorConfirmedAt` fields indicating the user's 2FA status.

9. **Document Uploads:** Fields `ktpFile` and `npwpFile` store file paths/uploads of identity documents.

---

## Integration Notes

### With Authentication Service

- External users authenticate using username and password
- Successful authentication returns JWT tokens
- Tokens are used in subsequent API requests via Bearer authentication

### With Role & Permission Service

- External users can be assigned multiple roles
- Roles determine available permissions and features
- Permissions are checked before allowing access to protected endpoints

### With Email Service

- Account creation triggers a welcome email
- Password reset requests trigger reset link emails
- Email verification may be required for activation

---

## Version History

| Version | Date       | Changes              |
| ------- | ---------- | -------------------- |
| 1.0     | 2024-01-01 | Initial API contract |
| 1.1     | 2026-07-08 | Fixed field names (`fullName` → `name`, `roleIds` → `roles`). Added `userType` field. Expanded response DTO with full fields (phoneNumber, nik, npwp, ktpFile, npwpFile, address, companyCode, responsible* fields, purpose, startDate, endDate, twoFactorEnabled, twoFactorConfirmedAt, createdBy, updatedBy). Updated create/update DTOs with additional optional fields. |
| 1.2     | 2026-07-09 | Added admin change password endpoint (`POST /{id}/change-password`). Added `AdminChangePasswordRequestDTO`. |
