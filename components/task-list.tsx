"use client"

import type { Task } from "@/lib/types"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  filterStatus: Task["status"] | "all"
  filterPriority: Task["priority"] | "all"
  sortBy: "dueDate" | "priority"
  onFilterStatusChange: (status: Task["status"] | "all") => void
  onFilterPriorityChange: (priority: Task["priority"] | "all") => void
  onSortChange: (sortBy: "dueDate" | "priority") => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({
  tasks,
  filterStatus,
  filterPriority,
  sortBy,
  onFilterStatusChange,
  onFilterPriorityChange,
  onSortChange,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterStatusChange("all")}>All Tasks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterStatusChange("todo")}>To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterStatusChange("in-progress")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterStatusChange("completed")}>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Priority: {filterPriority === "all" ? "All" : filterPriority}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterPriorityChange("all")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterPriorityChange("high")}>High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterPriorityChange("medium")}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterPriorityChange("low")}>Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by: {sortBy === "dueDate" ? "Due Date" : "Priority"}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange("dueDate")}>Due Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("priority")}>Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No tasks found. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
          ))}
        </div>
      )}
    </div>
  )
}
