import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function getAuthUserId(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);
  return payload?.userId || null;
}

export async function POST(request) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { localTasks } = await request.json();
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    // Fetch existing tasks for the user
    const existingTasks = await tasksCollection.find({ userId }).toArray();
    const existingLocalIds = new Set(existingTasks.map((t) => t.localId));

    // Filter out already-synced tasks
    const newTasks = localTasks
      ?.filter((task) => !existingLocalIds.has(task.localId))
      .map(({ _id, ...task }) => ({
        ...task,
        userId,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: task.updatedAt || new Date().toISOString(),
      }));

    if (newTasks && newTasks.length > 0) {
      await tasksCollection.insertMany(newTasks);
    }

    const allTasks = await tasksCollection.find({ userId }).toArray();

    return NextResponse.json({
      tasks: allTasks.map((task) => ({
        id: task._id.toString(),
        ...task,
      })),
    });
  } catch (error) {
    console.error("Sync tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
