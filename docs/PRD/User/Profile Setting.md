# Profile Setting - Product Requirements Document (PRD)

## 1. Overview

The **Profile Setting** page allows authenticated users (both internal and external) to view and manage their personal profile, security settings, and active sessions. This module covers profile viewing, profile updating, two-factor authentication (2FA) management, and user session management across devices.

---

## 2. Objectives

- Allow users to view their own profile information.
- Allow users to update editable profile fields based on their user type.
- Provide two-factor authentication (2FA) enable/disable functionality for enhanced account security.
- Allow users to view all active sessions (devices/locations where they are currently logged in).
- Allow users to remotely log out from a specific device or from all devices except the current one.

---

## 3. User Roles & Permissions

This feature is accessible to **all authenticated users** (internal and external). No specific permission is required — access is implicitly granted to any user with a valid session.

> **Note:** Users can only view and manage **their own** profile and sessions. Access to other users' profiles is handled by the User Management module (`setting:user:*` permissions).

---

## 4. Database Structure

### 4.1. Internal User Table (`internal_user`)

Reference: [Internal User DB Documentation](../../db/Master%20Data/InternalUser.md)

**Profile-Related Columns:**

| Column                      | Type         | Nullable | Description                              |
| --------------------------- | ------------ | -------- | ---------------------------------------- |
| `id`                        | BIGSERIAL    | NO       | Auto-increment primary key               |
| `nipp`                      | VARCHAR(50)  | NO       | Employee ID (from ESA)                   |
| `name`                      | VARCHAR(255) | YES      | Full name                                |
| `email`                     | VARCHAR(255) | YES      | Email address                            |
| `phone_number`              | VARCHAR(20)  | YES      | Phone number                             |
| `company_id`                | VARCHAR(50)  | YES      | Company code                             |
| `company_name`              | VARCHAR(255) | YES      | Company name                             |
| `two_factor_secret`         | TEXT         | YES      | TOTP secret key (null = 2FA disabled)    |
| `two_factor_recovery_codes` | TEXT         | YES      | Backup recovery codes (hashed)           |
| `two_factor_confirmed_at`   | TIMESTAMP    | YES      | Timestamp when 2FA was confirmed/enabled |

### 4.2. External User Table (`external_user`)

Reference: [External User DB Documentation](../../db/Master%20Data/ExternalUser.md)

**Profile-Related Columns:**

| Column                      | Type         | Nullable | Description                              |
| --------------------------- | ------------ | -------- | ---------------------------------------- |
| `id`                        | BIGSERIAL    | NO       | Auto-increment primary key               |
| `name`                      | VARCHAR(255) | YES      | Full name                                |
| `email`                     | VARCHAR(255) | YES      | Email address                            |
| `username`                  | VARCHAR(100) | YES      | Username                                 |
| `phone_number`              | VARCHAR(20)  | YES      | Phone number                             |
| `photo`                     | TEXT         | YES      | Profile photo file path                  |
| `nik`                       | VARCHAR(50)  | YES      | National ID number                       |
| `npwp`                      | VARCHAR(50)  | YES      | Tax ID number                            |
| `two_factor_secret`         | TEXT         | YES      | TOTP secret key (null = 2FA disabled)    |
| `two_factor_recovery_codes` | TEXT         | YES      | Backup recovery codes (hashed)           |
| `two_factor_confirmed_at`   | TIMESTAMP    | YES      | Timestamp when 2FA was confirmed/enabled |

### 4.3. User Sessions Table (`user_sessions`)

Reference: [V4 Migration](../../db/Treasury/../Master%20Data/)

| Column                     | Type         | Nullable | Description                                  |
| -------------------------- | ------------ | -------- | -------------------------------------------- |
| `id`                       | BIGSERIAL    | NO       | Auto-increment primary key                   |
| `user_id`                  | BIGINT       | NO       | References internal_user or external_user ID |
| `user_type`                | VARCHAR(50)  | NO       | `INTERNAL` or `EXTERNAL`                     |
| `ip_address`               | VARCHAR(45)  | YES      | Client IP address (IPv4/IPv6)                |
| `user_agent`               | TEXT         | YES      | Browser/client user agent string             |
| `token`                    | TEXT         | NO       | JWT access token                             |
| `sso_token`                | TEXT         | YES      | SSO token (if applicable)                    |
| `refresh_token`            | VARCHAR(500) | YES      | JWT refresh token                            |
| `refresh_token_expiration` | TIMESTAMP    | YES      | Refresh token expiry                         |
| `last_activity`            | TIMESTAMP    | YES      | Timestamp of last user activity              |
| `created_at`               | TIMESTAMP    | NO       | Session creation timestamp (login time)      |

---

## 5. Functional Requirements

### 5.1. View Profile

**Description:** Displays the current authenticated user's profile information in a read-only view. The profile page is the default view when accessing Profile Setting.

**Information Displayed:**

**For Internal Users:**

All internal user profile fields are displayed, grouped into logical sections.

**Section: Personal Information**

| No  | Field         | Label        | Notes                                         |
| --- | ------------- | ------------ | --------------------------------------------- |
| 1   | `photo`       | Photo        | Profile photo (displayed as avatar/thumbnail) |
| 2   | `nipp`        | NIPP         | Employee ID                                   |
| 3   | `name`        | Name         | Full name                                     |
| 4   | `email`       | Email        |                                               |
| 5   | `phoneNumber` | Phone Number |                                               |
| 6   | `genderName`  | Gender       |                                               |

**Section: Company & Organization**

| No  | Field                      | Label                     | Notes                             |
| --- | -------------------------- | ------------------------- | --------------------------------- |
| 1   | `companyName`              | Company                   | Company name (`companyCode`)        |
| 2   | `directorateName`          | Directorate               | Directorate name                  |
| 3   | `directorateNomenclature`  | Directorate Nomenclature  | Directorate nomenclature code     |
| 4   | `personalAreaName`         | Personal Area             | Personal area name                |
| 5   | `organizationName`         | Organization              | Organization name                 |
| 6   | `organizationNomenclature` | Organization Nomenclature | Organization nomenclature code    |
| 7   | `businessAreaName`         | Business Area             | Business area name                |
| 8   | `costCenterName`           | Cost Center               | Cost center name (`costCenterCode`) |

**Section: Position & Job**

| No  | Field                  | Label                 | Notes                      |
| --- | ---------------------- | --------------------- | -------------------------- |
| 1   | `positionName`         | Position              | Position name              |
| 2   | `positionNomenclature` | Position Nomenclature | Position nomenclature code |
| 3   | `jobName`              | Job                   | Job name                   |
| 4   | `jobFamilyName`        | Job Family            | Job family name            |
| 5   | `subJobFamilyName`     | Sub Job Family        | Sub job family name        |
| 6   | `grade`                | Grade                 | Employee grade             |
| 7   | `workerGroupName`      | Worker Group          | Worker group name          |
| 8   | `subWorkerGroupName`   | Sub Worker Group      | Sub worker group name      |

**Section: Supervisors**

| No  | Field                        | Label                       | Notes                                    |
| --- | ---------------------------- | --------------------------- | ---------------------------------------- |
| 1   | `supervisorLevelOneName`     | Supervisor Level 1          | Direct supervisor name (NIPP)            |
| 2   | `supervisorLevelOnePosition` | Supervisor Level 1 Position | Direct supervisor position               |
| 3   | `supervisorLevelTwoName`     | Supervisor Level 2          | Second-level supervisor name (NIPP)      |
| 4   | `supervisorLevelTwoPosition` | Supervisor Level 2 Position | Second-level supervisor position         |
| 5   | `tempSupervisorName`         | Temporary Supervisor        | Temp supervisor name (NIPP), if assigned |

**Section: CORSA**

| No  | Field               | Label              | Notes                   |
| --- | ------------------- | ------------------ | ----------------------- |
| 1   | `corsaName`         | CORSA              | CORSA name              |
| 2   | `corsaNomenclature` | CORSA Nomenclature | CORSA nomenclature code |

**Section: Employment**

| No  | Field                  | Label                   | Notes                    |
| --- | ---------------------- | ----------------------- | ------------------------ |
| 1   | `employmentStartDate`  | Employment Start Date   | Format: DD/MM/YYYY       |
| 2   | `mutationDate`         | Mutation Date           | Format: DD/MM/YYYY       |
| 3   | `beginningDate`        | Beginning Date          | Format: DD/MM/YYYY       |
| 4   | `endingDate`           | Ending Date             | Format: DD/MM/YYYY       |
| 5   | `recordingDate`        | Recording Date          | Format: DD/MM/YYYY HH:mm |
| 6   | `stat2`                | Status                  | Employment status code   |
| 7   | `psText`               | Personnel Subarea       | Personnel subarea text   |
| 8   | `psGroup`              | Personnel Subarea Group | Personnel subarea group  |
| 9   | `rkipInputPeriodUntil` | RKIP Input Period Until | Format: DD/MM/YYYY       |

**Section: Security & Roles**

| No  | Field              | Label      | Notes                                        |
| --- | ------------------ | ---------- | -------------------------------------------- |
| 1   | `twoFactorEnabled` | 2FA Status | Badge: "Enabled" (green) / "Disabled" (gray) |
| 2   | `roles`            | Roles      | List of assigned roles (name)                |

---

**For External Users:**

Fields are displayed based on the user's `userType`. Common fields are shown for all types, with type-specific fields shown conditionally.

**Common Fields (All Types):**

| No  | Field              | Label        | Notes                                                |
| --- | ------------------ | ------------ | ---------------------------------------------------- |
| 1   | `photo`            | Photo        | Profile photo (displayed as avatar/thumbnail)        |
| 2   | `userType`         | User Type    | Badge: PERSONAL / COMPANY / OTHER                    |
| 3   | `username`         | Username     |                                                      |
| 4   | `name`             | Name         | Full name (PERSONAL/OTHER) or company name (COMPANY) |
| 5   | `email`            | Email        |                                                      |
| 6   | `phoneNumber`      | Phone Number |                                                      |
| 7   | `address`          | Address      |                                                      |
| 8   | `startDate`        | Access Start | Format: DD/MM/YYYY. Hidden if null.                  |
| 9   | `endDate`          | Access End   | Format: DD/MM/YYYY. Hidden if null.                  |
| 10  | `twoFactorEnabled` | 2FA Status   | Badge: "Enabled" (green) / "Disabled" (gray)         |
| 11  | `roles`            | Roles        | List of assigned roles (name)                        |

**Additional Fields for PERSONAL Type:**

| No  | Field     | Label    | Notes                                     |
| --- | --------- | -------- | ----------------------------------------- |
| 1   | `nik`     | NIK      | National ID number                        |
| 2   | `ktpFile` | KTP File | KTP document (displayed as download link) |

**Additional Fields for COMPANY Type:**

| No  | Field                | Label               | Notes                                      |
| --- | -------------------- | ------------------- | ------------------------------------------ |
| 1   | `npwp`               | NPWP                | Tax ID number                              |
| 2   | `companyCode`        | Company Code        | Company identifier                         |
| 3   | `npwpFile`           | NPWP File           | NPWP document (displayed as download link) |
| 4   | `responsibleName`    | Responsible Person  | Contact person name                        |
| 5   | `responsibleEmail`   | Responsible Email   | Contact person email                       |
| 6   | `responsibleNik`     | Responsible NIK     | Contact person NIK                         |
| 7   | `responsibleAddress` | Responsible Address | Contact person address                     |

**Additional Fields for OTHER Type:**

| No  | Field     | Label   | Notes                           |
| --- | --------- | ------- | ------------------------------- |
| 1   | `purpose` | Purpose | Purpose of access / usage notes |

---

**Behavior:**

- The backend identifies the user from the JWT token (no user ID in the URL).
- Profile data is retrieved from the authenticated `AppUserDetails` principal or resolved from the database.
- For external users, the frontend conditionally renders type-specific fields based on the `userType` value.

**API Endpoint:** `GET /api/profile`

**Response Example (Internal User):**

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
    "genderName": "Male",
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
    "businessAreaCode": "BA01",
    "businessAreaName": "Finance Operations",
    "costCenterCode": "CC01",
    "costCenterName": "Treasury Cost Center",
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
    "supervisorLevelOneNipp": "654321",
    "supervisorLevelOneName": "Jane Smith",
    "supervisorLevelOnePosition": "Treasury Manager",
    "supervisorLevelTwoNipp": "111222",
    "supervisorLevelTwoName": "Bob Johnson",
    "supervisorLevelTwoPosition": "Finance Director",
    "tempSupervisorNipp": null,
    "tempSupervisorName": null,
    "corsaCode": "C01",
    "corsaName": "CORSA Finance",
    "corsaNomenclature": "CRS-FIN",
    "photo": null,
    "employmentStartDate": "2015-03-01",
    "mutationDate": "2023-06-15",
    "beginningDate": "2023-06-15",
    "endingDate": null,
    "recordingDate": "2023-06-15T08:00:00",
    "stat2": "3",
    "psText": "Bandung HQ",
    "psGroup": "01",
    "rkipInputPeriodUntil": "2026-12-31",
    "userType": "INTERNAL",
    "twoFactorEnabled": false,
    "roles": [{ "id": 1, "name": "Treasury Admin" }]
  },
  "errors": null
}
```

**Response Example (External User — COMPANY Type):**

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
    "photo": null,
    "address": "Jl. Sudirman No. 100, Jakarta",
    "npwp": "01.234.567.8-012.345",
    "companyCode": "MJ001",
    "npwpFile": "/files/npwp_mj001.pdf",
    "responsibleName": "Budi Santoso",
    "responsibleEmail": "budi@majujaya.co.id",
    "responsibleNik": "3201010101010001",
    "responsibleAddress": "Jl. Merdeka No. 50, Jakarta",
    "startDate": "2025-01-01",
    "endDate": null,
    "twoFactorEnabled": true,
    "roles": [{ "id": 5, "name": "Partner Viewer" }]
  },
  "errors": null
}
```

---

### 5.2. Update Profile

**Description:** Allows users to update their own editable profile fields. Non-editable fields (e.g., NIPP, email for internal users) are displayed but disabled.

**Editable Fields for Internal Users:**

| No  | Field         | Label        | Input Type | Validation                 |
| --- | ------------- | ------------ | ---------- | -------------------------- |
| 1   | `phoneNumber` | Phone Number | Text input | Max 20 characters, numeric |

> **Note:** Internal user data (name, email, company, etc.) is sourced from ESA (external system) and **cannot be edited** through this page.

**Editable Fields for External Users:**

Fields are editable based on the user's `userType`. Common fields are editable for all types, with type-specific fields shown conditionally.

**Common Editable Fields (All Types):**

| No  | Field         | Label        | Input Type  | Validation                                                        |
| --- | ------------- | ------------ | ----------- | ----------------------------------------------------------------- |
| 1   | `name`        | Name         | Text input  | Required. Max 100 characters.                                     |
| 2   | `email`       | Email        | Text input  | Required. Valid email format. Max 255 characters. Must be unique. |
| 3   | `phoneNumber` | Phone Number | Text input  | Max 50 characters                                                 |
| 4   | `photo`       | Photo        | File upload | Accepts image files (jpg, jpeg, png). Max 2MB.                    |
| 5   | `address`     | Address      | Textarea    | Optional. Free text.                                              |

**Additional Editable Fields for PERSONAL Type:**

| No  | Field     | Label    | Input Type  | Validation                                            |
| --- | --------- | -------- | ----------- | ----------------------------------------------------- |
| 1   | `nik`     | NIK      | Text input  | Max 50 characters. Must be unique.                    |
| 2   | `ktpFile` | KTP File | File upload | Accepts PDF or image files (jpg, jpeg, png). Max 5MB. |

**Additional Editable Fields for COMPANY Type:**

| No  | Field                | Label               | Input Type  | Validation                                            |
| --- | -------------------- | ------------------- | ----------- | ----------------------------------------------------- |
| 1   | `npwp`               | NPWP                | Text input  | Max 50 characters. Must be unique.                    |
| 2   | `companyCode`        | Company Code        | Text input  | Max 100 characters.                                   |
| 3   | `npwpFile`           | NPWP File           | File upload | Accepts PDF or image files (jpg, jpeg, png). Max 5MB. |
| 4   | `responsibleName`    | Responsible Person  | Text input  | Max 100 characters.                                   |
| 5   | `responsibleEmail`   | Responsible Email   | Text input  | Valid email format. Max 100 characters.               |
| 6   | `responsibleNik`     | Responsible NIK     | Text input  | Max 50 characters.                                    |
| 7   | `responsibleAddress` | Responsible Address | Textarea    | Optional. Free text.                                  |

**Additional Editable Fields for OTHER Type:**

| No  | Field     | Label   | Input Type | Validation           |
| --- | --------- | ------- | ---------- | -------------------- |
| 1   | `purpose` | Purpose | Textarea   | Optional. Free text. |

> **Non-editable fields for external users:** `username` (login identifier), `userType` (set at creation), `startDate`, `endDate` (admin-managed).

**Behavior:**

- On submit, only the changed fields are sent to the API.
- The frontend conditionally renders editable fields based on the `userType` value.
- On success, display a success notification and refresh the profile view.
- On validation error, display field-level error messages.
- If `email` or `nik` or `npwp` is changed to a value that already exists, return a `409 Conflict` with the duplicate field name.

**API Endpoint:** `PUT /api/profile`

**Request Example (Internal User):**

```json
{
  "phoneNumber": "081234567890"
}
```

**Request Example (External User — PERSONAL Type):**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "081234567890",
  "address": "Jl. Merdeka No. 10, Jakarta",
  "nik": "3201010101010001"
}
```

**Request Example (External User — COMPANY Type):**

```json
{
  "name": "PT Maju Jaya",
  "email": "admin@majujaya.co.id",
  "phoneNumber": "021-7654321",
  "address": "Jl. Sudirman No. 100, Jakarta",
  "npwp": "01.234.567.8-012.345",
  "companyCode": "MJ001",
  "responsibleName": "Budi Santoso",
  "responsibleEmail": "budi@majujaya.co.id",
  "responsibleNik": "3201010101010001",
  "responsibleAddress": "Jl. Merdeka No. 50, Jakarta"
}
```

> Photo, KTP file, and NPWP file are uploaded via multipart form data if changed.

---

### 5.3. Change Password

**Description:** Allows users to change their account password. The user must provide their current password for verification before setting a new one.

**Flow:**

1. User clicks "Change Password" button.
2. A form is displayed with three fields: Current Password, New Password, Confirm New Password.
3. User fills in all fields and submits.
4. System validates the current password against the database.
5. System validates the new password meets the password policy.
6. On success, the password is updated (hashed with bcrypt) and a success notification is displayed.
7. All other sessions are **optionally** terminated (user is prompted: _"Do you want to log out from all other devices?"_).

**Form Fields:**

| No  | Field             | Label            | Input Type     | Validation                                                                 |
| --- | ----------------- | ---------------- | -------------- | -------------------------------------------------------------------------- |
| 1   | `currentPassword` | Current Password | Password input | Required. Must match the user's current password.                          |
| 2   | `newPassword`     | New Password     | Password input | Required. Min 8 characters. Must contain uppercase, lowercase, and number. |
| 3   | `confirmPassword` | Confirm Password | Password input | Required. Must match `newPassword`.                                        |

**API Endpoint:** `PUT /api/profile/password`

**Request Example:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

**Response Example:**

```json
{
  "message": "Password changed successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Error Cases:**

| Scenario                          | HTTP Status | Error Message                                          |
| --------------------------------- | ----------- | ------------------------------------------------------ |
| Current password is incorrect     | 400         | "Current password is incorrect"                        |
| New password does not meet policy | 400         | Validation error on `newPassword`                      |
| Confirm password does not match   | 400         | "Password confirmation does not match"                 |
| New password same as current      | 400         | "New password must be different from current password" |

---

### 5.4. Two-Factor Authentication (2FA) Management

**Description:** Allows users to enable or disable TOTP-based two-factor authentication on their account. 2FA adds an additional layer of security by requiring a time-based code from an authenticator app (e.g., Google Authenticator, Authy) during login.

#### 5.4.1. View 2FA Status

**Information Displayed:**

| No  | Field                  | Label      | Notes                                                 |
| --- | ---------------------- | ---------- | ----------------------------------------------------- |
| 1   | `twoFactorEnabled`     | 2FA Status | Badge: "Enabled" (green) / "Disabled" (gray)          |
| 2   | `twoFactorConfirmedAt` | Enabled At | Date when 2FA was enabled. Hidden if 2FA is disabled. |

**Behavior:**

- If 2FA is disabled → Show "Enable 2FA" button.
- If 2FA is enabled → Show "Disable 2FA" button.

---

#### 5.4.2. Enable 2FA

**Flow:**

1. User clicks "Enable 2FA" button.
2. User must enter their **current password** to confirm identity.
3. System validates the password. If incorrect, display an error and stop.
4. System generates a TOTP secret and returns a QR code (otpauth URI) and the secret key as plain text (for manual entry).
5. User scans the QR code with their authenticator app.
6. User enters the 6-digit TOTP code generated by the app to verify setup.
7. System validates the code against the generated secret.
8. On success:
   - `two_factor_secret` is stored (encrypted) in the database.
   - `two_factor_confirmed_at` is set to the current timestamp.
   - System generates and displays **recovery codes** (one-time use, stored hashed).
   - User is prompted to save the recovery codes securely.
9. 2FA is now active for subsequent logins.

**API Endpoints:**

| Step | Method | Endpoint                   | Description                                          |
| ---- | ------ | -------------------------- | ---------------------------------------------------- |
| 1    | POST   | `/api/profile/2fa/setup`   | Generate TOTP secret and QR code (requires password) |
| 2    | POST   | `/api/profile/2fa/confirm` | Confirm setup with TOTP code                         |

**Setup Request Example:**

```json
{
  "password": "currentPassword123"
}
```

**Setup Response Example:**

```json
{
  "message": "2FA setup initiated",
  "status": "SUCCESS",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUri": "otpauth://totp/Fintra:john.doe@kai.id?secret=JBSWY3DPEHPK3PXP&issuer=Fintra"
  },
  "errors": null
}
```

**Confirm Request Example:**

```json
{
  "code": "123456"
}
```

**Confirm Response Example:**

```json
{
  "message": "2FA enabled successfully",
  "status": "SUCCESS",
  "data": {
    "recoveryCodes": [
      "ABCD-1234-EFGH",
      "IJKL-5678-MNOP",
      "QRST-9012-UVWX",
      "YZAB-3456-CDEF",
      "GHIJ-7890-KLMN",
      "OPQR-1234-STUV",
      "WXYZ-5678-ABCD",
      "EFGH-9012-IJKL"
    ]
  },
  "errors": null
}
```

> **Security:** Recovery codes are only shown **once** at setup time. They are stored hashed in the database and cannot be retrieved again.

---

#### 5.4.3. Disable 2FA

**Flow:**

1. User clicks "Disable 2FA" button.
2. Confirmation dialog is shown: _"Are you sure you want to disable two-factor authentication? This will reduce your account security."_
3. User must enter their current password to confirm.
4. On success:
   - `two_factor_secret` is set to `null`.
   - `two_factor_recovery_codes` is set to `null`.
   - `two_factor_confirmed_at` is set to `null`.
5. 2FA is now disabled.

**API Endpoint:** `POST /api/profile/2fa/disable`

**Request Example:**

```json
{
  "password": "currentPassword123"
}
```

**Response Example:**

```json
{
  "message": "2FA disabled successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

---

#### 5.4.4. Regenerate Recovery Codes

**Description:** Allows users to regenerate a new set of recovery codes if they have lost the original ones. The old codes are invalidated.

**Flow:**

1. User clicks "Regenerate Recovery Codes" (only visible when 2FA is enabled).
2. User must enter their current password to confirm.
3. System generates a new set of 8 recovery codes.
4. Old recovery codes are replaced (hashed) in the database.
5. New codes are displayed for the user to save.

**API Endpoint:** `POST /api/profile/2fa/recovery-codes`

**Request Example:**

```json
{
  "password": "currentPassword123"
}
```

---

### 5.5. User Session Management

**Description:** Displays all active sessions for the currently authenticated user, showing where they are logged in, from which devices/browsers, and when the last activity occurred. Users can terminate sessions from specific devices or from all devices at once (except the current session).

#### 5.5.1. View Active Sessions

**Table/List Columns:**

| No  | Field             | Label            | Notes                                                                       |
| --- | ----------------- | ---------------- | --------------------------------------------------------------------------- |
| 1   | `userAgent`       | Device / Browser | Parsed into a human-readable format (e.g., "Chrome on Windows 10")          |
| 2   | `ipAddress`       | IP Address       | Client IP address                                                           |
| 3   | `createdAt`       | Logged In At     | Session creation timestamp. Format: DD/MM/YYYY HH:mm                        |
| 4   | `lastActivity`    | Last Activity    | Last activity timestamp. Format: DD/MM/YYYY HH:mm                           |
| 5   | Current indicator | Status           | Badge: "Current Session" (green) for the session matching the current token |
| 6   | -                 | Action           | "Logout" button (hidden for the current session)                            |

**Sorting:** Sessions are sorted by `lastActivity` descending (most recent first).

**Current Session Detection:** The API identifies the current session by matching the JWT token from the `Authorization` header against session records.

**API Endpoint:** `GET /api/profile/sessions`

**Response Example:**

```json
{
  "message": "Sessions retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 101,
      "ipAddress": "192.168.1.10",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
      "lastActivity": "2026-04-08T14:30:00",
      "createdAt": "2026-04-08T08:00:00",
      "current": true
    },
    {
      "id": 102,
      "ipAddress": "10.0.0.5",
      "userAgent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile",
      "lastActivity": "2026-04-07T22:15:00",
      "createdAt": "2026-04-07T09:00:00",
      "current": false
    }
  ],
  "errors": null
}
```

---

#### 5.5.2. Logout a Specific Device

**Description:** Allows the user to remotely terminate a specific session (log out from a specific device).

**Behavior:**

1. User clicks the "Logout" button on a session row (button is **not shown** for the current session).
2. Confirmation dialog: _"Are you sure you want to log out from this device?"_
3. On confirmation, the targeted session is deleted (access token and refresh token are invalidated).
4. The session disappears from the list.

**API Endpoint:** `DELETE /api/profile/sessions/{sessionId}`

**Response Example:**

```json
{
  "message": "Session terminated successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

**Validation:**

- The session must belong to the authenticated user (users cannot terminate other users' sessions).
- The current session **cannot** be terminated through this endpoint (return `400 Bad Request`).

---

#### 5.5.3. Logout All Other Devices

**Description:** Allows the user to terminate all active sessions **except** the current one. This is useful when a user suspects unauthorized access.

**Behavior:**

1. User clicks "Logout All Other Devices" button (displayed above the session list).
2. Confirmation dialog: _"Are you sure you want to log out from all other devices? This will terminate all sessions except your current one."_
3. On confirmation, all sessions for the user are deleted except the one matching the current token.
4. The session list is refreshed showing only the current session.

**API Endpoint:** `DELETE /api/profile/sessions`

**Response Example:**

```json
{
  "message": "All other sessions terminated successfully",
  "status": "SUCCESS",
  "data": {
    "terminatedCount": 3
  },
  "errors": null
}
```

---

## 6. Non-Functional Requirements

| Aspect           | Requirement                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Performance      | Profile and session endpoints must respond within < 1 second.                                          |
| Security         | All endpoints require JWT authentication. Users can only access their own data.                        |
| 2FA Security     | TOTP secrets must be stored encrypted. Recovery codes must be stored hashed (bcrypt).                  |
| File Upload      | Profile photo accepts only image files (jpg, jpeg, png) with a maximum of 2MB.                         |
| Audit Trail      | Profile updates are recorded in `updated_at` and `updated_by`.                                         |
| Responsive       | Page must be responsive for desktop (min. 1280px).                                                     |
| Session Security | Users cannot terminate their own current session via session management (must use the regular logout). |

---

## 7. Business Rules

| No  | Rule                                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Users can only view and manage their own profile and sessions.                                                                                             |
| 2   | Internal user profile data (name, email, company, etc.) is sourced from ESA and **cannot be edited** through this page.                                    |
| 3   | External users can update all profile fields applicable to their user type (PERSONAL/COMPANY/OTHER). Non-editable: username, userType, startDate, endDate. |
| 4   | Internal users can update phone number only.                                                                                                               |
| 5   | Changing password requires the user's current password for verification.                                                                                   |
| 6   | New password must meet the password policy: min 8 characters, must contain uppercase, lowercase, and a number.                                             |
| 7   | 2FA enable requires the user's current password before generating the TOTP secret.                                                                         |
| 8   | 2FA setup requires scanning a QR code and confirming with a valid TOTP code before it is activated.                                                        |
| 9   | 2FA disable requires the user's current password for confirmation.                                                                                         |
| 10  | Recovery codes are generated once during 2FA setup and can be regenerated (invalidating old codes) with password confirmation.                             |
| 11  | Recovery codes are shown only once and stored hashed — they cannot be retrieved after initial display.                                                     |
| 12  | The current session **cannot** be terminated via session management. Users must use the regular logout flow.                                               |
| 13  | "Logout All Other Devices" terminates all sessions except the current one.                                                                                 |
| 14  | Session ownership is validated server-side — users cannot access or terminate sessions belonging to other users.                                           |

---

## 8. API Endpoints Summary

| No  | Method | Endpoint                          | Description                                          |
| --- | ------ | --------------------------------- | ---------------------------------------------------- |
| 1   | GET    | `/api/profile`                    | View current user's profile                          |
| 2   | PUT    | `/api/profile`                    | Update current user's profile                        |
| 3   | PUT    | `/api/profile/password`           | Change password (requires current password)          |
| 4   | POST   | `/api/profile/2fa/setup`          | Generate TOTP secret and QR code (requires password) |
| 5   | POST   | `/api/profile/2fa/confirm`        | Confirm 2FA setup with TOTP code                     |
| 6   | POST   | `/api/profile/2fa/disable`        | Disable 2FA (requires password)                      |
| 7   | POST   | `/api/profile/2fa/recovery-codes` | Regenerate recovery codes (requires password)        |
| 8   | GET    | `/api/profile/sessions`           | List all active sessions                             |
| 9   | DELETE | `/api/profile/sessions/{id}`      | Terminate a specific session                         |
| 10  | DELETE | `/api/profile/sessions`           | Terminate all sessions except current                |

> **Note:** All endpoints derive the user identity from the JWT token. No user ID is passed in the URL.

---

## 9. Acceptance Criteria

### AC-1: View Profile

- [ ] User can view their own profile information.
- [ ] Internal users see NIPP, name, email, phone number, company, and roles.
- [ ] External users see username, name, email, phone number, photo, NIK, NPWP, and roles.
- [ ] Profile data is retrieved from the authenticated user's JWT token context.

### AC-2: Update Profile

- [ ] Internal users can update their phone number.
- [ ] External users can update all editable fields based on their user type.
- [ ] PERSONAL users can edit: name, email, phoneNumber, photo, address, nik, ktpFile.
- [ ] COMPANY users can edit: name, email, phoneNumber, photo, address, npwp, companyCode, npwpFile, responsibleName, responsibleEmail, responsibleNik, responsibleAddress.
- [ ] OTHER users can edit: name, email, phoneNumber, photo, address, purpose.
- [ ] Non-editable fields are displayed but disabled.
- [ ] Validation errors are shown at the field level.
- [ ] Success notification is displayed after successful update.

### AC-3: Change Password

- [ ] User can change their password by providing the current password and a new password.
- [ ] Current password is validated before the change is applied.
- [ ] New password must meet the password policy (min 8 chars, uppercase, lowercase, number).
- [ ] Confirm password must match the new password.
- [ ] New password cannot be the same as the current password.
- [ ] Success notification is displayed after successful password change.

### AC-4: Enable 2FA

- [ ] User must enter their current password before 2FA setup is initiated.
- [ ] If password is incorrect, setup is blocked with an error message.
- [ ] User can initiate 2FA setup and receive a QR code and secret key.
- [ ] User scans QR code with an authenticator app and enters the generated code.
- [ ] System validates the TOTP code and activates 2FA on the account.
- [ ] Recovery codes (8 codes) are displayed after successful 2FA activation.
- [ ] User is informed that recovery codes are shown only once.

### AC-5: Disable 2FA

- [ ] User can disable 2FA by confirming with their current password.
- [ ] 2FA fields (secret, recovery codes, confirmed timestamp) are cleared.
- [ ] Subsequent logins no longer require a TOTP code.

### AC-6: Regenerate Recovery Codes

- [ ] User can regenerate recovery codes when 2FA is enabled.
- [ ] Password confirmation is required.
- [ ] Old recovery codes are invalidated and replaced with new ones.
- [ ] New codes are displayed for the user to save.

### AC-7: View Active Sessions

- [ ] User can see all their active sessions with device/browser info, IP address, login time, and last activity.
- [ ] The current session is clearly labeled (e.g., "Current Session" badge).
- [ ] Sessions are sorted by last activity (most recent first).

### AC-8: Logout Specific Device

- [ ] User can terminate a specific session by clicking "Logout" on that session row.
- [ ] The "Logout" button is not shown on the current session.
- [ ] Confirmation dialog is shown before termination.
- [ ] The terminated session disappears from the list.

### AC-9: Logout All Other Devices

- [ ] User can terminate all sessions except the current one.
- [ ] Confirmation dialog is shown before termination.
- [ ] After execution, only the current session remains in the list.
- [ ] The count of terminated sessions is displayed.

### AC-10: Security Validations

- [ ] All endpoints are protected by JWT authentication.
- [ ] Users cannot access or modify other users' profiles or sessions.
- [ ] Users cannot terminate their own current session via session management.
- [ ] Password confirmation is required for: changing password, enabling 2FA, disabling 2FA, and regenerating recovery codes.
