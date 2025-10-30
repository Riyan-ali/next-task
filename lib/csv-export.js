export function exportTasksToCSV(tasks, filename = "tasks.csv") {
  const headers = ["Title", "Description", "Priority", "Status", "Due Date", "Due Time", "Created At"]
  const rows = tasks.map((task) => [
    `"${task.title.replace(/"/g, '""')}"`,
    `"${task.description.replace(/"/g, '""')}"`,
    task.priority,
    task.status,
    task.dueDate || "",
    task.dueTime || "",
    new Date(task.createdAt).toLocaleString(),
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
