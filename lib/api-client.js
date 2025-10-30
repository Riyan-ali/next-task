export async function apiCall(endpoint, options = {}) {
  const { token, ...fetchOptions } = options
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`/api${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "API request failed")
  }

  return response.json()
}
