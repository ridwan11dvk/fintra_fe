# Digital Vault API Contract

## Overview

The Digital Vault API provides read-only endpoints for monitoring station cash closure deposits and reconciling reported closure amounts against actual received deposits. All data originates from external RTS (Railway Ticketing System) and VAI (Virtual Account Interface) banking systems.

---

## Base Information

- **Base URL**: `/api/treasury/digital-vault`
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

---

## Endpoints

### 1. Station Summary List

Retrieves a paginated list of stations with aggregated closure and deposit summaries.

**Endpoint**: `GET /`
**Permission**: `treasury:deposit:list`
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter   | Type    | Required | Default         | Description                                                                      |
| ----------- | ------- | -------- | --------------- | -------------------------------------------------------------------------------- |
| `month`     | integer | No       | -               | Reference month (1–12), filter parameter                                         |
| `year`      | integer | No       | -               | Reference year, filter parameter                                                 |
| `search`    | string  | No       | -               | Filter by station name (case-insensitive, partial)                               |
| `startDate` | date    | No       | -               | Start date (YYYY-MM-DD). If provided with `endDate`, overrides month/year window |
| `endDate`   | date    | No       | -               | End date (YYYY-MM-DD). If provided with `startDate`, overrides month/year window |
| `page`      | integer | No       | 0               | Page number (0-indexed)                                                          |
| `size`      | integer | No       | 20              | Number of items per page                                                         |
| `sort`      | string  | No       | stationName,asc | Sort format: `field,direction`                                                   |

> **Filter Logic**:
>
> - If `startDate` and `endDate` are both provided, API uses that explicit range.
> - Otherwise, API uses a 3-month rolling window from month/year (or current month/year when null).
>
> Example: `month=3&year=2026` → data from January 1 to March 31, 2026.

#### Response Body

```json
{
  "message": "Station summary retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "stationName": "BANDUNG",
        "companyCode": "IC100, IC101",
        "closureCount": 15,
        "totalClosureAmount": 75000000.0,
        "totalDepositAmount": 72000000.0
      }
    ],
    "pagination": {
      "total": 50,
      "pageSize": 10,
      "currentPage": 0,
      "totalPages": 5,
      "pageNumber": 1,
      "from": 1,
      "to": 10
    }
  },
  "errors": null
}
```

#### Response Fields

| Field                | Type    | Description                                 |
| -------------------- | ------- | ------------------------------------------- |
| `stationName`        | string  | Station name                                |
| `companyCode`        | string  | Company codes (comma-separated if multiple) |
| `closureCount`       | integer | Number of closure records in the period     |
| `totalClosureAmount` | decimal | Total closure amount (IDR)                  |
| `totalDepositAmount` | decimal | Total CREDIT deposits received (IDR)        |

#### HTTP Status Codes

| Status | Condition                             |
| ------ | ------------------------------------- |
| 200    | Request successful                    |
| 401    | Invalid or missing token              |
| 403    | Insufficient permissions              |
| 422    | Invalid parameters (e.g., month > 12) |

---

### 2. Station Summary Total

Retrieves grand totals across all stations for the same filter criteria used in station summary.

**Endpoint**: `GET /total`
**Permission**: `treasury:deposit:list`
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter   | Type    | Required | Default | Description                                                                      |
| ----------- | ------- | -------- | ------- | -------------------------------------------------------------------------------- |
| `month`     | integer | No       | -       | Reference month (1–12), filter parameter                                         |
| `year`      | integer | No       | -       | Reference year, filter parameter                                                 |
| `search`    | string  | No       | -       | Filter by station name (case-insensitive, partial)                               |
| `startDate` | date    | No       | -       | Start date (YYYY-MM-DD). If provided with `endDate`, overrides month/year window |
| `endDate`   | date    | No       | -       | End date (YYYY-MM-DD). If provided with `startDate`, overrides month/year window |

#### Response Body

```json
{
  "message": "Station summary total retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "totalAllClosureAmount": 3500000000.0,
    "totalAllDepositAmount": 3350000000.0
  },
  "errors": null
}
```

#### Response Fields

| Field                   | Type    | Description                                            |
| ----------------------- | ------- | ------------------------------------------------------ |
| `totalAllClosureAmount` | decimal | Aggregate closure amount across all matching stations  |
| `totalAllDepositAmount` | decimal | Aggregate CREDIT deposits across all matching stations |

#### HTTP Status Codes

| Status | Condition                             |
| ------ | ------------------------------------- |
| 200    | Request successful                    |
| 401    | Invalid or missing token              |
| 403    | Insufficient permissions              |
| 422    | Invalid parameters (e.g., month > 12) |

---

### 3. Station Closure Detail

Retrieves a paginated list of closure records for a specific station.

**Endpoint**: `GET /{stationName}/closures`
**Permission**: `treasury:deposit:read`
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| `stationName` | string | Station name (URL-encoded, case-insensitive) |

#### Query Parameters

| Parameter | Type    | Required | Default          | Description                                          |
| --------- | ------- | -------- | ---------------- | ---------------------------------------------------- |
| `month`   | integer | No       | -                | Reference month (1–12), filter parameter             |
| `year`    | integer | No       | -                | Reference year, filter parameter                     |
| `search`  | string  | No       | -                | Search by closure number, VA number, or company code |
| `page`    | integer | No       | 0                | Page number (0-indexed)                              |
| `size`    | integer | No       | 20               | Number of items per page                             |
| `sort`    | string  | No       | closureDate,desc | Sort format: `field,direction`                       |

#### Response Body

```json
{
  "message": "Closure detail retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 123,
        "virtualAccountNumber": "123456789012345678",
        "stationName": "BANDUNG",
        "companyCode": "IC100",
        "closureNumber": "CLO-2026-00123",
        "closureDate": "2026-03-15",
        "depositDate": "2026-03-15T14:30:00",
        "closureAmount": 5000000.0,
        "totalDepositAmount": 5000000.0,
        "bankCode": "BRI",
        "billingType": "COMPLETE",
        "paymentStatus": 1,
        "postingA8Status": 2
      }
    ],
    "pagination": {
      "total": 25,
      "pageSize": 10,
      "currentPage": 0,
      "totalPages": 3,
      "pageNumber": 1,
      "from": 1,
      "to": 10
    }
  },
  "errors": null
}
```

#### Response Fields

| Field                  | Type             | Description                                                                    |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------ |
| `id`                   | long             | Payment header ID                                                              |
| `virtualAccountNumber` | string           | VA number of the station                                                       |
| `stationName`          | string           | Station name                                                                   |
| `companyCode`          | string           | Company code                                                                   |
| `closureNumber`        | string           | Closure number from RTS system                                                 |
| `closureDate`          | date             | Closure date (YYYY-MM-DD)                                                      |
| `depositDate`          | datetime \| null | Latest deposit timestamp (ISO 8601), null if no deposit yet                    |
| `closureAmount`        | decimal          | Total reported closure amount (IDR)                                            |
| `totalDepositAmount`   | decimal          | Total CREDIT deposits received (IDR)                                           |
| `bankCode`             | string           | Bank code                                                                      |
| `billingType`          | string           | Latest billing status: `DEPOSIT` \| `CREDIT` \| `COMPLETE` \| `INQUIRY` \| `-` |
| `paymentStatus`        | integer          | 0=OPEN, 1=COMPLETE                                                             |
| `postingA8Status`      | integer \| null  | 1=INPROGRESS, 2=SUCCESS, 5=FAILED, null=not posted                             |

#### HTTP Status Codes

| Status | Condition                |
| ------ | ------------------------ |
| 200    | Request successful       |
| 401    | Invalid or missing token |
| 403    | Insufficient permissions |
| 422    | Invalid path parameters  |

---

### 4. Transaction Detail

Retrieves a single closure header with all its individual deposit transactions.

**Endpoint**: `GET /transactions/{id}`
**Permission**: `treasury:deposit:read`
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description       |
| --------- | ---- | ----------------- |
| `id`      | long | Payment header ID |

#### Response Body

```json
{
  "message": "Transaction detail retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 123,
    "virtualAccountNumber": "123456789012345678",
    "stationName": "BANDUNG",
    "companyCode": "IC100",
    "closureNumber": "CLO-2026-00123",
    "closureDate": "2026-03-15",
    "closureAmount": 5000000.0,
    "depositType": 1,
    "latestBillingType": "COMPLETE",
    "latestDepositDate": "2026-03-15T14:30:00",
    "totalDepositAmount": 5000000.0,
    "bankCode": "BRI",
    "paymentStatus": 1,
    "postingA8Status": 2,
    "depositDetails": [
      {
        "id": 456,
        "depositDate": "2026-03-15T10:00:00",
        "depositAmount": 2500000.0,
        "billingType": "DEPOSIT",
        "transactionId": "TXN-20260315-001",
        "machineCode": "ATM-BDG-01",
        "machineName": "DEPOS-BDG-01"
      },
      {
        "id": 457,
        "depositDate": "2026-03-15T14:30:00",
        "depositAmount": 5000000.0,
        "billingType": "CREDIT",
        "transactionId": "TXN-20260315-002",
        "machineName": "DEPOS-BDG-01",
        "machineCode": "ATM-BDG-01"
      }
    ]
  },
  "errors": null
}
```

#### Response Fields

| Field                            | Type     | Description                                            |
| -------------------------------- | -------- | ------------------------------------------------------ |
| `id`                             | long     | Payment header ID                                      |
| `virtualAccountNumber`           | string   | VA number of the station                               |
| `stationName`                    | string   | Station name                                           |
| `companyCode`                    | string   | Company code                                           |
| `closureNumber`                  | string   | Closure number from RTS                                |
| `closureDate`                    | date     | Closure date (YYYY-MM-DD)                              |
| `closureAmount`                  | decimal  | Total reported closure amount (IDR)                    |
| `depositType`                    | integer  | Deposit channel (1=Digital Vault, 2=Teller, 3=BRILink) |
| `latestBillingType`              | string   | Latest billing status from detail records              |
| `latestDepositDate`              | datetime | Latest deposit timestamp (ISO 8601), nullable          |
| `totalDepositAmount`             | decimal  | Total CREDIT deposits received (IDR)                   |
| `bankCode`                       | string   | Bank code                                              |
| `paymentStatus`                  | integer  | 0=OPEN, 1=COMPLETE                                     |
| `postingA8Status`                | integer  | 1=INPROGRESS, 2=SUCCESS, 5=FAILED, null=not posted     |
| `depositDetails[].id`            | long     | Payment detail ID                                      |
| `depositDetails[].depositDate`   | datetime | Deposit event timestamp (ISO 8601)                     |
| `depositDetails[].depositAmount` | decimal  | Individual deposit amount (IDR)                        |
| `depositDetails[].billingType`   | string   | `DEPOSIT` \| `CREDIT` \| `COMPLETE` \| `INQUIRY`       |
| `depositDetails[].transactionId` | string   | Banking transaction ID                                 |
| `depositDetails[].machineCode`   | string   | Deposit machine code                                   |
| `depositDetails[].machineName`   | string   | Deposit machine name                                   |

> **Note**: `depositDetails` are sorted by creation time descending. `totalDepositAmount` only sums details where `billingType = CREDIT`.

#### HTTP Status Codes

| Status | Condition                   |
| ------ | --------------------------- |
| 200    | Request successful          |
| 401    | Invalid or missing token    |
| 403    | Insufficient permissions    |
| 404    | Payment header ID not found |

---

## Required Permissions Summary

| Operation              | Permission              |
| ---------------------- | ----------------------- |
| Station Summary List   | `treasury:deposit:list` |
| Station Summary Total  | `treasury:deposit:list` |
| Station Closure Detail | `treasury:deposit:read` |
| Transaction Detail     | `treasury:deposit:read` |
