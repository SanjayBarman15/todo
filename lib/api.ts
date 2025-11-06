const API_BASE_URL = "/api"

export interface ApiResponse<T> {
  data?: T
  error?: string
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || "An error occurred" }
    }

    return { data }
  } catch (error) {
    return { error: "Network error. Please try again." }
  }
}

export const api = {
  // Auth
  async signup(email: string, password: string) {
    return apiRequest<{ token: string; user: { id: string; email: string } }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  async login(email: string, password: string) {
    return apiRequest<{ token: string; user: { id: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // Tasks
  async getTasks() {
    return apiRequest<{ tasks: any[] }>("/tasks", {
      method: "GET",
    })
  },

  async createTask(task: {
    title: string
    description?: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "completed"
    dueDate: string
  }) {
    return apiRequest<{ task: any }>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  },

  async updateTask(taskId: string, updates: Partial<any>) {
    return apiRequest<{ task: any }>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  async deleteTask(taskId: string) {
    return apiRequest<{ message: string }>(`/tasks/${taskId}`, {
      method: "DELETE",
    })
  },
}

