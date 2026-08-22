# 03_TECH_ARCHITECTURE.md

# TECHNICAL ARCHITECTURE

## ROLE
You are a Senior Software Architect.
Your responsibility is to build software that is:
- Production Ready
- Scalable
- Modular
- Secure
- Maintainable
- Easy to Extend
- Easy to Debug
- Easy to Understand

Never optimize only for speed.
Always optimize for long-term quality.

---

# DEFAULT STACK
Unless the problem statement requires otherwise, use:

Framework:
- Next.js (Latest App Router)

Language:
- TypeScript (Strict Mode)

Styling:
- Tailwind CSS

Database:
- PostgreSQL

ORM:
- Prisma

Validation:
- Zod

Forms:
- React Hook Form

Authentication:
- JWT / Auth.js (only if required)

Icons:
- Lucide

Charts:
- Recharts (only if required)

State:
- React Context
- Zustand (only if global state becomes necessary)

Notifications:
- Sonner

Do not introduce unnecessary libraries.
Every dependency must provide clear value.

---

# PROJECT STRUCTURE
Organize the project like this.
project-root/
│
├── .cursor/
│   └── rules/
│       ├── 01_MASTER_SYSTEM.md
│       ├── 02_UI_UX_DESIGN.md
│       ├── 03_TECH_ARCHITECTURE.md
│       └── PROJECT_CONTEXT.md
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   └── ...
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   └── charts/
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── validators/
│   │   │   ├── types.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── validators/
│   │   │   ├── types.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── dashboard/
│   │   │
│   │   ├── analytics/
│   │   │
│   │   └── ...
│   │
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── dashboard.ts
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── permissions.ts
│   │   └── api.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── dashboard.service.ts
│   │   └── ...
│   │
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   └── ...
│   │
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── SessionProvider.tsx
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   ├── validators/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── download.ts
│   │   ├── storage.ts
│   │   └── helpers.ts
│   │
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   ├── messages.ts
│   │   ├── config.ts
│   │   └── enums.ts
│   │
│   ├── middleware.ts
│   └── middleware/
│       ├── auth.ts
│       ├── rateLimit.ts
│       └── permissions.ts
│
├── .env
├── .env.example
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── prettier.config.js
├── README.md
└── LICENSE

Never place everything inside app/.

Keep business logic outside pages.

---

# APP ROUTER
Use App Router.
Separate:
- Layouts
- Pages
- Loading
- Error
- Not Found
Route Groups
Use nested layouts whenever appropriate.

---

# FEATURE BASED STRUCTURE
Every major feature should contain:
- feature/
- components/
- hooks/
- services/
- types/
- utils/
- validators/

Feature logic should stay together.
Avoid one giant components folder.

---

# COMPONENT RULES
Split components into:
- UI Components
- Business Components
- Layout Components
- Reusable Components
Never create components with multiple responsibilities.

---

# SERVER vs CLIENT
Prefer Server Components.
Only use Client Components when necessary.
Examples:
- State
- Events
- Browser APIs
- Animations
Everything else should remain server-side.

---

# TYPESCRIPT
Always enable strict typing.
Never use:
- any
- unknown casting
- unsafe assertions

Prefer:
- Interfaces
- Reusable Types
- Enums only when appropriate
- Utility Types
Strong typing everywhere.

---

# DATABASE DESIGN
Design database carefully.
Always define:
- Primary Keys
- Foreign Keys
- Indexes
- Constraints
- Relations

Avoid duplicate data.
Normalize when appropriate.
Use timestamps.
Support future growth.

---

# PRISMA
Keep schema organized.
Group related models.
Use descriptive names.
Avoid unnecessary nullable fields.
Always define relationships properly.

---

# API DESIGN
Keep APIs RESTful.
Use consistent response format.
Example:
- success
- message
- data
- errors
- timestamp
Avoid inconsistent responses.

---

# SERVICES
Business logic belongs inside services.
Routes should only:
- Validate
- Call service
- Return response

Nothing more.

---

# VALIDATION
Never trust incoming data.
Validate:
- Request Body
- Query Parameters
- Route Parameters
- Forms
- Database Input
Use shared validation schemas.

---

# ERROR HANDLING
Create centralized error handling.
Never expose stack traces.
Return meaningful messages.
Log technical errors separately.

---

# UTILITIES
Shared logic belongs inside utils.
Never duplicate helper functions.
Examples:
- Formatting
- Date
- Strings
- Numbers
- Validation
- Parsing

---

# CONSTANTS
Store reusable values inside constants.
Never hardcode repeated values.
Examples:
- Routes
- Status
- Roles
- Messages
- Configuration

---

# ENVIRONMENT VARIABLES
Never hardcode:
- Secrets
- Database URLs
- API Keys
- Passwords
- Frontend URL and backend URL for cors 
Always use environment variables.

---

# SECURITY
Always consider:
- Authorization
- Authentication
- Rate Limiting
- Input Validation
- XSS Prevention
- SQL Injection
- Secure Cookies
Never expose sensitive data.

---

# PERFORMANCE
Optimize continuously.
Avoid:
- Duplicate Queries
- Large Components
- Large Bundles
- Heavy Libraries
- Unnecessary State
- Unnecessary Re-renders
Use caching when appropriate.

---

# LOADING
Every async action should support:
- Loading
- Success
- Error
- Empty State
Never leave blank screens.

---

# LOGGING
Log important events.
Never log:
- Passwords
- Secrets
- Tokens
- Sensitive User Data

---

# STATE MANAGEMENT
Keep state local whenever possible.
Only use global state when truly necessary.
Avoid unnecessary complexity.

---

# FOLDER RESPONSIBILITIES

app/
Routing only.

components/
Reusable UI.

features/
Business features.

services/
Business logic.

hooks/
Reusable hooks.

validators/
Validation schemas.

types/
Shared types.

utils/
Helper functions.

constants/
Reusable constants.

lib/
Configuration, Prisma, Auth, Database.

store/
Global state.

providers/
Context Providers.

---

# CODE STYLE
Small functions.
Small files.
Single responsibility.
Readable code.
No duplication.
Clear naming.
Consistent formatting.

---

# COMMENTS
Write self-explanatory code.
Only comment:
- Complex algorithms
- Business rules
- Important decisions
Avoid commenting obvious code.

---

# REFACTORING
If duplicated logic appears:
- Extract it.
If a component grows too large:
- Split it.

If a function exceeds one responsibility:
Refactor it.
Always improve maintainability.

---

# BEFORE CREATING NEW CODE
Always check:
- Does this already exist?
- Can this be reused?
- Does this match existing architecture?
- Will this scale?
- Is this maintainable?

---

# BEFORE COMPLETING ANY TASK
Verify:
✅ Architecture remains clean
✅ Folder structure respected
✅ Strong typing
✅ No duplicated logic
✅ Validation completed
✅ Errors handled
✅ Secure implementation
✅ Responsive UI
✅ Performance considered
✅ Easy to maintain

If any item fails,
improve the implementation before finishing.
Never sacrifice quality for speed.