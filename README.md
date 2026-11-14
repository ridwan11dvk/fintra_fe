# Fintra - Financial Transaction Management System

A modern, feature-rich financial transaction management for tracking and controlling KAI financial activities efficiently. It provides comprehensive financial management and monitoring capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Routing](#routing)

## ✨ Features

### Core Features

- **Dashboard** - Real-time financial metrics and transaction overview
- **Payable Management** - Cash advances, direct transactions, reimbursements
- **Receivable Management** - Billing requests, transactions, and collector performance
- **Treasury Management** - Payment processing, fund management, deposits
- **Tax Management** - VAT, withholding tax, tax installments, and filing
- **Reporting** - Comprehensive financial reports and analytics
- **Monitoring** - Invoice and payment tracking
- **User Management** - Role-based access control and user administration

### Technical Features

- Lazy-loaded pages with Suspense boundaries
- Server-side state management with TanStack Query
- Form validation with React Hook Form + Zod
- Interactive charts with ApexCharts
- Responsive design with Tailwind CSS
- Type-safe API calls with Axios
- JWT authentication support

## 🛠 Tech Stack

### Core Framework

- **React 19** - UI library
- **React DOM 19** - React web platform
- **React Router 7** - Client-side routing
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool

### UI & Styling

- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Lucide Icons** - Icon library

### State & Data Management

- **TanStack React Query** - Server state management
- **Axios** - HTTP client

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation

### Charting

- **React ApexCharts** - Chart visualizations
- **ApexCharts** - Charting library

### Additional Tools

- **jwt-decode** - JWT token parsing
- **react-google-recaptcha** - reCAPTCHA integration

## 📁 Project Structure

```
src/
├── app/                    # Application root
│   ├── app.tsx            # Main app component
│   ├── provider.tsx       # Context/provider setup
│   ├── queryClient.ts     # TanStack Query configuration
│   └── routes.tsx         # Route definitions
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── dashboard/         # Dashboard & metrics
│   ├── users/             # User management
│   ├── payable/           # Payable transactions
│   ├── receivable/        # Receivable transactions
│   ├── treasury/          # Treasury operations
│   ├── tax/               # Tax management
│   ├── reporting/         # Reports
│   ├── monitoring/        # Monitoring & tracking
│   └── errors/            # Error pages
├── components/            # Shared UI components
│   ├── ui/                # shadcn/ui components
│   ├── data-table/        # Data table components
│   ├── date-picker.tsx    # Date picker
│   ├── theme-toggle.tsx   # Theme switcher
│   └── loader.tsx         # Loading component
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── layouts/               # Layout components
│   ├── main/              # Main app layout
│   ├── guest/             # Guest layout
│   └── components/        # Layout sub-components
├── services/              # API services
│   └── http.ts            # Axios instance
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
└── main.tsx              # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd fintra_fe
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables (if needed)

```bash
cp .env.example .env.local
```

4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts Vite development server with hot module replacement.

### Build

```bash
npm run build
```

Creates optimized production build and type checks with TypeScript.

### Lint

```bash
npm run lint
```

Runs ESLint to check code quality and style issues.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## 🏗 Architecture

### Feature-Based Structure

The application follows a **feature-based architecture** where each feature module owns:

- UI components
- API services
- Type definitions
- Pages/routes
- Data queries and mutations

### Data Flow

```
Components → React Hook Form + Zod
          ↓
       TanStack Query (useQuery/useMutation)
          ↓
       Axios (services/http.ts)
          ↓
       API Backend
```

### Styling Strategy

1. **Tailwind CSS** (Primary) - Utility classes for layout, spacing, colors
2. **shadcn/ui Variants** - Component variants via className prop
3. **CSS Modules** (Last resort) - Only for complex custom styles

## 🔀 Routing

Routes are organized hierarchically matching the feature structure:

```
/
├── /login                          # Authentication
├── /dashboard                      # Dashboard
├── /payable
│   ├── /cash-advance
│   │   ├── /petty-cash
│   │   └── /operational-cash
│   ├── /direct-transaction
│   │   ├── /vendor-payment
│   │   ├── /billing-payment
│   │   └── /utilities-payment
│   └── /reimbursement
├── /receivable
│   ├── /billing-request
│   ├── /billing-transaction
│   └── /collector-performance
├── /treasury
│   ├── /incoming-payment
│   │   ├── /close-payment
│   │   ├── /open-payment
│   │   ├── /settlement
│   │   └── /receipt
│   ├── /outgoing-payment
│   │   ├── /single-payment
│   │   ├── /bulk-payment
│   │   └── /autodebet
│   ├── /dropping
│   └── /deposit
├── /tax
│   ├── /vat
│   │   ├── /vat-in
│   │   ├── /vat-out
│   │   └── /tax-facility
│   ├── /withholding-tax
│   │   ├── /personal-income-tax
│   │   ├── /wht-unified-tax
│   │   └── /corporate-income-tax
│   ├── /tax-installment
│   ├── /tax-deposit
│   └── /transfer-pricing
├── /monitoring
│   ├── /invoice
│   └── /incoming-payment
├── /setting
│   ├── /user
│   ├── /approval
│   └── /roles
└── /* (404 - Not Found)
```

### Route Implementation Notes

- Routes use **lazy loading** with React Suspense for code splitting
- **Nested routes** enable shared layouts and middleware per feature
- **UnderConstructionPage** placeholder for in-development routes
- Error pages: NotFound (404), Unauthorized (401), ServerError (500), Maintenance (503)

## 📚 Key Concepts

### Forms & Validation

All forms use **React Hook Form** with **Zod** schemas:

```typescript
const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Data Fetching

Use **TanStack Query** for server state:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["transactions"],
  queryFn: () => transactionService.getAll(),
});
```

### API Calls

All HTTP requests go through the centralized Axios instance:

```typescript
// services/http.ts
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// features/*/api/*.service.ts
export const transactionService = {
  getAll: () => httpClient.get("/transactions"),
};
```

## 📖 Development Guidelines

### Code Standards

- Use **TypeScript** for all code (no `any` type)
- Use **function components** and **hooks** only
- Keep components **pure** (no side effects in render)
- Use **Tailwind** for styling (no inline styles)
- Use **shadcn/ui** components for consistency

### Naming Conventions

- Files: kebab-case (e.g., `user-form.tsx`)
- Components: PascalCase (e.g., `UserForm`)
- Functions: camelCase (e.g., `getUserData`)
- Types: PascalCase (e.g., `User`, `UserResponse`)

### Folder Organization

- Group related components by feature
- Keep API logic separate in `api/` folder
- Export public APIs via `index.ts`

## 🔐 Security

- JWT tokens handled via `jwt-decode`
- reCAPTCHA integration for form protection
- Environment variables for sensitive data
- TypeScript for compile-time type safety

## 📝 License

This project is proprietary and confidential.

## 🤝 Contributing

When contributing:

1. Follow the AGENTS.md rules strictly
2. Use the established tech stack only
3. Maintain feature-based architecture
4. Add tests for new features
5. Keep commits atomic and descriptive

## 📞 Support

For issues or questions, please contact the development team.
