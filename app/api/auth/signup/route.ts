import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const user = await createUser(email, password)
    const userId = typeof user._id === "string" ? user._id : user._id?.toString() || ""
    const token = generateToken({ userId, email: user.email })

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: { id: userId, email: user.email },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    
    if (error.message === "User already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error.message || "Internal server error"
      : "Internal server error"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

