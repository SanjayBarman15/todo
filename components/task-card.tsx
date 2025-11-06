"use client"

import type { Task } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, Circle, Trash2, MoreVertical, Edit2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { EditTaskDialog } from "./edit-task-dialog"
import { useState } from "react"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "text-destructive"
    case "medium":
      return "text-yellow-600 dark:text-yellow-500"
    case "low":
      return "text-green-600 dark:text-green-500"
  }
}

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const toggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === "completed" ? "todo" : "completed",
    })
  }

  const handleStatusChange = (newStatus: Task["status"]) => {
    onUpdate(task.id, { status: newStatus })
  }

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <button
            onClick={toggleComplete}
            className="mt-1 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            {task.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`font-semibold text-foreground ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`text-sm mt-1 ${task.status === "completed" ? "text-muted-foreground line-through" : "text-muted-foreground"}`}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange("todo")}>Mark as To Do</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Mark as Completed</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                {task.status === "in-progress" ? "In Progress" : task.status === "completed" ? "Completed" : "To Do"}
              </span>
              <span className={`text-xs font-medium uppercase ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-xs text-muted-foreground">
                Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <EditTaskDialog task={task} open={isEditOpen} onOpenChange={setIsEditOpen} onUpdate={onUpdate} />
    </>
  )
}
