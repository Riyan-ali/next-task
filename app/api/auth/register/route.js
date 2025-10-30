import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    const userId = result.insertedId.toString()
    const token = generateToken(userId, email)

    return NextResponse.json(
      {
        user: { id: userId, email },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
