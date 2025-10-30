"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addTask, updateTask, deleteTask, toggleTaskStatus } from "@/lib/slices/taskSlice"
import { apiCall } from "@/lib/api-client"
import { saveTasks } from "@/lib/localStorage"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export function useTaskActions() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const tasks = useAppSelector((state) => state.tasks.items)

  const createTask = useCallback(
    async (taskData) => {
      try {
        if (token) {
          const response = await apiCall("/tasks", {
            method: "POST",
            token,
            body: JSON.stringify(taskData),
          })
          const newTask = { id: response.id, ...response }
          dispatch(addTask(newTask))
          saveTasks([...tasks, newTask])
        } else {
          const newTask = {
            id: uuidv4(),
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          dispatch(addTask(newTask))
          saveTasks([...tasks, newTask])
        }
        toast.success("Task created successfully")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create task")
        throw error
      }
    },
    [token, tasks, dispatch],
  )

  const updateTaskAction = useCallback(
    async (id, taskData) => {
      try {
        if (token) {
          await apiCall(`/tasks/${id}`, {
            method: "PUT",
            token,
            body: JSON.stringify(taskData),
          })
        }
        const updatedTask = { ...tasks.find((t) => t.id === id), ...taskData, updatedAt: new Date().toISOString() }
        dispatch(updateTask(updatedTask))
        saveTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
        toast.success("Task updated successfully")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update task")
        throw error
      }
    },
    [token, tasks, dispatch],
  )

  const deleteTaskAction = useCallback(
    async (id) => {
      try {
        if (token) {
          await apiCall(`/tasks/${id}`, {
            method: "DELETE",
            token,
          })
        }
        dispatch(deleteTask(id))
        saveTasks(tasks.filter((t) => t.id !== id))
        toast.success("Task deleted successfully")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete task")
        throw error
      }
    },
    [token, tasks, dispatch],
  )

  const toggleTaskStatusAction = useCallback(
    async (id) => {
      try {
        const task = tasks.find((t) => t.id === id)
        if (!task) return

        const newStatus = task.status === "Completed" ? "Pending" : "Completed"

        if (token) {
          await apiCall(`/tasks/${id}`, {
            method: "PUT",
            token,
            body: JSON.stringify({ ...task, status: newStatus }),
          })
        }

        dispatch(toggleTaskStatus(id))
        saveTasks(
          tasks.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)),
        )
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update task")
        throw error
      }
    },
    [token, tasks, dispatch],
  )

  return { createTask, updateTaskAction, deleteTaskAction, toggleTaskStatusAction }
}
