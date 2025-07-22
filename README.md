## 📚 Table of Contents

- [🛠️ Tech Stack](#-tech-stack)
- [📝 Setup Instructions](#-setup-instructions)
- [🎬 Features & Implementation](#-features--implementation)
- [📦 Code Structure & Modularity](#-code-structure--modularity)
- [📘 Assumptions & Trade-offs](#-assumptions--trade-offs)
- [🚀 Future Improvements](#-future-improvements)
- [🧪 Testing](#-testing)
- [👩‍💻 Developer Experience & Workflow](#-developer-experience--workflow)
- [💡 Tips for Reviewers](#-tips-for-reviewers)

---

## 🛠️ Tech Stack

- [TypeScript](https://www.typescriptlang.org/) – Type safety across frontend and backend.
- [React (Next.js)](https://nextjs.org/) – Modern, scalable frontend framework.
- [Node.js](https://nodejs.org/) – Backend runtime.
- [Prisma](https://www.prisma.io/) – Type-safe ORM for database access.
- [Zod](https://zod.dev/) – Schema validation for both client and server.
- [PostgreSQL](https://www.postgresql.org/) – Relational database.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS for rapid UI.
- [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) – Testing.
- [React Query](https://tanstack.com/query/latest) – Data fetching and state caching.
- [Docker](https://www.docker.com/) – Local database development.

---

## 📝 Setup Instructions

### 1. Prerequisites

- Node.js (see `.nvmrc`)
- pnpm
- Docker (for local Postgres)

### 2. Environment Setup

- Copy `.env.example` to `.env`.  
  The `DATABASE_URL` value is already provided and ready to use.

### 3. Install Dependencies

```sh
pnpm install
```

### 4. Start the Database

```sh
docker compose -f develop/docker-compose.yaml up -d
```

### 5. Run Migrations & Seed Data

```sh
pnpm db:dev:migrate && pnpm db:seed
```

### 6. Start the Development Server

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Features & Implementation

### Video List Page

- **Grid layout** of videos (responsive, mobile & desktop).
- **Displays:** title, created_at, tags, duration, views, thumbnail image.
- **Sort:** by created_at (newest/oldest).
- **Filter:** by tags.
- **Search:** by title (substring match).
- **Loading states:** skeletons while loading.
- **Error states:** user-friendly error messages.
- **Empty state:** clear message if no results.
- **UI/UX:** All interactive elements are accessible (proper labels, keyboard navigation, ARIA patterns), and the design is responsive and user-friendly.

### Video Creation Page

- **Form:** input for title (required), duration (required), tags (optional, 0 or more).
- **Auto-set:** created_at, default/placeholder for thumbnail, duration, views.
- **Validation:** Zod is used for schema validation on both client and server.
- **Feedback:** disables submit button while submitting, shows errors if any.

### Data Flow

- **No REST API layer:** The frontend directly calls backend/server functions (e.g., `getVideoListByCriteria`, `createVideo`) using Next.js server actions and React Query.
- **React Query:** Handles data fetching and server state caching.
- **Prisma:** Handles all database access and modeling.
- **Zod:** Used for input validation and schema enforcement on both client and server.

---

## 📦 Code Structure & Modularity

- **Logical organization:**
  - `src/db/` – Database access, types, and validation schemas.
  - `src/features/` – Feature modules (video grid, forms, filters).
  - `src/components/` – Reusable UI components (Button, Input, QueryProvider).
- **Reusable, modular components:**
  - All UI elements (inputs, dropdowns, cards) are reusable and composable.
- **Consistent naming:**
  - Follows clear, predictable naming conventions.
- **No deeply nested logic:**
  - Each file and function has a single responsibility.
- **Type safety:**
  - Types are shared between backend and frontend.

---

## 📘 Assumptions & Trade-offs

- **No pagination:** All videos are returned in a single list for simplicity.
- **Search:** Substring matching on the title (not full-text).
- **No video details page/modal:** Focused on core flows.
- **Error handling:** Basic, but user-friendly.
- **Testing:** Only core flows are tested; more coverage would be added with more time.
- **API:** Data is fetched by directly calling backend functions from the frontend (no separate API endpoints). This is a common and efficient pattern in Next.js projects.

---

## 🚀 Future Improvements

- Add [OpenSearch](https://opensearch.org/) for full-text search, advanced filtering, synonym and multi-language support.
- Add pagination to video lists for scalability.
- Add video detail view (modal or separate page).
- **Further improve user feedback:**
  - Show toast notifications for successful actions (e.g., video creation).
- Add more comprehensive tests (unit, integration, e2e).
- **Custom Not-Found Page:**  
  Implement a custom 404 (not-found) page with a friendly message and a clear navigation button back to the home page, providing a more interactive and user-friendly experience than the default Next.js not-found page.

---

## 🧪 Testing

- **Jest** is used for backend and frontend tests.
- **React Testing Library** is used for frontend component tests.
- **Testing includes::**
  - Server action for fetching and mapping the videos list.
  - Creating a video and validating input.

---

## 👩‍💻 Developer Experience & Workflow

- **Prettier** and **ESLint** are set up and enforced for consistent code style and formatting.
- **TypeScript** is used throughout for type safety and better developer feedback.
- **Scripts** for linting, formatting, testing, and database management are provided in `package.json` for a smooth workflow:
  - `pnpm lint` – Lint the codebase
  - `pnpm format` – Format code with Prettier
  - `pnpm test` / `pnpm test:ci` – Run tests
  - `pnpm db:dev:migrate` / `pnpm db:seed` – Database migrations and seeding
- **GitHub Actions workflow** is set up for CI:
  - Installs dependencies, lints, formats, runs tests, and builds the application on every pull request and push to main.
  - Ensures code quality and reliability before merging changes.
- **Deployment:**
  - The app is deployed to [Vercel](https://video-library-dashboard.vercel.app), with a managed database storage.

---

## 💡 Tips for Reviewers

- The codebase prioritizes clarity and maintainability.
- Trade-offs and simplifications are documented above.
- If something feels awkward in the UI, I’d love your feedback!

---

**Priorities:** Clean code, clear structure, and a working user flow over completeness or polish.

---
