# AGENTS.md — STRICT MODE (Fintra App)

This document defines **MANDATORY RULES** for any AI agent, automation tool, or non-human contributor.  
Any violation of these rules is considered a **CRITICAL ERROR**.

---

## 1. Authority & Scope

The AI agent:

- **HAS NO AUTHORITY** to change product requirements or business logic
- **MUST ONLY** perform actions explicitly requested by the user
- **MUST NOT ASSUME** future features, tax rules, or compliance logic

If instructions are ambiguous or incomplete → **STOP AND ASK FOR CONFIRMATION**.

---

## 2. Tech Stack (LOCKED)

The following tech stack is **LOCKED** and **MUST NOT BE CHANGED**.

### Core

- React 19
- React DOM 19
- TypeScript 5
- Vite 7
- React Router 7

### UI & UX

- shadcn/ui (component collection)
- Tailwind CSS
- Lucide Icons (`lucide-react`)

### State & Data

- TanStack React Query
- Axios

### Charts

- React ApexCharts (`react-apexcharts`)
- ApexCharts (`apexcharts`)

### Validation & Forms

- Zod
- React Hook Form

### Utilities

- jwt-decode
- react-google-recaptcha

### Tooling

- ESLint
- TypeScript ESLint

> ❌ Adding, removing, or replacing libraries is **FORBIDDEN**  
> ❌ Suggesting alternatives (Next.js, Redux, MUI, etc.) is **FORBIDDEN**

---

## 3. Documentation & References (MANDATORY)

For all libraries in the tech stack, **MUST use MCP Context7** to access the **most up-to-date documentation**:

- ✅ Use MCP Context7 for API references, code examples, and best practices
- ✅ Use MCP Context7 for feature updates and new capabilities
- ✅ Prioritize official documentation over Stack Overflow or blog posts
- ❌ Do NOT rely on outdated docs or cached information

**Libraries covered by MCP Context7:**

- React 19 & React DOM 19
- React Router 7
- TanStack React Query
- Axios
- shadcn/ui & components
- Tailwind CSS
- Lucide Icons
- React Hook Form
- Zod
- jwt-decode
- React ApexCharts
- And all other dependencies

When uncertain about library usage → **Consult MCP Context7 FIRST**.

---

## 4. Dependency Rules (ZERO TOLERANCE)

The AI agent:

- **MUST NOT** add new dependencies
- **MUST NOT** remove dependencies
- **MUST NOT** upgrade or downgrade dependency versions
- **MUST NOT** modify `package.json`
- **MUST NOT** modify Vite, PostCSS, or TypeScript configs unless explicitly instructed

All dependencies are defined **ONLY** in `package.json`.

If a new dependency is required → **USER APPROVAL IS MANDATORY**.

---

## 5. React & TypeScript Rules

### React

- **Function Components ONLY**
- **Hooks ONLY**
- ❌ Class Components = **FORBIDDEN**
- ❌ Side effects during render = **FORBIDDEN**
- ❌ Direct DOM manipulation = **FORBIDDEN**

### TypeScript

- ❌ `any` type = **FORBIDDEN**
- Explicit typing is required for:
  - API responses
  - Form values
  - Component props
- Reuse existing types when available
- Zod schema is the **single source of truth** for validation

---

## 6. Data Fetching Rules (TanStack Query)

- **ALL server state MUST use TanStack Query**
- ❌ `useEffect` for fetching data = **FORBIDDEN**
- ❌ Global state for API data = **FORBIDDEN**
- Query keys must be:
  - Stable
  - Serializable
  - Feature-scoped

Mutations MUST handle:

- loading
- error
- success states

---

## 7. API & Axios Rules

- **ALL HTTP calls MUST go through Axios instance**
- ❌ Axios usage directly in components = **FORBIDDEN**
- ❌ Fetch API usage = **FORBIDDEN**

Layering rules:

- `services/http.ts` → Axios instance
- `features/**/api/*.service.ts` → Endpoint logic
- `features/**/api/*.query.ts` → TanStack Query hooks

---

## 8. Styling Rules (Tailwind First)

Styling priority (STRICT):

1. Tailwind utility classes
2. shadcn/ui component variants (via `className`)
3. CSS Modules (LAST RESORT for complex custom styles)

### Tailwind Rules

- ✅ Use Tailwind utility classes for all styling
- ✅ Use shadcn/ui components with their built-in variants
- ✅ Use `cn()` utility from `@/lib/utils` for conditional classes
- ❌ Inline `style={{}}` = **FORBIDDEN** (except truly dynamic values)
- ❌ Global component CSS = **FORBIDDEN**
- ✅ CSS Modules only for complex custom styles that can't be achieved with Tailwind

### Component Structure

Example:

TaxTable/
├─ TaxTable.tsx
├─ TaxTable.module.css (optional, only if needed)
└─ index.ts

### Tailwind Best Practices

- Use semantic class grouping (layout → spacing → colors → typography)
- Prefer Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.)
- Use shadcn/ui component variants instead of recreating styles
- Leverage Tailwind theme configuration for consistent design tokens

---

## 9. Folder & Architecture Rules

Architecture is **FEATURE-BASED**.

### High-level structure (LOCKED)

src/
├─ app/ # Providers, router, bootstrap
├─ features/ # Domain features (tax, auth, etc.)
├─ services/ # HTTP & shared API logic
└─ main.tsx

Rules:

- ❌ Business logic inside shared components = **FORBIDDEN**
- ✅ Each feature owns its:
  - API
  - schema
  - types
  - components
  - pages

---

## 10. Routing Rules

- Routing **MUST** use React Router
- ❌ Hardcoded navigation paths = **FORBIDDEN**
- ❌ Routing logic inside UI-only components = **FORBIDDEN**
- Lazy loading pages is **RECOMMENDED**

---

## 11. Forms & Validation Rules

- **ALL forms MUST use React Hook Form**
- **ALL validation MUST use Zod**
- ❌ Manual validation = **FORBIDDEN**
- ❌ Duplicated validation logic = **FORBIDDEN**

Flow:

Zod Schema → React Hook Form → UI

---

## 12. Security & Auth Rules

- JWT decoding MUST use `jwt-decode`
- ❌ Manual JWT parsing = **FORBIDDEN**
- Sensitive logic MUST NOT live in UI components
- reCAPTCHA integration MUST use the existing library

---

## 13. Scripts & Execution

Allowed scripts ONLY:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

❌ Custom scripts without approval = **FORBIDDEN**

### Output Files Rules

When running scripts that generate output files:

- **ALL output files MUST be created in `.output/` folder** at the project root
- Create the folder if it doesn't exist
- Organize outputs by script type:

  ```
  .output/
  ├─ lint/           # ESLint reports
  ├─ build/          # Build artifacts & reports
  ├─ tests/          # Test results & coverage
  └─ reports/        # Other analysis reports
  ```

- Examples:
  - `npm run lint` → save report to `.output/lint/eslint-report.json`
  - `npm run build` → build output to `.output/build/`
  - Test coverage → `.output/tests/coverage/`
  - SonarQube analysis → `.output/reports/sonarqube/`

- ❌ DO NOT commit output files to repository

---

## 14. Code Quality & Verification Rules (MANDATORY)

The AI agent **MUST** follow ESLint and SonarQube rules at all times.

### Verification Workflow

Before considering any code complete:

1. **Run ESLint verification:**

   ```bash
   npm run lint
   ```

   - ❌ NO unresolved linting errors allowed
   - ❌ NO warnings left unfixed (unless explicitly waived)

2. **Run build verification:**

   ```bash
   npm run build
   ```

   - ❌ Build MUST complete successfully with no errors
   - ❌ Build warnings must be investigated and resolved

3. **SonarQube compliance:**
   - Code MUST comply with project's SonarQube rules
   - Security hotspots MUST be reviewed and addressed
   - Code quality metrics MUST not degrade

### Enforcement

- ❌ Submitting code with lint errors = **FORBIDDEN**
- ❌ Submitting code that fails build = **FORBIDDEN**
- ❌ Ignoring SonarQube violations = **FORBIDDEN**

If lint or build errors occur → **FIX IMMEDIATELY** before proceeding.

---

## 15. Final Enforcement Rule

If the AI agent is unsure about:

- Architecture
- Folder placement
- Styling approach
- Dependency usage

→ STOP. DO NOT GUESS. ASK THE USER.

This project prioritizes correctness, maintainability, and regulatory safety.
Speed must NEVER compromise structure or rules.
