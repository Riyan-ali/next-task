"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

const priorityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

const statusColors = {
  Pending: "bg-gray-100 text-gray-800",
  "In-Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const isCompleted = task.status === "Completed";
  const dueDateTime = task.dueDate
    ? format(new Date(task.dueDate), "MMM dd, yyyy") +
      (task.dueTime ? ` at ${task.dueTime}` : "")
    : null;

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle
              className={`text-lg ${
                isCompleted ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </CardTitle>
            {task.description && (
              <p
                className="text-sm text-muted-foreground mt-1 line-clamp-5"
                title={task.description}
              >
                {task.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onToggleStatus(task.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>

          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>

        {dueDateTime && (
          <p className="text-xs text-muted-foreground">Due: {dueDateTime}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
