# Profit Center design reference

Scope: PRD 9.1.2.4, with the Profit Center page in the Figma file `Finalink / Payable Master Data` used as a visual reference.

Reviewed Figma frames:

- List: node `4834:122100`
- Add form: node `4834:122867`

The Figma list shows the Profit Center ID, name, parent ID, Business Unit ID, row actions, search, and pagination. The Add Form omits Profit Center ID and renders Parent Profit Center, Segment, Business Unit ID, and Status as selects/toggle. The PRD is authoritative for behavior and fields, so this FE slice includes a required unique Profit Center ID, text inputs for Parent Profit Center and Business Unit ID, a Status dropdown, and Segment choices restricted to active Segments (per Segment PRD 9.1.2.5). Responsible Person remains an optional dropdown; its development fixture uses only the PRD's example `John Smith`.

Pixel-level visual comparison is not claimed. The development adapter is in-memory only and is explicitly disabled outside development mode. API persistence and audit logging remain backend integration work.
