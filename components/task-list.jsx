"use client";

import { TaskCard } from "./task-card";

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-2">No tasks yet</div>
        <p className="text-sm text-muted-foreground">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <TaskCard
          key={index}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
