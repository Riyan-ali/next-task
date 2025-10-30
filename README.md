# NextTask - Modern To-Do Application

A full-stack to-do application built with Next.js, TypeScript, Redux Toolkit, and MongoDB. Designed as a portfolio project demonstrating clean code, modern architecture, and polished UX.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**: Title, description, due date/time, priority levels, and status tracking
- **Search & Filter**: Search by title/description, filter by priority and status
- **Sorting**: Sort tasks by newest, oldest, due date, or priority
- **localStorage Sync**: Non-authenticated users can create tasks locally; tasks sync to MongoDB on login
- **Responsive Design**: Mobile-first design that works on all devices
- **Toast Notifications**: User feedback for all CRUD operations
- **CSV Export**: Export all tasks to CSV format
- **Clean Architecture**: Modular components, proper TypeScript types, and organized file structure

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Redux Toolkit with localStorage persistence
- **Backend**: Next.js API routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens with bcryptjs password hashing
- **UI Components**: Radix UI, Lucide icons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast library

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Add your MongoDB URI and JWT secret to `.env.local`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   └── tasks/
│       ├── route.ts
│       ├── [id]/route.ts
│       └── sync/route.ts
├── dashboard/
│   └── page.tsx
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── auth-form.tsx
├── export-button.tsx
├── task-card.tsx
├── task-filters.tsx
├── task-form.tsx
├── task-list.tsx
├── task-modal.tsx
└── ui/
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── input.tsx
    ├── select.tsx
    └── textarea.tsx

lib/
├── api-client.ts
├── auth.ts
├── csv-export.ts
├── db.ts
├── localStorage.ts
├── store.ts
├── task-utils.ts
├── hooks.ts
└── slices/
    ├── authSlice.ts
    └── taskSlice.ts

hooks/
├── use-task-actions.ts
└── use-task-sync.ts
\`\`\`

## Key Features Explained

### Authentication Flow
- Users can register with email and password
- Passwords are hashed with bcryptjs
- JWT tokens are generated on successful login
- Tokens are stored in Redux and localStorage
- Protected routes redirect unauthenticated users to login

### Task Sync
- Non-authenticated users can create tasks locally (stored in localStorage)
- On login, local tasks are automatically synced to MongoDB
- All subsequent operations sync with the server
- Tasks persist across browser sessions

### Search & Filter
- Real-time search across task titles and descriptions
- Filter by priority (Low, Medium, High)
- Filter by status (Pending, In-Progress, Completed)
- Sort by newest, oldest, due date, or priority
- Reset all filters with one click

### Performance Optimizations
- Redux selectors prevent unnecessary re-renders
- localStorage caching reduces API calls
- Lazy loading of components
- Optimized CSS with Tailwind
- Proper TypeScript types for type safety

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/sync` - Sync local tasks to server

## Environment Variables

\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
\`\`\`

## Future Enhancements

- Task categories/tags
- Recurring tasks
- Task reminders/notifications
- Collaboration features
- Dark mode toggle
- Task analytics dashboard
- Mobile app with React Native

## License

MIT

## Author

Built as a portfolio project demonstrating full-stack development skills.
