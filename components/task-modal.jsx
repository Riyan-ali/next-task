"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "./task-form"

export function TaskModal({ isOpen, task, onClose, onSubmit, isLoading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>{task ? "Update your task details" : "Add a new task to your list"}</DialogDescription>
        </DialogHeader>
        <TaskForm
          initialTask={task}
          onSubmit={async (data) => {
            await onSubmit(data)
            onClose()
          }}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
