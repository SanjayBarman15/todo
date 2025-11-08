# Postman Testing Guide for SmartTask API

## Base URL

```
http://localhost:3000
```

Make sure your Next.js development server is running:

```bash
bun dev
```

---

## Step 1: User Signup

### Request Details

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/signup`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/auth/signup`
4. Go to **Headers** tab
5. Add header: `Content-Type` = `application/json`
6. Go to **Body** tab
7. Select **raw** and **JSON** format
8. Paste the JSON body above
9. Click **Send**

### Expected Response (201 Created):

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "testuser@example.com"
  }
}
```

### ⚠️ Important:

- **Copy the `token` value** from the response - you'll need it for authenticated requests
- Save it in a Postman variable or environment variable for easy reuse

---

## Step 2: User Login

### Request Details

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/auth/login`
4. Go to **Headers** tab
5. Add header: `Content-Type` = `application/json`
6. Go to **Body** tab
7. Select **raw** and **JSON** format
8. Paste the JSON body above
9. Click **Send**

### Expected Response (200 OK):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "testuser@example.com"
  }
}
```

### ⚠️ Important:

- **Copy the `token` value** - you'll need it for all task-related requests
- Use this token in the `Authorization` header for protected routes

---

## Step 3: Get All Tasks (Requires Authentication)

### Request Details

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/tasks`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3000/api/tasks`
4. Go to **Headers** tab
5. Add header: `Authorization` = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (replace with your actual token)
6. Add header: `Content-Type` = `application/json`
7. Click **Send**

### Expected Response (200 OK):

```json
{
  "tasks": [
    {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Complete project report",
      "description": "Write the final project report",
      "priority": "high",
      "status": "todo",
      "dueDate": "2024-11-15T00:00:00.000Z",
      "createdAt": "2024-11-07T10:30:00.000Z"
    }
  ]
}
```

### ⚠️ If you get 401 Unauthorized:

- Make sure you copied the token correctly from login/signup response
- Token should start with `Bearer ` (with a space after Bearer)
- Token might have expired (tokens expire after 7 days)

---

## Step 4: Create a New Task (Requires Authentication)

### Request Details

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/tasks`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Complete project report",
    "description": "Write the final project report with all sections",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-11-15T00:00:00.000Z"
  }
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/tasks`
4. Go to **Headers** tab
5. Add header: `Authorization` = `Bearer YOUR_TOKEN_HERE`
6. Add header: `Content-Type` = `application/json`
7. Go to **Body** tab
8. Select **raw** and **JSON** format
9. Paste the JSON body above (modify as needed)
10. Click **Send**

### Expected Response (201 Created):

```json
{
  "task": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Complete project report",
    "description": "Write the final project report with all sections",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-11-15T00:00:00.000Z",
    "createdAt": "2024-11-07T10:30:00.000Z"
  }
}
```

### Field Requirements:

- **title** (required): Task title
- **description** (optional): Task description
- **priority** (optional): `"low"`, `"medium"`, or `"high"` (defaults to `"medium"`)
- **status** (optional): `"todo"`, `"in-progress"`, or `"completed"` (defaults to `"todo"`)
- **dueDate** (optional): ISO 8601 date string (defaults to current date)

---

## Step 5: Update a Task (Requires Authentication)

### Request Details

- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/tasks/TASK_ID_HERE`
  - Replace `TASK_ID_HERE` with the actual task ID from Step 4
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Complete project report - UPDATED",
    "status": "in-progress",
    "priority": "high"
  }
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `PATCH`
3. Enter URL: `http://localhost:3000/api/tasks/65f1a2b3c4d5e6f7g8h9i0j3` (use your task ID)
4. Go to **Headers** tab
5. Add header: `Authorization` = `Bearer YOUR_TOKEN_HERE`
6. Add header: `Content-Type` = `application/json`
7. Go to **Body** tab
8. Select **raw** and **JSON** format
9. Paste the JSON body above (you can update any field)
10. Click **Send**

### Expected Response (200 OK):

```json
{
  "task": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Complete project report - UPDATED",
    "description": "Write the final project report with all sections",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2024-11-15T00:00:00.000Z",
    "createdAt": "2024-11-07T10:30:00.000Z"
  }
}
```

### Note:

- You can update any field(s) - you don't need to send all fields
- Only send the fields you want to update
- Task must belong to the authenticated user

---

## Step 6: Delete a Task (Requires Authentication)

### Request Details

- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/tasks/TASK_ID_HERE`
  - Replace `TASK_ID_HERE` with the actual task ID
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```

### Steps in Postman:

1. Create a new request
2. Set method to `DELETE`
3. Enter URL: `http://localhost:3000/api/tasks/65f1a2b3c4d5e6f7g8h9i0j3` (use your task ID)
4. Go to **Headers** tab
5. Add header: `Authorization` = `Bearer YOUR_TOKEN_HERE`
6. Add header: `Content-Type` = `application/json`
7. Click **Send** (no body needed)

### Expected Response (200 OK):

```json
{
  "message": "Task deleted successfully"
}
```

---

## Pro Tips for Postman

### 1. Using Postman Environment Variables

Create an environment in Postman to store your token:

1. Click **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Add a variable:
   - Variable: `token`
   - Initial Value: (leave empty)
   - Current Value: (paste your token here after login)
4. Save the environment
5. Select the environment from the dropdown (top right)
6. In your requests, use: `Bearer {{token}}` in the Authorization header

### 2. Automatically Save Token After Login

1. In your Login/Signup request, go to **Tests** tab
2. Add this script:
   ```javascript
   if (pm.response.code === 200 || pm.response.code === 201) {
     const response = pm.response.json();
     if (response.token) {
       pm.environment.set("token", response.token);
       console.log("Token saved to environment");
     }
   }
   ```
3. Now the token will be automatically saved after login/signup

### 3. Creating a Collection

Organize all your requests in a collection:

1. Click **Collections** in the left sidebar
2. Click **+** to create a new collection
3. Name it "SmartTask API"
4. Add folders:
   - **Auth** (for signup, login)
   - **Tasks** (for all task operations)
5. Drag your requests into the appropriate folders

### 4. Common Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

- **Solution:** Check if your token is correct and includes `Bearer ` prefix

#### 400 Bad Request

```json
{
  "error": "Email and password are required"
}
```

- **Solution:** Check if all required fields are included in the request body

#### 404 Not Found

```json
{
  "error": "Task not found"
}
```

- **Solution:** Check if the task ID is correct and belongs to the authenticated user

#### 409 Conflict

```json
{
  "error": "User already exists"
}
```

- **Solution:** User with this email already exists, try a different email

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

- **Solution:** Check server logs, might be a database connection issue

---

## Quick Testing Checklist

- [ ] Signup with a new user
- [ ] Login with the created user
- [ ] Get all tasks (should return empty array initially)
- [ ] Create a new task
- [ ] Get all tasks (should return the created task)
- [ ] Update the task
- [ ] Get all tasks (should show updated task)
- [ ] Delete the task
- [ ] Get all tasks (should return empty array again)
- [ ] Try accessing tasks without token (should return 401)
- [ ] Try creating a task with invalid data (should return 400)

---

## Example Postman Collection JSON

You can import this into Postman:

```json
{
  "info": {
    "name": "SmartTask API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/auth/signup",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:3000/api/tasks",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "tasks"]
            }
          }
        },
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Complete project report\",\n  \"description\": \"Write the final project report\",\n  \"priority\": \"high\",\n  \"status\": \"todo\",\n  \"dueDate\": \"2024-11-15T00:00:00.000Z\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/tasks",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "tasks"]
            }
          }
        },
        {
          "name": "Update Task",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Complete project report - UPDATED\",\n  \"status\": \"in-progress\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/tasks/:id",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "tasks", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "TASK_ID_HERE"
                }
              ]
            }
          }
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:3000/api/tasks/:id",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "tasks", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "TASK_ID_HERE"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Flow Example

1. **Start Fresh:**

   - Signup: `POST /api/auth/signup` → Copy token
   - Or Login: `POST /api/auth/login` → Copy token

2. **Create Tasks:**

   - Create Task 1: `POST /api/tasks` → Note the task ID
   - Create Task 2: `POST /api/tasks` → Note the task ID

3. **View Tasks:**

   - Get All Tasks: `GET /api/tasks` → Should see 2 tasks

4. **Update Task:**

   - Update Task 1: `PATCH /api/tasks/{task1_id}` → Change status to "in-progress"

5. **Verify Update:**

   - Get All Tasks: `GET /api/tasks` → Should see updated task

6. **Delete Task:**

   - Delete Task 2: `DELETE /api/tasks/{task2_id}`

7. **Verify Deletion:**
   - Get All Tasks: `GET /api/tasks` → Should see only 1 task

---

That's it! You now have a complete guide for testing all API endpoints in Postman.
