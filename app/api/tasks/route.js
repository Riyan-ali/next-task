import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function getAuthUserId(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")
  const payload = verifyToken(token)
  return payload?.userId || null
}

export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const tasksCollection = db.collection("tasks")

    const tasks = await tasksCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = getAuthUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, dueDate, dueTime, priority, status } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const tasksCollection = db.collection("tasks")

    const now = new Date().toISOString()
    const result = await tasksCollection.insertOne({
      userId,
      title,
      description: description || "",
      dueDate: dueDate || "",
      dueTime: dueTime || "",
      priority: priority || "Medium",
      status: status || "Pending",
      createdAt: now,
      updatedAt: now,
    })

    const newTask = await tasksCollection.findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        id: newTask?._id.toString(),
        ...newTask,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
