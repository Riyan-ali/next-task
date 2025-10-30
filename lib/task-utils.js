export function filterAndSortTasks(tasks, searchQuery, priorityFilter, statusFilter, sortBy) {
  let filtered = [...tasks]

  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
    )
  }

  if (priorityFilter !== "all") {
    filtered = filtered.filter((task) => task.priority === priorityFilter)
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((task) => task.status === statusFilter)
  }

  switch (sortBy) {
    case "oldest":
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case "dueDate":
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
      break
    case "priority":
      const priorityOrder = { High: 0, Medium: 1, Low: 2 }
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      break
    case "newest":
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return filtered
}
