import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    initializeTasks: (state, action) => {
      state.items = action.payload
    },
    addTask: (state, action) => {
      state.items.push(action.payload)
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload)
    },
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload)
      if (task) {
        task.status = task.status === "Completed" ? "Pending" : "Completed"
        task.updatedAt = new Date().toISOString()
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setTasks: (state, action) => {
      state.items = action.payload
    },
  },
})

export const { initializeTasks, addTask, updateTask, deleteTask, toggleTaskStatus, setLoading, setError, setTasks } =
  taskSlice.actions

export default taskSlice.reducer
