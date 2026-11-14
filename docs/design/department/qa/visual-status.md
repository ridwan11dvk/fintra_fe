# Department visual QA status

## Reference measurements

Figma exports are PNG/RGBA at 1×. The list, add, edit, and details frames are 1440 × 960. The search-empty frame is 1440 × 1185, so a same-size comparison uses its visible top 960px. Reference files are in `../reference/`.

OCR-derived geometry anchors (reference-image pixel coordinates; approximate text bounds):

| Frame | Anchor | Bounds |
|---|---|---|
| List | Page heading | x329, y83, w182, h23 |
| List | Search input icon/text region | x366, y271, w173, h20 |
| List | Table header row | x353–1239, y323–356 |
| List | First data row | x353–1110, y383–407 |
| Add | Form heading | x329, y83, w191, h23 |
| Add | Field labels | x329–451; y162 / 226 / 290 / 330 |
| Add | Field controls | x640–1152; first row y156; row step 64px |
| Add | Footer actions | Cancel x1247, Save x1360; y537–585 |
| Edit | Parent / Status / Name / Code label origins | x329; y162 / 226 / 266 / 321 |
| Details | Heading | x329, y83, w201, h23 |
| Details | Label/value rows | label x329; value x641; y162 / 206 / 250 |
| Empty | No-results heading | x785, y430, w166, h15 |
| Empty | No-results description | x698–1034, y457–490 |

Figma nodes: list `4834:196541`, empty `4834:197395`, add `4834:197308`, edit `4834:197342`, details `4834:197376`.

## Actual capture contract

| Property | Required | Captured |
|---|---|---|
| Local route | Department list and named state | Signed-in local app at `http://localhost:5173/master-data/department` |
| Viewport / DPR | 1440 × 960 CSS px / DPR 1 | 1440 × 960 / DPR 1; verified from `innerWidth`, `innerHeight`, and `devicePixelRatio` |
| Browser / theme | Chromium, light | Chromium 153.0.8010.36, light |
| Typography | Figma font loaded | `Inter Variable`, `document.fonts.status=loaded` |
| Motion | Stable capture | CSS animation/transition disabled in the capture tab |
| Data/state | Named, stable states | In-memory development fixture; 16 Department records; no temporary QA record remains |

Full 1440 × 960 captures are retained under `actual/`:

- `list-1440x960.png`
- `search-empty-1440x960.png`
- `add-1440x960.png`
- `edit-1440x960.png`
- `detail-1440x960.png`

The earlier 889 × 843 captures remain for narrow-width history. At 1440px the Department content geometry now aligns to the measured Figma anchors: list card x328 with 1080px width; list columns at x329/564/800/1036/1172; Add/Edit controls x640–1152; and detail values x640. The desktop Add and Edit forms use the Figma's two-column layout, with Edit field ordering following its frame. Narrow-width behavior remains a separate breakpoint check, not inferred from the desktop captures.

## Comparison results

`compare.json` preserves both unmodified full-frame comparisons and a documented crop of the Department content area (`x328..1408`, `y64..960`) to separate feature layout from the shared application shell. Acceptance settings remain channel tolerance 3 and maximum mismatch ratio 1%; no mismatch was hidden with a mask.

Full-frame comparisons remain **failed**. The Figma shell is visibly different from the current shared app shell (Figma left navigation is 296px wide with different menu content; local navigation is 256px wide and includes the current app toolbar). Full-frame mismatch ratios at the matched viewport were 10.4% for list, 6.3% for add, 6.1% for edit, and 5.5% for detail. Search-empty full-frame comparison also fails on height (1185px reference vs 960px capture).

The isolated Department content crops are visually close in manual review and their key geometry anchors match, but strict pixel diffs still exceed 1%: list 8.0%, add 2.7%, edit 2.5%, detail 1.6%, and search-empty 5.3% at tolerance 3. Differences are explainable by the shared app shell/background, screenshot text rasterization, fixture values/count, and explicit PRD-over-Figma behavior. The PRD takes precedence: Department Name remains a text field rather than the Figma dropdown; the empty copy names Department rather than the Figma's stale “Reject Reason”; and the in-memory fixture differs from Figma sample rows. The detail fixture's Finance record has no parent while the Figma sample shows Corporate. These content differences are not treated as visual passes.

Therefore, functional implementation and matched-viewport visual review are complete, but **strict visual QA is not passed**. Do not mark the slice fully visually complete until remaining differences are reconciled with the product/design owner or an approved reference updated to match the current shell and PRD.

## State and behavior matrix

| State | Actual capture | Visual review | Behavior |
|---|---|---|---|
| List with records | `actual/list-1440x960.png` | Content geometry aligned; strict diff 8.0% | Pagination and row actions exercised |
| Search no-results | `actual/search-empty-1440x960.png` | Department content copy/placement reviewed; strict diff 5.3%; reference height differs | Search and clear-search exercised |
| Add form | `actual/add-1440x960.png` | Field geometry aligned; strict diff 2.7%; required status differs from mock | Empty Save disabled; status switch and create flow exercised |
| Edit form | `actual/edit-1440x960.png` | Field order/geometry aligned; strict diff 2.5% | Update and unsaved-change flow exercised |
| Details | `actual/detail-1440x960.png` | Row geometry aligned; strict diff 1.6%; fixture parent differs | Detail navigation/value rendering exercised |
| Status confirmation | No dedicated Figma capture | No reference frame | Activate/deactivate dialogs and resulting status exercised |
| Keyboard focus / validation error | No dedicated Figma capture | Not captured | Unit validation covered; dedicated accessibility/browser pass pending |

Functional browser flows had previously passed at 889 × 843 and the key list/add/edit/detail states were recaptured at 1440 × 960. The Department adapter unit suite passes 5/5; lint and production build are checked after the final layout changes. Visual evidence and pixel metrics are in this directory.
