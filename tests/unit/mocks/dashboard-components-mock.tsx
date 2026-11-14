import type React from "react";

type Row = Record<string, unknown>;

type SimpleTableColumn = {
  key: string;
  cell?: (row: Row) => React.ReactNode;
};

/**
 * Mock implementations for the `@railfinance/ui` dashboard components
 * (PageHeader, KpiCard, SectionCard, ActivityFeed, AlertBanner, Chart,
 * SimpleTable, SimpleStatusBadge). Dashboard pages import these directly
 * from `@railfinance/ui`, so tests spread this object into their
 * `vi.mock("@railfinance/core", ...)` factory.
 */
export const dashboardUiMocks = {
  PageHeader: ({
    title,
    description,
    withBackButton,
  }: {
    title?: string;
    description?: string;
    withBackButton?: boolean;
  }) => (
    <div
      data-testid="page-header"
      data-title={title}
      data-description={description}
      data-back-button={withBackButton}
    >
      {description && <p>{description}</p>}
    </div>
  ),
  KpiCard: ({
    label,
    value,
    delta,
    tone,
  }: {
    label?: string;
    value?: string;
    delta?: number;
    tone?: string;
  }) => (
    <div
      data-testid="kpi-card"
      data-label={label}
      data-value={value}
      data-delta={delta}
      data-tone={tone}
    >
      {value}
    </div>
  ),
  SectionCard: ({
    title,
    children,
    className,
  }: {
    title?: string;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="section-card" data-title={title} className={className}>
      {children}
    </div>
  ),
  ActivityFeed: ({ items }: { items?: Array<{ title?: string }> }) => (
    <div data-testid="activity-feed" data-items={items?.length} />
  ),
  AlertBanner: ({ items }: { items?: Array<{ title?: string }> }) => (
    <div data-testid="alert-banner" data-items={items?.length} />
  ),
  Chart: ({
    type,
    height,
    series,
  }: {
    type?: string;
    height?: number;
    series?: unknown[];
  }) => (
    <div
      data-testid="chart"
      data-type={type}
      data-height={height}
      data-series-count={series?.length}
    />
  ),
  SimpleTable: ({
    columns,
    data,
  }: {
    columns?: SimpleTableColumn[];
    data?: Row[];
  }) => (
    <div
      data-testid="simple-table"
      data-columns={columns?.length}
      data-rows={data?.length}
    >
      {data?.map((row, i) => (
        <div key={i} data-testid="simple-table-row">
          {columns?.map((col) => (
            <span key={col.key}>
              {col.cell ? col.cell(row) : String(row[col.key] ?? "")}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
  SimpleStatusBadge: ({ status }: { status?: string }) => (
    <div data-testid="simple-status-badge" data-status={status} />
  ),
};
