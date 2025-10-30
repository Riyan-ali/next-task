"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportTasksToCSV } from "@/lib/csv-export"
import { toast } from "sonner"

export function ExportButton({ tasks }) {
  const handleExport = () => {
    try {
      const filename = `nexttask-${new Date().toISOString().split("T")[0]}.csv`
      exportTasksToCSV(tasks, filename)
      toast.success(`Exported ${tasks.length} tasks to CSV`)
    } catch (error) {
      toast.error("Failed to export tasks")
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
      <Download className="w-4 h-4" />
      Export CSV
    </Button>
  )
}
