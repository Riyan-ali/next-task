import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    initializeAuth: (state, action) => {
      if (action.payload) {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      }
    },
  },
})

export const { setAuth, clearAuth, setLoading, setError, initializeAuth } = authSlice.actions
export default authSlice.reducer
