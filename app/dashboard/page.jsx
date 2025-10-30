"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { initializeTasks } from "@/lib/slices/taskSlice";
import { initializeAuth } from "@/lib/slices/authSlice";
import { loadTasks, loadAuth } from "@/lib/localStorage";
import { useTaskSync } from "@/hooks/use-task-sync";
import { useTaskActions } from "@/hooks/use-task-actions";
import { TaskFilters } from "@/components/task-filters";
import { TaskList } from "@/components/task-list";
import { TaskModal } from "@/components/task-modal";
import { ExportButton } from "@/components/export-button";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { clearAuth } from "@/lib/slices/authSlice";
import { clearAuth as clearAuthStorage } from "@/lib/localStorage";
import { filterAndSortTasks } from "@/lib/task-utils";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const tasks = useAppSelector((state) => state.tasks.items);
  const isLoading = useAppSelector((state) => state.tasks.loading);
  const user = useAppSelector((state) => state.auth.user);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isSyncing, setIsSyncing] = useState(false);

  const { syncLocalTasksToServer, fetchTasks } = useTaskSync();
  const {
    createTask,
    updateTaskAction,
    deleteTaskAction,
    toggleTaskStatusAction,
  } = useTaskActions();

  useEffect(() => {
    const savedAuth = loadAuth();
    const savedTasks = loadTasks();

    if (savedAuth) dispatch(initializeAuth(savedAuth));
    if (savedTasks.length > 0) dispatch(initializeTasks(savedTasks));

    const timer = setTimeout(() => setIsInitialized(true), 150);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !isSyncing) {
      const timer = setTimeout(() => {
        setIsSyncing(true);
        syncLocalTasksToServer().finally(() => setIsSyncing(false));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, syncLocalTasksToServer]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated && !loadAuth()) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  const filteredTasks = filterAndSortTasks(
    tasks,
    searchQuery,
    priorityFilter,
    statusFilter,
    sortBy
  );

  const handleCreateTask = async (data) => {
    await createTask(data);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (data) => {
    if (editingTask) {
      await updateTaskAction(editingTask.id, data);
      setEditingTask(undefined);
      setIsModalOpen(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(initializeTasks([]));

    if (typeof window !== "undefined") {
      localStorage.clear();
    }

    router.push("/login");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NextTask</h1>
            {user && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
          <div className="flex gap-2">
            <ExportButton tasks={tasks} />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="cursor-pointer gap-2 bg-[#124559] text-white hover:bg-[#01161e] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-[#598392] text-white hover:bg-[#124559] hover:text-white"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={deleteTaskAction}
            onToggleStatus={toggleTaskStatusAction}
            isLoading={isLoading || isSyncing}
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      <footer>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
          Developed by Riyan Ali &copy; 2025
        </div>
      </footer>
    </div>
  );
}
