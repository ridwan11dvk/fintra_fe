# Authentication API Contract

## Overview
The Authentication API provides endpoints for user login, registration, token refresh, and logout operations. It supports both internal and external users with JWT-based token authentication.

---

## Base URL
```
/api/auth
```

---

## Authentication
Most endpoints (except `/login` and `/register`) require JWT Bearer token authentication.

**Header Format:**
```
Authorization: Bearer {jwt_token}
```

---

## Endpoints

### 1. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user using email/NIPP (internal) or email/username (external) and password. Returns user information and JWT authentication tokens. Creates a user session record for tracking.

**Request Body:**
```json
{
  "emailOrUsername": "string",
  "password": "string"
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `emailOrUsername` | String | Yes | User email (for both internal and external) or NIPP (internal only) or username (external only). Cannot be blank. |
| `password` | String | Yes | User password. Cannot be blank. |

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "status": "SUCCESS",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "roles": ["USER", "ADMIN"],
      "createdAt": "2026-01-29T10:30:00",
      "updatedAt": "2026-01-29T10:30:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isSuperAdmin": false,
    "roles": ["USER", "ADMIN"],
    "permissions": ["READ_PROFILE", "EDIT_PROFILE"]
  },
  "errors": null
}
```

**Response Fields (User Object - Internal):**
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | User ID |
| `nipp` | Long | National identification number |
| `name` | String | User full name |
| `email` | String | User email address |
| `companyCode` | String | Company identifier |
| `companyName` | String | Company name |
| `directorateCode` | String | Directorate identifier |
| `directorateName` | String | Directorate name |
| `personalAreaCode` | String | Personal area identifier |
| `personalAreaName` | String | Personal area name |
| `organizationCode` | String | Organization identifier |
| `organizationName` | String | Organization name |
| `jobCode` | String | Job identifier |
| `jobName` | String | Job name |
| `positionCode` | String | Position identifier |
| `positionName` | String | Position name |
| `costCenterCode` | String | Cost center identifier |
| `costCenterName` | String | Cost center name |
| `corsaCode` | String | Corsa identifier |
| `corsaName` | String | Corsa name |
| `businessAreaCode` | String | Business area identifier |
| `businessAreaName` | String | Business area name |
| `supervisorLevelOneNipp` | Long | Level one supervisor NIPP |
| `supervisorLevelOneName` | String | Level one supervisor name |
| `supervisorLevelTwoNipp` | Long | Level two supervisor NIPP |
| `supervisorLevelTwoName` | String | Level two supervisor name |
| `supervisorLevelOnePosition` | String | Level one supervisor position |
| `supervisorLevelTwoPosition` | String | Level two supervisor position |
| `photo` | String | User photo URL |
| `roles` | List<String> | List of assigned roles |
| `createdAt` | LocalDateTime | Account creation timestamp |
| `updatedAt` | LocalDateTime | Last update timestamp |
| `createdBy` | String | Created by user identifier |
| `updatedBy` | String | Updated by user identifier |

**Response Fields (User Object - External):**
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | User ID |
| `name` | String | User full name |
| `email` | String | User email address |
| `username` | String | Unique username |
| `institution` | String | Associated institution |
| `position` | String | User position/title |
| `roles` | List<String> | List of assigned roles |
| `expirationDate` | LocalDate | Account expiration date |
| `twoFactorEnabled` | Boolean | Two-factor authentication status |
| `createdAt` | LocalDateTime | Account creation timestamp |
| `updatedAt` | LocalDateTime | Last update timestamp |
| `createdBy` | String | Created by user identifier |
| `updatedBy` | String | Updated by user identifier |

**Response Fields (Login Response):**
| Field | Type | Description |
|-------|------|-------------|
| `user` | Object | User information (Internal or External) |
| `token` | String | JWT access token (use in Authorization header) |
| `refreshToken` | String | JWT refresh token (use to request new access token) |
| `isSuperAdmin` | Boolean | Whether user is superadmin |
| `roles` | Set<String> | Set of user roles |
| `permissions` | Set<String> | Set of user permissions |

**Error Responses:**

| Status Code | Error | Description |
|------------|-------|-------------|
| `400 Bad Request` | Validation Error | Missing or invalid request fields |
| `401 Unauthorized` | Invalid Credentials | Email/username or password is incorrect |
| `404 Not Found` | User Not Found | User with provided identifier does not exist |

**Error Response Example (400):**
```json
{
  "message": "Validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "emailOrUsername",
      "message": "Email or username cannot be blank"
    },
    {
      "field": "password",
      "message": "Password cannot be blank"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "password123"
  }'
```

---

### 2. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Request a new access token using a valid refresh token. Implements token rotation by issuing a new refresh token as well.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | String | Yes | Valid refresh token from previous login. Cannot be blank. |

**Success Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "status": "SUCCESS",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "roles": ["USER", "ADMIN"],
      "createdAt": "2026-01-29T10:30:00",
      "updatedAt": "2026-01-29T10:30:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isSuperAdmin": false,
    "roles": ["USER", "ADMIN"],
    "permissions": ["READ_PROFILE", "EDIT_PROFILE"]
  },
  "errors": null
}
```

**Error Responses:**

| Status Code | Error | Description |
|------------|-------|-------------|
| `400 Bad Request` | Validation Error | Refresh token is missing or invalid format |
| `401 Unauthorized` | Invalid Token | Refresh token is expired or invalid |

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

### 3. Register External User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new external user account with email, username, and password.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "institution": "string",
  "position": "string"
}
```

**Request Parameters:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-----------|-------------|
| `name` | String | Yes | 2-255 chars | User's full name. Cannot be blank. |
| `email` | String | Yes | Valid email format | User's email address. Cannot be blank. Must be valid email format. |
| `username` | String | Yes | 4-100 chars | Unique username. Cannot be blank. Must be between 4 and 100 characters. |
| `password` | String | Yes | Min 8 chars | User's password. Cannot be blank. Must be at least 8 characters. |
| `institution` | String | Yes | - | Associated institution. Cannot be blank. |
| `position` | String | Yes | - | User's position/title. Cannot be blank. |

**Success Response (201 Created):**
```json
{
  "message": "Registration successful",
  "status": "SUCCESS",
  "data": {
    "userId": 2,
    "email": "newuser@example.com",
    "username": "newuser",
    "name": "Jane Doe",
    "institution": "ABC Organization",
    "position": "Senior Analyst",
    "expirationDate": "2027-01-29",
    "registeredAt": "2026-01-29T10:30:00"
  },
  "errors": null
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `userId` | Long | ID of the newly created user |
| `email` | String | Registered email address |
| `username` | String | Registered username |
| `name` | String | User's full name |
| `institution` | String | Associated institution |
| `position` | String | User's position |
| `expirationDate` | LocalDate | Account expiration date |
| `registeredAt` | LocalDateTime | Registration timestamp |

**Error Responses:**

| Status Code | Error | Description |
|------------|-------|-------------|
| `400 Bad Request` | Validation Error | Missing, invalid, or duplicate fields |
| `409 Conflict` | Email/Username Exists | Email or username already registered |

**Error Response Example (400):**
```json
{
  "message": "Validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Email should be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    },
    {
      "field": "name",
      "message": "Name must be between 2 and 255 characters"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "janedoe",
    "password": "SecurePass123",
    "institution": "ABC Organization",
    "position": "Senior Analyst"
  }'
```

---

### 4. User Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout the current authenticated user. Invalidates the session or token and clears cached user data.

**Authentication Required:** Yes (Bearer Token)

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "message": "Logout successful",
  "status": "SUCCESS",
  "data": "Logout successful",
  "errors": null
}
```

**Error Responses:**

| Status Code | Error | Description |
|------------|-------|-------------|
| `401 Unauthorized` | Missing Token | Authorization header or token is missing |
| `403 Forbidden` | Invalid Token | Token is invalid or expired |

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. Get Permissions for Role Simulation (Superadmin Only)

**Endpoint:** `GET /api/auth/superadmin/simulate/{roleId}`

**Description:** Retrieve all UI permissions associated with a specific role. Only accessible by superadmin users.

**Authentication Required:** Yes (Bearer Token)

**Authorization Required:** Superadmin role

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | Long | Yes | The ID of the role to retrieve permissions for |

**Success Response (200 OK):**
```json
{
  "message": "Permissions retrieved successfully",
  "status": "SUCCESS",
  "data": [
    "READ_USERS",
    "CREATE_USERS",
    "EDIT_USERS",
    "DELETE_USERS",
    "READ_REPORTS",
    "APPROVE_TRANSACTIONS"
  ],
  "errors": null
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `data` | Set<String> | Set of permission names for the role |

**Error Responses:**

| Status Code | Error | Description |
|------------|-------|-------------|
| `401 Unauthorized` | Missing Token | Authorization header or token is missing |
| `403 Forbidden` | Access Denied | User is not superadmin or token is invalid |
| `404 Not Found` | Role Not Found | Role with provided ID does not exist |

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/auth/superadmin/simulate/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Common Response Codes

| Status Code | Meaning |
|------------|---------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request or validation error |
| `401 Unauthorized` | Authentication failed or token invalid |
| `403 Forbidden` | Authorization failed (insufficient permissions) |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource conflict (e.g., duplicate email) |
| `500 Internal Server Error` | Server-side error |

---

## Error Response Format

All errors follow a standard format:

```json
{
  "message": "Error description",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

---

## Token Management

### JWT Token Structure
Tokens are JWT (JSON Web Tokens) with the following claims:
- `sub`: Subject (user email or ID)
- `iat`: Issued at time
- `exp`: Expiration time
- `aud`: Audience
- `iss`: Issuer

### Token Lifespan
- **Access Token:** 15 minutes (configurable)
- **Refresh Token:** 7 days (configurable)

### Token Rotation
When using the `/refresh` endpoint, a new refresh token is issued along with the access token. The old refresh token becomes invalid after token rotation.

---

## Session Management

### Session Creation
A session record is created upon successful login with:
- User ID and type (INTERNAL/EXTERNAL)
- JWT tokens
- Client IP address
- User agent/browser information
- Timestamp

### Session Invalidation
Sessions are invalidated when:
- User logs out
- Access token expires
- Refresh token expires

---

## Best Practices

### Client Implementation
1. Store access tokens in memory (not localStorage for security)
2. Store refresh tokens securely (httpOnly cookies recommended)
3. Implement token refresh before expiration
4. Handle token expiration gracefully
5. Clear tokens on logout

### Security
1. Always use HTTPS in production
2. Never log or expose JWT tokens
3. Validate email format on the client side
4. Implement rate limiting for login attempts
5. Implement account lockout after failed attempts
6. Use strong passwords (minimum 8 characters)

### Error Handling
1. Catch 401 errors and redirect to login
2. Catch 403 errors and show permission denied message
3. Catch 400 errors and display validation messages
4. Implement exponential backoff for retries

---

## Example Workflow

### 1. User Registration
```
POST /api/auth/register → User created
```

### 2. User Login
```
POST /api/auth/login → Receive access and refresh tokens
```

### 3. Access Protected Resource
```
GET /api/protected/resource
Authorization: Bearer {access_token}
```

### 4. Token Refresh (Before Expiration)
```
POST /api/auth/refresh
Body: { "refreshToken": "{refresh_token}" }
→ Receive new access and refresh tokens
```

### 5. User Logout
```
POST /api/auth/logout
Authorization: Bearer {access_token}
→ Session invalidated, tokens revoked
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-29 | Initial API contract |

