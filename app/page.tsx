"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getUser } from "@/lib/auth";
import { saveTasks, getTasks as getStoredTasks, getGoals as getStoredGoals } from "@/lib/storage";
import type { Task } from "@/lib/storage";
import Mascot from "@/components/Mascot";
import TaskInput from "@/components/TaskInput";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import SearchBar from "@/components/SearchBar";
import Toast from "@/components/Toast";
import ClockAnimation from "@/components/ClockAnimation";
import ExportPDF from "@/components/ExportPDF";

type Filter = "all" | "active" | "done";
type MascotMood = "idle" | "celebrate" | "think" | "sad";

function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 👋`;
  if (hour < 18) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [userName, setUserName] = useState("");
  const [goalCount, setGoalCount] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type, visible: true });
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Task[] = await res.json();
      setTasks(data);
      saveTasks(data);
    } catch {
      showToast("Failed to load tasks.", "error");
    }
  }, [showToast]);

  useEffect(() => {
    const user = getUser();
    if (user) setUserName(user.name);
    setGoalCount(getStoredGoals().length);

    const stored = getStoredTasks();
    if (stored.length > 0) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "__seed__", _seed: stored }),
      })
        .then(() => fetchTasks())
        .finally(() => setIsLoading(false));
    } else {
      fetchTasks().finally(() => setIsLoading(false));
    }
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks.length === 0) setMascotMood("sad");
    else setMascotMood("idle");
  }, [tasks]);

  function triggerCelebrate() {
    setMascotMood("celebrate");
    setTimeout(() => setMascotMood("idle"), 2000);
  }

  async function handleAdd(
    title: string,
    priority: "low" | "medium" | "high",
    dueDate: string | null
  ) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority, dueDate }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add task");
      }
      showToast("Task added!", "success");
      triggerCelebrate();
      await fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to add task.",
        "error"
      );
    }
  }

  async function handleToggle(id: number) {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    if (task && !task.completed) triggerCelebrate();
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTasks();
    } catch {
      showToast("Failed to update task.", "error");
      await fetchTasks();
    }
  }

  async function handleDelete(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      showToast("Task deleted.", "success");
      await fetchTasks();
    } catch {
      showToast("Failed to delete task.", "error");
      await fetchTasks();
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const stats = [
    { label: "Total", value: tasks.length, icon: "📋" },
    { label: "Completed", value: completedCount, icon: "✅" },
    { label: "Pending", value: pendingCount, icon: "⏳" },
    { label: "Goals", value: goalCount, icon: "🎯" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      {/* Greeting + Clock */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {getGreeting(userName || "there")}
        </h2>
        <ClockAnimation size={40} showDigital={false} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-3 text-center shadow-sm"
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mascot */}
      <div className="flex justify-center mb-4">
        <Mascot
          mood={mascotMood}
          size={90}
          message={
            mascotMood === "sad"
              ? "No tasks yet! Add your first one 🎯"
              : mascotMood === "celebrate"
                ? "Great job! 🎉"
                : undefined
          }
        />
      </div>

      <SearchBar onSearch={setSearchQuery} />
      <FilterBar filter={filter} setFilter={setFilter} tasks={tasks} />
      <TaskInput onAdd={handleAdd} />

      {/* Export row */}
      {tasks.length > 0 && (
        <div className="flex gap-2 mb-4">
          <ExportPDF tasks={tasks} />
        </div>
      )}

      <TaskList
        tasks={tasks}
        filter={filter}
        searchQuery={searchQuery}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={dismissToast}
      />
    </motion.div>
  );
}
