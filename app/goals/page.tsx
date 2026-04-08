"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveGoals, getGoals as getStoredGoals, getTasks as getStoredTasks } from "@/lib/storage";
import type { Goal, Task } from "@/lib/storage";
import Mascot from "@/components/Mascot";
import GoalCard from "@/components/GoalCard";
import Toast from "@/components/Toast";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [formError, setFormError] = useState("");
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

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error();
      const data: Goal[] = await res.json();
      setGoals(data);
      saveGoals(data);
    } catch {
      showToast("Failed to load goals.", "error");
    }
  }, [showToast]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error();
      const data: Task[] = await res.json();
      setTasks(data);
    } catch {}
  }, []);

  useEffect(() => {
    const storedGoals = getStoredGoals();
    if (storedGoals.length > 0) {
      fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "__seed__", _seed: storedGoals }),
      })
        .then(() => fetchGoals())
        .finally(() => setIsLoading(false));
    } else {
      fetchGoals().finally(() => setIsLoading(false));
    }
    fetchTasks();
  }, [fetchGoals, fetchTasks]);

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!targetDate || new Date(targetDate) <= new Date()) {
      setFormError("Target date must be in the future.");
      return;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          targetDate,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Goal added!", "success");
      setTitle("");
      setDescription("");
      setTargetDate("");
      setShowForm(false);
      await fetchGoals();
    } catch {
      showToast("Failed to add goal.", "error");
    }
  }

  async function handleComplete(id: number) {
    try {
      const res = await fetch(`/api/goals?id=${id}`, { method: "PUT" });
      if (!res.ok) throw new Error();
      showToast("Goal completed!", "success");
      await fetchGoals();
    } catch {
      showToast("Failed to update goal.", "error");
    }
  }

  async function handleDelete(id: number) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    try {
      const res = await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Goal deleted.", "success");
      await fetchGoals();
    } catch {
      showToast("Failed to delete goal.", "error");
      await fetchGoals();
    }
  }

  const completedGoals = goals.filter((g) => g.completed).length;
  const pct = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  function getMascotData(): { mood: "idle" | "celebrate" | "think" | "sad"; message: string } {
    if (goals.length === 0) return { mood: "sad", message: "Let's set some goals! 🎯" };
    if (pct === 100) return { mood: "celebrate", message: "You crushed it! 🎉" };
    if (pct >= 50) return { mood: "idle", message: "Almost there! Don't stop now! 🔥" };
    return { mood: "idle", message: "Keep going, you got this! 💪" };
  }

  const mascotData = getMascotData();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Goals</h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "New Goal"}
        </motion.button>
      </div>

      <div className="flex justify-center mb-6">
        <Mascot mood={mascotData.mood} size={90} message={mascotData.message} />
      </div>

      {/* Add Goal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-6"
          >
            <form onSubmit={handleAddGoal} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formError && <p className="text-red-500 text-xs">{formError}</p>}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          No goals set. What do you want to achieve?
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                tasks={tasks}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={dismissToast}
      />
    </motion.div>
  );
}
