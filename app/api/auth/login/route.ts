import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword } from "@/lib/models/User"
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

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(user, password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const userId = typeof user._id === "string" ? user._id : user._id?.toString() || ""
    const token = generateToken({ userId, email: user.email })

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: userId, email: user.email },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    
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

