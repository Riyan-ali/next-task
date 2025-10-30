import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

function getAuthUserId(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);
  return payload?.userId || null;
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const userId = getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, dueDate, dueTime, priority, status } = body;

    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id), userId },
      {
        $set: {
          title,
          description,
          dueDate,
          dueTime,
          priority,
          status,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await tasksCollection.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      id: updatedTask?._id.toString(),
      ...updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  console.log("DELETE request received for task");
  try {
    const { id } = await params;
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
