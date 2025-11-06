import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export interface User {
  _id?: ObjectId | string
  email: string
  password: string
  createdAt: Date
}

export async function createUser(email: string, password: string): Promise<User> {
  const db = await getDb()
  const usersCollection = db.collection<User>("users")

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: Omit<User, "_id"> = {
    email,
    password: hashedPassword,
    createdAt: new Date(),
  }

  const result = await usersCollection.insertOne(newUser as User)
  return {
    _id: result.insertedId.toString(),
    ...newUser,
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb()
  const usersCollection = db.collection<User>("users")
  return usersCollection.findOne({ email })
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password)
}

