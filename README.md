# Task Manager Web App

A full-stack task management application built with Next.js, MongoDB, and TypeScript.

## Features

- 🔐 User authentication (signup/login)
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- 🎯 Task filtering by status and priority
- 📊 Task statistics dashboard
- 🔒 Secure JWT-based authentication
- 💾 MongoDB database integration

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
   - Copy `env.txt` to `.env.local`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB_NAME`: Database name (default: `todoapp`)
     - `JWT_SECRET`: A secure random string for JWT signing

   Example `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=todoapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login endpoint
│   │   │   └── signup/route.ts     # Signup endpoint
│   │   └── tasks/
│   │       ├── route.ts            # GET (list) and POST (create) tasks
│   │       └── [id]/route.ts       # PATCH (update) and DELETE tasks
│   ├── page.tsx                    # Main page
│   └── layout.tsx                   # Root layout
├── components/
│   ├── dashboard.tsx                # Main dashboard component
│   ├── login-form.tsx               # Login/signup form
│   ├── task-list.tsx               # Task list with filters
│   ├── task-card.tsx               # Individual task card
│   └── ui/                          # UI components
├── lib/
│   ├── api.ts                       # API client utilities
│   ├── auth.ts                      # JWT authentication utilities
│   ├── mongodb.ts                   # MongoDB connection
│   ├── models/
│   │   ├── User.ts                  # User model and operations
│   │   └── Task.ts                  # Task model and operations
│   └── types.ts                     # TypeScript type definitions
└── env.txt                          # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password

### Tasks (requires authentication)
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## Technologies Used

- **Next.js 16** - React framework
- **MongoDB** - Database
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Tailwind CSS** - Styling
- **Radix UI** - UI components

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
