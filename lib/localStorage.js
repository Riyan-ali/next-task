const TASKS_KEY = "nexttask_tasks"
const AUTH_KEY = "nexttask_auth"

export const saveTasks = (tasks) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }
}

export const loadTasks = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(TASKS_KEY)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export const saveAuth = (auth) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  }
}

export const loadAuth = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

export const clearTasks = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TASKS_KEY)
  }
}
