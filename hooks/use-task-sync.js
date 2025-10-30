"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setTasks, setLoading, setError } from "@/lib/slices/taskSlice"
import { apiCall } from "@/lib/api-client"
import { saveTasks } from "@/lib/localStorage"

export function useTaskSync() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const tasks = useAppSelector((state) => state.tasks.items)

  const syncLocalTasksToServer = useCallback(async () => {
    if (!token) return

    try {
      dispatch(setLoading(true))
      const response = await apiCall("/tasks/sync", {
        method: "POST",
        token,
        body: JSON.stringify({ localTasks: tasks }),
      })

      dispatch(setTasks(response.tasks))
      saveTasks(response.tasks)
      dispatch(setError(null))
    } catch (error) {
      console.error("Sync error:", error)
      dispatch(setError(error instanceof Error ? error.message : "Sync failed"))
    } finally {
      dispatch(setLoading(false))
    }
  }, [token, tasks, dispatch])

  const fetchTasks = useCallback(async () => {
    if (!token) return

    try {
      dispatch(setLoading(true))
      const response = await apiCall("/tasks", { token })
      dispatch(setTasks(response))
      saveTasks(response)
      dispatch(setError(null))
    } catch (error) {
      console.error("Fetch error:", error)
      dispatch(setError(error instanceof Error ? error.message : "Failed to fetch tasks"))
    } finally {
      dispatch(setLoading(false))
    }
  }, [token, dispatch])

  return { syncLocalTasksToServer, fetchTasks }
}
