## SmartTask – Project Report

### 1) Problem Statement and Objectives

SmartTask is a web application that helps users manage personal tasks with a clean, responsive UI and secure data persistence. The goals were:

- Provide simple authentication (signup/login)
- Allow users to create, read, update, and delete tasks
- Support task attributes (title, description, priority, status, due date)
- Offer filtering, sorting, and quick stats on the dashboard
- Persist data in MongoDB with user-level isolation
- Give a delightful UX: responsive layout, calendar date picking, and toast feedback

Outcome: A full‑stack Next.js app with a real backend (API routes) and MongoDB persistence, styled with TailwindCSS and enhanced with shadcn/ui and Sonner toasts.

---

### 2) Tools and Technologies Used

- Framework: Next.js (App Router, API Routes)
- Language: TypeScript, React 19
- Styling: TailwindCSS (v4), shadcn/ui components, Radix UI primitives
- Forms & Validation: React Hook Form (select areas), Zod (where needed)
- Notifications: Sonner
- Database: MongoDB (official Node.js driver)
- Auth: JSON Web Tokens (JWT), bcryptjs for hashing
- Date Picker: react-day-picker (customized calendar)
- Build/Dev: Bun

---

### 3) System Architecture Diagram

```
          ┌─────────────────────────────┐
          │        Browser (UI)         │
          │  React components (CSR)     │
          │  Tailwind + shadcn + Sonner │
          └──────────────┬──────────────┘
                         │ fetch / JSON
                         ▼
                lib/api.ts (client)
                         │ /api/*
                         ▼
        ┌────────────────────────────────────┐
        │     Next.js API Routes (Backend)   │
        │  app/api/auth/*  app/api/tasks/*   │
        │  AuthN/AuthZ with JWT              │
        └──────────────────┬─────────────────┘
                           │ MongoDB driver
                           ▼
                 lib/models/*, lib/mongodb.ts
                           │
                           ▼
                     MongoDB (Atlas)
```

---

### 4) Representative Code Snippets

#### Frontend – creating a task (excerpt from Add Task dialog)

```tsx
// components/add-task-dialog.tsx (excerpt)
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;
  const selectedDate = dueDate || new Date();
  onAddTask({
    title,
    description,
    priority,
    status: "todo",
    dueDate: selectedDate.toISOString(),
  });
  // reset form + close
};
```

#### Frontend – calling backend APIs with auth header

```ts
// lib/api.ts (excerpt)
async function apiRequest<T>(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`/api${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) return { error: data.error || "An error occurred" };
  return { data };
}
```

#### Backend – signup route

```ts
// app/api/auth/signup/route.ts (excerpt)
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password)
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  if (password.length < 6)
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  const user = await createUser(email, password); // hashes with bcrypt
  const userId =
    typeof user._id === "string" ? user._id : user._id?.toString() || "";
  const token = generateToken({ userId, email: user.email });
  return NextResponse.json(
    {
      message: "User created successfully",
      token,
      user: { id: userId, email: user.email },
    },
    { status: 201 }
  );
}
```

#### Backend – tasks (create and list)

```ts
// app/api/tasks/route.ts (excerpt)
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await getTasksByUserId(userId);
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, priority, status, dueDate } =
    await request.json();
  if (!title)
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const task = await createTask(userId, {
    title,
    description,
    priority: priority || "medium",
    status: status || "todo",
    dueDate: dueDate || new Date().toISOString(),
  });
  return NextResponse.json({ task }, { status: 201 });
}
```

---

### 5) Screenshots of Web Pages and API Testing

Include the following screenshots (sample list; attach your captured images):

- Login/Signup screen with successful signup/login toasts
- Dashboard with task statistics (Total / In Progress / To Do / Completed)
- Add Task dialog with calendar date picker
- Task list showing filters (status/priority), sorting, edit, and delete
- Network tab or a tool like Thunder Client/Postman hitting:
  - POST `/api/auth/signup`
  - POST `/api/auth/login`
  - GET `/api/tasks`
  - POST `/api/tasks` (with Authorization header)
  - PATCH `/api/tasks/:id` and DELETE `/api/tasks/:id`

Tip: For API screenshots, show request method, URL, headers (Authorization: Bearer <token>), and JSON response.

---

### Notes on Security & Deployment

- Secrets are stored in `.env` (`MONGODB_URI`, `JWT_SECRET`, etc.)
- Passwords are hashed with `bcryptjs`
- JWT tokens expire and are verified on protected routes
- For deployment (e.g., Vercel), set environment variables in the platform, and ensure MongoDB IP access rules are configured

---

### Conclusion

SmartTask meets the objectives of a responsive, user‑friendly task manager with real backend persistence and authentication. The modular Next.js architecture—with API Routes, models, and a typed client—keeps the codebase maintainable and ready for future features (reminders, labels, sharing).
