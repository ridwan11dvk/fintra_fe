# Department design and scope

Scope follows PRD §9.1.9.10. Figma's page is labelled `Departement`; the PRD label and navigation use `Department`.

Reference frames exported from Figma at 1x:

- List: node `4834:196541`, 1440 × 960 (`reference/department-list.png`)
- Search empty state: node `4834:197395`, 1440 × 1185 (`reference/department-empty.png`)
- Add form: node `4834:197308`, 1440 × 960 (`reference/department-add-form.png`)
- Edit form: node `4834:197342`, 1440 × 960 (`reference/department-edit-form.png`)
- Details: node `4834:197376`, 1440 × 960 (`reference/department-details.png`)

Figma contains inconsistencies that are resolved in favor of the PRD: the Add/Edit mockup renders Department Name as a dropdown and Department Code as a tall text area, while the PRD requires text fields; the empty-state copy still says “Reject Reason”; the detail frame omits Status even though Status is present in the list and Add/Edit fields. The FE keeps Department Name as text, uses a text area for Code to follow the frame's geometry, uses Department-specific empty copy, and omits Status on the detail page.

Implemented FE flows:

- Search by Department name, code, or parent; pagination; count; loading, error, empty, and no-search-results states.
- Add/edit Department Name and unique Department Code; optional Parent Department; Active/Inactive status.
- Parent options are active Departments only, excluding the record itself and its descendants. Existing inactive parent links remain visible but cannot be newly selected.
- Read-only detail, edit navigation, activate/deactivate confirmation, and unsaved-edit dialog.
- In the Partner Contact form, development mode uses active Department options; an existing inactive value remains visible during edit. Outside development, the existing text field remains until the Department API is available.

The Department service uses the shared in-memory development fixture and throws outside development mode. There is no Department API integration or audit-log persistence in this slice. Functional browser flows and the Department adapter unit suite pass. The Department content was visually reviewed in all five available Figma states at 1440 × 960, and form/list/detail geometry was adjusted to the reference anchors. Strict pixel QA is still not passed because of shell, fixture, and intentional PRD-over-Figma differences; see `qa/visual-status.md` and `qa/compare.json` for captured evidence and residual mismatches.
