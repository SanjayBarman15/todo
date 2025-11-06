"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { TaskList } from "./task-list"
import { AddTaskDialog } from "./add-task-dialog"
import type { Task } from "@/lib/types"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface DashboardProps {
  userEmail: string
  onLogout: () => void
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "all">("all")
  const [filterPriority, setFilterPriority] = useState<Task["priority"] | "all">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setIsLoading(true)
    const response = await api.getTasks()
    if (response.data) {
      setTasks(response.data.tasks)
    } else if (response.error) {
      toast.error("Failed to load tasks", {
        description: response.error,
      })
    }
    setIsLoading(false)
  }

  const handleAddTask = async (task: Omit<Task, "id" | "createdAt">) => {
    const response = await api.createTask(task)
    if (response.data) {
      setTasks([...tasks, response.data.task])
      toast.success("Task created", {
        description: `"${task.title}" has been added to your tasks.`,
      })
    } else {
      toast.error("Failed to create task", {
        description: response.error || "An error occurred while creating the task.",
      })
      // If error, reload tasks to sync with server
      loadTasks()
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    const response = await api.updateTask(id, updates)
    if (response.data) {
      setTasks(tasks.map((task) => (task.id === id ? response.data!.task : task)))
      toast.success("Task updated", {
        description: "Your task has been updated successfully.",
      })
    } else {
      toast.error("Failed to update task", {
        description: response.error || "An error occurred while updating the task.",
      })
      // If error, reload tasks to sync with server
      loadTasks()
    }
  }

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    const response = await api.deleteTask(id)
    if (!response.error) {
      setTasks(tasks.filter((task) => task.id !== id))
      toast.success("Task deleted", {
        description: taskToDelete ? `"${taskToDelete.title}" has been deleted.` : "Task has been deleted.",
      })
    } else {
      toast.error("Failed to delete task", {
        description: response.error || "An error occurred while deleting the task.",
      })
      // If error, reload tasks to sync with server
      loadTasks()
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} onLogout={onLogout} stats={stats} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {sortedTasks.length} task{sortedTasks.length !== 1 ? "s" : ""} to manage
              </p>
            </div>
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>

          <TaskList
            tasks={sortedTasks}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            sortBy={sortBy}
            onFilterStatusChange={setFilterStatus}
            onFilterPriorityChange={setFilterPriority}
            onSortChange={setSortBy}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </main>
    </div>
  )
}
