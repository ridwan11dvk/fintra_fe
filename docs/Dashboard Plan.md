# Dashboard Plan

Based on module structure, each module dashboard focus on **operational KPIs, workflow status, aging analysis, exceptions, and trend monitoring** rather than just showing menu shortcuts. This will make the dashboard actionable for Finance, Treasury, Tax, and Operations teams. The design below is derived from the modules. 

---

# 1. Payable Dashboard

### Executive KPI Cards

* Total Outstanding Payables
* Due Today
* Overdue Amount
* Cash Advance Outstanding
* Reimbursement Pending
* Average Payment Cycle

### Payment Overview

```text
Outstanding Payables Trend (30 Days)
```

### Payable Composition

```text
Vendor Payment      60%
Billing Payment     25%
Utilities Payment   15%
```

### Cash Advance Monitoring

| Metric                    | Value |
| ------------------------- | ----- |
| Petty Cash Requests       | 120   |
| Operational Cash Requests | 85    |
| Unsettled Advances        | 45    |
| Overdue Advances          | 12    |

### Workflow Status

| Status           | Count |
| ---------------- | ----- |
| Draft            | 50    |
| Waiting Approval | 28    |
| Approved         | 15    |
| Rejected         | 4     |
| Paid             | 200   |

### Top 10 Due Payments

* Vendor
* Invoice Number
* Due Date
* Amount
* Aging

### Approval Bottleneck

```text
Pending by Approver
```

---

# 2. Receivable Dashboard

### Executive KPI Cards

* Total Receivable
* Current Month Billing
* Collected Amount
* Collection Rate %
* Overdue Receivable
* DSO (Days Sales Outstanding)

### Billing Pipeline

```text
Billing Request
     ↓
Billing Transaction
     ↓
Collection
```

### Receivable Aging

| Aging      | Amount |
| ---------- | ------ |
| 0-30 Days  | xxx    |
| 31-60 Days | xxx    |
| 61-90 Days | xxx    |
| >90 Days   | xxx    |

### Collection Performance

```text
Collector Achievement %
```

### Top Outstanding Customers

| Customer | Amount | Aging |
| -------- | ------ | ----- |

### Monthly Collection Trend

```text
Target vs Actual Collection
```

### Billing Status

| Status   | Count |
| -------- | ----- |
| Draft    |       |
| Approved |       |
| Posted   |       |
| Paid     |       |
| Overdue  |       |

---

# 3. Treasury Dashboard

### Executive KPI Cards

* Bank Balance
* Incoming Payment Today
* Outgoing Payment Today
* Open Payment Amount
* Deposit Box Balance
* Net Cash Position

### Cash Position

```text
Opening Balance
+ Incoming
- Outgoing
----------------
Closing Balance
```

### Incoming Payment Summary

| Type          | Amount |
| ------------- | ------ |
| Open Payment  |        |
| Close Payment |        |
| Settlement    |        |
| Receipt       |        |

### Outgoing Payment Summary

| Type           | Amount |
| -------------- | ------ |
| Single Payment |        |
| Bulk Payment   |        |
| Autodebet      |        |

### Cash Flow Trend

```text
7 Day Cash Flow
```

### House Bank Distribution

```text
Balance per Bank
```

### Open Items

| Item                | Count |
| ------------------- | ----- |
| Open Payments       |       |
| Unsettled Dropping  |       |
| Pending Settlement  |       |
| Deposit Box Pending |       |

### Treasury Alerts

* Negative balance forecast
* Large outgoing payments
* Failed settlement
* Unmatched receipt

---

# 4. Tax Dashboard

### Executive KPI Cards

* Tax Liability
* VAT In
* VAT Out
* WHT Outstanding
* Tax Deposit Due
* Tax Installment Due

### VAT Summary

| Metric           | Amount |
| ---------------- | ------ |
| VAT In           |        |
| VAT Out          |        |
| Net VAT Position |        |

### Withholding Tax Summary

| Tax Type             | Amount |
| -------------------- | ------ |
| Personal Income Tax  |        |
| WHT Unified          |        |
| Corporate Income Tax |        |

### Tax Compliance Calendar

Upcoming:

* VAT Reporting
* WHT Reporting
* Tax Installment
* Annual Tax Submission

### Tax Trend

```text
Monthly Tax Liability
```

### Transfer Pricing Monitoring

| Status                | Count |
| --------------------- | ----- |
| Pending Documentation |       |
| Completed             |       |
| Review Required       |       |

### Tax Exception Monitoring

* Missing tax documents
* Invalid tax rate
* Unposted tax transactions
* Expired tax facility

---

# 5. Monitoring Dashboard

This should be an operational control tower.

### Executive KPI Cards

* Pending Invoice Posting
* Failed Invoice Posting
* Pending Incoming Payment Posting
* Failed Incoming Payment Posting
* Processing Success Rate
* SLA Compliance %

### Invoice Posting Monitoring

| Status     | Count |
| ---------- | ----- |
| Pending    |       |
| Processing |       |
| Success    |       |
| Failed     |       |

### Incoming Payment Posting Monitoring

| Status     | Count |
| ---------- | ----- |
| Pending    |       |
| Processing |       |
| Success    |       |
| Failed     |       |

### Posting Trend

```text
Success vs Failed Transactions
```

### Error Analysis

| Error Type            | Count |
| --------------------- | ----- |
| Missing Partner       |       |
| Missing GL Account    |       |
| Tax Validation Error  |       |
| Duplicate Transaction |       |
| Posting Failure       |       |

### Real-Time Activity Feed

```text
10:15 Invoice INV001 Posted
10:20 Payment PAY001 Failed
10:25 Invoice INV002 Posted
```

### SLA Monitoring

| Process         | SLA    | Actual |
| --------------- | ------ | ------ |
| Invoice Posting | 15 Min | 10 Min |
| Payment Posting | 15 Min | 20 Min |

---

# Recommended Standard Dashboard Layout

For consistency across all modules:

```text
┌────────────────────────────────────┐
│ KPI CARDS (6-8 cards)              │
└────────────────────────────────────┘

┌───────────────┬────────────────────┐
│ Trend Chart   │ Status Distribution│
└───────────────┴────────────────────┘

┌───────────────┬────────────────────┐
│ Aging/Analysis│ Workflow Monitoring│
└───────────────┴────────────────────┘

┌────────────────────────────────────┐
│ Top Exceptions / Alerts            │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Detail Transaction Table           │
└────────────────────────────────────┘
```

This structure is suitable for a modern Spring Boot + React enterprise finance application and aligns well with the Payable, Receivable, Treasury, Tax, and Monitoring modules defined in your application. 
