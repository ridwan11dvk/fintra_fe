# Profile API Contract

## Overview

The Profile API provides endpoints for authenticated users to manage their own profile information, change their password, configure two-factor authentication (2FA), and manage active sessions. All endpoints derive the user identity from the JWT token — no user ID is passed in the URL.

---

## Base Information

- **Base URL**: `/api/profile`
- **Authentication**: Bearer JWT Token (required for all endpoints)
- **Content-Type**:
  - JSON: `application/json`
  - File upload: `multipart/form-data`
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

---

## Endpoints Summary

| No | Method   | Endpoint                          | Description                                      |
|----|----------|-----------------------------------|--------------------------------------------------|
| 1  | GET      | `/api/profile`                    | View current user's profile                      |
| 2  | PUT      | `/api/profile`                    | Update current user's profile                    |
| 3  | PUT      | `/api/profile/password`           | Change password                                  |
| 4  | POST     | `/api/profile/2fa/setup`          | Initiate 2FA setup (generate QR & secret)        |
| 5  | POST     | `/api/profile/2fa/confirm`        | Confirm 2FA setup with TOTP code                 |
| 6  | POST     | `/api/profile/2fa/disable`        | Disable 2FA                                      |
| 7  | POST     | `/api/profile/2fa/recovery-codes` | Regenerate 2FA recovery codes                    |
| 8  | GET      | `/api/profile/sessions`           | List all active sessions                         |
| 9  | DELETE   | `/api/profile/sessions/{id}`      | Terminate a specific session                     |
| 10 | DELETE   | `/api/profile/sessions`           | Terminate all sessions except the current one    |

---

## 1. Get Profile

**Endpoint:** `GET /api/profile`

**Description:** Returns the full profile of the authenticated user. The response shape differs depending on whether the user is `INTERNAL` or `EXTERNAL`.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK) — Internal User:**

```json
{
  "message": "Profile retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "nipp": "123456",
    "name": "John Doe",
    "email": "john.doe@kai.id",
    "phoneNumber": "081234567890",
    "photo": null,
    "companyCode": "1000",
    "companyName": "PT Kereta Api Indonesia",
    "directorateCode": "D01",
    "directorateName": "Directorate of Finance",
    "directorateNomenclature": "DIR-FIN",
    "personalAreaCode": "PA01",
    "personalAreaName": "Bandung",
    "organizationCode": "ORG01",
    "organizationName": "Treasury Division",
    "organizationNomenclature": "TREAS",
    "positionCode": "POS01",
    "positionName": "Senior Treasury Officer",
    "positionNomenclature": "STO",
    "jobCode": "JOB01",
    "jobName": "Treasury Officer",
    "jobFamilyCode": "JF01",
    "jobFamilyName": "Finance",
    "subJobFamilyCode": "SJF01",
    "subJobFamilyName": "Treasury Management",
    "grade": "IV/A",
    "workerGroupCode": "WG01",
    "workerGroupName": "Permanent Employee",
    "subWorkerGroupCode": "SWG01",
    "subWorkerGroupName": "Professional Staff",
    "corsaCode": "C01",
    "corsaName": "CORSA Finance",
    "corsaNomenclature": "CRS-FIN",
    "businessAreaCode": "BA01",
    "businessAreaName": "Finance Operations",
    "costCenterCode": "CC01",
    "costCenterName": "Treasury Cost Center",
    "supervisorLevelOneNipp": "654321",
    "supervisorLevelOneName": "Jane Smith",
    "supervisorLevelOnePosition": "Treasury Manager",
    "supervisorLevelTwoNipp": "111222",
    "supervisorLevelTwoName": "Bob Johnson",
    "supervisorLevelTwoPosition": "Finance Director",
    "tempSupervisorNipp": null,
    "tempSupervisorName": null,
    "genderCode": "M",
    "genderName": "Male",
    "employmentStartDate": "2015-03-01",
    "mutationDate": "2023-06-15",
    "beginningDate": "2023-06-15",
    "endingDate": null,
    "recordingDate": "2023-06-15T08:00:00",
    "rkipInputPeriodUntil": "2026-12-31",
    "stat2": "3",
    "psText": "Bandung HQ",
    "psGroup": "01",
    "twoFactorEnabled": false,
    "twoFactorConfirmedAt": null,
    "roles": [
      { "id": 1, "name": "Treasury Admin" }
    ]
  },
  "errors": null
}
```

**Response Fields — Internal User:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | User ID |
| `nipp` | String | Employee ID (from ESA) |
| `name` | String | Full name |
| `email` | String | Email address |
| `phoneNumber` | String | Phone number |
| `photo` | String | Profile photo URL (nullable) |
| `companyCode` | String | Company code |
| `companyName` | String | Company name |
| `directorateCode` | String | Directorate code |
| `directorateName` | String | Directorate name |
| `directorateNomenclature` | String | Directorate nomenclature |
| `personalAreaCode` | String | Personal area code |
| `personalAreaName` | String | Personal area name |
| `organizationCode` | String | Organization code |
| `organizationName` | String | Organization name |
| `organizationNomenclature` | String | Organization nomenclature |
| `positionCode` | String | Position code |
| `positionName` | String | Position name |
| `positionNomenclature` | String | Position nomenclature |
| `jobCode` | String | Job code |
| `jobName` | String | Job name |
| `jobFamilyCode` | String | Job family code |
| `jobFamilyName` | String | Job family name |
| `subJobFamilyCode` | String | Sub job family code |
| `subJobFamilyName` | String | Sub job family name |
| `grade` | String | Employee grade |
| `workerGroupCode` | String | Worker group code |
| `workerGroupName` | String | Worker group name |
| `subWorkerGroupCode` | String | Sub worker group code |
| `subWorkerGroupName` | String | Sub worker group name |
| `corsaCode` | String | CORSA code |
| `corsaName` | String | CORSA name |
| `corsaNomenclature` | String | CORSA nomenclature |
| `businessAreaCode` | String | Business area code |
| `businessAreaName` | String | Business area name |
| `costCenterCode` | String | Cost center code |
| `costCenterName` | String | Cost center name |
| `supervisorLevelOneNipp` | String | Direct supervisor NIPP |
| `supervisorLevelOneName` | String | Direct supervisor name |
| `supervisorLevelOnePosition` | String | Direct supervisor position |
| `supervisorLevelTwoNipp` | String | Second-level supervisor NIPP |
| `supervisorLevelTwoName` | String | Second-level supervisor name |
| `supervisorLevelTwoPosition` | String | Second-level supervisor position |
| `tempSupervisorNipp` | String | Temporary supervisor NIPP (nullable) |
| `tempSupervisorName` | String | Temporary supervisor name (nullable) |
| `genderCode` | String | Gender code |
| `genderName` | String | Gender name |
| `employmentStartDate` | LocalDate | Employment start date |
| `mutationDate` | LocalDate | Mutation date (nullable) |
| `beginningDate` | LocalDate | Beginning date (nullable) |
| `endingDate` | LocalDate | Ending date (nullable) |
| `recordingDate` | LocalDateTime | Recording date (nullable) |
| `rkipInputPeriodUntil` | LocalDate | RKIP input period until (nullable) |
| `stat2` | String | Employment status code |
| `psText` | String | Personnel subarea text |
| `psGroup` | String | Personnel subarea group |
| `twoFactorEnabled` | Boolean | Whether 2FA is active |
| `twoFactorConfirmedAt` | LocalDateTime | Timestamp when 2FA was enabled (nullable) |
| `roles` | List\<Object\> | List of assigned roles (`id`, `name`) |

---

**Success Response (200 OK) — External User (COMPANY type):**

```json
{
  "message": "Profile retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 50,
    "userType": "COMPANY",
    "username": "pt_maju_jaya",
    "name": "PT Maju Jaya",
    "email": "admin@majujaya.co.id",
    "phoneNumber": "021-7654321",
    "photo": "https://storage.example.com/profile/photos/photo.jpg",
    "address": "Jl. Sudirman No. 100, Jakarta",
    "startDate": "2025-01-01",
    "endDate": null,
    "nik": null,
    "ktpFile": null,
    "npwp": "01.234.567.8-012.345",
    "companyCode": "MJ001",
    "npwpFile": "https://storage.example.com/profile/npwp/npwp.pdf",
    "responsibleName": "Budi Santoso",
    "responsibleEmail": "budi@majujaya.co.id",
    "responsibleNik": "3201010101010001",
    "responsibleAddress": "Jl. Merdeka No. 50, Jakarta",
    "purpose": null,
    "twoFactorEnabled": true,
    "twoFactorConfirmedAt": "2026-03-15T10:00:00",
    "roles": [
      { "id": 5, "name": "Partner Viewer" }
    ]
  },
  "errors": null
}
```

**Response Fields — External User:**

| Field | Type | User Types | Description |
|-------|------|------------|-------------|
| `id` | Long | All | User ID |
| `userType` | String | All | `PERSONAL`, `COMPANY`, or `OTHER` |
| `username` | String | All | Login username |
| `name` | String | All | Full name (or company name for COMPANY) |
| `email` | String | All | Email address |
| `phoneNumber` | String | All | Phone number (nullable) |
| `photo` | String | All | Profile photo URL (nullable) |
| `address` | String | All | Address (nullable) |
| `startDate` | LocalDate | All | Access start date (nullable) |
| `endDate` | LocalDate | All | Access end date (nullable) |
| `nik` | String | PERSONAL | National ID number (nullable) |
| `ktpFile` | String | PERSONAL | KTP document URL (nullable) |
| `npwp` | String | COMPANY | Tax ID number (nullable) |
| `companyCode` | String | COMPANY | Company identifier (nullable) |
| `npwpFile` | String | COMPANY | NPWP document URL (nullable) |
| `responsibleName` | String | COMPANY | Contact person name (nullable) |
| `responsibleEmail` | String | COMPANY | Contact person email (nullable) |
| `responsibleNik` | String | COMPANY | Contact person NIK (nullable) |
| `responsibleAddress` | String | COMPANY | Contact person address (nullable) |
| `purpose` | String | OTHER | Purpose of access (nullable) |
| `twoFactorEnabled` | Boolean | All | Whether 2FA is active |
| `twoFactorConfirmedAt` | LocalDateTime | All | Timestamp when 2FA was enabled (nullable) |
| `roles` | List\<Object\> | All | List of assigned roles (`id`, `name`) |

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401 Unauthorized` | Missing or invalid JWT token |

---

## 2. Update Profile

**Endpoint:** `PUT /api/profile`

**Description:** Updates the authenticated user's editable profile fields. The Content-Type determines which user type is being updated:
- `application/json` → Internal user (phone number only)
- `multipart/form-data` → External user (all editable fields + optional file uploads)

**Authentication:** Required (Bearer Token)

---

### 2a. Update Internal User Profile

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "phoneNumber": "081234567890"
}
```

**Request Fields:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `phoneNumber` | String | No | Max 20 chars | New phone number. Null = no change. |

**Success Response (200 OK):**

Returns the full updated `ProfileInternalResponseDTO` (same structure as [Get Profile — Internal](#1-get-profile)).

```json
{
  "message": "Profile updated successfully",
  "status": "SUCCESS",
  "data": { ... },
  "errors": null
}
```

---

### 2b. Update External User Profile

**Content-Type:** `multipart/form-data`

**Request Fields:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | String | No | Max 100 chars | Full name. Null = no change. |
| `email` | String | No | Valid email, max 255 chars, unique | Email address. Null = no change. |
| `phoneNumber` | String | No | Max 50 chars | Phone number. Null = no change. |
| `address` | String | No | Free text | Address. Null = no change. |
| `photo` | File | No | jpg, jpeg, png | Profile photo. Omit = no change. |
| `nik` | String | No (PERSONAL) | Max 50 chars, unique | National ID. Null = no change. |
| `ktpFile` | File | No (PERSONAL) | jpg, jpeg, png, pdf | KTP document. Omit = no change. |
| `npwp` | String | No (COMPANY) | Max 50 chars, unique | Tax ID. Null = no change. |
| `companyCode` | String | No (COMPANY) | Max 100 chars | Company code. Null = no change. |
| `npwpFile` | File | No (COMPANY) | jpg, jpeg, png, pdf | NPWP document. Omit = no change. |
| `responsibleName` | String | No (COMPANY) | Max 100 chars | Contact person name. Null = no change. |
| `responsibleEmail` | String | No (COMPANY) | Valid email, max 100 chars | Contact person email. Null = no change. |
| `responsibleNik` | String | No (COMPANY) | Max 50 chars | Contact person NIK. Null = no change. |
| `responsibleAddress` | String | No (COMPANY) | Free text | Contact person address. Null = no change. |
| `purpose` | String | No (OTHER) | Free text | Purpose of access. Null = no change. |

> Only send fields that need to be updated. Omitted fields (null) are not changed.

**Success Response (200 OK):**

Returns the full updated `ProfileExternalResponseDTO` (same structure as [Get Profile — External](#1-get-profile)).

```json
{
  "message": "Profile updated successfully",
  "status": "SUCCESS",
  "data": { ... },
  "errors": null
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Validation error on request fields |
| `401 Unauthorized` | Missing or invalid JWT token |
| `409 Conflict` | Email, NIK, or NPWP already exists |

---

## 3. Change Password

**Endpoint:** `PUT /api/profile/password`

**Description:** Changes the authenticated user's password. Requires the current password for verification.

**Authentication:** Required (Bearer Token)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "NewSecurePass456",
  "confirmPassword": "NewSecurePass456"
}
```

**Request Fields:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `currentPassword` | String | Yes | Non-blank | Must match the user's stored password |
| `newPassword` | String | Yes | Min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit | New password |
| `confirmPassword` | String | Yes | Non-blank | Must match `newPassword` exactly |

**Success Response (200 OK):**

```json
{
  "message": "Password changed successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Current password incorrect, policy not met, confirm mismatch, or new same as current |
| `401 Unauthorized` | Missing or invalid JWT token |

**Error Cases:**

| Scenario | Status | Message |
|----------|--------|---------|
| Current password incorrect | 400 | `"Current password is incorrect"` |
| New password does not meet policy | 400 | Validation error on `newPassword` |
| Confirm password does not match | 400 | `"Password confirmation does not match"` |
| New password same as current | 400 | `"New password must be different from current password"` |

---

## 4. Setup 2FA

**Endpoint:** `POST /api/profile/2fa/setup`

**Description:** Initiates 2FA setup. Validates the current password, generates a TOTP secret, stores it encrypted, and returns a QR code URI and plain-text secret. 2FA is **not** activated until `/2fa/confirm` is called.

**Authentication:** Required (Bearer Token)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "password": "currentPassword123"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | String | Yes | The user's current password |

**Success Response (200 OK):**

```json
{
  "message": "2FA setup initiated",
  "status": "SUCCESS",
  "data": {
    "qrCodeUri": "otpauth://totp/Fintra:john.doe@kai.id?secret=JBSWY3DPEHPK3PXP&issuer=Fintra&algorithm=SHA1&digits=6&period=30",
    "secretKey": "JBSWY3DPEHPK3PXP"
  },
  "errors": null
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `qrCodeUri` | String | `otpauth://` URI — render as QR code for authenticator app |
| `secretKey` | String | Plain-text TOTP secret for manual entry in authenticator app |

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Password is incorrect or missing |
| `401 Unauthorized` | Missing or invalid JWT token |

---

## 5. Confirm 2FA

**Endpoint:** `POST /api/profile/2fa/confirm`

**Description:** Confirms and activates 2FA by verifying the 6-digit TOTP code from the authenticator app. On success, generates 8 recovery codes (shown once only) and sets `two_factor_confirmed_at`.

**Authentication:** Required (Bearer Token)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "code": "123456"
}
```

**Request Fields:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `code` | String | Yes | Exactly 6 digits | Current TOTP code from authenticator app |

**Success Response (200 OK):**

```json
{
  "message": "2FA enabled successfully",
  "status": "SUCCESS",
  "data": {
    "recoveryCodes": [
      "A1B2C3D4E5F6G7H8",
      "I9J0K1L2M3N4O5P6",
      "Q7R8S9T0U1V2W3X4",
      "Y5Z6A7B8C9D0E1F2",
      "G3H4I5J6K7L8M9N0",
      "O1P2Q3R4S5T6U7V8",
      "W9X0Y1Z2A3B4C5D6",
      "E7F8G9H0I1J2K3L4"
    ]
  },
  "errors": null
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `recoveryCodes` | List\<String\> | 8 plain-text recovery codes. **Shown once only** — the user must save these. |

> **Security note:** Recovery codes are stored hashed in the database and cannot be retrieved after this response. If lost, they must be regenerated.

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Invalid or expired TOTP code |
| `401 Unauthorized` | Missing or invalid JWT token |
| `409 Conflict` | 2FA setup has not been initiated (call `/2fa/setup` first) |

---

## 6. Disable 2FA

**Endpoint:** `POST /api/profile/2fa/disable`

**Description:** Disables 2FA for the authenticated user. Clears the TOTP secret, recovery codes, and confirmation timestamp. Requires the current password.

**Authentication:** Required (Bearer Token)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "password": "currentPassword123"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | String | Yes | The user's current password |

**Success Response (200 OK):**

```json
{
  "message": "2FA disabled successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Password is incorrect |
| `401 Unauthorized` | Missing or invalid JWT token |

---

## 7. Regenerate Recovery Codes

**Endpoint:** `POST /api/profile/2fa/recovery-codes`

**Description:** Generates a new set of 8 recovery codes, invalidating the previous ones. Can only be called when 2FA is active. Requires the current password.

**Authentication:** Required (Bearer Token)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "password": "currentPassword123"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | String | Yes | The user's current password |

**Success Response (200 OK):**

```json
{
  "message": "Recovery codes regenerated successfully",
  "status": "SUCCESS",
  "data": {
    "recoveryCodes": [
      "A1B2C3D4E5F6G7H8",
      "I9J0K1L2M3N4O5P6",
      "Q7R8S9T0U1V2W3X4",
      "Y5Z6A7B8C9D0E1F2",
      "G3H4I5J6K7L8M9N0",
      "O1P2Q3R4S5T6U7V8",
      "W9X0Y1Z2A3B4C5D6",
      "E7F8G9H0I1J2K3L4"
    ]
  },
  "errors": null
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `recoveryCodes` | List\<String\> | 8 new plain-text recovery codes. **Shown once only.** |

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Password is incorrect |
| `401 Unauthorized` | Missing or invalid JWT token |
| `409 Conflict` | 2FA is not enabled |

---

## 8. List Active Sessions

**Endpoint:** `GET /api/profile/sessions`

**Description:** Returns all active sessions for the authenticated user, sorted by most recent activity first. The session matching the current request token is flagged as `isCurrent: true`.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK):**

```json
{
  "message": "Sessions retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 101,
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
      "ipAddress": "192.168.1.10",
      "createdAt": "2026-04-08T08:00:00",
      "lastActivity": "2026-04-08T14:30:00",
      "isCurrent": true
    },
    {
      "id": 102,
      "userAgent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile",
      "ipAddress": "10.0.0.5",
      "createdAt": "2026-04-07T09:00:00",
      "lastActivity": "2026-04-07T22:15:00",
      "isCurrent": false
    }
  ],
  "errors": null
}
```

**Response Fields (per session object):**

| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Session ID |
| `userAgent` | String | Browser/client user agent string |
| `ipAddress` | String | Client IP address |
| `createdAt` | LocalDateTime | Session creation timestamp (login time) |
| `lastActivity` | LocalDateTime | Timestamp of last recorded activity |
| `isCurrent` | Boolean | `true` if this session matches the current request's JWT token |

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401 Unauthorized` | Missing or invalid JWT token |

---

## 9. Terminate a Specific Session

**Endpoint:** `DELETE /api/profile/sessions/{sessionId}`

**Description:** Terminates a specific active session by its ID. The session must belong to the authenticated user. The current session cannot be terminated via this endpoint — use the regular logout (`POST /api/auth/logout`) instead.

**Authentication:** Required (Bearer Token)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | Long | Yes | ID of the session to terminate |

**Success Response (200 OK):**

```json
{
  "message": "Session terminated successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Attempting to terminate the current session |
| `401 Unauthorized` | Missing or invalid JWT token |
| `404 Not Found` | Session not found or does not belong to the authenticated user |

---

## 10. Terminate All Other Sessions

**Endpoint:** `DELETE /api/profile/sessions`

**Description:** Terminates all active sessions for the authenticated user **except** the current one. Useful when a user suspects unauthorized access. The current session is preserved.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK):**

```json
{
  "message": "All other sessions terminated successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401 Unauthorized` | Missing or invalid JWT token |

---

## cURL Examples

### Get Profile
```bash
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer {jwt_token}"
```

### Update Internal Profile
```bash
curl -X PUT http://localhost:8080/api/profile \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "081234567890"}'
```

### Update External Profile (with file)
```bash
curl -X PUT http://localhost:8080/api/profile \
  -H "Authorization: Bearer {jwt_token}" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "photo=@/path/to/photo.jpg"
```

### Change Password
```bash
curl -X PUT http://localhost:8080/api/profile/password \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old123","newPassword":"New456!","confirmPassword":"New456!"}'
```

### Initiate 2FA Setup
```bash
curl -X POST http://localhost:8080/api/profile/2fa/setup \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"password": "currentPassword123"}'
```

### Confirm 2FA
```bash
curl -X POST http://localhost:8080/api/profile/2fa/confirm \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'
```

### Disable 2FA
```bash
curl -X POST http://localhost:8080/api/profile/2fa/disable \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"password": "currentPassword123"}'
```

### Regenerate Recovery Codes
```bash
curl -X POST http://localhost:8080/api/profile/2fa/recovery-codes \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"password": "currentPassword123"}'
```

### List Sessions
```bash
curl -X GET http://localhost:8080/api/profile/sessions \
  -H "Authorization: Bearer {jwt_token}"
```

### Terminate a Session
```bash
curl -X DELETE http://localhost:8080/api/profile/sessions/102 \
  -H "Authorization: Bearer {jwt_token}"
```

### Terminate All Other Sessions
```bash
curl -X DELETE http://localhost:8080/api/profile/sessions \
  -H "Authorization: Bearer {jwt_token}"
```
