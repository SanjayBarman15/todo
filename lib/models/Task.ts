import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Task } from "@/lib/types"

export interface TaskDocument extends Omit<Task, "id"> {
  _id?: ObjectId
  userId: string
}

export async function createTask(userId: string, task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  const db = await getDb()
  const tasksCollection = db.collection<TaskDocument>("tasks")

  const newTask: TaskDocument = {
    ...task,
    userId,
    createdAt: new Date().toISOString(),
  }

  const result = await tasksCollection.insertOne(newTask)
  return {
    id: result.insertedId.toString(),
    title: newTask.title,
    description: newTask.description,
    priority: newTask.priority,
    status: newTask.status,
    dueDate: newTask.dueDate,
    createdAt: newTask.createdAt,
  }
}

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  const db = await getDb()
  const tasksCollection = db.collection<TaskDocument>("tasks")

  const tasks = await tasksCollection.find({ userId }).toArray()
  return tasks.map((task) => ({
    id: task._id?.toString() || "",
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
  }))
}

export async function updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const db = await getDb()
  const tasksCollection = db.collection<TaskDocument>("tasks")

  let objectId: ObjectId
  try {
    objectId = new ObjectId(taskId)
  } catch {
    return null
  }

  // Verify task belongs to user
  const task = await tasksCollection.findOne({ _id: objectId, userId })
  if (!task) {
    return null
  }

  const updateData: Partial<TaskDocument> = { ...updates }
  delete (updateData as any).id

  await tasksCollection.updateOne(
    { _id: objectId, userId },
    { $set: updateData }
  )

  const updatedTask = await tasksCollection.findOne({ _id: objectId, userId })
  if (!updatedTask) return null

  return {
    id: updatedTask._id?.toString() || "",
    title: updatedTask.title,
    description: updatedTask.description,
    priority: updatedTask.priority,
    status: updatedTask.status,
    dueDate: updatedTask.dueDate,
    createdAt: updatedTask.createdAt,
  }
}

export async function deleteTask(userId: string, taskId: string): Promise<boolean> {
  const db = await getDb()
  const tasksCollection = db.collection<TaskDocument>("tasks")

  let objectId: ObjectId
  try {
    objectId = new ObjectId(taskId)
  } catch {
    return false
  }

  const result = await tasksCollection.deleteOne({ _id: objectId, userId })
  return result.deletedCount === 1
}

